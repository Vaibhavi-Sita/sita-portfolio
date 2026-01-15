import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Profile } from '../../models';

/**
 * Hero section view - displays main profile info
 */
@Component({
  selector: 'app-hero-view',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    @if (profile) {
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-name">{{ profile.name }}</h1>
        <p class="hero-title">{{ profile.title }}</p>
        @if (profile.tagline) {
          <p class="hero-tagline">{{ profile.tagline }}</p>
        }
        <div class="hero-actions">
          <button mat-raised-button color="primary" (click)="viewWork.emit()">
            View My Work
          </button>
          <button mat-stroked-button (click)="contactClick.emit()">
            Get In Touch
          </button>
        </div>
        <div class="hero-social">
          @if (profile.githubUrl) {
            <a [href]="profile.githubUrl" target="_blank" rel="noopener" aria-label="GitHub">
              <mat-icon>code</mat-icon>
            </a>
          }
          @if (profile.linkedinUrl) {
            <a [href]="profile.linkedinUrl" target="_blank" rel="noopener" aria-label="LinkedIn">
              <mat-icon>business</mat-icon>
            </a>
          }
          @if (profile.email) {
            <a [href]="'mailto:' + profile.email" aria-label="Email">
              <mat-icon>email</mat-icon>
            </a>
          }
        </div>
      </div>
    </section>
    }
  `,
  styles: [`
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }

    .hero-content {
      max-width: 800px;
    }

    .hero-name {
      font-size: 4rem;
      font-weight: 800;
      margin: 0;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-title {
      font-size: 1.75rem;
      color: var(--text-secondary);
      margin: 0.5rem 0;
    }

    .hero-tagline {
      font-size: 1.25rem;
      color: var(--text-muted);
      margin: 1rem 0 2rem;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .hero-social {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .hero-social a {
      color: var(--text-secondary);
      transition: color 0.2s, transform 0.2s;
    }

    .hero-social a:hover {
      color: var(--primary-color);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .hero-name {
        font-size: 2.5rem;
      }

      .hero-title {
        font-size: 1.25rem;
      }

      .hero-actions {
        flex-direction: column;
      }
    }
  `]
})
export class HeroViewComponent {
  @Input() profile: Profile | null = null;
  @Output() viewWork = new EventEmitter<void>();
  @Output() contactClick = new EventEmitter<void>();
}
