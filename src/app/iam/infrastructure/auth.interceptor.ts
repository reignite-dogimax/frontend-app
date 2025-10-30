import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthStorageService } from '../infrastructure/auth-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authStorage: AuthStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authStorage.getToken();
    
    // Don't add token to authentication endpoints
    if (req.url.includes('/authentication/')) {
      return next.handle(req);
    }

    if (token) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}
