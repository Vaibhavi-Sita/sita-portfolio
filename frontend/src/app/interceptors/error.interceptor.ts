import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services';

/**
 * Error interceptor to handle HTTP errors globally
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - redirect to login
      if (error.status === 401) {
        authService.logout();
        return throwError(() => error);
      }

      // Handle 403 Forbidden
      if (error.status === 403) {
        router.navigate(['/']);
        return throwError(() => error);
      }

      // Handle 404 Not Found
      if (error.status === 404) {
        console.error('Resource not found:', error);
      }

      // Handle 500 Server Error
      if (error.status >= 500) {
        console.error('Server error:', error);
      }

      return throwError(() => error);
    })
  );
};
