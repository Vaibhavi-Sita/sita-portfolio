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
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    SectionHeaderComponent,
    DatePipe,
  ],
  template: `
    <section
      class="experience section parallax-section parallax-experience"
      id="experience"
      data-parallax
      data-parallax-speed="0.12"
      data-parallax-speed2="0.22"
    >
      <app-section-header
        title="Experience"
        subtitle="My professional journey"
        number="02"
      >
      </app-section-header>

      @if (!experiences.length) {
      <div class="empty-state reveal-on-scroll">
        <p class="empty-title">No timelines yet.</p>
        <p class="empty-copy">
          Think of this as a TODO: more commits incoming.
        </p>
      </div>
      }

      <div class="timeline">
        @for (exp of experiences; track exp.id; let i = $index) {
        <div class="timeline-item" [class.timeline-item-right]="i % 2 === 1">
          <div class="timeline-marker">
            <div class="marker-dot"></div>
          </div>
          <div class="experience-card card-glow reveal-on-scroll hover-elevate">
            <div class="card-header">
              <div class="company-row">
                @if (exp.logoUrl) {
                <div class="company-logo">
                  <img [src]="exp.logoUrl" [alt]="exp.company + ' logo'" />
                </div>
                }
                <div class="company-meta">
                  <h3 class="role">{{ exp.role }}</h3>
                  <div class="company-info">
                    <span class="company text-blue-violet">{{
                      exp.company
                    }}</span>
                    @if (exp.location) {
                    <span class="location"> • {{ exp.location }}</span>
                    }
                  </div>
                </div>
              </div>
              <p class="date-range">
                {{ exp.startDate | date : 'MMM yyyy' }} —
                {{
                  exp.endDate ? (exp.endDate | date : 'MMM yyyy') : 'Present'
                }}
              </p>
            </div>

            @if (exp.description) {
            <p class="description">{{ exp.description }}</p>
            } @if (exp.bullets.length) {
            <ul class="bullets">
              @for (bullet of exp.bullets; track bullet.id) {
              <li>{{ bullet.content }}</li>
              }
            </ul>
            } @if (exp.techStack) {
            <div class="chip-group">
              @for (tech of getTechArray(exp.techStack); track tech) {
              <span [class]="'chip-code-mango'">{{ tech }}</span>
              }
            </div>
            }
          </div>
        </div>
        }
        <div class="timeline-line"></div>
      </div>
    </section>
  `,
  styles: [
    `
      .experience {
        background: var(--bg-secondary);
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

      .timeline {
        max-width: 1500px;
        margin: 0 auto;
        position: relative;
      }

      .timeline-line {
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(
          180deg,
          var(--color-blue-violet) 0%,
          var(--color-winter-sky) 50%,
          var(--color-orange) 100%
        );
        transform: translateX(-50%);
      }

      .timeline-item {
        position: relative;
        padding: 0 0 3rem;
        width: 50%;
        padding-right: 3rem;
      }

      .timeline-item-right {
        margin-left: 50%;
        padding-right: 0;
        padding-left: 3rem;
      }

      .timeline-marker {
        position: absolute;
        right: -8px;
        top: 0;
        z-index: 2;
      }

      .timeline-item-right .timeline-marker {
        right: auto;
        left: -8px;
      }

      .marker-dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--color-blue-violet);
        border: 3px solid var(--bg-secondary);
        box-shadow: 0 0 20px rgba(131, 56, 236, 0.5);
      }

      .experience-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        padding: 1.5rem;
        transition: all var(--transition-base);

        &:hover {
          border-color: rgba(131, 56, 236, 0.5);
          box-shadow: inset 0 0 20px rgba(131, 56, 236, 0.05),
            0 0 30px rgba(131, 56, 236, 0.15);
          transform: translateY(-2px);
        }
      }

      .card-header {
        margin-bottom: 1rem;
      }

      .company-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .company-logo {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--border-subtle);
        background: var(--bg-secondary);
        display: grid;
        place-items: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
      }

      .company-logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .role {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0 0 0.25rem;
        color: var(--text-primary);
      }

      .company-info {
        font-size: 0.9375rem;
        margin-bottom: 0.25rem;
      }

      .company {
        font-weight: 600;
      }

      .location {
        color: var(--text-muted);
      }

      .date-range {
        font-size: 0.875rem;
        color: var(--text-muted);
        margin: 0;
        font-family: 'JetBrains Mono', monospace;
      }

      .description {
        color: var(--text-secondary);
        line-height: 1.7;
        margin-bottom: 1rem;
      }

      .bullets {
        margin: 0 0 1rem;
        padding-left: 1.25rem;
      }

      .bullets li {
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
        line-height: 1.6;
        position: relative;

        &::marker {
          color: var(--color-winter-sky);
        }
      }

      @media (max-width: 768px) {
        .timeline-line {
          left: 8px;
        }

        .timeline-item,
        .timeline-item-right {
          width: 100%;
          margin-left: 0;
          padding-left: 2.5rem;
          padding-right: 0;
        }

        .timeline-marker,
        .timeline-item-right .timeline-marker {
          left: 0;
          right: auto;
        }
      }
    `,
  ],
})
export class ExperienceViewComponent {
  @Input() experiences: Experience[] = [];

  getTechArray(techStack: string): string[] {
    return techStack.split(',').map((t) => t.trim());
  }

  // getChipClass(index: number): string {
  //   const classes = [
  //     'chip-code',
  //     'chip-code-pink',
  //     'chip-code-orange',
  //     'chip-code-mango',
  //   ];
  //   return classes[index % classes.length];
  // }
}
