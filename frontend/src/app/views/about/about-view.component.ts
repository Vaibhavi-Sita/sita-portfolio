import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../models';
import { SectionHeaderComponent } from '../../shared';

/**
 * About section view - displays bio and personal info
 */
@Component({
  selector: 'app-about-view',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent],
  template: `
    @if (profile) {
    <section
      class="about section parallax-section parallax-about"
      id="about"
      data-parallax
      data-parallax-speed="0.1"
      data-parallax-speed2="0.2"
    >
      <app-section-header
        title="About Me"
        subtitle="A little bit about who I am"
        number="01"
      >
      </app-section-header>

      <div class="about-content">
        @if (profile.avatarUrl) {
        <div class="about-image reveal-on-scroll">
          <div class="image-wrapper">
            <img [src]="profile.avatarUrl" [alt]="profile.name" />
            <div class="image-border"></div>
          </div>
        </div>
        }
        <div class="about-text reveal-on-scroll">
          @if (profile.bio) {
          <p class="bio">{{ profile.bio }}</p>
          }
          <div class="about-highlights">
            <div class="highlight reveal-on-scroll hover-elevate">
              <span class="highlight-number text-gradient">5+</span>
              <span class="highlight-label">Years Experience</span>
            </div>
            <div class="highlight reveal-on-scroll hover-elevate">
              <span class="highlight-number text-gradient">20+</span>
              <span class="highlight-label">Projects Completed</span>
            </div>
            <div class="highlight reveal-on-scroll hover-elevate">
              <span class="highlight-number text-gradient">10+</span>
              <span class="highlight-label">Technologies</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    }
  `,
  styles: [
    `
      .about {
        background: var(--bg-primary);
      }

      .about-content {
        max-width: 1000px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 4rem;
        align-items: center;
      }

      .about-image {
        display: flex;
        justify-content: center;
      }

      .image-wrapper {
        position: relative;
        width: 280px;
        height: 280px;
      }

      .image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 20px;
        position: relative;
        z-index: 2;
      }

      .image-border {
        position: absolute;
        inset: -8px;
        border-radius: 24px;
        background: linear-gradient(
          135deg,
          var(--color-blue-violet),
          var(--color-winter-sky),
          var(--color-orange)
        );
        z-index: 1;
        opacity: 0.6;
        filter: blur(2px);
      }

      .about-text {
        max-width: 600px;
      }

      .bio {
        font-size: 1.125rem;
        line-height: 1.8;
        color: var(--text-secondary);
        margin-bottom: 2rem;
      }

      .about-highlights {
        display: flex;
        gap: 2rem;
      }

      .highlight {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.25rem 1.5rem;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        transition: all var(--transition-base);

        &:hover {
          border-color: var(--color-blue-violet);
          transform: translateY(-4px);
          box-shadow: 0 0 30px rgba(131, 56, 236, 0.15);
        }
      }

      .highlight-number {
        font-size: 2.25rem;
        font-weight: 800;
        line-height: 1;
      }

      .highlight-label {
        font-size: 0.8125rem;
        color: var(--text-muted);
        margin-top: 0.375rem;
        text-align: center;
      }

      @media (max-width: 900px) {
        .about-content {
          grid-template-columns: 1fr;
          gap: 2rem;
          text-align: center;
        }

        .about-text {
          max-width: 100%;
        }

        .about-highlights {
          justify-content: center;
          flex-wrap: wrap;
        }

        .image-wrapper {
          width: 220px;
          height: 220px;
        }
      }

      @media (max-width: 480px) {
        .about-highlights {
          gap: 1rem;
        }

        .highlight {
          padding: 1rem;
          flex: 1;
          min-width: 100px;
        }

        .highlight-number {
          font-size: 1.75rem;
        }
      }
    `,
  ],
})
export class AboutViewComponent {
  @Input() profile: Profile | null = null;
}
