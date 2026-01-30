import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import {
  PortfolioService,
  StateService,
  ContactService,
  NotificationService,
} from '../../services';
import { MotionService } from '../../services/motion.service';
import { ContactFormData } from '../../models';
import {
  HeroViewComponent,
  AboutViewComponent,
  ExperienceViewComponent,
  ProjectsViewComponent,
  SkillsViewComponent,
  EducationViewComponent,
  CertificationsViewComponent,
  ContactViewComponent,
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
    CertificationsViewComponent,
    ContactViewComponent,
    LoadingSpinnerComponent,
  ],
  template: `
    @if (state.isLoading()) {
    <app-loading-spinner
      [overlay]="true"
      message="Loading portfolio..."
    ></app-loading-spinner>
    } @if (state.error()) {
    <div class="error-container">
      <div class="error-content">
        <h2>Oops! Something went wrong</h2>
        <p>{{ state.error() }}</p>
        <button class="btn-primary" (click)="loadPortfolio()">Try Again</button>
      </div>
    </div>
    }

    <!-- Home / Hero Section -->
    <app-hero-view
      [profile]="state.profile()"
      [availabilityStatus]="state.contactSettings()?.availabilityStatus"
      (experienceClick)="scrollToSection('experience')"
      (contactClick)="scrollToSection('contact')"
    >
    </app-hero-view>

    <!-- About Section -->
    <app-about-view [profile]="state.profile()"></app-about-view>

    <!-- Experience Section -->
    <app-experience-view
      [experiences]="state.experiences()"
    ></app-experience-view>

    <!-- Education Section -->
    <app-education-view [education]="state.education()"></app-education-view>

    <!-- Projects Section -->
    <app-projects-view
      [projects]="state.projects()"
      (projectClick)="handleProjectClick($event)"
    >
    </app-projects-view>

    <!-- Skills Section -->
    <app-skills-view [categories]="state.skills()"></app-skills-view>

    <!-- Certifications Section -->
    <app-certifications-view
      [certifications]="state.certifications()"
    ></app-certifications-view>

    <!-- Contact Section -->
    <app-contact-view
      [settings]="state.contactSettings()"
      [isSubmitting]="isSubmittingContact"
      (formSubmit)="handleContactSubmit($event)"
    >
    </app-contact-view>
  `,
  styles: [
    `
      .error-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: var(--bg-primary);
      }

      .error-content {
        text-align: center;
        max-width: 400px;
      }

      .error-content h2 {
        font-size: 1.75rem;
        margin-bottom: 1rem;
        background: linear-gradient(
          135deg,
          var(--color-tart-orange),
          var(--color-orange)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .error-content p {
        color: var(--text-secondary);
        margin-bottom: 2rem;
      }
    `,
  ],
})
export class HomeController implements OnInit, AfterViewInit, OnDestroy {
  private readonly portfolioService = inject(PortfolioService);
  private readonly contactService = inject(ContactService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly motionService = inject(MotionService);
  readonly state = inject(StateService);

  isSubmittingContact = false;

  ngOnInit(): void {
    this.loadPortfolio();
  }

  ngAfterViewInit(): void {
    this.motionService.init();
  }

  ngOnDestroy(): void {
    this.motionService.destroy();
  }

  loadPortfolio(): void {
    this.state.setLoading(true);

    forkJoin({
      profile: this.portfolioService
        .getProfile()
        .pipe(catchError(() => of(null))),
      experiences: this.portfolioService
        .getExperiences()
        .pipe(catchError(() => of([]))),
      projects: this.portfolioService
        .getProjects()
        .pipe(catchError(() => of([]))),
      skills: this.portfolioService.getSkills().pipe(catchError(() => of([]))),
      education: this.portfolioService
        .getEducation()
        .pipe(catchError(() => of([]))),
      certifications: this.portfolioService
        .getCertifications()
        .pipe(catchError(() => of([]))),
      contactSettings: this.portfolioService
        .getContactSettings()
        .pipe(catchError(() => of(null))),
    }).subscribe({
      next: (data) => {
        if (data.profile) {
          this.state.profile.set(data.profile);
        }
        this.state.experiences.set(data.experiences);
        this.state.projects.set(data.projects);
        this.state.skills.set(data.skills);
        this.state.education.set(data.education);
        this.state.certifications.set(data.certifications);
        if (data.contactSettings) {
          this.state.contactSettings.set(data.contactSettings);
        }
        this.state.setLoading(false);
        // Re-run motion observers once content is rendered
        setTimeout(() => this.motionService.refresh(), 50);
      },
      error: (err) => {
        console.error('Failed to load portfolio:', err);
        this.state.setError('Failed to load portfolio. Please try again.');
      },
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  handleProjectClick(project: { slug?: string }): void {
    if (project.slug) {
      this.router.navigate(['/project', project.slug]);
    }
  }

  handleContactSubmit(data: ContactFormData): void {
    this.isSubmittingContact = true;
    this.contactService
      .submit(data)
      .pipe(finalize(() => (this.isSubmittingContact = false)))
      .subscribe({
        next: () => {
          const successMessage =
            this.state.contactSettings()?.successMessage ||
            'Message sent successfully!';
          this.notify.success(successMessage);
        },
        error: (err) => {
          console.error('Contact form submission failed:', err);
          this.notify.error('Failed to send message. Please try again.');
        },
      });
  }
}
