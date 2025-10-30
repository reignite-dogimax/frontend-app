import { Injectable } from '@angular/core';
import { AuthStorageService } from '../../iam/infrastructure/auth-storage.service';

/**
 * Service to get current user information from localStorage
 * This replaces the use of environment.userId and environment.userName
 */
@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  
  constructor(private authStorage: AuthStorageService) {}

  /**
   * Get the current user's ID from localStorage
   * @returns The user ID or null if not authenticated
   */
  getUserId(): number | null {
    const user = this.authStorage.getUser();
    return user?.id ?? null;
  }

  /**
   * Get the current user's full name from localStorage
   * @returns The user's full name or null if not authenticated
   */
  getUserName(): string | null {
    const user = this.authStorage.getUser();
    return user ? `${user.nombre} ${user.apellido}` : null;
  }

  /**
   * Get the current user's first name from localStorage
   * @returns The user's first name or null if not authenticated
   */
  getFirstName(): string | null {
    const user = this.authStorage.getUser();
    return user?.nombre ?? null;
  }

  /**
   * Get the current user's email from localStorage
   * @returns The user's email or null if not authenticated
   */
  getEmail(): string | null {
    const user = this.authStorage.getUser();
    return user?.email ?? null;
  }

  /**
   * Get the current user's role from localStorage
   * @returns The user's role or null if not authenticated
   */
  getRole(): string | null {
    const user = this.authStorage.getUser();
    return user?.rol ?? null;
  }

  /**
   * Check if current user is a pet lover
   * @returns true if user is a pet lover, false otherwise
   */
  isPetLover(): boolean {
    return this.getRole() === 'petlover';
  }

  /**
   * Check if current user is a veterinary
   * @returns true if user is a veterinary, false otherwise
   */
  isVeterinary(): boolean {
    return this.getRole() === 'veterinary';
  }
}
