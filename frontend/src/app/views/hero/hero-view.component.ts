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
          <button class="btn-primary" (click)="viewWork.emit()">
            View My Work
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
            class="social-link"
          >
            <mat-icon>code</mat-icon>
          </a>
          } @if (profile.linkedinUrl) {
          <a
            [href]="profile.linkedinUrl"
            target="_blank"
            rel="noopener"
            aria-label="LinkedIn"
            class="social-link"
          >
            <mat-icon>business</mat-icon>
          </a>
          } @if (profile.nickname) {
          <a
            [href]="profile.nickname"
            target="_blank"
            rel="noopener"
            aria-label="Nickname"
            class="social-link"
          >
            <mat-icon>person</mat-icon>
          </a>
          } @if (profile.email) {
          <a
            [href]="'mailto:' + profile.email"
            aria-label="Email"
            class="social-link"
          >
            <mat-icon>email</mat-icon>
          </a>
          }
        </div>
      </div>
      <div class="hero-decoration">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
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
      }

      .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 50%;
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
        background: var(--color-winter-sky);
        top: 50%;
        right: -5%;
        animation-delay: -3s;
      }

      .orb-3 {
        width: 250px;
        height: 250px;
        background: var(--color-orange);
        bottom: 10%;
        left: 20%;
        animation-delay: -6s;
      }

      @keyframes float {
        0%,
        100% {
          transform: translate(0, 0);
        }
        33% {
          transform: translate(20px, -20px);
        }
        66% {
          transform: translate(-20px, 20px);
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
  @Output() viewWork = new EventEmitter<void>();
  @Output() contactClick = new EventEmitter<void>();
}
