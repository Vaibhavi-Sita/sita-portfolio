import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Certification } from '../models';

interface ReorderRequestDto {
  orderedIds: string[];
}

interface PublishDto {
  isPublished: boolean;
}

interface CreateCertificationDto {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  badgeUrl?: string;
  published?: boolean;
}

interface UpdateCertificationDto {
  name?: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  badgeUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminCertificationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl || environment.apiUrl;

  getAll(): Observable<Certification[]> {
    return this.http
      .get<ApiResponse<Certification[]>>(`${this.baseUrl}/api/admin/certifications`)
      .pipe(map((res) => res.data));
  }

  get(id: string): Observable<Certification> {
    return this.http
      .get<ApiResponse<Certification>>(`${this.baseUrl}/api/admin/certifications/${id}`)
      .pipe(map((res) => res.data));
  }

  create(payload: CreateCertificationDto): Observable<Certification> {
    return this.http
      .post<ApiResponse<Certification>>(`${this.baseUrl}/api/admin/certifications`, payload)
      .pipe(map((res) => res.data));
  }

  update(id: string, payload: UpdateCertificationDto): Observable<Certification> {
    return this.http
      .put<ApiResponse<Certification>>(`${this.baseUrl}/api/admin/certifications/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/api/admin/certifications/${id}`)
      .pipe(map(() => void 0));
  }

  setPublished(id: string, published: boolean): Observable<Certification> {
    const body: PublishDto = { isPublished: published };
    return this.http
      .patch<ApiResponse<Certification>>(
        `${this.baseUrl}/api/admin/certifications/${id}/publish`,
        body
      )
      .pipe(map((res) => res.data));
  }

  reorder(ids: string[]): Observable<Certification[]> {
    const body: ReorderRequestDto = { orderedIds: ids };
    return this.http
      .put<ApiResponse<Certification[]>>(`${this.baseUrl}/api/admin/certifications/reorder`, body)
      .pipe(map((res) => res.data));
  }
}
