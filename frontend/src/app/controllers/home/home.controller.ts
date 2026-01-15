import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PortfolioService, StateService } from '../../services';
import { ContactFormData } from '../../models';
import {
  HeroViewComponent,
  AboutViewComponent,
  ExperienceViewComponent,
  ProjectsViewComponent,
  SkillsViewComponent,
  EducationViewComponent,
  ContactViewComponent
} from '../../views';
import { LoadingSpinnerComponent } from '../../shared';

/**
 * Home controller - coordinates all portfolio sections
 */
@Component({
  selector: 'app-home-controller',
  standalone: true,
  imports: [
    CommonModule,
    HeroViewComponent,
    AboutViewComponent,
    ExperienceViewComponent,
    ProjectsViewComponent,
    SkillsViewComponent,
    EducationViewComponent,
    ContactViewComponent,
    LoadingSpinnerComponent
  ],
  template: `
    @if (state.isLoading()) {
      <app-loading-spinner [overlay]="true" message="Loading portfolio..."></app-loading-spinner>
    }

    @if (state.error()) {
      <div class="error-message">
        <p>{{ state.error() }}</p>
        <button (click)="loadPortfolio()">Try Again</button>
      </div>
    }

    <app-hero-view
      [profile]="state.profile()"
      (viewWork)="scrollToSection('projects')"
      (contactClick)="scrollToSection('contact')">
    </app-hero-view>

    <app-about-view [profile]="state.profile()"></app-about-view>

    <app-experience-view [experiences]="state.experiences()"></app-experience-view>

    <app-projects-view 
      [projects]="state.projects()"
      (projectClick)="handleProjectClick($event)">
    </app-projects-view>

    <app-skills-view [categories]="state.skills()"></app-skills-view>

    <app-education-view 
      [education]="state.education()"
      [certifications]="state.certifications()">
    </app-education-view>

    <app-contact-view
      [settings]="state.contactSettings()"
      [isSubmitting]="isSubmittingContact"
      (formSubmit)="handleContactSubmit($event)">
    </app-contact-view>
  `,
  styles: [`
    .error-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      text-align: center;
      padding: 2rem;
    }

    .error-message p {
      color: var(--error-color);
      margin-bottom: 1rem;
    }

    .error-message button {
      padding: 0.75rem 1.5rem;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
    }
  `]
})
export class HomeController implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly router = inject(Router);
  readonly state = inject(StateService);

  isSubmittingContact = false;

  ngOnInit(): void {
    this.loadPortfolio();
  }

  loadPortfolio(): void {
    this.state.setLoading(true);

    forkJoin({
      profile: this.portfolioService.getProfile(),
      experiences: this.portfolioService.getExperiences(),
      projects: this.portfolioService.getProjects(),
      skills: this.portfolioService.getSkills(),
      education: this.portfolioService.getEducation(),
      certifications: this.portfolioService.getCertifications(),
      contactSettings: this.portfolioService.getContactSettings()
    }).subscribe({
      next: (data) => {
        this.state.profile.set(data.profile);
        this.state.experiences.set(data.experiences);
        this.state.projects.set(data.projects);
        this.state.skills.set(data.skills);
        this.state.education.set(data.education);
        this.state.certifications.set(data.certifications);
        this.state.contactSettings.set(data.contactSettings);
        this.state.setLoading(false);
      },
      error: (err) => {
        console.error('Failed to load portfolio:', err);
        this.state.setError('Failed to load portfolio. Please try again.');
      }
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleProjectClick(project: { slug?: string }): void {
    if (project.slug) {
      this.router.navigate(['/project', project.slug]);
    }
  }

  handleContactSubmit(data: ContactFormData): void {
    this.isSubmittingContact = true;
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', data);
    setTimeout(() => {
      this.isSubmittingContact = false;
      alert('Message sent! (Demo mode)');
    }, 1000);
  }
}
