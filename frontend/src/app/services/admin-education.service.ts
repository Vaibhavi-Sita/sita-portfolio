import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Education } from '../models';

interface ReorderRequestDto {
  orderedIds: string[];
}

interface PublishDto {
  isPublished: boolean;
}

interface CreateEducationDto {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startYear: number;
  endYear?: number;
  gpa?: string;
  description?: string;
  logoUrl?: string;
  published?: boolean;
}

interface UpdateEducationDto {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  location?: string;
  startYear?: number;
  endYear?: number;
  gpa?: string;
  description?: string;
  logoUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminEducationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl || environment.apiUrl;

  getAll(): Observable<Education[]> {
    return this.http
      .get<ApiResponse<Education[]>>(`${this.baseUrl}/api/admin/education`)
      .pipe(map((res) => res.data));
  }

  get(id: string): Observable<Education> {
    return this.http
      .get<ApiResponse<Education>>(`${this.baseUrl}/api/admin/education/${id}`)
      .pipe(map((res) => res.data));
  }

  create(payload: CreateEducationDto): Observable<Education> {
    return this.http
      .post<ApiResponse<Education>>(`${this.baseUrl}/api/admin/education`, payload)
      .pipe(map((res) => res.data));
  }

  update(id: string, payload: UpdateEducationDto): Observable<Education> {
    return this.http
      .put<ApiResponse<Education>>(`${this.baseUrl}/api/admin/education/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/api/admin/education/${id}`)
      .pipe(map(() => void 0));
  }

  setPublished(id: string, published: boolean): Observable<Education> {
    const body: PublishDto = { isPublished: published };
    return this.http
      .patch<ApiResponse<Education>>(`${this.baseUrl}/api/admin/education/${id}/publish`, body)
      .pipe(map((res) => res.data));
  }

  reorder(ids: string[]): Observable<Education[]> {
    const body: ReorderRequestDto = { orderedIds: ids };
    return this.http
      .put<ApiResponse<Education[]>>(`${this.baseUrl}/api/admin/education/reorder`, body)
      .pipe(map((res) => res.data));
  }
}
