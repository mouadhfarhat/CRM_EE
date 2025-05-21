import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Role } from '../../types/role';
import { jwtDecode } from 'jwt-decode';  // Changed to named import

@Injectable({ providedIn: 'root' })
export class RoleService {
  private currentRole = new BehaviorSubject<Role>('VISITOR');
  role$ = this.currentRole.asObservable();

  constructor() {
    this.detectRoleFromToken();
  }

  detectRoleFromToken() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.currentRole.next('VISITOR');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const roles: string[] = decoded?.realm_access?.roles || [];

      if (roles.includes('ADMIN')) {
        this.currentRole.next('ADMIN');
      } else if (roles.includes('GESTIONNAIRE')) {
        this.currentRole.next('GESTIONNAIRE');
      } else if (roles.includes('CLIENT')) {
        this.currentRole.next('CLIENT');
      } else {
        this.currentRole.next('VISITOR');
      }
    } catch (e) {
      console.error('Failed to decode token:', e);
      this.currentRole.next('VISITOR');
    }
  }

  setRole(role: Role) {
    this.currentRole.next(role);
  }

  getRole(): Role {
    return this.currentRole.getValue();
  }
}
