import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="login-container hero-gradient-bg">
      <div class="login-card">
        <div class="login-header">
          <div class="login-icon">
            <mat-icon>admin_panel_settings</mat-icon>
          </div>
          <h1 class="login-title">Admin Login</h1>
          <p class="login-subtitle">Sign in to manage your portfolio</p>
        </div>

        <form
          [formGroup]="loginForm"
          (ngSubmit)="onSubmit()"
          class="login-form"
        >
          <mat-form-field appearance="outline">
            <mat-label>Email or username</mat-label>
            <input matInput formControlName="email" type="email" />
            <mat-icon matSuffix>email</mat-icon>
            @if (loginForm.get('email')?.hasError('required')) {
            <mat-error>Email is required</mat-error>
            } @if (loginForm.get('email')?.hasError('email')) {
            <mat-error>Please enter a valid email</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input
              matInput
              formControlName="password"
              [type]="hidePassword ? 'password' : 'text'"
            />
            <button
              mat-icon-button
              matSuffix
              type="button"
              (click)="hidePassword = !hidePassword"
              tabindex="-1"
            >
              <mat-icon>{{
                hidePassword ? 'visibility_off' : 'visibility'
              }}</mat-icon>
            </button>
            @if (loginForm.get('password')?.hasError('required')) {
            <mat-error>Password is required</mat-error>
            }
          </mat-form-field>

          @if (errorMessage) {
          <div class="error-message">
            <mat-icon>error</mat-icon>
            {{ errorMessage }}
          </div>
          }

          <button
            type="submit"
            class="btn-primary login-btn"
            [disabled]="isLoading || loginForm.invalid"
          >
            @if (isLoading) {
            <mat-spinner diameter="20"></mat-spinner>
            Signing in... } @else { Sign In
            <mat-icon>arrow_forward</mat-icon>
            }
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        min-height: calc(100vh - 64px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .login-card {
        width: 100%;
        max-width: 420px;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 20px;
        padding: 2.5rem;
        box-shadow: var(--shadow-lg);
      }

      .login-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .login-icon {
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        background: linear-gradient(
          135deg,
          var(--color-blue-violet),
          var(--color-winter-sky)
        );
        border-radius: 16px;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: white;
        }
      }

      .login-title {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
        color: var(--text-primary);
      }

      .login-subtitle {
        color: var(--text-muted);
        margin: 0;
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      mat-form-field {
        width: 100%;
      }

      .error-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: rgba(255, 51, 51, 0.1);
        border: 1px solid rgba(255, 51, 51, 0.3);
        border-radius: 8px;
        color: var(--color-tart-orange);
        font-size: 0.875rem;

        mat-icon {
          font-size: 1.25rem;
          width: 20px;
          height: 20px;
        }
      }

      .login-btn {
        margin-top: 1rem;
        width: 100%;
        height: 52px;
      }

      mat-spinner {
        margin-right: 0.5rem;

        ::ng-deep circle {
          stroke: white !important;
        }
      }
    `,
  ],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .login(this.loginForm.value as { email: string; password: string })
      .subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage =
            err.error?.message || 'Login failed. Please try again.';
        },
      });
  }
}
