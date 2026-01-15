import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services';
import { NotificationService } from '../services/notification.service';

/**
 * Error interceptor to handle HTTP errors globally
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const payloadMessage =
        (error.error && (error.error.message || error.error.error)) ||
        (typeof error.error === 'string' ? error.error : null);

      // Handle 401 Unauthorized - redirect to login
      if (error.status === 401) {
        notify.error(payloadMessage || 'Session expired. Please log in again.');
        authService.logout();
        router.navigate(['/admin/login']);
        return throwError(() => error);
      }

      // Handle 403 Forbidden
      if (error.status === 403) {
        notify.error(payloadMessage || 'Access forbidden.');
        return throwError(() => error);
      }

      // Handle validation / client errors
      if (error.status === 400) {
        notify.error(payloadMessage || 'Validation failed. Please check the form.');
        return throwError(() => error);
      }

      // Handle server errors
      if (error.status >= 500) {
        notify.error(payloadMessage || 'Server error. Please try again later.');
      }

      return throwError(() => error);
    })
  );
};
