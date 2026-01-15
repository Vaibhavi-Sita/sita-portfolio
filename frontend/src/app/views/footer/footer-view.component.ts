import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Profile } from '../../models';

/**
 * Footer view - displays copyright and social links
 */
@Component({
  selector: 'app-footer-view',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="social-links">
          @if (profile?.githubUrl) {
            <a [href]="profile!.githubUrl" target="_blank" rel="noopener" aria-label="GitHub">
              <mat-icon>code</mat-icon>
            </a>
          }
          @if (profile?.linkedinUrl) {
            <a [href]="profile!.linkedinUrl" target="_blank" rel="noopener" aria-label="LinkedIn">
              <mat-icon>business</mat-icon>
            </a>
          }
          @if (profile?.email) {
            <a [href]="'mailto:' + profile!.email" aria-label="Email">
              <mat-icon>email</mat-icon>
            </a>
          }
        </div>
        <p class="copyright">
          © {{ currentYear }} {{ profile?.name || 'Portfolio' }}. Built with Angular & Spring Boot.
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      padding: 3rem 2rem;
      background: var(--bg-secondary);
      text-align: center;
    }

    .social-links {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .social-links a {
      color: var(--text-secondary);
      transition: color 0.2s, transform 0.2s;
    }

    .social-links a:hover {
      color: var(--primary-color);
      transform: translateY(-2px);
    }

    .copyright {
      color: var(--text-muted);
      font-size: 0.875rem;
      margin: 0;
    }
  `]
})
export class FooterViewComponent {
  @Input() profile: Profile | null = null;

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
