import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  Validators,
} from '@angular/forms';
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
import { Experience, ExperienceBullet } from '../../models';
import { AdminExperienceService } from '../../services/admin-experience.service';

@Component({
  selector: 'app-experience-admin',
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
          <h2>Experience</h2>
          <p class="section-subtitle">
            Manage roles, bullets, publish state, and order.
          </p>
        </header>

        <div
          cdkDropList
          class="item-list"
          (cdkDropListDropped)="onReorder($event)"
          [cdkDropListData]="experiences"
        >
          @for (exp of experiences; track exp.id; let i = $index) {
          <div class="item-row" cdkDrag>
            <div class="drag-handle" cdkDragHandle>
              <mat-icon>drag_indicator</mat-icon>
            </div>
            <div class="item-meta" (click)="edit(exp)">
              <div class="item-title">
                {{ exp.role }} &#64; {{ exp.company }}
              </div>
              <div class="item-sub">
                {{ exp.location || 'Remote/unspecified' }}
              </div>
            </div>
            <mat-slide-toggle
              [checked]="exp.published"
              (change)="togglePublish(exp, $event.checked)"
              aria-label="Publish toggle"
            >
              {{ exp.published ? 'Published' : 'Draft' }}
            </mat-slide-toggle>
            <button class="icon-btn" (click)="edit(exp)" aria-label="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <button
              class="icon-btn danger"
              (click)="remove(exp)"
              aria-label="Delete"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
          }
        </div>

        <button class="btn-primary" (click)="newExperience()">
          <mat-icon>add</mat-icon>
          New experience
        </button>
      </div>

      <div class="form-card" *ngIf="form">
        <div class="form-header">
          <h3>{{ editingId ? 'Edit experience' : 'Create experience' }}</h3>
          @if (saving) {
          <span class="saving">Saving...</span>
          }
        </div>
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Company</mat-label>
              <input matInput formControlName="company" required />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Role</mat-label>
              <input matInput formControlName="role" required />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Location</mat-label>
              <input matInput formControlName="location" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Employment type</mat-label>
              <input matInput formControlName="employmentType" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Start date</mat-label>
              <input matInput formControlName="startDate" type="date" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>End date</mat-label>
              <input matInput formControlName="endDate" type="date" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Company URL</mat-label>
              <input matInput formControlName="companyUrl" />
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
          <mat-form-field appearance="outline" class="full">
            <mat-label>Tech stack (comma separated)</mat-label>
            <input matInput formControlName="techStack" />
          </mat-form-field>

          <div class="toggle-row">
            <mat-slide-toggle formControlName="published"
              >Published</mat-slide-toggle
            >
          </div>

          <div class="bullets">
            <div class="bullets-header">
              <h4>Bullets</h4>
              <button type="button" class="btn-secondary" (click)="addBullet()">
                <mat-icon>add</mat-icon>
                Add bullet
              </button>
            </div>
            <div
              cdkDropList
              class="bullet-list"
              (cdkDropListDropped)="onBulletReorder($event)"
              [cdkDropListData]="bulletControls"
            >
              @for (bulletCtrl of bulletControls; track bulletCtrl.value.__key;
              let i = $index) {
              <div class="bullet-row" cdkDrag>
                <div class="drag-handle" cdkDragHandle>
                  <mat-icon>drag_indicator</mat-icon>
                </div>
                <mat-form-field appearance="outline" class="bullet-field">
                  <mat-label>Bullet</mat-label>
                  <input
                    matInput
                    [formControl]="$any(bulletCtrl.get('content'))"
                  />
                </mat-form-field>
                <button
                  type="button"
                  class="icon-btn danger"
                  (click)="removeBullet(i)"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
              }
            </div>
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

      .bullets {
        margin-top: 1rem;
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        padding: 1rem;
      }

      .bullets-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .bullet-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .bullet-row {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 0.5rem;
        align-items: center;
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        padding: 0.5rem;
        background: var(--bg-elevated);
      }

      .bullet-field {
        width: 100%;
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
    `,
  ],
})
export class ExperienceAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminExperienceService);

  experiences: Experience[] = [];
  form = this.buildForm();
  editingId: string | null = null;
  saving = false;

  ngOnInit(): void {
    this.load();
  }

  get bulletControls() {
    return (this.form.get('bullets') as FormArray).controls;
  }

  load(): void {
    this.api.getAll().subscribe((data) => (this.experiences = data));
  }

  buildForm() {
    return this.fb.group({
      company: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', [Validators.required, Validators.minLength(2)]],
      location: [''],
      employmentType: [''],
      startDate: [''],
      endDate: [''],
      description: [''],
      techStack: [''],
      companyUrl: [''],
      logoUrl: [''],
      published: [false],
      bullets: this.fb.array([]),
    });
  }

  setBullets(bullets: ExperienceBullet[]) {
    const fa = this.form.get('bullets') as FormArray;
    fa.clear();
    bullets
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .forEach((b) => {
        fa.push(
          this.fb.group({
            id: [b.id],
            content: [
              b.content,
              [Validators.required, Validators.minLength(1)],
            ],
            __key: [b.id || crypto.randomUUID()],
          })
        );
      });
    if (!bullets.length) {
      this.addBullet();
    }
  }

  newExperience(): void {
    this.editingId = null;
    this.form.reset({ published: false });
    this.setBullets([]);
  }

  edit(exp: Experience): void {
    this.editingId = exp.id;
    this.form.patchValue({
      company: exp.company,
      role: exp.role,
      location: exp.location,
      employmentType: exp.employmentType,
      startDate: exp.startDate?.slice(0, 10),
      endDate: exp.endDate?.slice(0, 10),
      description: exp.description,
      techStack: exp.techStack,
      companyUrl: exp.companyUrl,
      logoUrl: exp.logoUrl,
      published: exp.published,
    });
    this.setBullets(exp.bullets || []);
  }

  addBullet(): void {
    const fa = this.form.get('bullets') as FormArray;
    fa.push(
      this.fb.group({
        id: [null],
        content: ['', Validators.required],
        __key: [crypto.randomUUID()],
      })
    );
  }

  removeBullet(index: number): void {
    (this.form.get('bullets') as FormArray).removeAt(index);
  }

  onBulletReorder(event: CdkDragDrop<any[]>): void {
    moveItemInArray(
      this.bulletControls,
      event.previousIndex,
      event.currentIndex
    );
  }

  onReorder(event: CdkDragDrop<Experience[]>): void {
    const previous = [...this.experiences];
    moveItemInArray(this.experiences, event.previousIndex, event.currentIndex);
    const orderedIds = this.experiences.map((e) => e.id);
    this.api.reorder(orderedIds).subscribe({
      next: (data) => (this.experiences = data),
      error: () => {
        this.experiences = previous;
      },
    });
  }

  togglePublish(exp: Experience, published: boolean): void {
    const prev = exp.published;
    this.api.setPublished(exp.id, published).subscribe({
      next: (updated) => {
        exp.published = updated.published;
      },
      error: () => {
        exp.published = prev;
      },
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const { payload, bullets } = this.preparePayload();

    const action$ = this.editingId
      ? this.api.update(this.editingId, payload)
      : this.api.create(payload);

    action$.subscribe({
      next: (saved) => {
        this.syncBullets(saved.id, bullets, saved.bullets || []).then(() => {
          this.saving = false;
          this.load();
          this.editingId = saved.id;
        });
      },
      error: () => (this.saving = false),
    });
  }

  private preparePayload(): {
    payload: Partial<Experience>;
    bullets: { id: string | null; content: string }[];
  } {
    const clean = (v: any) => (v === null || v === '' ? undefined : v);
    const raw = this.form.value;
    const bullets: { id: string | null; content: string }[] = (
      raw.bullets || []
    ).map((b: any) => ({ id: b.id ?? null, content: b.content || '' }));

    const payload: Partial<Experience> = {
      company: clean(raw.company),
      role: clean(raw.role),
      location: clean(raw.location),
      employmentType: clean(raw.employmentType),
      startDate: clean(raw.startDate),
      endDate: clean(raw.endDate),
      description: clean(raw.description),
      techStack: clean(raw.techStack),
      companyUrl: clean(raw.companyUrl),
      logoUrl: clean(raw.logoUrl),
      published: !!raw.published,
    };

    return { payload, bullets };
  }

  private async syncBullets(
    experienceId: string,
    formBullets: { id: string | null; content: string }[],
    existingBullets: ExperienceBullet[]
  ): Promise<void> {
    const existingMap = new Map(existingBullets.map((b) => [b.id, b]));
    const toDelete = existingBullets
      .filter((b) => !formBullets.find((fb) => fb.id === b.id))
      .map((b) => b.id);

    for (const id of toDelete) {
      await this.api.deleteBullet(experienceId, id).toPromise();
    }

    for (let idx = 0; idx < formBullets.length; idx++) {
      const fb = formBullets[idx];
      if (fb.id && existingMap.has(fb.id)) {
        await this.api
          .updateBullet(experienceId, fb.id, fb.content, idx)
          .toPromise();
      } else if (!fb.id) {
        const res = await this.api
          .addBullet(experienceId, fb.content)
          .toPromise();
        if (!res?.bullets) continue;
        const created = res.bullets.find((b) => b.content === fb.content);
        if (created?.id) {
          await this.api
            .updateBullet(experienceId, created.id, created.content, idx)
            .toPromise();
        }
      }
    }
  }

  remove(exp: Experience): void {
    if (!confirm('Delete this experience?')) return;
    this.api.delete(exp.id).subscribe(() => {
      this.experiences = this.experiences.filter((e) => e.id !== exp.id);
      if (this.editingId === exp.id) {
        this.newExperience();
      }
    });
  }

  cancelEdit(): void {
    this.newExperience();
  }
}
