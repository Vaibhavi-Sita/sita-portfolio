import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable section header component
 */
@Component({
  selector: 'app-contact-section-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-header reveal-on-scroll">
      <span class="section-number">{{ number }}</span>
      <h2 class="section-title underline-anim">{{ title }}</h2>
      <div class="section-line"></div>
      @if (subtitle) {
      <p class="section-subtitle">{{ subtitle }}</p>
      }
    </div>
  `,
  styles: [
    `
      .section-header {
        text-align: center;
        margin-bottom: 4rem;
      }

      .section-number {
        display: inline-block;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-blue-violet);
        margin-bottom: 0.5rem;
        opacity: 0;
      }

      .section-title {
        font-size: clamp(2rem, 5vw, 2.75rem);
        font-weight: 700;
        margin: 0;
        background: linear-gradient(
          135deg,
          var(--color-green) 0%,
          var(--color-neon-green) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 5px var(--color-neon-green);
      }

      .section-line {
        width: 60px;
        height: 3px;
        background: linear-gradient(
          90deg,
          var(--color-blue-violet),
          var(--color-neon-green)
        );
        margin: 1rem auto;
        border-radius: 2px;
      }

      .section-subtitle {
        font-size: 1.125rem;
        color: var(--text-secondary);
        margin: 0;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
      }
    `,
  ],
})
export class ContactSectionHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() number?: string;
}
