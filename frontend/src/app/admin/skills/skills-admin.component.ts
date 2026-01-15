import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
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
import { SkillCategory, SkillItem } from '../../models';
import { AdminSkillService } from '../../services/admin-skill.service';

type EditMode = 'none' | 'category' | 'item';

@Component({
  selector: 'app-skills-admin',
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
          <h2>Skills</h2>
          <p class="section-subtitle">Organize categories and skill badges.</p>
        </header>

        <div
          cdkDropList
          class="category-list"
          [cdkDropListData]="categories"
          (cdkDropListDropped)="onCategoryReorder($event)"
        >
          @for (cat of categories; track cat.id) {
          <div class="category-card">
            <div class="category-header" cdkDrag>
              <div class="drag-handle" cdkDragHandle>
                <mat-icon>drag_indicator</mat-icon>
              </div>
              <div class="category-info" (click)="editCategory(cat)">
                <div class="category-title">
                  @if (cat.icon) {
                  <mat-icon>{{ cat.icon }}</mat-icon>
                  }
                  {{ cat.name }}
                </div>
                <div class="category-count">
                  {{ (cat.skills && cat.skills.length) || 0 }} skills
                </div>
              </div>
              <mat-slide-toggle
                [checked]="cat.published"
                (change)="toggleCategoryPublish(cat, $event.checked)"
              >
                {{ cat.published ? 'Published' : 'Draft' }}
              </mat-slide-toggle>
              <button
                class="icon-btn"
                (click)="editCategory(cat)"
                aria-label="Edit category"
              >
                <mat-icon>edit</mat-icon>
              </button>
              <button
                class="icon-btn danger"
                (click)="removeCategory(cat)"
                aria-label="Delete category"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>

            <div
              cdkDropList
              class="skill-list"
              [cdkDropListData]="cat.skills"
              (cdkDropListDropped)="onSkillReorder($event, cat)"
            >
              @for (skill of cat.skills; track skill.id) {
              <div class="skill-row" cdkDrag>
                <div class="drag-handle" cdkDragHandle>
                  <mat-icon>drag_indicator</mat-icon>
                </div>
                <div class="skill-info" (click)="editSkill(cat, skill)">
                  <span class="skill-name">{{ skill.name }}</span>
                  @if (skill.proficiency) {
                  <span class="skill-proficiency">{{ skill.proficiency }}</span>
                  }
                </div>
                <button
                  class="icon-btn small"
                  (click)="editSkill(cat, skill)"
                  aria-label="Edit skill"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  class="icon-btn small danger"
                  (click)="removeSkill(skill)"
                  aria-label="Delete skill"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
              }
            </div>

            <button class="btn-secondary btn-sm" (click)="newSkill(cat)">
              <mat-icon>add</mat-icon>
              Add skill
            </button>
          </div>
          }
        </div>

        <button class="btn-primary" (click)="newCategory()">
          <mat-icon>add</mat-icon>
          New category
        </button>
      </div>

      <div class="form-card" *ngIf="editMode !== 'none'">
        <div class="form-header">
          <h3>{{ getFormTitle() }}</h3>
          @if (saving) {
          <span class="saving">Saving...</span>
          }
        </div>

        @if (editMode === 'category' && categoryForm) {
        <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Category name</mat-label>
            <input matInput formControlName="name" required />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Icon (Material Icon name)</mat-label>
            <input
              matInput
              formControlName="icon"
              placeholder="e.g. code, storage, cloud"
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
              [disabled]="categoryForm.invalid || saving"
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
        } @if (editMode === 'item' && skillForm) {
        <form [formGroup]="skillForm" (ngSubmit)="saveSkill()">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Skill name</mat-label>
            <input matInput formControlName="name" required />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Icon URL</mat-label>
            <input
              matInput
              formControlName="iconUrl"
              placeholder="https://example.com/icon.svg"
            />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Proficiency</mat-label>
            <input
              matInput
              formControlName="proficiency"
              placeholder="e.g. Expert, Advanced, Intermediate"
            />
          </mat-form-field>
          <div class="actions">
            <button
              type="submit"
              class="btn-primary"
              [disabled]="skillForm.invalid || saving"
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
        }
      </div>
    </section>
  `,
  styles: [
    `
      .two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
      }

      .list-card,
      .form-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 16px;
        padding: 1.25rem;
      }

      .category-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 1rem 0;
      }

      .category-card {
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        padding: 1rem;
        background: var(--bg-elevated);
      }

      .category-header {
        display: grid;
        grid-template-columns: auto 1fr auto auto auto;
        gap: 0.5rem;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .category-info {
        cursor: pointer;
      }

      .category-title {
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .category-count {
        color: var(--text-muted);
        font-size: 0.85rem;
      }

      .skill-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        min-height: 40px;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }

      .skill-row {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        gap: 0.5rem;
        align-items: center;
        padding: 0.5rem;
        border-radius: 8px;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
      }

      .skill-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
      }

      .skill-name {
        font-weight: 500;
      }

      .skill-proficiency {
        color: var(--text-muted);
        font-size: 0.85rem;
        padding: 0.15rem 0.5rem;
        background: rgba(131, 56, 236, 0.15);
        border-radius: 4px;
      }

      .drag-handle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        cursor: grab;
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

      .icon-btn.small {
        width: 32px;
        height: 32px;
      }

      .icon-btn:hover {
        border-color: var(--color-blue-violet);
        color: var(--color-blue-violet);
      }

      .icon-btn.danger:hover {
        border-color: var(--color-tart-orange);
        color: var(--color-tart-orange);
      }

      .btn-sm {
        padding: 0.5rem 0.75rem;
        font-size: 0.85rem;
      }

      .form-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
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

      .category-list.cdk-drop-list-dragging
        .category-card:not(.cdk-drag-placeholder),
      .skill-list.cdk-drop-list-dragging .skill-row:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class SkillsAdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminSkillService);

  categories: SkillCategory[] = [];
  editMode: EditMode = 'none';
  categoryForm: FormGroup | null = null;
  skillForm: FormGroup | null = null;
  editingCategoryId: string | null = null;
  editingSkillId: string | null = null;
  editingParentCategoryId: string | null = null;
  saving = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.getAll().subscribe((data) => {
      this.categories = data.sort((a, b) => a.sortOrder - b.sortOrder);
      this.categories.forEach((cat) => {
        if (cat.skills) {
          cat.skills.sort((a, b) => a.sortOrder - b.sortOrder);
        }
      });
    });
  }

  getFormTitle(): string {
    if (this.editMode === 'category') {
      return this.editingCategoryId ? 'Edit category' : 'Create category';
    }
    if (this.editMode === 'item') {
      return this.editingSkillId ? 'Edit skill' : 'Add skill';
    }
    return '';
  }

  newCategory(): void {
    this.editMode = 'category';
    this.editingCategoryId = null;
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      icon: [''],
      published: [true],
    });
  }

  editCategory(cat: SkillCategory): void {
    this.editMode = 'category';
    this.editingCategoryId = cat.id;
    this.categoryForm = this.fb.group({
      name: [cat.name, [Validators.required, Validators.minLength(2)]],
      icon: [cat.icon || ''],
      published: [cat.published],
    });
  }

  saveCategory(): void {
    if (!this.categoryForm || this.categoryForm.invalid) return;
    this.saving = true;
    const raw = this.categoryForm.value;

    if (this.editingCategoryId) {
      this.api
        .updateCategory(this.editingCategoryId, {
          name: raw.name,
          icon: raw.icon || undefined,
        })
        .subscribe({
          next: () => {
            this.saving = false;
            this.load();
            this.cancelEdit();
          },
          error: () => (this.saving = false),
        });
    } else {
      this.api
        .createCategory({
          name: raw.name,
          icon: raw.icon || undefined,
          published: raw.published,
        })
        .subscribe({
          next: () => {
            this.saving = false;
            this.load();
            this.cancelEdit();
          },
          error: () => (this.saving = false),
        });
    }
  }

  removeCategory(cat: SkillCategory): void {
    if (!confirm(`Delete category "${cat.name}" and all its skills?`)) return;
    this.api.deleteCategory(cat.id).subscribe(() => {
      this.categories = this.categories.filter((c) => c.id !== cat.id);
      if (this.editingCategoryId === cat.id) {
        this.cancelEdit();
      }
    });
  }

  toggleCategoryPublish(cat: SkillCategory, published: boolean): void {
    const prev = cat.published;
    this.api.setCategoryPublished(cat.id, published).subscribe({
      next: (updated) => (cat.published = updated.published),
      error: () => (cat.published = prev),
    });
  }

  onCategoryReorder(event: CdkDragDrop<SkillCategory[]>): void {
    const previous = [...this.categories];
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
    const orderedIds = this.categories.map((c) => c.id);
    this.api.reorderCategories(orderedIds).subscribe({
      next: (data) => {
        this.categories = data.sort((a, b) => a.sortOrder - b.sortOrder);
      },
      error: () => {
        this.categories = previous;
      },
    });
  }

  newSkill(cat: SkillCategory): void {
    this.editMode = 'item';
    this.editingSkillId = null;
    this.editingParentCategoryId = cat.id;
    this.skillForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      iconUrl: [''],
      proficiency: [''],
    });
  }

  editSkill(cat: SkillCategory, skill: SkillItem): void {
    this.editMode = 'item';
    this.editingSkillId = skill.id;
    this.editingParentCategoryId = cat.id;
    this.skillForm = this.fb.group({
      name: [skill.name, [Validators.required, Validators.minLength(1)]],
      iconUrl: [skill.iconUrl || ''],
      proficiency: [skill.proficiency || ''],
    });
  }

  saveSkill(): void {
    if (
      !this.skillForm ||
      this.skillForm.invalid ||
      !this.editingParentCategoryId
    )
      return;
    this.saving = true;
    const raw = this.skillForm.value;

    if (this.editingSkillId) {
      this.api
        .updateSkillItem(this.editingSkillId, {
          name: raw.name,
          iconUrl: raw.iconUrl || undefined,
          proficiency: raw.proficiency || undefined,
        })
        .subscribe({
          next: () => {
            this.saving = false;
            this.load();
            this.cancelEdit();
          },
          error: () => (this.saving = false),
        });
    } else {
      this.api
        .addSkillItem({
          categoryId: this.editingParentCategoryId,
          name: raw.name,
          iconUrl: raw.iconUrl || undefined,
          proficiency: raw.proficiency || undefined,
        })
        .subscribe({
          next: () => {
            this.saving = false;
            this.load();
            this.cancelEdit();
          },
          error: () => (this.saving = false),
        });
    }
  }

  removeSkill(skill: SkillItem): void {
    if (!confirm(`Delete skill "${skill.name}"?`)) return;
    this.api.deleteSkillItem(skill.id).subscribe(() => {
      this.load();
      if (this.editingSkillId === skill.id) {
        this.cancelEdit();
      }
    });
  }

  onSkillReorder(event: CdkDragDrop<SkillItem[]>, cat: SkillCategory): void {
    if (!cat.skills) return;
    const previous = [...cat.skills];
    moveItemInArray(cat.skills, event.previousIndex, event.currentIndex);
    const orderedIds = cat.skills.map((s) => s.id);
    this.api.reorderSkillItems(cat.id, orderedIds).subscribe({
      next: (updated) => {
        const idx = this.categories.findIndex((c) => c.id === cat.id);
        if (idx >= 0 && updated.skills) {
          this.categories[idx].skills = updated.skills.sort(
            (a, b) => a.sortOrder - b.sortOrder
          );
        }
      },
      error: () => {
        cat.skills = previous;
      },
    });
  }

  cancelEdit(): void {
    this.editMode = 'none';
    this.categoryForm = null;
    this.skillForm = null;
    this.editingCategoryId = null;
    this.editingSkillId = null;
    this.editingParentCategoryId = null;
  }
}
