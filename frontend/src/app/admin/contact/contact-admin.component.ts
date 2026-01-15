import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminContactService } from '../../services/admin-contact.service';

@Component({
  selector: 'app-contact-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  template: `
    <section class="admin-section">
      <header class="section-header">
        <h2>Contact Settings</h2>
        <p class="section-subtitle">
          Configure contact information and form settings.
        </p>
      </header>

      <form class="form-card" [formGroup]="form" (ngSubmit)="save()">
        <h3 class="form-section-title">Contact Information</h3>
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" required />
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone" />
            <mat-icon matSuffix>phone</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Location</mat-label>
            <input
              matInput
              formControlName="location"
              placeholder="City, Country"
            />
            <mat-icon matSuffix>location_on</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Availability status</mat-label>
            <input
              matInput
              formControlName="availabilityStatus"
              placeholder="e.g. Available for hire"
            />
            <mat-icon matSuffix>schedule</mat-icon>
          </mat-form-field>
        </div>

        <h3 class="form-section-title">Contact Form Settings</h3>
        <div class="toggle-row">
          <mat-slide-toggle formControlName="formEnabled">
            Enable contact form
          </mat-slide-toggle>
        </div>

        <div class="form-grid" *ngIf="form.get('formEnabled')?.value">
          <mat-form-field appearance="outline">
            <mat-label>Form recipient email</mat-label>
            <input matInput formControlName="formRecipient" type="email" />
            <mat-hint>Leave blank to use primary email</mat-hint>
          </mat-form-field>
        </div>

        <mat-form-field
          appearance="outline"
          class="full"
          *ngIf="form.get('formEnabled')?.value"
        >
          <mat-label>Success message</mat-label>
          <textarea
            matInput
            rows="2"
            formControlName="successMessage"
            placeholder="Thanks for reaching out! I'll get back to you soon."
          ></textarea>
          <mat-hint>Shown after successful form submission</mat-hint>
        </mat-form-field>

        <div class="actions">
          <button
            class="btn-primary"
            type="submit"
            [disabled]="form.invalid || saving"
          >
            <mat-icon>save</mat-icon>
            {{ saving ? 'Saving...' : 'Save settings' }}
          </button>
          @if (saveSuccess) {
          <span class="success-msg">
            <mat-icon>check_circle</mat-icon>
            Settings saved!
          </span>
          }
        </div>
      </form>
    </section>
  `,
  styles: [
    `
      .admin-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 16px;
        padding: 1.5rem;
        max-width: 800px;
      }

      .form-section-title {
        margin: 0 0 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-subtle);
        color: var(--text-secondary);
        font-size: 0.95rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .form-section-title:first-of-type {
        padding-top: 0;
        border-top: none;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .full {
        width: 100%;
        margin-bottom: 1rem;
      }

      .toggle-row {
        margin: 1rem 0;
        padding: 1rem;
        background: rgba(131, 56, 236, 0.08);
        border-radius: 12px;
        border: 1px solid rgba(131, 56, 236, 0.2);
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-subtle);
      }

      .success-msg {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        color: var(--color-spring-green);
        font-size: 0.9rem;
      }

      .success-msg mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    `,
  ],
})
export class ContactAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminContactService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    location: [''],
    availabilityStatus: [''],
    formEnabled: [true],
    formRecipient: ['', Validators.email],
    successMessage: [''],
  });

  saving = false;
  saveSuccess = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.get().subscribe({
      next: (settings) => {
        if (settings) {
          this.form.patchValue({
            email: settings.email,
            phone: settings.phone || '',
            location: settings.location || '',
            availabilityStatus: settings.availabilityStatus || '',
            formEnabled: settings.formEnabled,
            formRecipient: settings.formRecipient || '',
            successMessage: settings.successMessage || '',
          });
        }
      },
      error: () => {
        // Settings might not exist yet, that's okay
      },
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.saveSuccess = false;

    const clean = (v: any) => (v === null || v === '' ? undefined : v);
    const raw = this.form.value;

    const payload = {
      email: raw.email!,
      phone: clean(raw.phone),
      location: clean(raw.location),
      availabilityStatus: clean(raw.availabilityStatus),
      formEnabled: !!raw.formEnabled,
      formRecipient: clean(raw.formRecipient),
      successMessage: clean(raw.successMessage),
    };

    this.api.update(payload).subscribe({
      next: () => {
        this.saving = false;
        this.saveSuccess = true;
        setTimeout(() => (this.saveSuccess = false), 3000);
      },
      error: () => {
        this.saving = false;
      },
    });
  }
}
