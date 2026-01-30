import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Project } from '../../models';
import { SectionHeaderComponent } from '../../shared';

/**
 * Projects section view - displays portfolio projects
 */
@Component({
  selector: 'app-projects-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    SectionHeaderComponent,
  ],
  template: `
    <section
      class="projects section parallax-section parallax-projects"
      id="projects"
      data-parallax
      data-parallax-speed="0.12"
      data-parallax-speed2="0.24"
    >
      <app-section-header
        title="Projects"
        subtitle="Shipped pieces I'm proud to demo"
        number="03"
      >
      </app-section-header>

      @if (!projects.length) {
      <div class="empty-state reveal-on-scroll">
        <p class="empty-title">No projects listed yet.</p>
        <p class="empty-copy">Give me a sprint; I’ll fill this grid.</p>
      </div>
      }

      <div class="projects-grid">
        @for (project of projects; track project.id) {
        <article
          class="project-card reveal-on-scroll hover-elevate"
          [class.featured]="project.featured"
        >
          @if (project.featured) {
          <div class="featured-badge">
            <mat-icon>star</mat-icon>
            Featured
          </div>
          } @if (project.imageUrl) {
          <div class="project-image">
            <img
              [src]="project.imageUrl"
              [alt]="project.title"
              loading="lazy"
            />
            <div class="image-overlay"></div>
          </div>
          }

          <div class="project-content">
            <h3 class="project-title">{{ project.title }}</h3>

            @if (project.description) {
            <p class="project-description">{{ project.description }}</p>
            } @if (project.bullets.length) {
            <ul class="project-features">
              @for (bullet of project.bullets.slice(0, 3); track bullet.id) {
              <li>{{ bullet.content }}</li>
              }
            </ul>
            } @if (project.techStack) {
            <div class="chip-group">
              @for (tech of getTechArray(project.techStack); track tech; let i =
              $index) {
              <span [class]="getChipClass(i)">{{ tech }}</span>
              }
            </div>
            }

            <div class="project-links">
              @if (project.liveUrl) {
              <a
                [href]="project.liveUrl"
                target="_blank"
                rel="noopener"
                class="project-link"
              >
                <mat-icon>launch</mat-icon>
                Live Demo
              </a>
              } @if (project.githubUrl) {
              <a
                [href]="project.githubUrl"
                target="_blank"
                rel="noopener"
                class="project-link"
              >
                <mat-icon>code</mat-icon>
                Source
              </a>
              }
            </div>
          </div>
        </article>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .projects {
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

      .projects-grid {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 2rem;
      }

      .project-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 16px;
        overflow: hidden;
        transition: all var(--transition-base);
        position: relative;

        &:hover {
          transform: translateY(-8px);
          border-color: var(--border-medium);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(131, 56, 236, 0.15);

          .project-image img {
            transform: scale(1.05);
          }

          .image-overlay {
            opacity: 0.3;
          }
        }
      }

      .project-card.featured {
        border-color: rgba(131, 56, 236, 0.4);
        grid-column: span 1;

        &:hover {
          border-color: var(--color-blue-violet);
        }
      }

      .featured-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.375rem 0.75rem;
        background: rgba(255, 190, 11, 0.15);
        border: 1px solid rgba(255, 190, 11, 0.3);
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-mango);
        z-index: 2;

        mat-icon {
          font-size: 0.875rem;
          width: 14px;
          height: 14px;
        }
      }

      .project-image {
        position: relative;
        height: 200px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
      }

      .image-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          transparent 0%,
          var(--bg-card) 100%
        );
        opacity: 0.6;
        transition: opacity var(--transition-base);
      }

      .project-content {
        padding: 1.5rem;
      }

      .project-title {
        font-size: 1.375rem;
        font-weight: 700;
        margin: 0 0 0.75rem;
        color: var(--text-primary);
      }

      .project-description {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 1rem;
      }

      .project-features {
        margin: 0 0 1rem;
        padding-left: 1.25rem;
      }

      .project-features li {
        margin-bottom: 0.375rem;
        color: var(--text-muted);
        font-size: 0.875rem;
        line-height: 1.5;

        &::marker {
          color: var(--color-orange);
        }
      }

      .project-links {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-subtle);
      }

      .project-link {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-secondary);
        text-decoration: none;
        transition: color var(--transition-fast);

        mat-icon {
          font-size: 1rem;
          width: 16px;
          height: 16px;
        }

        &:hover {
          color: var(--color-blue-violet);
        }
      }

      @media (max-width: 768px) {
        .projects-grid {
          grid-template-columns: 1fr;
        }

        .project-card.featured {
          grid-column: span 1;
        }
      }
    `,
  ],
})
export class ProjectsViewComponent {
  @Input() projects: Project[] = [];
  @Output() projectClick = new EventEmitter<Project>();

  getTechArray(techStack: string): string[] {
    return techStack.split(',').map((t) => t.trim());
  }

  getChipClass(index: number): string {
    const classes = [
      'chip-code',
      'chip-code-pink',
      'chip-code-orange',
      'chip-code-mango',
    ];
    return classes[index % classes.length];
  }
}
