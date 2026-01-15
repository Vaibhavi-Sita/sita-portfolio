import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Education, Certification } from '../../models';
import { SectionHeaderComponent } from '../../shared';

/**
 * Education section view - displays education and certifications
 */
@Component({
  selector: 'app-education-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, SectionHeaderComponent],
  template: `
    <section class="education" id="education">
      <app-section-header 
        title="Education & Certifications" 
        subtitle="My academic background and credentials">
      </app-section-header>

      <div class="education-content">
        <div class="education-list">
          <h3>Education</h3>
          @for (edu of education; track edu.id) {
            <mat-card class="education-card">
              <mat-card-header>
                <mat-icon mat-card-avatar>school</mat-icon>
                <mat-card-title>{{ edu.degree }}</mat-card-title>
                <mat-card-subtitle>{{ edu.institution }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                @if (edu.fieldOfStudy) {
                  <p class="field">{{ edu.fieldOfStudy }}</p>
                }
                <p class="duration">
                  {{ edu.startYear }} - {{ edu.endYear || 'Present' }}
                </p>
                @if (edu.location) {
                  <p class="location">
                    <mat-icon>location_on</mat-icon>
                    {{ edu.location }}
                  </p>
                }
                @if (edu.gpa) {
                  <p class="gpa">GPA: {{ edu.gpa }}</p>
                }
                @if (edu.description) {
                  <p class="description">{{ edu.description }}</p>
                }
              </mat-card-content>
            </mat-card>
          }
        </div>

        @if (certifications.length) {
          <div class="certifications-list">
            <h3>Certifications & Publications</h3>
            @for (cert of certifications; track cert.id) {
              <mat-card class="certification-card">
                <mat-card-header>
                  <mat-icon mat-card-avatar>verified</mat-icon>
                  <mat-card-title>{{ cert.name }}</mat-card-title>
                  <mat-card-subtitle>{{ cert.issuer }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p class="date">Issued: {{ cert.issueDate | date:'MMM yyyy' }}</p>
                  @if (cert.credentialUrl) {
                    <a [href]="cert.credentialUrl" target="_blank" rel="noopener" class="credential-link">
                      <mat-icon>open_in_new</mat-icon>
                      View Credential
                    </a>
                  }
                </mat-card-content>
              </mat-card>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .education {
      padding: 5rem 2rem;
      background: var(--bg-secondary);
    }

    .education-content {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    h3 {
      margin-bottom: 1.5rem;
      color: var(--text-primary);
    }

    .education-card,
    .certification-card {
      background: var(--bg-card);
      margin-bottom: 1rem;
    }

    mat-icon[mat-card-avatar] {
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      padding: 0.5rem;
    }

    .field {
      color: var(--primary-color);
      font-weight: 500;
    }

    .duration, .date {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .location {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .location mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .gpa {
      color: var(--text-secondary);
      font-weight: 500;
    }

    .description {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-top: 0.5rem;
    }

    .credential-link {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--primary-color);
      text-decoration: none;
      font-size: 0.875rem;
    }

    .credential-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .education-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EducationViewComponent {
  @Input() education: Education[] = [];
  @Input() certifications: Certification[] = [];
}
