import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Education } from '../../models';
import { AdminEducationService } from '../../services/admin-education.service';

@Component({
  selector: 'app-education-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  template: `
    <section class="admin-section two-col">
      <div class="list-card">
        <header class="section-header">
          <h2>Education</h2>
          <p class="section-subtitle">
            Keep degrees and coursework up to date.
          </p>
        </header>

        <div
          cdkDropList
          class="item-list"
          [cdkDropListData]="entries"
          (cdkDropListDropped)="onReorder($event)"
        >
          @for (entry of entries; track entry.id) {
          <div class="item-row" cdkDrag>
            <div class="drag-handle" cdkDragHandle>
              <mat-icon>drag_indicator</mat-icon>
            </div>
            <div class="item-meta" (click)="edit(entry)">
              <div class="item-title">{{ entry.degree }}</div>
              <div class="item-sub">
                {{ entry.institution }} · {{ entry.startYear }}–{{
                  entry.endYear || 'Present'
                }}
              </div>
            </div>
            <mat-slide-toggle
              [checked]="entry.published"
              (change)="togglePublish(entry, $event.checked)"
            >
              {{ entry.published ? 'Published' : 'Draft' }}
            </mat-slide-toggle>
            <button class="icon-btn" (click)="edit(entry)" aria-label="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <button
              class="icon-btn danger"
              (click)="remove(entry)"
              aria-label="Delete"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
          }
        </div>

        <button class="btn-primary" (click)="newEntry()">
          <mat-icon>add</mat-icon>
          New education
        </button>
      </div>

      <div class="form-card" *ngIf="form">
        <div class="form-header">
          <h3>{{ editingId ? 'Edit education' : 'Create education' }}</h3>
          @if (saving) {
          <span class="saving">Saving...</span>
          }
        </div>

        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Institution</mat-label>
              <input matInput formControlName="institution" required />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Degree</mat-label>
              <input matInput formControlName="degree" required />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Field of study</mat-label>
              <input matInput formControlName="fieldOfStudy" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Location</mat-label>
              <input matInput formControlName="location" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Start year</mat-label>
              <input
                matInput
                formControlName="startYear"
                type="number"
                required
              />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>End year</mat-label>
              <input
                matInput
                formControlName="endYear"
                type="number"
                placeholder="Leave blank if current"
              />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>GPA</mat-label>
              <input
                matInput
                formControlName="gpa"
                placeholder="e.g. 3.8/4.0"
              />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Logo URL</mat-label>
              <input matInput formControlName="logoUrl" />
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Description</mat-label>
            <textarea
              matInput
              rows="3"
              formControlName="description"
            ></textarea>
          </mat-form-field>

          <div class="toggle-row">
            <mat-slide-toggle formControlName="published"
              >Published</mat-slide-toggle
            >
          </div>

          <div class="actions">
            <button
              type="submit"
              class="btn-primary"
              [disabled]="form.invalid || saving"
            >
              <mat-icon>save</mat-icon>
              Save
            </button>
            <button
              type="button"
              class="btn-ghost"
              (click)="cancelEdit()"
              [disabled]="saving"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: [
    `
      .two-col {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 1.25rem;
      }

      .list-card,
      .form-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 16px;
        padding: 1.25rem;
      }

      .item-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin: 1rem 0;
      }

      .item-row {
        display: grid;
        grid-template-columns: auto 1fr auto auto auto;
        gap: 0.5rem;
        align-items: center;
        padding: 0.75rem;
        border-radius: 12px;
        border: 1px solid var(--border-subtle);
        background: var(--bg-elevated);
      }

      .drag-handle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        cursor: grab;
      }

      .item-meta {
        cursor: pointer;
      }

      .item-title {
        font-weight: 700;
      }

      .item-sub {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .icon-btn {
        border: 1px solid var(--border-subtle);
        background: transparent;
        color: var(--text-secondary);
        border-radius: 8px;
        width: 38px;
        height: 38px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .icon-btn:hover {
        border-color: var(--color-blue-violet);
        color: var(--color-blue-violet);
      }

      .icon-btn.danger:hover {
        border-color: var(--color-tart-orange);
        color: var(--color-tart-orange);
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.75rem;
      }

      .full {
        width: 100%;
      }

      .toggle-row {
        margin: 0.5rem 0;
      }

      .actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 1rem;
      }

      .form-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .saving {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      @media (max-width: 1024px) {
        .two-col {
          grid-template-columns: 1fr;
        }
      }

      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 12px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
      }

      .cdk-drag-placeholder {
        opacity: 0.3;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class EducationAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminEducationService);

  entries: Education[] = [];
  form = this.buildForm();
  editingId: string | null = null;
  saving = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.getAll().subscribe((data) => {
      this.entries = data.sort((a, b) => a.sortOrder - b.sortOrder);
    });
  }

  buildForm() {
    return this.fb.group({
      institution: ['', [Validators.required, Validators.minLength(2)]],
      degree: ['', [Validators.required, Validators.minLength(2)]],
      fieldOfStudy: [''],
      location: [''],
      startYear: [new Date().getFullYear(), Validators.required],
      endYear: [null as number | null],
      gpa: [''],
      description: [''],
      logoUrl: [''],
      published: [true],
    });
  }

  newEntry(): void {
    this.editingId = null;
    this.form.reset({ published: true, startYear: new Date().getFullYear() });
  }

  edit(entry: Education): void {
    this.editingId = entry.id;
    this.form.patchValue({
      institution: entry.institution,
      degree: entry.degree,
      fieldOfStudy: entry.fieldOfStudy,
      location: entry.location,
      startYear: entry.startYear,
      endYear: entry.endYear,
      gpa: entry.gpa,
      description: entry.description,
      logoUrl: entry.logoUrl,
      published: entry.published,
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const clean = (v: any) => (v === null || v === '' ? undefined : v);
    const raw = this.form.value;

    const payload = {
      institution: raw.institution!,
      degree: raw.degree!,
      fieldOfStudy: clean(raw.fieldOfStudy),
      location: clean(raw.location),
      startYear: raw.startYear!,
      endYear: clean(raw.endYear),
      gpa: clean(raw.gpa),
      description: clean(raw.description),
      logoUrl: clean(raw.logoUrl),
      published: !!raw.published,
    };

    const action$ = this.editingId
      ? this.api.update(this.editingId, payload)
      : this.api.create(payload);

    action$.subscribe({
      next: (saved) => {
        this.saving = false;
        this.load();
        this.editingId = saved.id;
      },
      error: () => (this.saving = false),
    });
  }

  remove(entry: Education): void {
    if (!confirm('Delete this education entry?')) return;
    this.api.delete(entry.id).subscribe(() => {
      this.entries = this.entries.filter((e) => e.id !== entry.id);
      if (this.editingId === entry.id) {
        this.newEntry();
      }
    });
  }

  togglePublish(entry: Education, published: boolean): void {
    const prev = entry.published;
    this.api.setPublished(entry.id, published).subscribe({
      next: (updated) => (entry.published = updated.published),
      error: () => (entry.published = prev),
    });
  }

  onReorder(event: CdkDragDrop<Education[]>): void {
    const previous = [...this.entries];
    moveItemInArray(this.entries, event.previousIndex, event.currentIndex);
    const orderedIds = this.entries.map((e) => e.id);
    this.api.reorder(orderedIds).subscribe({
      next: (data) => {
        this.entries = data.sort((a, b) => a.sortOrder - b.sortOrder);
      },
      error: () => {
        this.entries = previous;
      },
    });
  }

  cancelEdit(): void {
    this.newEntry();
  }
}
