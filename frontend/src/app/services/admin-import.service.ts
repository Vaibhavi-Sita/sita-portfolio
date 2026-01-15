import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models';

export interface ImportResult {
  success: boolean;
  message: string;
  counts: {
    experiences: number;
    projects: number;
    skillCategories: number;
    education: number;
    certifications: number;
  };
}

export interface ResumeImportData {
  profile?: {
    name: string;
    title: string;
    tagline?: string;
    bio?: string;
    avatarUrl?: string;
    resumeUrl?: string;
    email?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
  };
  experiences?: Array<{
    company: string;
    role: string;
    location?: string;
    employmentType?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    techStack?: string;
    companyUrl?: string;
    logoUrl?: string;
    published?: boolean;
    bullets?: Array<{ content: string }>;
  }>;
  projects?: Array<{
    title: string;
    slug?: string;
    description?: string;
    longDescription?: string;
    techStack?: string;
    liveUrl?: string;
    githubUrl?: string;
    imageUrl?: string;
    thumbnailUrl?: string;
    featured?: boolean;
    published?: boolean;
    bullets?: Array<{ content: string }>;
  }>;
  skillCategories?: Array<{
    name: string;
    icon?: string;
    published?: boolean;
    skills?: Array<{
      name: string;
      iconUrl?: string;
      proficiency?: string;
    }>;
  }>;
  education?: Array<{
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
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    badgeUrl?: string;
    published?: boolean;
  }>;
  contactSettings?: {
    email: string;
    phone?: string;
    location?: string;
    availabilityStatus?: string;
    formEnabled?: boolean;
    formRecipient?: string;
    successMessage?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AdminImportService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl || environment.apiUrl;

  import(data: ResumeImportData): Observable<ImportResult> {
    return this.http
      .post<ApiResponse<ImportResult>>(`${this.baseUrl}/api/admin/import`, data)
      .pipe(map((res) => res.data));
  }
}
