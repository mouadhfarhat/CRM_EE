import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Role } from '../../types/role';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private currentRole = new BehaviorSubject<Role>('visitor');
  role$ = this.currentRole.asObservable();

  setRole(role: Role) {
    this.currentRole.next(role);
  }

  getRole(): Role {
    return this.currentRole.getValue();
  }
}