import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, ContactSettings } from '../models';

interface UpdateContactSettingsDto {
  email?: string;
  phone?: string;
  location?: string;
  availabilityStatus?: string;
  formEnabled?: boolean;
  formRecipient?: string;
  successMessage?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminContactService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl || environment.apiUrl;

  get(): Observable<ContactSettings> {
    return this.http
      .get<ApiResponse<ContactSettings>>(`${this.baseUrl}/api/admin/contact`)
      .pipe(map((res) => res.data));
  }

  update(payload: UpdateContactSettingsDto): Observable<ContactSettings> {
    return this.http
      .put<ApiResponse<ContactSettings>>(`${this.baseUrl}/api/admin/contact`, payload)
      .pipe(map((res) => res.data));
  }
}
