import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Project } from '../models';

interface ReorderRequestDto {
  orderedIds: string[];
}

interface PublishDto {
  published: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminProjectService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAll(): Observable<Project[]> {
    return this.http
      .get<ApiResponse<Project[]>>(`${this.baseUrl}/api/admin/projects`)
      .pipe(map((res) => res.data));
  }

  create(payload: Partial<Project>): Observable<Project> {
    return this.http
      .post<ApiResponse<Project>>(`${this.baseUrl}/api/admin/projects`, payload)
      .pipe(map((res) => res.data));
  }

  update(id: string, payload: Partial<Project>): Observable<Project> {
    return this.http
      .put<ApiResponse<Project>>(`${this.baseUrl}/api/admin/projects/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/api/admin/projects/${id}`)
      .pipe(map(() => void 0));
  }

  setPublished(id: string, published: boolean): Observable<Project> {
    const body: PublishDto = { published };
    return this.http
      .patch<ApiResponse<Project>>(`${this.baseUrl}/api/admin/projects/${id}/publish`, body)
      .pipe(map((res) => res.data));
  }

  reorder(ids: string[]): Observable<Project[]> {
    const body: ReorderRequestDto = { orderedIds: ids };
    return this.http
      .put<ApiResponse<Project[]>>(`${this.baseUrl}/api/admin/projects/reorder`, body)
      .pipe(map((res) => res.data));
  }

  addBullet(projectId: string, content: string): Observable<Project> {
    return this.http
      .post<ApiResponse<Project>>(`${this.baseUrl}/api/admin/projects/${projectId}/bullets`, { content })
      .pipe(map((res) => res.data));
  }

  updateBullet(projectId: string, bulletId: string, content: string, sortOrder: number): Observable<Project> {
    return this.http
      .put<ApiResponse<Project>>(
        `${this.baseUrl}/api/admin/projects/${projectId}/bullets/${bulletId}`,
        { content, sortOrder }
      )
      .pipe(map((res) => res.data));
  }

  deleteBullet(projectId: string, bulletId: string): Observable<Project> {
    return this.http
      .delete<ApiResponse<Project>>(
        `${this.baseUrl}/api/admin/projects/${projectId}/bullets/${bulletId}`
      )
      .pipe(map((res) => res.data));
  }
}
