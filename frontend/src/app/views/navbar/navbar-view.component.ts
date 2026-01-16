import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface NavItem {
  id: string;
  label: string;
}

/**
 * Navbar view - displays navigation with active section highlighting
 */
@Component({
  selector: 'app-navbar-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <nav
      class="navbar"
      [class.scrolled]="isScrolled"
      role="navigation"
      aria-label="Main navigation"
    >
      <div class="navbar-content">
        <a
          routerLink="/"
          class="logo"
          (click)="scrollToTop($event)"
          (keydown.enter)="scrollToTop($event)"
          tabindex="0"
        >
          <span class="logo-symbol">&lt;</span>
          <span class="logo-text">{{ title }}</span>
          <span class="logo-symbol">/&gt;</span>
        </a>

        <div
          id="mobile-menu"
          class="nav-links"
          [class.open]="mobileMenuOpen"
          role="menubar"
          [attr.aria-hidden]="!mobileMenuOpen && isMobile"
        >
          @for (item of navItems; track item.id) {
          <a
            class="nav-link"
            [class.active]="activeSection === item.id"
            [class.nav-link-cta]="item.id === 'contact'"
            [href]="'#' + item.id"
            (click)="onNavClick($event, item.id)"
            (keydown.enter)="onNavClick($event, item.id)"
            role="menuitem"
            [attr.aria-current]="activeSection === item.id ? 'true' : null"
            tabindex="0"
          >
            {{ item.label }}
          </a>
          }
        </div>

        <!-- <div class="navbar-actions">
          <button 
            class="btn-icon" 
            (click)="toggleDarkMode.emit()" 
            aria-label="Toggle theme"
            tabindex="0">
            <mat-icon>{{ darkMode ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>

          <button 
            class="menu-toggle btn-icon" 
            (click)="onMenuToggle()"
            [attr.aria-expanded]="mobileMenuOpen"
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            tabindex="0">
            <mat-icon>{{ mobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
          </button>
        </div>-->
      </div>
    </nav>

    <!-- Backdrop for mobile menu -->
    @if (mobileMenuOpen) {
    <div
      class="nav-backdrop"
      (click)="closeMobileMenu()"
      (keydown.escape)="closeMobileMenu()"
      aria-hidden="true"
    ></div>
    }
  `,
  styles: [
    `
      .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        padding: 1rem 2rem;
        transition: all var(--transition-base);
      }

      .navbar.scrolled {
        background: rgba(11, 11, 16, 0.9);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border-subtle);
        padding: 0.75rem 2rem;
      }

      .navbar-content {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .logo {
        font-size: 1.25rem;
        font-weight: 700;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--text-primary);
        transition: color var(--transition-fast);
        cursor: pointer;

        &:focus-visible {
          outline: 2px solid var(--color-blue-violet);
          outline-offset: 4px;
          border-radius: 4px;
        }
      }

      .logo-symbol {
        color: var(--color-blue-violet);
        font-family: 'JetBrains Mono', monospace;
      }

      .logo:hover {
        color: var(--color-blue-violet);
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .nav-link {
        padding: 0.5rem 1rem;
        font-size: 0.9375rem;
        font-weight: 500;
        color: var(--text-secondary);
        text-decoration: none;
        border-radius: 6px;
        transition: all var(--transition-fast);
        position: relative;
        overflow: hidden;

        &::after {
          content: '';
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 6px;
          height: 2px;
          background: var(--gradient-cool);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform var(--transition-fast);
        }

        &:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
          &::after {
            transform: scaleX(1);
          }
        }

        &:focus-visible {
          outline: 2px solid var(--color-blue-violet);
          outline-offset: 2px;
        }

        &.active {
          color: var(--color-blue-violet);

          &::after {
            transform: scaleX(1);
            background: var(--color-blue-violet);
            left: 12px;
            right: 12px;
          }
        }
      }

      .nav-link-cta {
        color: var(--color-neon-green);
        border: 1px solid var(--color-neon-green);
        margin-left: 0.5rem;

        &:hover {
          background: var(--color-neon-green);
          color: var(--text-inverse);
        }

        &.active {
          background: var(--color-neon-green);
          color: var(--text-inverse);

          &::after {
            display: none;
          }
        }
      }

      .navbar-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        padding: 0;
        background: transparent;
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all var(--transition-fast);

        &:hover {
          color: var(--color-blue-violet);
          border-color: var(--color-blue-violet);
        }

        &:focus-visible {
          outline: 2px solid var(--color-blue-violet);
          outline-offset: 2px;
        }
      }

      .menu-toggle {
        display: none;
      }

      .nav-backdrop {
        display: none;
      }

      @media (max-width: 900px) {
        .nav-links {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(11, 11, 16, 0.98);
          flex-direction: column;
          justify-content: center;
          gap: 1rem;
          display: none;
          z-index: 99;
          padding: 2rem;
        }

        .nav-links.open {
          display: flex;
        }

        .nav-link {
          font-size: 1.5rem;
          padding: 0.75rem 1.5rem;
          text-align: center;
          width: 100%;
          max-width: 300px;

          &.active::after {
            bottom: 0;
            width: 40px;
          }
        }

        .nav-link-cta {
          margin-left: 0;
          margin-top: 1rem;
        }

        .menu-toggle {
          display: flex;
          z-index: 101;
        }

        .nav-backdrop {
          display: block;
          position: fixed;
          inset: 0;
          background: transparent;
          z-index: 98;
        }
      }
    `,
  ],
})
export class NavbarViewComponent implements OnInit {
  @Input() title = 'Portfolio';
  @Input() darkMode = false;
  @Input() mobileMenuOpen = false;
  @Input() isScrolled = false;
  @Input() activeSection = 'home';
  @Input() navItems: NavItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'contact', label: 'Contact' },
  ];

  @Output() toggleDarkMode = new EventEmitter<void>();
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() sectionClick = new EventEmitter<string>();
  @Output() closeMenu = new EventEmitter<void>();

  isMobile = false;

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile = window.innerWidth <= 900;
  }

  @HostListener('window:keydown.escape')
  onEscapeKey(): void {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 900;
  }

  onNavClick(event: Event, sectionId: string): void {
    event.preventDefault();
    this.sectionClick.emit(sectionId);
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  onMenuToggle(): void {
    this.toggleMenu.emit();
  }

  closeMobileMenu(): void {
    this.closeMenu.emit();
  }

  scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}
