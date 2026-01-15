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
import { Project, ProjectBullet } from '../../models';
import { AdminProjectService } from '../../services/admin-project.service';

@Component({
  selector: 'app-projects-admin',
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
          <h2>Projects</h2>
          <p class="section-subtitle">
            Manage projects, bullets, publish, and order.
          </p>
        </header>

        <div
          cdkDropList
          class="item-list"
          [cdkDropListData]="projects"
          (cdkDropListDropped)="onReorder($event)"
        >
          @for (proj of projects; track proj.id) {
          <div class="item-row" cdkDrag>
            <div class="drag-handle" cdkDragHandle>
              <mat-icon>drag_indicator</mat-icon>
            </div>
            <div class="item-meta" (click)="edit(proj)">
              <div class="item-title">{{ proj.title }}</div>
              <div class="item-sub">{{ proj.slug || 'no-slug' }}</div>
            </div>
            <mat-slide-toggle
              [checked]="proj.published"
              (change)="togglePublish(proj, $event.checked)"
            >
              {{ proj.published ? 'Published' : 'Draft' }}
            </mat-slide-toggle>
            <button class="icon-btn" (click)="edit(proj)">
              <mat-icon>edit</mat-icon>
            </button>
            <button class="icon-btn danger" (click)="remove(proj)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
          }
        </div>

        <button class="btn-primary" (click)="newProject()">
          <mat-icon>add</mat-icon>
          New project
        </button>
      </div>

      <div class="form-card" *ngIf="form">
        <div class="form-header">
          <h3>{{ editingId ? 'Edit project' : 'Create project' }}</h3>
          @if (saving) { <span class="saving">Saving...</span> }
        </div>

        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" required />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Slug</mat-label>
              <input matInput formControlName="slug" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Tech stack</mat-label>
              <input matInput formControlName="techStack" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Live URL</mat-label>
              <input matInput formControlName="liveUrl" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Repo URL</mat-label>
              <input matInput formControlName="githubUrl" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Image URL</mat-label>
              <input matInput formControlName="imageUrl" />
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
            <mat-label>Long description</mat-label>
            <textarea
              matInput
              rows="4"
              formControlName="longDescription"
            ></textarea>
          </mat-form-field>

          <div class="toggle-row">
            <mat-slide-toggle formControlName="featured"
              >Featured</mat-slide-toggle
            >
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
              [cdkDropListData]="bulletControls"
              (cdkDropListDropped)="onBulletReorder($event)"
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

      .toggle-row {
        display: flex;
        gap: 1rem;
        margin: 0.5rem 0;
      }

      @media (max-width: 1024px) {
        .two-col {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ProjectsAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminProjectService);

  projects: Project[] = [];
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
    this.api.getAll().subscribe((data) => (this.projects = data));
  }

  buildForm() {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      slug: [''],
      description: [''],
      longDescription: [''],
      techStack: [''],
      liveUrl: [''],
      githubUrl: [''],
      imageUrl: [''],
      featured: [false],
      published: [false],
      bullets: this.fb.array([]),
    });
  }

  setBullets(bullets: ProjectBullet[]) {
    const fa = this.form.get('bullets') as FormArray;
    fa.clear();
    bullets
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .forEach((b) => {
        fa.push(
          this.fb.group({
            id: [b.id],
            content: [b.content, Validators.required],
            __key: [b.id || crypto.randomUUID()],
          })
        );
      });
    if (!bullets.length) this.addBullet();
  }

  newProject(): void {
    this.editingId = null;
    this.form.reset({ featured: false, published: false });
    this.setBullets([]);
  }

  edit(proj: Project): void {
    this.editingId = proj.id;
    this.form.patchValue({
      title: proj.title,
      slug: proj.slug,
      description: proj.description,
      longDescription: proj.longDescription,
      techStack: proj.techStack,
      liveUrl: proj.liveUrl,
      githubUrl: proj.githubUrl,
      imageUrl: proj.imageUrl,
      featured: proj.featured,
      published: proj.published,
    });
    this.setBullets(proj.bullets || []);
  }

  addBullet(): void {
    (this.form.get('bullets') as FormArray).push(
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

  onReorder(event: CdkDragDrop<Project[]>): void {
    const previous = [...this.projects];
    moveItemInArray(this.projects, event.previousIndex, event.currentIndex);
    const orderedIds = this.projects.map((p) => p.id);
    this.api.reorder(orderedIds).subscribe({
      next: (data) => (this.projects = data),
      error: () => {
        this.projects = previous;
      },
    });
  }

  togglePublish(proj: Project, published: boolean): void {
    const prev = proj.published;
    this.api.setPublished(proj.id, published).subscribe({
      next: (updated) => (proj.published = updated.published),
      error: () => {
        proj.published = prev;
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
    payload: Partial<Project>;
    bullets: { id: string | null; content: string }[];
  } {
    const clean = (v: any) => (v === null || v === '' ? undefined : v);
    const raw = this.form.value;
    const bullets: { id: string | null; content: string }[] = (
      raw.bullets || []
    ).map((b: any) => ({ id: b.id ?? null, content: b.content || '' }));

    const payload: Partial<Project> = {
      title: clean(raw.title),
      slug: clean(raw.slug),
      description: clean(raw.description),
      longDescription: clean(raw.longDescription),
      techStack: clean(raw.techStack),
      liveUrl: clean(raw.liveUrl),
      githubUrl: clean(raw.githubUrl),
      imageUrl: clean(raw.imageUrl),
      featured: !!raw.featured,
      published: !!raw.published,
    };

    return { payload, bullets };
  }

  private async syncBullets(
    projectId: string,
    formBullets: any[],
    existingBullets: ProjectBullet[]
  ): Promise<void> {
    const existingMap = new Map(existingBullets.map((b) => [b.id, b]));
    const toDelete = existingBullets
      .filter((b) => !formBullets.find((fb) => fb.id === b.id))
      .map((b) => b.id);

    for (const id of toDelete) {
      await this.api.deleteBullet(projectId, id).toPromise();
    }

    for (let idx = 0; idx < formBullets.length; idx++) {
      const fb = formBullets[idx];
      if (fb.id && existingMap.has(fb.id)) {
        await this.api
          .updateBullet(projectId, fb.id, fb.content, idx)
          .toPromise();
      } else if (!fb.id) {
        const res = await this.api.addBullet(projectId, fb.content).toPromise();
        if (!res?.bullets) continue;
        const created = res.bullets.find((b) => b.content === fb.content);
        if (created?.id) {
          await this.api
            .updateBullet(projectId, created.id, created.content, idx)
            .toPromise();
        }
      }
    }
  }

  remove(proj: Project): void {
    if (!confirm('Delete this project?')) return;
    this.api.delete(proj.id).subscribe(() => {
      this.projects = this.projects.filter((p) => p.id !== proj.id);
      if (this.editingId === proj.id) {
        this.newProject();
      }
    });
  }

  cancelEdit(): void {
    this.newProject();
  }
}
