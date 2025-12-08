export enum RolUsuario {
  ADMIN = 'ADMIN',
  TECNICO = 'TECNICO',
  CLIENTE = 'CLIENTE'
}

export interface User {
  idUser: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  rol: RolUsuario;
}

export type RegisterDto = RegisterPayload;

export interface RegisterPayload {
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  password: string;
  rol: 'ADMIN' | 'TECNICO' | 'CLIENTE';
  emailVerificado: boolean;
  isActive: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface AuthError {
  success: false;
  error: string;
  statusCode: number;
}

export interface LoginByEmailDto {
  email: string;
  password: string;
}

export interface LoginByCedulaDto {
  cedula: string;
  password: string;
}

export type LoginDto = LoginByEmailDto | LoginByCedulaDto;

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
