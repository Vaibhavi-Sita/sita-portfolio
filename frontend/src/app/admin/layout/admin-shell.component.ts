import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services';

interface AdminNavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-shell">
      <aside class="sidebar" [class.open]="sidebarOpen">
        <div class="brand">
          <span class="brand-symbol">&lt;/&gt;</span>
          <span class="brand-text">Admin</span>
        </div>
        <nav class="nav">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              class="nav-link"
              (click)="sidebarOpen = false"
            >
              <span class="material-icons nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
            </a>
          }
        </nav>
      </aside>

      <div class="main">
        <header class="topbar">
          <button class="menu-btn" (click)="sidebarOpen = !sidebarOpen" aria-label="Toggle menu">
            <span class="material-icons">{{ sidebarOpen ? 'close' : 'menu' }}</span>
          </button>
          <div class="topbar-spacer"></div>
          <a class="view-site" routerLink="/">
            <span class="material-icons">open_in_new</span>
            View site
          </a>
          <button class="logout-btn" (click)="logout()">
            <span class="material-icons">logout</span>
            Logout
          </button>
        </header>

        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-shell {
        display: grid;
        grid-template-columns: 260px 1fr;
        min-height: 100vh;
        background: var(--bg-primary);
        color: var(--text-primary);
      }

      .sidebar {
        background: var(--bg-elevated);
        border-right: 1px solid var(--border-subtle);
        padding: 1.25rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        position: sticky;
        top: 0;
        height: 100vh;
        overflow-y: auto;
        transition: transform var(--transition-base);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 700;
        letter-spacing: -0.01em;
      }

      .brand-symbol {
        color: var(--color-blue-violet);
        font-family: 'JetBrains Mono', monospace;
      }

      .nav {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 0.9rem;
        border-radius: 10px;
        color: var(--text-secondary);
        text-decoration: none;
        transition: background var(--transition-fast), color var(--transition-fast);
      }

      .nav-link:hover {
        background: rgba(255, 255, 255, 0.04);
        color: var(--text-primary);
      }

      .nav-link.active {
        background: rgba(131, 56, 236, 0.15);
        color: var(--color-blue-violet);
        border: 1px solid rgba(131, 56, 236, 0.3);
      }

      .nav-icon {
        font-size: 20px;
        width: 20px;
      }

      .topbar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--border-subtle);
        position: sticky;
        top: 0;
        backdrop-filter: blur(12px);
        background: rgba(11, 11, 16, 0.8);
        z-index: 5;
      }

      .menu-btn {
        display: none;
        background: transparent;
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        color: var(--text-primary);
        width: 40px;
        height: 40px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .view-site,
      .logout-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.5rem 0.85rem;
        border-radius: 8px;
        border: 1px solid var(--border-subtle);
        text-decoration: none;
        color: var(--text-primary);
        background: var(--bg-elevated);
        transition: all var(--transition-fast);
      }

      .view-site:hover,
      .logout-btn:hover {
        border-color: var(--color-blue-violet);
        color: var(--color-blue-violet);
      }

      .logout-btn {
        cursor: pointer;
      }

      .topbar-spacer {
        flex: 1;
      }

      .content {
        padding: 1.5rem;
      }

      .main {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      @media (max-width: 960px) {
        .admin-shell {
          grid-template-columns: 1fr;
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          transform: translateX(-100%);
          z-index: 10;
          width: 240px;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .menu-btn {
          display: inline-flex;
        }

        .main {
          min-height: 100vh;
        }

        .content {
          padding: 1rem;
        }
      }
    `,
  ],
})
export class AdminShellComponent {
  private readonly authService = inject(AuthService);

  sidebarOpen = false;

  readonly navItems: AdminNavItem[] = [
    { path: '/admin/profile', label: 'Profile', icon: 'person' },
    { path: '/admin/experience', label: 'Experience', icon: 'work' },
    { path: '/admin/projects', label: 'Projects', icon: 'folder' },
    { path: '/admin/skills', label: 'Skills', icon: 'code' },
    { path: '/admin/education', label: 'Education', icon: 'school' },
    { path: '/admin/certifications', label: 'Certifications', icon: 'workspace_premium' },
    { path: '/admin/contact', label: 'Contact', icon: 'mail' },
    { path: '/admin/import', label: 'Import', icon: 'upload' },
  ];

  logout(): void {
    this.authService.logout();
  }
}
