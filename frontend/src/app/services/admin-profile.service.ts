import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Profile } from '../models';

export interface UpdateProfilePayload {
  name?: string;
  title?: string;
  tagline?: string;
  bio?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  nickname?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl || environment.apiUrl;

  get(): Observable<Profile> {
    return this.http
      .get<ApiResponse<Profile>>(`${this.baseUrl}/api/admin/profile`)
      .pipe(map((res) => res.data));
  }

  update(payload: UpdateProfilePayload): Observable<Profile> {
    return this.http
      .put<ApiResponse<Profile>>(`${this.baseUrl}/api/admin/profile`, payload)
      .pipe(map((res) => res.data));
  }
}
