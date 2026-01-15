import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable section header component
 */
@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-header">
      <h2 class="section-title">{{ title }}</h2>
      @if (subtitle) {
        <p class="section-subtitle">{{ subtitle }}</p>
      }
    </div>
  `,
  styles: [`
    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .section-subtitle {
      font-size: 1.125rem;
      color: var(--text-secondary);
      margin: 0;
    }
  `]
})
export class SectionHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
}
