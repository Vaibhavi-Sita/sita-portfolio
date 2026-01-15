import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, ApiResponse } from '../models';

const TOKEN_KEY = 'auth_token';
const EXPIRES_KEY = 'auth_expires';

/**
 * Authentication service for admin login
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = environment.apiUrl;

  // Reactive state (memory)
  private readonly tokenSignal = signal<string | null>(this.getStoredToken());
  private readonly expiresAtSignal = signal<number | null>(this.getStoredExpiration());

  // Computed properties
  readonly isAuthenticated = computed(() => {
    const token = this.tokenSignal();
    const expiresAt = this.expiresAtSignal();
    return !!token && !!expiresAt && Date.now() < expiresAt;
  });

  readonly token = computed(() => this.tokenSignal());

  /**
   * Login with email and password
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.baseUrl}/api/auth/login`,
      credentials
    ).pipe(
      tap(response => this.setSession(response.data)),
      map(response => response.data),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout and clear session
   */
  logout(): void {
    this.clearSession();
    this.router.navigate(['/admin/login']);
  }

  /**
   * Get the current access token
   */
  getToken(): string | null {
    return this.tokenSignal();
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiresAt = this.expiresAtSignal();
    return !expiresAt || Date.now() >= expiresAt;
  }

  /**
   * Set session data after login
   */
  private setSession(authResult: LoginResponse): void {
    const expiresAt = Date.now() + authResult.expiresIn;

    sessionStorage.setItem(TOKEN_KEY, authResult.accessToken);
    sessionStorage.setItem(EXPIRES_KEY, expiresAt.toString());

    this.tokenSignal.set(authResult.accessToken);
    this.expiresAtSignal.set(expiresAt);
  }

  /**
   * Clear session data on logout
   */
  private clearSession(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXPIRES_KEY);

    this.tokenSignal.set(null);
    this.expiresAtSignal.set(null);
  }

  /**
   * Get stored token from localStorage
   */
  private getStoredToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  /**
   * Get stored expiration from localStorage
   */
  private getStoredExpiration(): number | null {
    const expires = sessionStorage.getItem(EXPIRES_KEY);
    return expires ? parseInt(expires, 10) : null;
  }
}
