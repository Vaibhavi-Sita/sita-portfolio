import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <div class="header-content">
          <h1 class="text-gradient">Admin Dashboard</h1>
          <p class="header-subtitle">Manage your portfolio content</p>
        </div>
        <button class="btn-secondary" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </header>

      <div class="dashboard-grid">
        <div class="dashboard-card" [class]="getCardClass(0)">
          <div class="card-icon">
            <mat-icon>person</mat-icon>
          </div>
          <div class="card-content">
            <h3>Profile</h3>
            <p>Manage your personal information</p>
          </div>
          <button class="btn-ghost card-action">
            Edit Profile
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>

        <div class="dashboard-card" [class]="getCardClass(1)">
          <div class="card-icon icon-pink">
            <mat-icon>work</mat-icon>
          </div>
          <div class="card-content">
            <h3>Experience</h3>
            <p>Manage work experience entries</p>
          </div>
          <button class="btn-ghost card-action">
            Manage
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>

        <div class="dashboard-card" [class]="getCardClass(2)">
          <div class="card-icon icon-orange">
            <mat-icon>folder</mat-icon>
          </div>
          <div class="card-content">
            <h3>Projects</h3>
            <p>Manage portfolio projects</p>
          </div>
          <button class="btn-ghost card-action">
            Manage
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>

        <div class="dashboard-card" [class]="getCardClass(3)">
          <div class="card-icon icon-mango">
            <mat-icon>code</mat-icon>
          </div>
          <div class="card-content">
            <h3>Skills</h3>
            <p>Manage skill categories and items</p>
          </div>
          <button class="btn-ghost card-action">
            Manage
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>

        <div class="dashboard-card" [class]="getCardClass(0)">
          <div class="card-icon">
            <mat-icon>school</mat-icon>
          </div>
          <div class="card-content">
            <h3>Education</h3>
            <p>Manage education and certifications</p>
          </div>
          <button class="btn-ghost card-action">
            Manage
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>

        <div class="dashboard-card" [class]="getCardClass(1)">
          <div class="card-icon icon-pink">
            <mat-icon>upload</mat-icon>
          </div>
          <div class="card-content">
            <h3>Import</h3>
            <p>Import resume data from JSON</p>
          </div>
          <button class="btn-ghost card-action">
            Import
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .header-content h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem;
    }

    .header-subtitle {
      color: var(--text-muted);
      margin: 0;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .dashboard-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: all var(--transition-base);

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
      }
    }

    .dashboard-card.card-violet {
      border-color: rgba(131, 56, 236, 0.3);

      &:hover {
        border-color: rgba(131, 56, 236, 0.6);
        box-shadow: 0 0 30px rgba(131, 56, 236, 0.2);
      }
    }

    .dashboard-card.card-pink {
      border-color: rgba(255, 0, 110, 0.3);

      &:hover {
        border-color: rgba(255, 0, 110, 0.6);
        box-shadow: 0 0 30px rgba(255, 0, 110, 0.2);
      }
    }

    .dashboard-card.card-orange {
      border-color: rgba(251, 86, 7, 0.3);

      &:hover {
        border-color: rgba(251, 86, 7, 0.6);
        box-shadow: 0 0 30px rgba(251, 86, 7, 0.2);
      }
    }

    .dashboard-card.card-mango {
      border-color: rgba(255, 190, 11, 0.3);

      &:hover {
        border-color: rgba(255, 190, 11, 0.6);
        box-shadow: 0 0 30px rgba(255, 190, 11, 0.2);
      }
    }

    .card-icon {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background: rgba(131, 56, 236, 0.15);
      color: var(--color-blue-violet);

      mat-icon {
        font-size: 26px;
        width: 26px;
        height: 26px;
      }
    }

    .card-icon.icon-pink {
      background: rgba(255, 0, 110, 0.15);
      color: var(--color-winter-sky);
    }

    .card-icon.icon-orange {
      background: rgba(251, 86, 7, 0.15);
      color: var(--color-orange);
    }

    .card-icon.icon-mango {
      background: rgba(255, 190, 11, 0.15);
      color: var(--color-mango);
    }

    .card-content {
      flex: 1;
    }

    .card-content h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 0.375rem;
      color: var(--text-primary);
    }

    .card-content p {
      color: var(--text-muted);
      margin: 0;
      font-size: 0.9375rem;
    }

    .card-action {
      width: 100%;
      justify-content: space-between;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        gap: 1.5rem;
      }

      .header-content h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }

  getCardClass(index: number): string {
    const classes = ['card-violet', 'card-pink', 'card-orange', 'card-mango'];
    return classes[index % classes.length];
  }
}
