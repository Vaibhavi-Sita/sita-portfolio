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
import { Certification } from '../../models';
import { AdminCertificationService } from '../../services/admin-certification.service';

@Component({
  selector: 'app-certifications-admin',
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
          <h2>Certifications</h2>
          <p class="section-subtitle">Track certifications and credentials.</p>
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
              <div class="item-title">{{ entry.name }}</div>
              <div class="item-sub">
                {{ entry.issuer }} · {{ formatDate(entry.issueDate) }}
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
          New certification
        </button>
      </div>

      <div class="form-card" *ngIf="form">
        <div class="form-header">
          <h3>
            {{ editingId ? 'Edit certification' : 'Create certification' }}
          </h3>
          @if (saving) {
          <span class="saving">Saving...</span>
          }
        </div>

        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" required />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Issuer</mat-label>
              <input matInput formControlName="issuer" required />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Issue date</mat-label>
              <input
                matInput
                formControlName="issueDate"
                type="date"
                required
              />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Expiry date</mat-label>
              <input matInput formControlName="expiryDate" type="date" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Credential ID</mat-label>
              <input matInput formControlName="credentialId" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Badge URL</mat-label>
              <input matInput formControlName="badgeUrl" />
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Credential URL</mat-label>
            <input
              matInput
              formControlName="credentialUrl"
              placeholder="https://..."
            />
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
export class CertificationsAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminCertificationService);

  entries: Certification[] = [];
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
      name: ['', [Validators.required, Validators.minLength(2)]],
      issuer: ['', [Validators.required, Validators.minLength(2)]],
      issueDate: ['', Validators.required],
      expiryDate: [''],
      credentialId: [''],
      credentialUrl: [''],
      badgeUrl: [''],
      published: [true],
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  newEntry(): void {
    this.editingId = null;
    this.form.reset({ published: true });
  }

  edit(entry: Certification): void {
    this.editingId = entry.id;
    this.form.patchValue({
      name: entry.name,
      issuer: entry.issuer,
      issueDate: entry.issueDate?.slice(0, 10),
      expiryDate: entry.expiryDate?.slice(0, 10) || '',
      credentialId: entry.credentialId,
      credentialUrl: entry.credentialUrl,
      badgeUrl: entry.badgeUrl,
      published: entry.published,
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const clean = (v: any) => (v === null || v === '' ? undefined : v);
    const raw = this.form.value;

    const payload = {
      name: raw.name!,
      issuer: raw.issuer!,
      issueDate: raw.issueDate!,
      expiryDate: clean(raw.expiryDate),
      credentialId: clean(raw.credentialId),
      credentialUrl: clean(raw.credentialUrl),
      badgeUrl: clean(raw.badgeUrl),
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

  remove(entry: Certification): void {
    if (!confirm('Delete this certification?')) return;
    this.api.delete(entry.id).subscribe(() => {
      this.entries = this.entries.filter((e) => e.id !== entry.id);
      if (this.editingId === entry.id) {
        this.newEntry();
      }
    });
  }

  togglePublish(entry: Certification, published: boolean): void {
    const prev = entry.published;
    this.api.setPublished(entry.id, published).subscribe({
      next: (updated) => (entry.published = updated.published),
      error: () => (entry.published = prev),
    });
  }

  onReorder(event: CdkDragDrop<Certification[]>): void {
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
