import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Certification } from '../../models';
import { SectionHeaderComponent } from '../../shared';

/**
 * Certifications section view - displays certifications and publications
 */
@Component({
  selector: 'app-certifications-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, SectionHeaderComponent, DatePipe],
  template: `
    @if (certifications.length) {
    <section
      class="certifications section parallax-section parallax-certifications"
      id="certifications"
      data-parallax
      data-parallax-speed="0.12"
      data-parallax-speed2="0.22"
    >
      <app-section-header
        title="Certifications & Publications"
        subtitle="A collection of certifications and publications that I have earned or published."
        number="07"
      >
      </app-section-header>

      @if (!certifications.length) {
      <div class="empty-state reveal-on-scroll">
        <p class="empty-title">No certifications on file.</p>
        <p class="empty-copy">Badge collection pending. Stay tuned.</p>
      </div>
      }

      <div class="certifications-grid">
        @for (cert of certifications; track cert.id; let i = $index) {
        <div
          class="certification-card reveal-on-scroll hover-elevate"
          [class]="getCardClass(i)"
        >
          <div class="cert-icon">
            <mat-icon>{{ getIcon(cert) }}</mat-icon>
          </div>
          <div class="cert-content">
            <h3 class="cert-name">{{ cert.name }}</h3>
            <p class="cert-issuer">{{ cert.issuer }}</p>
            <div class="cert-meta">
              <span class="cert-date">
                <mat-icon>event</mat-icon>
                {{ cert.issueDate | date : 'MMM yyyy' }}
              </span>
              @if (cert.credentialId) {
              <span class="cert-id">
                <mat-icon>tag</mat-icon>
                {{ cert.credentialId }}
              </span>
              }
            </div>
            @if (cert.credentialUrl) {
            <a
              [href]="cert.credentialUrl"
              target="_blank"
              rel="noopener"
              class="cert-link"
            >
              <mat-icon>open_in_new</mat-icon>
              View Credential
            </a>
            }
          </div>
        </div>
        }
      </div>
    </section>
    }
  `,
  styles: [
    `
      .certifications {
        background: transparent;
      }

      .empty-state {
        text-align: center;
        color: var(--text-secondary);
        margin: 2rem 0 3rem;
      }

      .empty-title {
        margin: 0 0 0.25rem;
        font-weight: 700;
      }

      .empty-copy {
        margin: 0;
        color: var(--text-muted);
      }

      .certifications-grid {
        max-width: 1000px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .certification-card {
        display: flex;
        gap: 1rem;
        padding: 1.5rem;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        transition: all var(--transition-base);

        &:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
      }

      .certification-card.card-violet {
        border-color: rgba(131, 56, 236, 0.3);

        &:hover {
          border-color: rgba(131, 56, 236, 0.6);
          box-shadow: 0 0 30px rgba(131, 56, 236, 0.2);
        }

        .cert-icon {
          background: rgba(131, 56, 236, 0.15);
          color: var(--color-blue-violet);
        }
      }

      .certification-card.card-pink {
        border-color: rgba(255, 0, 110, 0.3);

        &:hover {
          border-color: rgba(255, 0, 110, 0.6);
          box-shadow: 0 0 30px rgba(255, 0, 110, 0.2);
        }

        .cert-icon {
          background: rgba(255, 0, 110, 0.15);
          color: var(--color-winter-sky);
        }
      }

      .certification-card.card-orange {
        border-color: rgba(251, 86, 7, 0.3);

        &:hover {
          border-color: rgba(251, 86, 7, 0.6);
          box-shadow: 0 0 30px rgba(251, 86, 7, 0.2);
        }

        .cert-icon {
          background: rgba(251, 86, 7, 0.15);
          color: var(--color-orange);
        }
      }

      .certification-card.card-mango {
        border-color: rgba(255, 190, 11, 0.3);

        &:hover {
          border-color: rgba(255, 190, 11, 0.6);
          box-shadow: 0 0 30px rgba(255, 190, 11, 0.2);
        }

        .cert-icon {
          background: rgba(255, 190, 11, 0.15);
          color: var(--color-mango);
        }
      }

      .cert-icon {
        width: 52px;
        height: 52px;
        min-width: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: rgba(131, 56, 236, 0.15);
        color: var(--color-blue-violet);

        mat-icon {
          font-size: 26px;
          width: 26px;
          height: 26px;
        }
      }

      .cert-content {
        flex: 1;
        min-width: 0;
      }

      .cert-name {
        font-size: 1.0625rem;
        font-weight: 700;
        margin: 0 0 0.25rem;
        color: var(--text-primary);
      }

      .cert-issuer {
        font-size: 0.9375rem;
        font-weight: 500;
        color: var(--color-blue-violet);
        margin: 0 0 0.75rem;
      }

      .cert-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 0.75rem;
      }

      .cert-date,
      .cert-id {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--text-muted);
        font-size: 0.8125rem;

        mat-icon {
          font-size: 0.875rem;
          width: 14px;
          height: 14px;
        }
      }

      .cert-link {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        color: var(--color-winter-sky);
        font-size: 0.875rem;
        font-weight: 500;
        text-decoration: none;
        transition: color var(--transition-fast);

        mat-icon {
          font-size: 1rem;
          width: 16px;
          height: 16px;
        }

        &:hover {
          color: var(--color-mango);
        }

        &:focus-visible {
          outline: 2px solid var(--color-blue-violet);
          outline-offset: 2px;
          border-radius: 4px;
        }
      }

      @media (max-width: 640px) {
        .certifications-grid {
          grid-template-columns: 1fr;
        }

        .certification-card {
          flex-direction: column;
          text-align: center;
        }

        .cert-icon {
          margin: 0 auto;
        }

        .cert-meta {
          justify-content: center;
        }

        .cert-link {
          justify-content: center;
        }
      }
    `,
  ],
})
export class CertificationsViewComponent {
  @Input() certifications: Certification[] = [];

  getCardClass(index: number): string {
    const classes = ['card-violet', 'card-pink', 'card-orange', 'card-mango'];
    return classes[index % classes.length];
  }

  getIcon(cert: Certification): string {
    const name = cert.name.toLowerCase();
    if (name.includes('aws') || name.includes('cloud')) return 'cloud';
    if (name.includes('security') || name.includes('certified'))
      return 'verified_user';
    if (
      name.includes('publication') ||
      name.includes('journal') ||
      name.includes('research')
    )
      return 'article';
    if (name.includes('course') || name.includes('training')) return 'school';
    return 'workspace_premium';
  }
}
