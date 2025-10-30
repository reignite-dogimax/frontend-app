import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, SignInRequest, SignUpRequest } from '../domain/model/auth.model';
import { User } from '../domain/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/api/v1/authentication`;

  constructor(private http: HttpClient) {}

  signIn(request: SignInRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/sign-in`, request);
  }

  signUp(request: SignUpRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/sign-up`, request);
  }
}
