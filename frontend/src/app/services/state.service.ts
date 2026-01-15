import { Injectable, signal, computed } from '@angular/core';
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
 * Global state service using Angular signals
 */
@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Loading states
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Portfolio data signals
  readonly profile = signal<Profile | null>(null);
  readonly experiences = signal<Experience[]>([]);
  readonly projects = signal<Project[]>([]);
  readonly skills = signal<SkillCategory[]>([]);
  readonly education = signal<Education[]>([]);
  readonly certifications = signal<Certification[]>([]);
  readonly contactSettings = signal<ContactSettings | null>(null);

  // Computed values
  readonly featuredProjects = computed(() => 
    this.projects().filter(p => p.featured)
  );

  readonly hasProfile = computed(() => this.profile() !== null);
  readonly hasExperiences = computed(() => this.experiences().length > 0);
  readonly hasProjects = computed(() => this.projects().length > 0);
  readonly hasSkills = computed(() => this.skills().length > 0);
  readonly hasEducation = computed(() => this.education().length > 0);
  readonly hasCertifications = computed(() => this.certifications().length > 0);

  // UI state
  readonly darkMode = signal<boolean>(this.getInitialDarkMode());
  readonly mobileMenuOpen = signal<boolean>(false);

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
    if (loading) {
      this.error.set(null);
    }
  }

  /**
   * Set error state
   */
  setError(message: string): void {
    this.error.set(message);
    this.isLoading.set(false);
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.error.set(null);
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode(): void {
    const newValue = !this.darkMode();
    this.darkMode.set(newValue);
    localStorage.setItem('darkMode', String(newValue));
    this.applyDarkMode(newValue);
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(open => !open);
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  /**
   * Get initial dark mode preference
   */
  private getInitialDarkMode(): boolean {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      return stored === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Apply dark mode to document
   */
  private applyDarkMode(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
