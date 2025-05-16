import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Keycloak, { KeycloakProfile } from 'keycloak-js';
import { TokenService } from '../token/token.service';
import { UserProfile } from './user-profile';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private _keycloak: Keycloak | undefined;
  private _profile: UserProfile | undefined;

  constructor(private tokenService: TokenService, private http: HttpClient) {}

  get keycloak(): Keycloak | undefined {
    if (!this._keycloak) {
      if (typeof window !== 'undefined') {
        this._keycloak = new Keycloak({
          url: 'http://localhost:8090', // Keycloak Server URL
          realm: 'crm',
          clientId: 'haider_client',
        });
      }
    }
    return this._keycloak;
  }

  get profile(): UserProfile | undefined {
    return this._profile;
  }

  async init(): Promise<void> {
    try {
      console.log("Initializing Keycloak...");
      if (!this.keycloak) {
        console.error("Keycloak instance is undefined!");
        return;
      }

      const authenticated = await this.keycloak.init({
        onLoad: 'login-required',
        checkLoginIframe: false,
      });

      console.log('Authenticated:', authenticated);

      if (authenticated) {
        this._profile = (await this.keycloak.loadUserProfile()) as UserProfile;
        this._profile.token = this.keycloak.token || '';
        sessionStorage.setItem('token', this._profile.token);
        console.log('Token stored in sessionStorage:', this._profile.token.substring(0, 20) + '...');
      } else {
        console.warn("User not authenticated. Redirecting to login.");
        await this.keycloak.login();
      }
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
    }
  }

  async login(): Promise<void> {
    await this.keycloak?.login();
  }

  async logout(): Promise<void> {
    sessionStorage.clear();
    this.tokenService.token = '';
    this.keycloak?.clearToken();
    await this.keycloak?.logout({
      redirectUri: 'http://localhost:4200'
    });
  }

  async isLoggedIn(): Promise<boolean> {
    const authenticated = this.keycloak?.authenticated || false;
    console.log('User is logged in:', authenticated);
    return authenticated;
  }

  async getToken(): Promise<string | undefined> {
    if (!this.keycloak) {
      console.warn('Keycloak instance is undefined');
      return undefined;
    }

    let token = sessionStorage.getItem('token');
    if (token) {
      if (this.keycloak.isTokenExpired()) {
        console.log("Token expired, refreshing...");
        await this.keycloak.updateToken(30);
        token = this.keycloak.token || '';
        sessionStorage.setItem('token', token);
        console.log('Refreshed token:', token.substring(0, 20) + '...');
      } else {
        console.log('Retrieved token from sessionStorage:', token.substring(0, 20) + '...');
      }
      return token;
    }

    console.warn('No token available in sessionStorage');
    return undefined;
  }

  async getUserDetails(): Promise<{ sub: string; email: string } | null> {
    if (!this.keycloak || !this.keycloak.authenticated) {
      console.warn('User not authenticated or Keycloak not initialized');
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
    if (!this.keycloak) {
      throw new Error('Keycloak is not initialized');
    }
    return await this.keycloak.loadUserProfile();
  }

  getUserRoles(): string[] {
    if (!this.keycloak || !this.keycloak.tokenParsed) {
      return [];
    }
    const roles = this.keycloak.tokenParsed['realm_access']?.roles || [];
    return roles;
  }
}