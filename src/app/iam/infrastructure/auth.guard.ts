import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStorageService } from '../infrastructure/auth-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);

  if (authStorage.isAuthenticated()) {
    return true;
  }

  // Redirect to login if not authenticated
  router.navigate(['/login']);
  return false;
};
