import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StateService, ScrollService } from '../../services';
import { NavbarViewComponent, FooterViewComponent } from '../../views';

/**
 * Layout controller - manages app shell (navbar + footer)
 */
@Component({
  selector: 'app-layout-controller',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarViewComponent,
    FooterViewComponent,
  ],
  template: `
    <app-navbar-view
      [title]="state.profile()?.name || 'Portfolio'"
      [darkMode]="state.darkMode()"
      [mobileMenuOpen]="state.mobileMenuOpen()"
      [isScrolled]="scrollService.isScrolled()"
      [activeSection]="scrollService.activeSection()"
      [navItems]="navItems"
      (toggleDarkMode)="state.toggleDarkMode()"
      (toggleMenu)="state.toggleMobileMenu()"
      (sectionClick)="onSectionClick($event)"
      (closeMenu)="state.closeMobileMenu()"
    >
    </app-navbar-view>

    <main class="main-content" id="main-content" role="main">
      <router-outlet></router-outlet>
    </main>

    <app-footer-view [profile]="state.profile()"></app-footer-view>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .main-content {
        flex: 1;
      }
    `,
  ],
})
export class LayoutController implements OnInit, AfterViewInit {
  readonly state = inject(StateService);
  readonly scrollService = inject(ScrollService);

  readonly navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'contact', label: 'Contact' },
  ];

  ngOnInit(): void {
    // Handle initial hash in URL
    this.scrollService.handleInitialHash();
  }

  ngAfterViewInit(): void {
    // Initialize section observer after view is ready
    setTimeout(() => {
      this.scrollService.initSectionObserver(
        this.navItems.map((item) => item.id)
      );
    }, 500);
  }

  onSectionClick(sectionId: string): void {
    this.scrollService.scrollToSection(sectionId);
    this.state.closeMobileMenu();
  }
}
