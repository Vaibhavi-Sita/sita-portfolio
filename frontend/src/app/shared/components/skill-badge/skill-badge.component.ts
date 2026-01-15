import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

/**
 * Reusable skill badge component
 */
@Component({
  selector: 'app-skill-badge',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  template: `
    <mat-chip class="skill-badge" [class]="proficiencyClass">
      @if (iconUrl) {
        <img [src]="iconUrl" [alt]="name" class="skill-icon" />
      }
      <span class="skill-name">{{ name }}</span>
      @if (proficiency) {
        <span class="skill-proficiency">({{ proficiency }})</span>
      }
    </mat-chip>
  `,
  styles: [`
    .skill-badge {
      margin: 0.25rem;
      font-size: 0.875rem;
    }

    .skill-icon {
      width: 16px;
      height: 16px;
      margin-right: 0.25rem;
    }

    .skill-name {
      font-weight: 500;
    }

    .skill-proficiency {
      margin-left: 0.25rem;
      font-size: 0.75rem;
      opacity: 0.8;
    }

    .expert {
      --mdc-chip-elevated-container-color: var(--expert-bg);
    }

    .advanced {
      --mdc-chip-elevated-container-color: var(--advanced-bg);
    }

    .intermediate {
      --mdc-chip-elevated-container-color: var(--intermediate-bg);
    }
  `]
})
export class SkillBadgeComponent {
  @Input({ required: true }) name!: string;
  @Input() iconUrl?: string;
  @Input() proficiency?: string;

  get proficiencyClass(): string {
    return this.proficiency?.toLowerCase() || '';
  }
}
