// src/app/guards/role.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RoleService } from '../role/role.service';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const roleService = inject(RoleService);
    const router = inject(Router);
    const userRole = roleService.getRole();

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    console.warn(`Access denied for role: ${userRole}`);
    router.navigate(['/']); // or to a "not authorized" page
    return false;
  };
}
