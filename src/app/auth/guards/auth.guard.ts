import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

export const roleGuard: (allowedRoles: UserRole[]) => CanActivateFn = 
  (allowedRoles: UserRole[]) => (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const currentUser = authService.getCurrentUser();

    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
      router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  };