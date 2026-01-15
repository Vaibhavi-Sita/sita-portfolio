import { Component, inject, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StateService } from '../../services';
import { NavbarViewComponent, FooterViewComponent } from '../../views';

/**
 * Layout controller - manages app shell (navbar + footer)
 */
@Component({
  selector: 'app-layout-controller',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarViewComponent, FooterViewComponent],
  template: `
    <app-navbar-view
      [title]="state.profile()?.name || 'Portfolio'"
      [darkMode]="state.darkMode()"
      [mobileMenuOpen]="state.mobileMenuOpen()"
      [isScrolled]="isScrolled()"
      (toggleDarkMode)="state.toggleDarkMode()"
      (toggleMenu)="state.toggleMobileMenu()">
    </app-navbar-view>

    <main class="main-content" (click)="state.closeMobileMenu()" (keydown.escape)="state.closeMobileMenu()" tabindex="0">
      <router-outlet></router-outlet>
    </main>

    <app-footer-view [profile]="state.profile()"></app-footer-view>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      padding-top: 64px; /* Account for fixed navbar */
    }
  `]
})
export class LayoutController {
  readonly state = inject(StateService);
  readonly isScrolled = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }
}
