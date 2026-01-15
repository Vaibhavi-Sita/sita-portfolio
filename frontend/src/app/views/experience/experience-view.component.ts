import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Experience } from '../../models';
import { SectionHeaderComponent } from '../../shared';

/**
 * Experience section view - displays work history timeline
 */
@Component({
  selector: 'app-experience-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule, SectionHeaderComponent, DatePipe],
  template: `
    <section class="experience" id="experience">
      <app-section-header 
        title="Work Experience" 
        subtitle="My professional journey">
      </app-section-header>

      <div class="timeline">
        @for (exp of experiences; track exp.id) {
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <mat-card class="experience-card">
              <mat-card-header>
                <mat-card-title>{{ exp.role }}</mat-card-title>
                <mat-card-subtitle>
                  <span class="company">{{ exp.company }}</span>
                  @if (exp.location) {
                    <span class="location">• {{ exp.location }}</span>
                  }
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p class="date-range">
                  {{ exp.startDate | date:'MMM yyyy' }} - 
                  {{ exp.endDate ? (exp.endDate | date:'MMM yyyy') : 'Present' }}
                </p>
                @if (exp.description) {
                  <p class="description">{{ exp.description }}</p>
                }
                @if (exp.bullets.length) {
                  <ul class="bullets">
                    @for (bullet of exp.bullets; track bullet.id) {
                      <li>{{ bullet.content }}</li>
                    }
                  </ul>
                }
                @if (exp.techStack) {
                  <div class="tech-stack">
                    @for (tech of getTechArray(exp.techStack); track tech) {
                      <mat-chip>{{ tech }}</mat-chip>
                    }
                  </div>
                }
              </mat-card-content>
            </mat-card>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .experience {
      padding: 5rem 2rem;
    }

    .timeline {
      max-width: 800px;
      margin: 0 auto;
      position: relative;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--primary-color);
    }

    .timeline-item {
      padding-left: 2rem;
      position: relative;
      margin-bottom: 2rem;
    }

    .timeline-marker {
      position: absolute;
      left: -5px;
      top: 1.5rem;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--primary-color);
      border: 2px solid var(--bg-primary);
    }

    .experience-card {
      background: var(--bg-card);
    }

    .company {
      font-weight: 600;
      color: var(--primary-color);
    }

    .location {
      color: var(--text-muted);
    }

    .date-range {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    .description {
      color: var(--text-primary);
      line-height: 1.6;
    }

    .bullets {
      margin: 1rem 0;
      padding-left: 1.25rem;
    }

    .bullets li {
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .timeline::before {
        left: 10px;
      }

      .timeline-marker {
        left: 5px;
      }

      .timeline-item {
        padding-left: 2.5rem;
      }
    }
  `]
})
export class ExperienceViewComponent {
  @Input() experiences: Experience[] = [];

  getTechArray(techStack: string): string[] {
    return techStack.split(',').map(t => t.trim());
  }
}
