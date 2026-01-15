import { Component, inject, HostListener } from '@angular/core';
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
    <div class="admin-shell" [class.sidebar-open]="sidebarOpen">
      <!-- Overlay for mobile -->
      <div
        class="overlay"
        [class.visible]="sidebarOpen"
        (click)="sidebarOpen = false"
      ></div>

      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="sidebarOpen">
        <div class="sidebar-header">
          <a routerLink="/admin" class="brand" (click)="closeSidebar()">
            <span class="brand-symbol">&lt;/&gt;</span>
            <span class="brand-text">Admin</span>
          </a>
          <button
            class="close-btn"
            (click)="sidebarOpen = false"
            aria-label="Close menu"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <nav class="nav">
          <a
            routerLink="/admin"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link"
            (click)="closeSidebar()"
          >
            <span class="material-icons nav-icon">dashboard</span>
            <span class="nav-label">Dashboard</span>
          </a>

          <div class="nav-divider"></div>

          @for (item of navItems; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="active"
            class="nav-link"
            (click)="closeSidebar()"
          >
            <span class="material-icons nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </a>
          }
        </nav>

        <div class="sidebar-footer">
          <a class="footer-link" routerLink="/" (click)="closeSidebar()">
            <span class="material-icons">open_in_new</span>
            <span>View Site</span>
          </a>
          <button class="footer-link logout" (click)="logout()">
            <span class="material-icons">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <div class="main">
        <header class="topbar">
          <button
            class="menu-btn"
            (click)="sidebarOpen = !sidebarOpen"
            aria-label="Toggle menu"
          >
            <span class="material-icons">{{
              sidebarOpen ? 'close' : 'menu'
            }}</span>
          </button>

          <a routerLink="/admin" class="topbar-brand">
            <span class="brand-symbol">&lt;/&gt;</span>
            <span class="brand-text">Admin</span>
          </a>

          <div class="topbar-spacer"></div>

          <a class="topbar-action" routerLink="/">
            <span class="material-icons">open_in_new</span>
            <span class="action-label">View site</span>
          </a>
          <button class="topbar-action logout" (click)="logout()">
            <span class="material-icons">logout</span>
            <span class="action-label">Logout</span>
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

      /* Overlay */
      .overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .overlay.visible {
        opacity: 1;
      }

      /* Sidebar */
      .sidebar {
        background: var(--bg-elevated);
        border-right: 1px solid var(--border-subtle);
        padding: 0;
        display: flex;
        flex-direction: column;
        position: sticky;
        top: 0;
        height: 100vh;
        overflow-y: auto;
        transition: transform 0.3s ease;
      }

      .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.25rem 1rem;
        border-bottom: 1px solid var(--border-subtle);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 700;
        letter-spacing: -0.01em;
        text-decoration: none;
        color: var(--text-primary);
      }

      .brand-symbol {
        color: var(--color-blue-violet);
        font-family: 'JetBrains Mono', monospace;
      }

      .close-btn {
        display: none;
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 6px;
        transition: all var(--transition-fast);
      }

      .close-btn:hover {
        color: var(--text-primary);
        background: rgba(255, 255, 255, 0.05);
      }

      .nav {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 1rem;
        flex: 1;
      }

      .nav-divider {
        height: 1px;
        background: var(--border-subtle);
        margin: 0.5rem 0;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 0.9rem;
        border-radius: 10px;
        color: var(--text-secondary);
        text-decoration: none;
        transition: all var(--transition-fast);
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

      .sidebar-footer {
        padding: 1rem;
        border-top: 1px solid var(--border-subtle);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .footer-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.65rem 0.9rem;
        border-radius: 8px;
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.9rem;
        background: transparent;
        border: none;
        cursor: pointer;
        width: 100%;
        text-align: left;
        transition: all var(--transition-fast);
      }

      .footer-link:hover {
        background: rgba(255, 255, 255, 0.04);
        color: var(--text-primary);
      }

      .footer-link.logout:hover {
        color: var(--color-tart-orange);
      }

      /* Main area */
      .main {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
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
        transition: all var(--transition-fast);
      }

      .menu-btn:hover {
        border-color: var(--color-blue-violet);
        color: var(--color-blue-violet);
      }

      .topbar-brand {
        display: none;
        align-items: center;
        gap: 0.5rem;
        font-weight: 700;
        text-decoration: none;
        color: var(--text-primary);
      }

      .topbar-spacer {
        flex: 1;
      }

      .topbar-action {
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
        cursor: pointer;
        font-size: 0.9rem;
      }

      .topbar-action:hover {
        border-color: var(--color-blue-violet);
        color: var(--color-blue-violet);
      }

      .topbar-action.logout:hover {
        border-color: var(--color-tart-orange);
        color: var(--color-tart-orange);
      }

      .content {
        padding: 1.5rem;
        flex: 1;
      }

      /* Mobile styles */
      @media (max-width: 960px) {
        .admin-shell {
          grid-template-columns: 1fr;
        }

        .overlay {
          display: block;
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          transform: translateX(-100%);
          z-index: 10;
          width: 280px;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .close-btn {
          display: flex;
        }

        .menu-btn {
          display: inline-flex;
        }

        .topbar-brand {
          display: flex;
        }

        .action-label {
          display: none;
        }

        .topbar-action {
          padding: 0.5rem;
        }

        .content {
          padding: 1rem;
        }
      }

      /* Extra small screens */
      @media (max-width: 480px) {
        .topbar {
          padding: 0.75rem 1rem;
        }

        .topbar-brand .brand-text {
          display: none;
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
    {
      path: '/admin/certifications',
      label: 'Certifications',
      icon: 'workspace_premium',
    },
    { path: '/admin/contact', label: 'Contact', icon: 'mail' },
    { path: '/admin/import', label: 'Import', icon: 'upload' },
  ];

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.sidebarOpen = false;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
