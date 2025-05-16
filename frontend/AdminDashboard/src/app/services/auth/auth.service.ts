import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private helper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  get token(): string {
    return sessionStorage.getItem('token') || '';
  }

  private get decodedToken(): any {
    return this.helper.decodeToken(this.token);
  }

  get username(): string {
    return this.decodedToken?.['preferred_username'] || '';
  }

  get role(): string {
    const roles: string[] = this.decodedToken?.['realm_access']?.roles || [];
    if (roles.includes('ADMIN')) return 'ADMIN';
    if (roles.includes('GESTIONNAIRE')) return 'GESTIONNAIRE';
    if (roles.includes('CLIENT')) return 'CLIENT';
    return 'UNKNOWN';
  }
  getClientId(): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/api/clients/by-username/${this.username}`);
  }

  
  
  
}
