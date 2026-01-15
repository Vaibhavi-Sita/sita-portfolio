import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Profile,
  Experience,
  Project,
  SkillCategory,
  Education,
  Certification,
  ContactSettings
} from '../models';

/**
 * Portfolio service for fetching public portfolio data
 */
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly api = inject(ApiService);

  /**
   * Get profile information
   */
  getProfile(): Observable<Profile> {
    return this.api.get<Profile>('/api/public/profile');
  }

  /**
   * Get work experience list
   */
  getExperiences(): Observable<Experience[]> {
    return this.api.get<Experience[]>('/api/public/experience');
  }

  /**
   * Get projects list
   */
  getProjects(): Observable<Project[]> {
    return this.api.get<Project[]>('/api/public/projects');
  }

  /**
   * Get featured projects
   */
  getFeaturedProjects(): Observable<Project[]> {
    return this.api.get<Project[]>('/api/public/projects?featured=true');
  }

  /**
   * Get skill categories with items
   */
  getSkills(): Observable<SkillCategory[]> {
    return this.api.get<SkillCategory[]>('/api/public/skills');
  }

  /**
   * Get education list
   */
  getEducation(): Observable<Education[]> {
    return this.api.get<Education[]>('/api/public/education');
  }

  /**
   * Get certifications list
   */
  getCertifications(): Observable<Certification[]> {
    return this.api.get<Certification[]>('/api/public/certifications');
  }

  /**
   * Get contact settings
   */
  getContactSettings(): Observable<ContactSettings> {
    return this.api.get<ContactSettings>('/api/public/contact');
  }

  /**
   * Check API health
   */
  checkHealth(): Observable<{ status: string; timestamp: string }> {
    return this.api.get<{ status: string; timestamp: string }>('/api/public/health');
  }
}
