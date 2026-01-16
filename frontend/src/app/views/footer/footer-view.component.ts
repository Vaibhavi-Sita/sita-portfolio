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
        <div class="footer-brand">
          <span class="logo">
            <span class="logo-symbol">&lt; </span>
            {{ profile?.name || 'Portfolio' }}
            <span class="logo-symbol">/&gt;</span>
          </span>
        </div>

        <div class="footer-social">
          @if (profile?.githubUrl) {
          <a
            [href]="profile!.githubUrl"
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
            class="social-link"
          >
            <mat-icon>code</mat-icon>
          </a>
          } @if (profile?.linkedinUrl) {
          <a
            [href]="profile!.linkedinUrl"
            target="_blank"
            rel="noopener"
            aria-label="LinkedIn"
            class="social-link"
          >
            <mat-icon>business</mat-icon>
          </a>
          } @if (profile?.email) {
          <a
            [href]="'mailto:' + profile!.email"
            aria-label="Email"
            class="social-link"
          >
            <mat-icon>email</mat-icon>
          </a>
          }
        </div>

        <div class="footer-bottom">
          <p class="copyright">
            © {{ currentYear }} {{ profile?.name || 'Portfolio' }}
          </p>
          <p class="built-with">
            Built with <span class="text-winter-sky">Angular</span> &
            <span class="text-orange">Spring Boot</span>
          </p>
        </div>
      </div>

      <div class="footer-gradient"></div>
    </footer>
  `,
  styles: [
    `
      .footer {
        position: relative;
        padding: 4rem 2rem 2rem;
        background: var(--bg-primary);
        border-top: 1px solid var(--border-subtle);
        overflow: hidden;
      }

      .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        text-align: center;
        position: relative;
        z-index: 1;
      }

      .footer-brand {
        margin-bottom: 2rem;
      }

      .logo {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
      }

      .logo-symbol {
        color: var(--color-blue-violet);
        font-family: 'JetBrains Mono', monospace;
      }

      .footer-social {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--bg-elevated);
        border: 1px solid var(--border-subtle);
        color: var(--text-secondary);
        transition: all var(--transition-base);

        &:hover {
          color: var(--color-blue-violet);
          border-color: var(--color-blue-violet);
          transform: translateY(-3px);
          box-shadow: 0 0 20px rgba(131, 56, 236, 0.3);
        }
      }

      .footer-bottom {
        padding-top: 2rem;
        border-top: 1px solid var(--border-subtle);
      }

      .copyright {
        color: var(--text-muted);
        font-size: 0.875rem;
        margin: 0 0 0.5rem;
      }

      .built-with {
        color: var(--text-muted);
        font-size: 0.8125rem;
        margin: 0;
      }

      .footer-gradient {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 200px;
        background: radial-gradient(
          ellipse at 50% 100%,
          rgba(131, 56, 236, 0.1) 0%,
          transparent 70%
        );
        pointer-events: none;
      }
    `,
  ],
})
export class FooterViewComponent {
  @Input() profile: Profile | null = null;

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
