import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStorageService } from './auth-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStorage = inject(AuthStorageService);
  const token = authStorage.getToken();

  // Don't add token to authentication endpoints
  if (req.url.includes('/authentication/')) {
    return next(req);
  }

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
