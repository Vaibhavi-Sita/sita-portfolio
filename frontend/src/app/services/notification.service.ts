import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snack = inject(MatSnackBar);

  error(message: string, action = 'Dismiss', duration = 5000): void {
    this.snack.open(message, action, {
      duration,
      panelClass: ['snack-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  success(message: string, action = 'OK', duration = 2500): void {
    this.snack.open(message, action, {
      duration,
      panelClass: ['snack-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  info(message: string, action = 'OK', duration = 3000): void {
    this.snack.open(message, action, {
      duration,
      panelClass: ['snack-info'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
