import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Experience } from '../models';

interface ReorderRequestDto {
  orderedIds: string[];
}

interface PublishDto {
  published: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminExperienceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAll(): Observable<Experience[]> {
    return this.http
      .get<ApiResponse<Experience[]>>(`${this.baseUrl}/api/admin/experiences`)
      .pipe(map((res) => res.data));
  }

  create(payload: Partial<Experience>): Observable<Experience> {
    return this.http
      .post<ApiResponse<Experience>>(`${this.baseUrl}/api/admin/experiences`, payload)
      .pipe(map((res) => res.data));
  }

  update(id: string, payload: Partial<Experience>): Observable<Experience> {
    return this.http
      .put<ApiResponse<Experience>>(`${this.baseUrl}/api/admin/experiences/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/api/admin/experiences/${id}`)
      .pipe(map(() => void 0));
  }

  setPublished(id: string, published: boolean): Observable<Experience> {
    const body: PublishDto = { published };
    return this.http
      .patch<ApiResponse<Experience>>(`${this.baseUrl}/api/admin/experiences/${id}/publish`, body)
      .pipe(map((res) => res.data));
  }

  reorder(ids: string[]): Observable<Experience[]> {
    const body: ReorderRequestDto = { orderedIds: ids };
    return this.http
      .put<ApiResponse<Experience[]>>(`${this.baseUrl}/api/admin/experience/reorder`, body)
      .pipe(map((res) => res.data));
  }

  addBullet(experienceId: string, content: string): Observable<Experience> {
    return this.http
      .post<ApiResponse<Experience>>(
        `${this.baseUrl}/api/admin/experiences/${experienceId}/bullets`,
        { content }
      )
      .pipe(map((res) => res.data));
  }

  updateBullet(experienceId: string, bulletId: string, content: string, sortOrder: number): Observable<Experience> {
    return this.http
      .put<ApiResponse<Experience>>(
        `${this.baseUrl}/api/admin/experiences/${experienceId}/bullets/${bulletId}`,
        { content, sortOrder }
      )
      .pipe(map((res) => res.data));
  }

  deleteBullet(experienceId: string, bulletId: string): Observable<Experience> {
    return this.http
      .delete<ApiResponse<Experience>>(
        `${this.baseUrl}/api/admin/experiences/${experienceId}/bullets/${bulletId}`
      )
      .pipe(map((res) => res.data));
  }
}
