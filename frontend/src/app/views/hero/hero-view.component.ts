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
    <section
      class="hero hero-gradient-bg parallax-section parallax-home"
      id="home"
      data-parallax
      data-parallax-speed="0.08"
      data-parallax-speed2="0.16"
    >
      <div class="hero-content reveal-on-scroll">
        <p class="hero-greeting">Hey there, I’m</p>
        <h1 class="hero-name text-gradient">{{ profile.nickname }}</h1>
        <p class="hero-title">{{ profile.title }}</p>
        @if (profile.tagline) {
        <p class="hero-tagline">{{ profile.tagline }}</p>
        } @else {
        <p class="hero-tagline">
          Building reliable things with clean code and AI.
        </p>
        }
        <div class="hero-actions">
          <button class="btn-primary" (click)="experienceClick.emit()">
            Dive In
            <mat-icon>arrow_forward</mat-icon>
          </button>
          <button class="btn-secondary" (click)="contactClick.emit()">
            Get In Touch
          </button>
        </div>
        <div class="hero-social">
          @if (profile.githubUrl) {
          <a
            [href]="profile.githubUrl"
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
            title="GitHub"
            class="social-link"
          >
            <mat-icon>code</mat-icon>
            <span class="social-label">GitHub</span>
          </a>
          } @if (profile.linkedinUrl) {
          <a
            [href]="profile.linkedinUrl"
            target="_blank"
            rel="noopener"
            aria-label="LinkedIn"
            title="LinkedIn"
            class="social-link"
          >
            <mat-icon>business</mat-icon>
            <span class="social-label">LinkedIn</span>
          </a>
          } @if (profile.resumeUrl) {
          <a
            [href]="profile.resumeUrl"
            target="_blank"
            rel="noopener"
            aria-label="Resume"
            title="Resume"
            class="social-link"
          >
            <mat-icon>file_present</mat-icon>
            <span class="social-label">Resume</span>
          </a>
          } @if (profile.email) {
          <a
            [href]="'mailto:' + profile.email"
            aria-label="Email"
            title="Email"
            class="social-link"
          >
            <mat-icon>email</mat-icon>
            <span class="social-label">Email</span>
          </a>
          }
        </div>
        <br />
        @if (availabilityStatus) {
        <div class="availability-badge">
          <span class="availability-dot"></span>
          <span class="availability-text">{{ availabilityStatus }}</span>
        </div>
        }
      </div>
      <div class="hero-decoration">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="orb orb-4"></div>
      </div>
    </section>
    }
  `,
  styles: [
    `
      .hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 6rem 2rem 4rem;
        position: relative;
      }

      .hero-content {
        max-width: 900px;
        position: relative;
        z-index: 2;
      }

      .hero-greeting {
        font-size: 1.125rem;
        color: var(--color-blue-violet);
        font-weight: 500;
        margin-bottom: 0.5rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .hero-name {
        font-size: clamp(3rem, 8vw, 5.5rem);
        font-weight: 800;
        margin: 0;
        line-height: 1.1;
        letter-spacing: -0.03em;
      }

      .hero-title {
        font-size: clamp(1.25rem, 3vw, 1.75rem);
        color: var(--text-secondary);
        margin: 1rem 0;
        font-weight: 400;
      }

      .hero-tagline {
        font-size: 1.125rem;
        color: var(--text-muted);
        margin: 0 auto 2.5rem;
        max-width: 600px;
        line-height: 1.7;
      }
      .availability-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        margin-bottom: 2rem;
        background: rgba(44, 255, 5, 0.1);
        border: 1px solid rgba(44, 255, 5, 0.3);
        border-radius: 50px;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-neon-green);
        animation: fadeIn 0.5s ease-out;
      }

      .availability-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--color-neon-green);
        animation: pulse 2s ease-in-out infinite;
      }

      .availability-text {
        letter-spacing: 0.02em;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes pulse {
        0% {
          opacity: 1;
          transform: scale(1);
        }
        70% {
          opacity: 0;
          transform: scale(1.5);
        }
      }

      .hero-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 3rem;
        flex-wrap: wrap;
      }

      .hero-social {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .social-link {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.35rem;
        width: 88px;
        height: 92px;
        padding: 0.5rem;
        border-radius: 14px;
        background: var(--bg-elevated);
        border: 1px solid var(--border-subtle);
        color: var(--text-secondary);
        transition: all var(--transition-base);

        &:hover {
          color: var(--color-blue-violet);
          border-color: var(--color-blue-violet);
          transform: translateY(-3px);
          box-shadow: var(--glow-violet);
        }
      }

      .social-label {
        font-size: 0.75rem;
        color: var(--text-muted);
        letter-spacing: 0.01em;
      }

      .social-link:hover .social-label {
        color: var(--color-blue-violet);
      }

      .hero-decoration {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
      }

      .orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.5;
        animation: float 10s ease-in-out infinite;
      }

      .orb-1 {
        width: 400px;
        height: 400px;
        background: var(--color-blue-violet);
        top: 10%;
        left: -10%;
        animation-delay: 0s;
      }

      .orb-2 {
        width: 300px;
        height: 300px;
        background: var(--color-blue-violet);
        top: 50%;
        right: -5%;
        animation-delay: -3s;
      }

      .orb-3 {
        width: 250px;
        height: 250px;
        background: var(--color-winter-sky);
        bottom: 20%;
        left: 20%;
        animation-delay: -6s;
      }

      @keyframes float {
        0%,
        100% {
          transform: translate(0, 0);
        }
        33% {
          transform: translate(50px, -50px);
        }
        66% {
          transform: translate(-50px, 50px);
        }
      }

      @media (max-width: 768px) {
        .hero {
          padding-top: 5rem;
        }

        .hero-actions {
          flex-direction: column;
          align-items: center;
        }

        .hero-actions button {
          width: 100%;
          max-width: 280px;
        }

        .orb {
          opacity: 0.3;
        }
      }
    `,
  ],
})
export class HeroViewComponent {
  @Input() profile: Profile | null = null;
  @Input() availabilityStatus?: string;
  @Output() experienceClick = new EventEmitter<void>();
  @Output() contactClick = new EventEmitter<void>();
}
