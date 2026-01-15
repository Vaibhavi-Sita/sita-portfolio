import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { Profile } from '../../models';
import {
  AdminProfileService,
  UpdateProfilePayload,
} from '../../services/admin-profile.service';

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
        <p class="section-subtitle">
          Update your headline, bio, and social links.
        </p>
      </header>

      <form class="form-card" [formGroup]="form" (ngSubmit)="save()">
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" required />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Nickname</mat-label>
            <input matInput formControlName="nickname" />
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
        <mat-form-field appearance="outline" class="full">
          <mat-label>Nickname</mat-label>
          <input matInput formControlName="nickname" />
        </mat-form-field>
        <div class="actions">
          <button
            class="btn-primary"
            type="submit"
            [disabled]="form.invalid || saving"
          >
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
  private readonly adminProfile = inject(AdminProfileService);

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
    nickname: [''],
  });

  saving = false;

  ngOnInit(): void {
    this.adminProfile.get().subscribe((profile: Profile) => {
      if (profile) {
        this.form.patchValue(profile as any);
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const {
      name,
      title,
      tagline,
      bio,
      avatarUrl,
      email,
      githubUrl,
      linkedinUrl,
      nickname,
    } = this.form.value;

    const payload: UpdateProfilePayload = {
      name: name || undefined,
      title: title || undefined,
      tagline: tagline || undefined,
      bio: bio || undefined,
      avatarUrl: avatarUrl || undefined,
      email: email || undefined,
      githubUrl: githubUrl || undefined,
      linkedinUrl: linkedinUrl || undefined,
      nickname: nickname || undefined,
    };

    this.adminProfile
      .update(payload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (updated) => this.form.patchValue(updated as any),
        error: (err) => console.error('Failed to update profile', err),
      });
  }
}
