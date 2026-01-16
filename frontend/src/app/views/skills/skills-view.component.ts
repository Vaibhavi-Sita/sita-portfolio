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
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    SectionHeaderComponent,
    SkillBadgeComponent,
  ],
  template: `
    <section
      class="skills section parallax-section parallax-skills"
      id="skills"
      data-parallax
      data-parallax-speed="0.12"
      data-parallax-speed2="0.24"
    >
      <app-section-header
        title="Skills"
        subtitle="Tech I've worked with so far"
        number="04"
      >
      </app-section-header>

      @if (!categories.length) {
      <div class="empty-state reveal-on-scroll">
        <p class="empty-title">No skills listed yet.</p>
        <p class="empty-copy">
          Promise I know things — just need to name them.
        </p>
      </div>
      }

      <div class="skills-grid">
        @for (category of categories; track category.id; let i = $index) {
        <div
          class="skill-category reveal-on-scroll hover-elevate"
          [class]="getCategoryClass(i)"
        >
          <div class="category-header">
            @if (category.icon) {
            <div class="category-icon">
              <mat-icon>{{ category.icon }}</mat-icon>
            </div>
            }
            <h3 class="category-name">{{ category.name }}</h3>
          </div>
          <div class="skills-list">
            @for (skill of category.skills; track skill.id; let j = $index) {
            <span [class]="getSkillChipClass(i, j)">
              {{ skill.name }}
            </span>
            }
          </div>
        </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .skills {
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

      .skills-grid {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .skill-category {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 16px;
        padding: 1.75rem;
        transition: all var(--transition-base);

        &:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
      }

      .skill-category.category-violet {
        border-color: rgba(131, 56, 236, 0.3);

        &:hover {
          border-color: rgba(131, 56, 236, 0.6);
          box-shadow: 0 0 30px rgba(131, 56, 236, 0.2);
        }

        .category-icon {
          background: linear-gradient(
            135deg,
            rgba(131, 56, 236, 0.2),
            rgba(131, 56, 236, 0.1)
          );
          color: var(--color-blue-violet);
        }
      }

      .skill-category.category-pink {
        border-color: rgba(255, 0, 110, 0.3);

        &:hover {
          border-color: rgba(255, 0, 110, 0.6);
          box-shadow: 0 0 30px rgba(255, 0, 110, 0.2);
        }

        .category-icon {
          background: linear-gradient(
            135deg,
            rgba(255, 0, 110, 0.2),
            rgba(255, 0, 110, 0.1)
          );
          color: var(--color-winter-sky);
        }
      }

      .skill-category.category-orange {
        border-color: rgba(251, 86, 7, 0.3);

        &:hover {
          border-color: rgba(251, 86, 7, 0.6);
          box-shadow: 0 0 30px rgba(251, 86, 7, 0.2);
        }

        .category-icon {
          background: linear-gradient(
            135deg,
            rgba(251, 86, 7, 0.2),
            rgba(251, 86, 7, 0.1)
          );
          color: var(--color-orange);
        }
      }

      .skill-category.category-mango {
        border-color: rgba(255, 190, 11, 0.3);

        &:hover {
          border-color: rgba(255, 190, 11, 0.6);
          box-shadow: 0 0 30px rgba(255, 190, 11, 0.2);
        }

        .category-icon {
          background: linear-gradient(
            135deg,
            rgba(255, 190, 11, 0.2),
            rgba(255, 190, 11, 0.1)
          );
          color: var(--color-mango);
        }
      }

      .category-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.25rem;
      }

      .category-icon {
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: rgba(131, 56, 236, 0.15);
        color: var(--color-blue-violet);
      }

      .category-name {
        font-size: 1.125rem;
        font-weight: 700;
        margin: 0;
        color: var(--text-primary);
      }

      .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
    `,
  ],
})
export class SkillsViewComponent {
  @Input() categories: SkillCategory[] = [];

  getCategoryClass(index: number): string {
    const classes = [
      'category-violet',
      'category-pink',
      'category-orange',
      'category-mango',
    ];
    return classes[index % classes.length];
  }

  getSkillChipClass(categoryIndex: number, skillIndex: number): string {
    const baseClasses = [
      ['chip-code', 'chip-code-pink'],
      ['chip-code-pink', 'chip-code-orange'],
      ['chip-code-orange', 'chip-code-mango'],
      ['chip-code-mango', 'chip-code'],
    ];
    const categoryClasses = baseClasses[categoryIndex % baseClasses.length];
    return categoryClasses[skillIndex % categoryClasses.length];
  }
}
