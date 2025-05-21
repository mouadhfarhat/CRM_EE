import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Keycloak, { KeycloakProfile } from 'keycloak-js';
import { TokenService } from '../token/token.service';
import { UserProfile } from './user-profile';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private _keycloak: Keycloak | undefined;
  private _profile: UserProfile | undefined;
  private _isInitialized = false;
  private _authStatusSubject = new BehaviorSubject<boolean>(false);
  
  public authStatus$ = this._authStatusSubject.asObservable();

  // Configuration constants - can be moved to environment files
  private readonly KEYCLOAK_URL = 'http://localhost:8090';
  private readonly KEYCLOAK_REALM = 'crm';
  private readonly KEYCLOAK_CLIENT_ID = 'haider_client';
  private readonly APP_URL = 'http://localhost:4200';

  constructor(private tokenService: TokenService, private http: HttpClient) {}

  get keycloak(): Keycloak | undefined {
    if (!this._keycloak) {
      if (typeof window !== 'undefined') {
        this._keycloak = new Keycloak({
          url: this.KEYCLOAK_URL,
          realm: this.KEYCLOAK_REALM,
          clientId: this.KEYCLOAK_CLIENT_ID,
        });
      }
    }
    return this._keycloak;
  }

  get profile(): UserProfile | undefined {
    return this._profile;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  async init(): Promise<boolean> {
    try {
      console.log("Initializing Keycloak...");
      if (!this.keycloak) {
        console.error("Keycloak instance is undefined!");
        return false;
      }

      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`, // Notice the path change
        checkLoginIframe: false,
        enableLogging: true // Helpful for debugging
      });

      console.log('Authenticated:', authenticated);
      this._isInitialized = true;
      this._authStatusSubject.next(authenticated);

      if (authenticated) {
        await this.updateUserProfile();
        
        // Set up token refresh
        this.setupTokenRefresh();
      } 

      return authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
      this._isInitialized = false;
      this._authStatusSubject.next(false);
      return false;
    }
  }
  
  private async updateUserProfile(): Promise<void> {
    if (!this.keycloak?.authenticated) return;
    
    try {
      this._profile = (await this.keycloak.loadUserProfile()) as UserProfile;
      this._profile.token = this.keycloak.token || '';
      this.tokenService.token = this._profile.token;
      sessionStorage.setItem('token', this._profile.token);
      console.log('Token stored:', this._profile.token.substring(0, 20) + '...');
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  }
  
  private setupTokenRefresh(): void {
    if (!this.keycloak) return;
    
    // Calculate time to refresh (at 70% of token lifetime)
    const tokenUpdateInterval = () => {
      const expiresIn = this.keycloak?.tokenParsed?.exp 
        ? this.keycloak.tokenParsed.exp - Math.ceil(Date.now() / 1000)
        : 60;
        
      // Refresh at 70% of token lifetime
      return (expiresIn * 0.7) * 1000;
    };
    
    setTimeout(() => this.refreshToken(), tokenUpdateInterval());
  }
  
  private async refreshToken(): Promise<void> {
    if (!this.keycloak?.authenticated) return;
    
    try {
      const refreshed = await this.keycloak.updateToken(30);
      if (refreshed) {
        console.log('Token refreshed');
        this.tokenService.token = this.keycloak.token || '';
        sessionStorage.setItem('token', this.keycloak.token || '');
      }
      
      // Schedule next refresh
      this.setupTokenRefresh();
    } catch (error) {
      console.error('Failed to refresh token, logging out', error);
      await this.logout();
    }
  }

  async login(redirectUri?: string): Promise<void> {
    try {
      await this.keycloak?.login({
        redirectUri: redirectUri || this.APP_URL
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  async logout(): Promise<void> {
    try {
      sessionStorage.clear();
      this.tokenService.token = '';
      this._authStatusSubject.next(false);
      
      if (this.keycloak?.authenticated) {
        await this.keycloak.logout({
          redirectUri: this.APP_URL
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect as fallback
      window.location.href = this.APP_URL;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    if (!this._isInitialized) {
      await this.init();
    }
    const authenticated = this.keycloak?.authenticated || false;
    return authenticated;
  }

  async getToken(): Promise<string | undefined> {
    if (!this.keycloak) {
      console.warn('Keycloak instance is undefined');
      return undefined;
    }

    try {
      // Check if token is about to expire (within next 30 seconds)
      if (this.keycloak.authenticated && this.keycloak.isTokenExpired(30)) {
        console.log("Token about to expire, refreshing...");
        const refreshed = await this.keycloak.updateToken(30);
        if (refreshed) {
          const token = this.keycloak.token || '';
          this.tokenService.token = token;
          sessionStorage.setItem('token', token);
          console.log('Refreshed token:', token.substring(0, 20) + '...');
          return token;
        }
      }
      
      // Return existing token (either from keycloak or session)
      if (this.keycloak.token) {
        return this.keycloak.token;
      }
      
      const sessionToken = sessionStorage.getItem('token');
      if (sessionToken) {
        return sessionToken;
      }
      
      // No valid token available
      console.warn('No valid token available');
      return undefined;
    } catch (error) {
      console.error('Error getting token:', error);
      return undefined;
    }
  }

  async getUserDetails(): Promise<{ sub: string; email: string } | null> {
    if (!this.keycloak?.authenticated) {
      console.warn('User not authenticated');
      return null;
    }
    
    try {
      const profile = await this.keycloak.loadUserProfile();
      return {
        sub: this.keycloak.subject || '',
        email: (profile as any).email || ''
      };
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  }

  async loadUserProfile(): Promise<KeycloakProfile> {
    if (!this.keycloak?.authenticated) {
      throw new Error('User not authenticated or Keycloak not initialized');
    }
    return await this.keycloak.loadUserProfile();
  }

  getUserRoles(): string[] {
    if (!this.keycloak?.tokenParsed) {
      return [];
    }
    return this.keycloak.tokenParsed['realm_access']?.roles || [];
  }

  getKeycloakId(): string | undefined {
    return this.keycloak?.subject;
  }
  
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }
}