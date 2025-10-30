import { User } from './user.model';

export interface AuthenticatedUser extends User {
  token: string;
}

export interface AuthResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaRegistro: string;
  rol: string;
  token: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  rol: string;
}
