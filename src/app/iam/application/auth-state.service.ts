import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthStorageService } from '../infrastructure/auth-storage.service';
import { AuthenticatedUser } from '../domain/model/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private currentUserSubject = new BehaviorSubject<AuthenticatedUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private authStorage: AuthStorageService) {
    // Initialize from storage
    this.checkAuthState();
  }

  private checkAuthState(): void {
    const user = this.authStorage.getUser();
    const isAuthenticated = this.authStorage.isAuthenticated();
    
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  setUser(user: AuthenticatedUser): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  clearUser(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): AuthenticatedUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
