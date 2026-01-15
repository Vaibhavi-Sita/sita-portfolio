import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../models';
import { SectionHeaderComponent } from '../../shared';

/**
 * About section view - displays bio and personal info
 */
@Component({
  selector: 'app-about-view',
  standalone: true,
  imports: [CommonModule, SectionHeaderComponent],
  template: `
    @if (profile) {
    <section class="about" id="about">
      <app-section-header 
        title="About Me" 
        subtitle="A little bit about who I am">
      </app-section-header>
      
      <div class="about-content">
        @if (profile.avatarUrl) {
          <div class="about-image">
            <img [src]="profile.avatarUrl" [alt]="profile.name" />
          </div>
        }
        <div class="about-text">
          @if (profile.bio) {
            <p class="bio">{{ profile.bio }}</p>
          }
        </div>
      </div>
    </section>
    }
  `,
  styles: [`
    .about {
      padding: 5rem 2rem;
      background: var(--bg-secondary);
    }

    .about-content {
      max-width: 900px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 3rem;
      align-items: center;
    }

    .about-image img {
      width: 100%;
      max-width: 300px;
      border-radius: 1rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .bio {
      font-size: 1.125rem;
      line-height: 1.8;
      color: var(--text-primary);
    }

    @media (max-width: 768px) {
      .about-content {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .about-image {
        display: flex;
        justify-content: center;
      }
    }
  `]
})
export class AboutViewComponent {
  @Input() profile: Profile | null = null;
}
