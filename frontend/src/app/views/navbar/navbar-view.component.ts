import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Navbar view - displays navigation
 */
@Component({
  selector: 'app-navbar-view',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar class="navbar" [class.scrolled]="isScrolled">
      <a routerLink="/" class="logo">{{ title }}</a>
      
      <span class="spacer"></span>

      <nav class="nav-links" [class.open]="mobileMenuOpen">
        <a mat-button routerLink="/" fragment="about">About</a>
        <a mat-button routerLink="/" fragment="experience">Experience</a>
        <a mat-button routerLink="/" fragment="projects">Projects</a>
        <a mat-button routerLink="/" fragment="skills">Skills</a>
        <a mat-button routerLink="/" fragment="education">Education</a>
        <a mat-button routerLink="/" fragment="contact">Contact</a>
      </nav>

      <button mat-icon-button (click)="toggleDarkMode.emit()" aria-label="Toggle dark mode">
        <mat-icon>{{ darkMode ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>

      <button mat-icon-button class="menu-toggle" (click)="toggleMenu.emit()" aria-label="Toggle menu">
        <mat-icon>{{ mobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: transparent;
      transition: background 0.3s, box-shadow 0.3s;
    }

    .navbar.scrolled {
      background: var(--bg-primary);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      text-decoration: none;
      color: var(--text-primary);
    }

    .spacer {
      flex: 1;
    }

    .nav-links a {
      color: var(--text-primary);
    }

    .menu-toggle {
      display: none;
    }

    @media (max-width: 768px) {
      .nav-links {
        position: fixed;
        top: 64px;
        left: 0;
        right: 0;
        background: var(--bg-primary);
        flex-direction: column;
        padding: 1rem;
        display: none;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }

      .nav-links.open {
        display: flex;
      }

      .menu-toggle {
        display: flex;
      }
    }
  `]
})
export class NavbarViewComponent {
  @Input() title = 'Portfolio';
  @Input() darkMode = false;
  @Input() mobileMenuOpen = false;
  @Input() isScrolled = false;
  @Output() toggleDarkMode = new EventEmitter<void>();
  @Output() toggleMenu = new EventEmitter<void>();
}
