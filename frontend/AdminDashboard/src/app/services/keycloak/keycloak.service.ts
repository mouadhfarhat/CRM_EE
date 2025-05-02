import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Keycloak from 'keycloak-js';
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
        console.log('Token stored in sessionStorage:', this._profile.token);
      } else {
        console.warn("User not authenticated. Redirecting to login.");
        this.keycloak.login();
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
    this.keycloak?.clearToken(); // Clears the stored Keycloak token
    await this.keycloak?.logout({ redirectUri: 'http://localhost:4200' });
  }

  async isLoggedIn(): Promise<boolean> {
    const authenticated = this.keycloak?.authenticated || false;
    console.log('User is logged in:', authenticated);
    return authenticated;
  }
  

  async getToken(): Promise<string | undefined> {
    if (this.keycloak) {
      if (this.keycloak.isTokenExpired()) {
        console.log("Token expired, refreshing...");
        await this.keycloak.updateToken(30); // Refresh if token is expiring in 30s
        sessionStorage.setItem('token', this.keycloak.token || '');
      }
      return this.keycloak.token;
    }
    return undefined;
  }
  
  
}
