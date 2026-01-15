import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Education } from '../../models';
import { SectionHeaderComponent } from '../../shared';

/**
 * Education section view - displays education background
 */
@Component({
  selector: 'app-education-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, SectionHeaderComponent],
  template: `
    <section class="education section parallax-section parallax-education" id="education" data-parallax data-parallax-speed="0.12" data-parallax-speed2="0.22">
      <app-section-header 
        title="Education" 
        subtitle="Degrees earned, curiosity ongoing"
        number="06">
      </app-section-header>

      @if (!education.length) {
        <div class="empty-state reveal-on-scroll">
          <p class="empty-title">No education entries yet.</p>
          <p class="empty-copy">Still learning — just not typing it here.</p>
        </div>
      }

      <div class="education-grid">
        @for (edu of education; track edu.id; let i = $index) {
          <div class="education-card reveal-on-scroll hover-elevate" [class]="getCardClass(i)">
            <div class="edu-icon">
              <mat-icon>school</mat-icon>
            </div>
            <div class="edu-content">
              <h3 class="degree">{{ edu.degree }}</h3>
              <p class="institution">{{ edu.institution }}</p>
              @if (edu.fieldOfStudy) {
                <p class="field">{{ edu.fieldOfStudy }}</p>
              }
              <div class="edu-meta">
                <span class="duration">
                  <mat-icon>calendar_today</mat-icon>
                  {{ edu.startYear }} — {{ edu.endYear || 'Present' }}
                </span>
                @if (edu.location) {
                  <span class="location">
                    <mat-icon>location_on</mat-icon>
                    {{ edu.location }}
                  </span>
                }
              </div>
              @if (edu.gpa) {
                <span class="chip-code-mango gpa">GPA: {{ edu.gpa }}</span>
              }
              @if (edu.description) {
                <p class="description">{{ edu.description }}</p>
              }
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .education {
      background: var(--bg-primary);
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

    .education-grid {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .education-card {
      display: flex;
      gap: 1.5rem;
      padding: 1.75rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      transition: all var(--transition-base);

      &:hover {
        transform: translateX(8px);
        box-shadow: var(--shadow-lg);
      }
    }

    .education-card.card-violet {
      border-left: 4px solid var(--color-blue-violet);

      &:hover {
        border-color: var(--color-blue-violet);
        box-shadow: 0 0 30px rgba(131, 56, 236, 0.2);
      }

      .edu-icon {
        background: rgba(131, 56, 236, 0.15);
        color: var(--color-blue-violet);
      }
    }

    .education-card.card-pink {
      border-left: 4px solid var(--color-winter-sky);

      &:hover {
        border-color: var(--color-winter-sky);
        box-shadow: 0 0 30px rgba(255, 0, 110, 0.2);
      }

      .edu-icon {
        background: rgba(255, 0, 110, 0.15);
        color: var(--color-winter-sky);
      }
    }

    .education-card.card-orange {
      border-left: 4px solid var(--color-orange);

      &:hover {
        border-color: var(--color-orange);
        box-shadow: 0 0 30px rgba(251, 86, 7, 0.2);
      }

      .edu-icon {
        background: rgba(251, 86, 7, 0.15);
        color: var(--color-orange);
      }
    }

    .education-card.card-mango {
      border-left: 4px solid var(--color-mango);

      &:hover {
        border-color: var(--color-mango);
        box-shadow: 0 0 30px rgba(255, 190, 11, 0.2);
      }

      .edu-icon {
        background: rgba(255, 190, 11, 0.15);
        color: var(--color-mango);
      }
    }

    .edu-icon {
      width: 56px;
      height: 56px;
      min-width: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background: rgba(131, 56, 236, 0.15);
      color: var(--color-blue-violet);

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }

    .edu-content {
      flex: 1;
    }

    .degree {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 0.25rem;
      color: var(--text-primary);
    }

    .institution {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-blue-violet);
      margin: 0 0 0.25rem;
    }

    .field {
      color: var(--text-secondary);
      margin: 0 0 0.75rem;
      font-size: 0.9375rem;
    }

    .edu-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .duration,
    .location {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      color: var(--text-muted);
      font-size: 0.875rem;

      mat-icon {
        font-size: 1rem;
        width: 16px;
        height: 16px;
      }
    }

    .gpa {
      display: inline-block;
      margin-bottom: 0.75rem;
    }

    .description {
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
      font-size: 0.9375rem;
    }

    @media (max-width: 640px) {
      .education-card {
        flex-direction: column;
        text-align: center;

        &:hover {
          transform: translateY(-4px);
        }
      }

      .edu-icon {
        margin: 0 auto;
      }

      .edu-meta {
        justify-content: center;
      }
    }
  `]
})
export class EducationViewComponent {
  @Input() education: Education[] = [];

  getCardClass(index: number): string {
    const classes = ['card-violet', 'card-pink', 'card-orange', 'card-mango'];
    return classes[index % classes.length];
  }
}
