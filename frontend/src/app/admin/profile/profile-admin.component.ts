import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Profile } from '../../models';
import { PortfolioService } from '../../services';

@Component({
  selector: 'app-profile-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <section class="admin-section">
      <header class="section-header">
        <h2>Profile</h2>
        <p class="section-subtitle">Update your headline, bio, and social links.</p>
      </header>

      <form class="form-card" [formGroup]="form" (ngSubmit)="save()">
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" required />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Tagline</mat-label>
            <input matInput formControlName="tagline" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Location</mat-label>
            <input matInput formControlName="location" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Bio</mat-label>
          <textarea matInput rows="3" formControlName="bio"></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Avatar URL</mat-label>
          <input matInput formControlName="avatarUrl" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>GitHub URL</mat-label>
          <input matInput formControlName="githubUrl" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>LinkedIn URL</mat-label>
          <input matInput formControlName="linkedinUrl" />
        </mat-form-field>

        <div class="actions">
          <button class="btn-primary" type="submit" [disabled]="form.invalid || saving">
            <mat-icon>save</mat-icon>
            Save
          </button>
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
        padding: 1.25rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 0.75rem;
      }

      .full {
        width: 100%;
      }

      .actions {
        margin-top: 1rem;
      }
    `,
  ],
})
export class ProfileAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly portfolio = inject(PortfolioService);

  form = this.fb.group({
    name: ['', Validators.required],
    title: [''],
    tagline: [''],
    location: [''],
    email: ['', Validators.email],
    phone: [''],
    bio: [''],
    avatarUrl: [''],
    githubUrl: [''],
    linkedinUrl: [''],
  });

  saving = false;

  ngOnInit(): void {
    this.portfolio.getProfile().subscribe((profile) => {
      if (profile) {
        this.form.patchValue(profile as any);
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    // Placeholder: wire to admin profile endpoint when available
    setTimeout(() => {
      this.saving = false;
    }, 400);
  }
}
