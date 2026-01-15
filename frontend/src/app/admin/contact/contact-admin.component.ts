import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="admin-section">
      <header class="section-header">
        <h2>Contact</h2>
        <p class="section-subtitle">Configure contact settings and methods.</p>
      </header>
      <div class="placeholder-card">
        Contact management UI coming soon.
      </div>
    </section>
  `,
  styles: [
    `
      .admin-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .section-header h2 {
        margin: 0;
      }

      .section-subtitle {
        margin: 0;
        color: var(--text-muted);
      }

      .placeholder-card {
        padding: 1.5rem;
        border-radius: 12px;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
      }
    `,
  ],
})
export class ContactAdminComponent {}
