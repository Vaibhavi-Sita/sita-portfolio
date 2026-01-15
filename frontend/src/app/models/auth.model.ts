/**
 * Authentication models
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  expiresAt: number | null;
}
