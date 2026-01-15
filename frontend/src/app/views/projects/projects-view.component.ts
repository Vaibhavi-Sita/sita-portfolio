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
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, SectionHeaderComponent],
  template: `
    <section class="projects" id="projects">
      <app-section-header 
        title="Projects" 
        subtitle="Some things I've built">
      </app-section-header>

      <div class="projects-grid">
        @for (project of projects; track project.id) {
          <mat-card class="project-card" [class.featured]="project.featured">
            @if (project.imageUrl) {
              <img mat-card-image [src]="project.imageUrl" [alt]="project.title" />
            }
            <mat-card-header>
              <mat-card-title>{{ project.title }}</mat-card-title>
              @if (project.featured) {
                <mat-icon class="featured-badge" color="primary">star</mat-icon>
              }
            </mat-card-header>
            <mat-card-content>
              @if (project.description) {
                <p class="description">{{ project.description }}</p>
              }
              @if (project.bullets.length) {
                <ul class="features">
                  @for (bullet of project.bullets; track bullet.id) {
                    <li>{{ bullet.content }}</li>
                  }
                </ul>
              }
              @if (project.techStack) {
                <div class="tech-stack">
                  @for (tech of getTechArray(project.techStack); track tech) {
                    <mat-chip>{{ tech }}</mat-chip>
                  }
                </div>
              }
            </mat-card-content>
            <mat-card-actions>
              @if (project.liveUrl) {
                <a mat-button [href]="project.liveUrl" target="_blank" rel="noopener">
                  <mat-icon>launch</mat-icon>
                  Live Demo
                </a>
              }
              @if (project.githubUrl) {
                <a mat-button [href]="project.githubUrl" target="_blank" rel="noopener">
                  <mat-icon>code</mat-icon>
                  Source
                </a>
              }
            </mat-card-actions>
          </mat-card>
        }
      </div>
    </section>
  `,
  styles: [`
    .projects {
      padding: 5rem 2rem;
      background: var(--bg-secondary);
    }

    .projects-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .project-card {
      background: var(--bg-card);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .project-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }

    .project-card.featured {
      border: 2px solid var(--primary-color);
    }

    .featured-badge {
      margin-left: auto;
    }

    .description {
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .features {
      margin: 1rem 0;
      padding-left: 1.25rem;
    }

    .features li {
      margin-bottom: 0.25rem;
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    mat-card-actions {
      padding: 0.5rem 1rem 1rem;
    }

    @media (max-width: 768px) {
      .projects-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProjectsViewComponent {
  @Input() projects: Project[] = [];
  @Output() projectClick = new EventEmitter<Project>();

  getTechArray(techStack: string): string[] {
    return techStack.split(',').map(t => t.trim());
  }
}
