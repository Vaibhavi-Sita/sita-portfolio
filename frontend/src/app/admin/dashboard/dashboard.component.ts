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
        <h1>Admin Dashboard</h1>
        <button mat-button color="warn" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </header>

      <div class="dashboard-grid">
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>person</mat-icon>
            <mat-card-title>Profile</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage your personal information</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">Edit Profile</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>work</mat-icon>
            <mat-card-title>Experience</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage work experience entries</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">Manage</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>folder</mat-icon>
            <mat-card-title>Projects</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage portfolio projects</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">Manage</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>code</mat-icon>
            <mat-card-title>Skills</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage skill categories and items</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">Manage</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>school</mat-icon>
            <mat-card-title>Education</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage education and certifications</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">Manage</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>upload</mat-icon>
            <mat-card-title>Import</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Import resume data from JSON</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">Import</button>
          </mat-card-actions>
        </mat-card>
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
      align-items: center;
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      margin: 0;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .dashboard-card {
      background: var(--bg-card);
    }

    mat-icon[mat-card-avatar] {
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      padding: 0.5rem;
    }
  `]
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
