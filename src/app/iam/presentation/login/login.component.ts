import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../infrastructure/auth.service';
import { AuthStorageService } from '../../infrastructure/auth-storage.service';
import { AuthStateService } from '../../application/auth-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private authStorage: AuthStorageService,
    private authState: AuthStateService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.signIn(this.loginForm.value).subscribe({
        next: (response) => {
          // Save token and user data
          this.authStorage.saveToken(response.token);
          this.authStorage.saveUser(response);
          this.authState.setUser(response);
          
          this.isLoading = false;
          
          // Redirect to appointments page
          this.router.navigate(['/appointments']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid email or password. Please try again.';
          console.error('Login error:', error);
        }
      });
    }
  }
}
