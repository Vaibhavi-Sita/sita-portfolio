import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, SkillCategory, SkillItem } from '../models';

interface ReorderRequestDto {
  orderedIds: string[];
}

interface ReorderSkillItemsDto {
  categoryId: string;
  orderedIds: string[];
}

interface PublishDto {
  isPublished: boolean;
}

interface CreateSkillCategoryDto {
  name: string;
  icon?: string;
  published?: boolean;
}

interface UpdateSkillCategoryDto {
  name?: string;
  icon?: string;
}

interface CreateSkillItemDto {
  categoryId: string;
  name: string;
  iconUrl?: string;
  proficiency?: string;
}

interface UpdateSkillItemDto {
  name?: string;
  iconUrl?: string;
  proficiency?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminSkillService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl || environment.apiUrl;

  getAll(): Observable<SkillCategory[]> {
    return this.http
      .get<ApiResponse<SkillCategory[]>>(`${this.baseUrl}/api/admin/skills`)
      .pipe(map((res) => res.data));
  }

  getCategory(id: string): Observable<SkillCategory> {
    return this.http
      .get<ApiResponse<SkillCategory>>(`${this.baseUrl}/api/admin/skills/${id}`)
      .pipe(map((res) => res.data));
  }

  createCategory(payload: CreateSkillCategoryDto): Observable<SkillCategory> {
    return this.http
      .post<ApiResponse<SkillCategory>>(`${this.baseUrl}/api/admin/skills`, payload)
      .pipe(map((res) => res.data));
  }

  updateCategory(id: string, payload: UpdateSkillCategoryDto): Observable<SkillCategory> {
    return this.http
      .put<ApiResponse<SkillCategory>>(`${this.baseUrl}/api/admin/skills/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  deleteCategory(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/api/admin/skills/${id}`)
      .pipe(map(() => void 0));
  }

  setCategoryPublished(id: string, published: boolean): Observable<SkillCategory> {
    const body: PublishDto = { isPublished: published };
    return this.http
      .patch<ApiResponse<SkillCategory>>(`${this.baseUrl}/api/admin/skills/${id}/publish`, body)
      .pipe(map((res) => res.data));
  }

  reorderCategories(ids: string[]): Observable<SkillCategory[]> {
    const body: ReorderRequestDto = { orderedIds: ids };
    return this.http
      .put<ApiResponse<SkillCategory[]>>(`${this.baseUrl}/api/admin/skills/reorder`, body)
      .pipe(map((res) => res.data));
  }

  reorderSkillItems(categoryId: string, ids: string[]): Observable<SkillCategory> {
    const body: ReorderSkillItemsDto = { categoryId, orderedIds: ids };
    return this.http
      .put<ApiResponse<SkillCategory>>(`${this.baseUrl}/api/admin/skills/items/reorder`, body)
      .pipe(map((res) => res.data));
  }

  addSkillItem(payload: CreateSkillItemDto): Observable<SkillCategory> {
    return this.http
      .post<ApiResponse<SkillCategory>>(`${this.baseUrl}/api/admin/skills/items`, payload)
      .pipe(map((res) => res.data));
  }

  updateSkillItem(itemId: string, payload: UpdateSkillItemDto): Observable<SkillCategory> {
    return this.http
      .put<ApiResponse<SkillCategory>>(`${this.baseUrl}/api/admin/skills/items/${itemId}`, payload)
      .pipe(map((res) => res.data));
  }

  deleteSkillItem(itemId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/api/admin/skills/items/${itemId}`)
      .pipe(map(() => void 0));
  }
}
