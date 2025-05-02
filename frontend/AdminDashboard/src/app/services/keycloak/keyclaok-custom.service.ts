import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakService } from './keycloak.service';

@Injectable({
  providedIn: 'root',
})
export class KeycloakCustomService {
  constructor(private keycloakService: KeycloakService, private http: HttpClient) {}

  async registerUserInBackend(): Promise<any> {
    const keycloakInstance = this.keycloakService.keycloak;
    if (!keycloakInstance) {
      console.error('Keycloak instance is not initialized.');
      return;
    }

    const user = keycloakInstance.tokenParsed;

    if (!user) {
      console.error('User data is not available.');
      return;
    }

    const userData = {
      firstname: user['given_name'],
      lastname: user['family_name'],
      email: user['email'],
      username: user['preferred_username'],
    };

    return this.http.post('http://localhost:8080/api/auth/signup', userData).toPromise();
  }
}
