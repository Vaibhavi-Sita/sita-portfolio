import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SkillCategory } from '../../models';
import { SectionHeaderComponent, SkillBadgeComponent } from '../../shared';

/**
 * Skills section view - displays skill categories and items
 */
@Component({
  selector: 'app-skills-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, SectionHeaderComponent, SkillBadgeComponent],
  template: `
    <section class="skills" id="skills">
      <app-section-header 
        title="Skills" 
        subtitle="Technologies I work with">
      </app-section-header>

      <div class="skills-grid">
        @for (category of categories; track category.id) {
          <mat-card class="skill-category-card">
            <mat-card-header>
              @if (category.icon) {
                <mat-icon mat-card-avatar>{{ category.icon }}</mat-icon>
              }
              <mat-card-title>{{ category.name }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="skills-list">
                @for (skill of category.skills; track skill.id) {
                  <app-skill-badge
                    [name]="skill.name"
                    [iconUrl]="skill.iconUrl"
                    [proficiency]="skill.proficiency">
                  </app-skill-badge>
                }
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </section>
  `,
  styles: [`
    .skills {
      padding: 5rem 2rem;
    }

    .skills-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .skill-category-card {
      background: var(--bg-card);
    }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    mat-icon[mat-card-avatar] {
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      padding: 0.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class SkillsViewComponent {
  @Input() categories: SkillCategory[] = [];
}
