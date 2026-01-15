import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface DashboardCard {
  path: string;
  label: string;
  description: string;
  icon: string;
  iconColor: string;
  buttonText: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <section class="dashboard">
      <header class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p class="subtitle">Manage your portfolio content</p>
      </header>

      <div class="cards-grid">
        @for (card of cards; track card.path) {
          <div class="card">
            <div class="card-icon" [style.background]="card.iconColor">
              <mat-icon>{{ card.icon }}</mat-icon>
            </div>
            <h3 class="card-title">{{ card.label }}</h3>
            <p class="card-description">{{ card.description }}</p>
            <a [routerLink]="card.path" class="card-button">
              {{ card.buttonText }}
              <mat-icon>arrow_forward</mat-icon>
            </a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      background: linear-gradient(135deg, #ff5733 0%, #8338ec 50%, #ffbe0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      color: var(--text-muted);
      margin: 0;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.25rem;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 1.5rem;
      transition: all var(--transition-fast);
    }

    .card:hover {
      border-color: rgba(131, 56, 236, 0.4);
      transform: translateY(-2px);
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .card-icon mat-icon {
      color: white;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .card-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      color: var(--text-primary);
    }

    .card-description {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin: 0 0 1rem;
      line-height: 1.5;
    }

    .card-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      color: var(--text-primary);
      text-decoration: none;
      font-size: 0.9rem;
      transition: all var(--transition-fast);
      width: 100%;
      justify-content: space-between;
    }

    .card-button:hover {
      background: rgba(131, 56, 236, 0.1);
      border-color: var(--color-blue-violet);
      color: var(--color-blue-violet);
    }

    .card-button mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    @media (max-width: 640px) {
      .cards-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent {
  readonly cards: DashboardCard[] = [
    {
      path: '/admin/profile',
      label: 'Profile',
      description: 'Manage your personal information, bio, and social links',
      icon: 'person',
      iconColor: 'linear-gradient(135deg, #8338ec, #6b21a8)',
      buttonText: 'Edit Profile'
    },
    {
      path: '/admin/experience',
      label: 'Experience',
      description: 'Manage work experience entries with roles and achievements',
      icon: 'work',
      iconColor: 'linear-gradient(135deg, #ec4899, #be185d)',
      buttonText: 'Manage'
    },
    {
      path: '/admin/projects',
      label: 'Projects',
      description: 'Showcase your portfolio projects with descriptions and links',
      icon: 'folder',
      iconColor: 'linear-gradient(135deg, #f97316, #c2410c)',
      buttonText: 'Manage'
    },
    {
      path: '/admin/skills',
      label: 'Skills',
      description: 'Organize skill categories and individual skill badges',
      icon: 'code',
      iconColor: 'linear-gradient(135deg, #eab308, #a16207)',
      buttonText: 'Manage'
    },
    {
      path: '/admin/education',
      label: 'Education',
      description: 'Track your educational background and certifications',
      icon: 'school',
      iconColor: 'linear-gradient(135deg, #8338ec, #5b21b6)',
      buttonText: 'Manage'
    },
    {
      path: '/admin/certifications',
      label: 'Certifications',
      description: 'Display professional certifications and credentials',
      icon: 'workspace_premium',
      iconColor: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      buttonText: 'Manage'
    },
    {
      path: '/admin/contact',
      label: 'Contact',
      description: 'Configure contact form settings and availability status',
      icon: 'mail',
      iconColor: 'linear-gradient(135deg, #10b981, #047857)',
      buttonText: 'Settings'
    },
    {
      path: '/admin/import',
      label: 'Import',
      description: 'Bulk import portfolio data from JSON format',
      icon: 'upload',
      iconColor: 'linear-gradient(135deg, #f43f5e, #be123c)',
      buttonText: 'Import'
    }
  ];
}
