import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  AdminImportService,
  ImportResult,
  ResumeImportData,
} from '../../services/admin-import.service';

interface ValidationError {
  field: string;
  message: string;
}

@Component({
  selector: 'app-import-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <section class="admin-section">
      <header class="section-header">
        <h2>Import Resume Data</h2>
        <p class="section-subtitle">
          Import portfolio data from JSON. This will replace existing data for
          the imported sections.
        </p>
      </header>

      <div class="import-card">
        <div class="toolbar">
          <button class="btn-secondary" (click)="loadSample()">
            <mat-icon>download</mat-icon>
            Load sample
          </button>
          <button class="btn-secondary" (click)="formatJson()">
            <mat-icon>code</mat-icon>
            Format JSON
          </button>
          <button class="btn-secondary" (click)="clearJson()">
            <mat-icon>clear</mat-icon>
            Clear
          </button>
        </div>

        <div class="textarea-wrapper">
          <textarea
            class="json-input"
            [(ngModel)]="jsonInput"
            (input)="onInputChange()"
            placeholder='Paste your resume JSON here...

{
  "profile": { "name": "...", "title": "..." },
  "experiences": [...],
  "projects": [...],
  "skillCategories": [...],
  "education": [...],
  "certifications": [...]
}'
            spellcheck="false"
          ></textarea>
          <div class="line-numbers">
            @for (line of lineNumbers; track line) {
            <span>{{ line }}</span>
            }
          </div>
        </div>

        @if (validationErrors.length > 0) {
        <div class="error-panel">
          <div class="error-header">
            <mat-icon>error_outline</mat-icon>
            <span>Validation Errors</span>
          </div>
          <ul class="error-list">
            @for (err of validationErrors; track err.field) {
            <li>
              <strong>{{ err.field }}:</strong> {{ err.message }}
            </li>
            }
          </ul>
        </div>
        } @if (importResult) {
        <div
          class="result-panel"
          [class.success]="importResult.success"
          [class.error]="!importResult.success"
        >
          <div class="result-header">
            <mat-icon>{{
              importResult.success ? 'check_circle' : 'error'
            }}</mat-icon>
            <span>{{ importResult.message }}</span>
          </div>
          @if (importResult.success && importResult.counts) {
          <div class="result-counts">
            <div class="count-item">
              <span class="count-value">{{
                importResult.counts.experiences
              }}</span>
              <span class="count-label">Experiences</span>
            </div>
            <div class="count-item">
              <span class="count-value">{{
                importResult.counts.projects
              }}</span>
              <span class="count-label">Projects</span>
            </div>
            <div class="count-item">
              <span class="count-value">{{
                importResult.counts.skillCategories
              }}</span>
              <span class="count-label">Skill Categories</span>
            </div>
            <div class="count-item">
              <span class="count-value">{{
                importResult.counts.education
              }}</span>
              <span class="count-label">Education</span>
            </div>
            <div class="count-item">
              <span class="count-value">{{
                importResult.counts.certifications
              }}</span>
              <span class="count-label">Certifications</span>
            </div>
          </div>
          }
        </div>
        }

        <div class="actions">
          <button
            class="btn-primary btn-lg"
            (click)="doImport()"
            [disabled]="importing || !isValidJson"
          >
            <mat-icon>{{ importing ? 'hourglass_empty' : 'upload' }}</mat-icon>
            {{ importing ? 'Importing...' : 'Import data' }}
          </button>
          <span
            class="validation-status"
            [class.valid]="isValidJson"
            [class.invalid]="!isValidJson && jsonInput.trim()"
          >
            @if (isValidJson) {
            <mat-icon>check</mat-icon> Valid JSON } @else if (jsonInput.trim())
            { <mat-icon>close</mat-icon> Invalid JSON }
          </span>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .admin-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .import-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 16px;
        padding: 1.25rem;
      }

      .toolbar {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }

      .textarea-wrapper {
        position: relative;
        display: flex;
        background: var(--bg-primary);
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        overflow: hidden;
      }

      .line-numbers {
        display: flex;
        flex-direction: column;
        padding: 1rem 0.75rem;
        background: rgba(0, 0, 0, 0.2);
        color: var(--text-muted);
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.85rem;
        line-height: 1.5;
        text-align: right;
        user-select: none;
        min-width: 40px;
      }

      .json-input {
        flex: 1;
        min-height: 400px;
        padding: 1rem;
        background: transparent;
        border: none;
        color: var(--text-primary);
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.85rem;
        line-height: 1.5;
        resize: vertical;
        outline: none;
      }

      .json-input::placeholder {
        color: var(--text-muted);
        opacity: 0.6;
      }

      .error-panel {
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(255, 87, 51, 0.1);
        border: 1px solid rgba(255, 87, 51, 0.3);
        border-radius: 12px;
      }

      .error-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--color-tart-orange);
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .error-list {
        margin: 0;
        padding-left: 1.5rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
      }

      .error-list li {
        margin: 0.25rem 0;
      }

      .result-panel {
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 12px;
      }

      .result-panel.success {
        background: rgba(0, 255, 127, 0.1);
        border: 1px solid rgba(0, 255, 127, 0.3);
      }

      .result-panel.error {
        background: rgba(255, 87, 51, 0.1);
        border: 1px solid rgba(255, 87, 51, 0.3);
      }

      .result-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
      }

      .result-panel.success .result-header {
        color: var(--color-spring-green);
      }

      .result-panel.error .result-header {
        color: var(--color-tart-orange);
      }

      .result-counts {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .count-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.75rem 1.25rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        min-width: 100px;
      }

      .count-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-spring-green);
      }

      .count-label {
        font-size: 0.8rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
      }

      .btn-lg {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      }

      .validation-status {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.9rem;
      }

      .validation-status.valid {
        color: var(--color-spring-green);
      }

      .validation-status.invalid {
        color: var(--color-tart-orange);
      }

      .validation-status mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    `,
  ],
})
export class ImportAdminComponent {
  private readonly http = inject(HttpClient);
  private readonly api = inject(AdminImportService);

  jsonInput = '';
  isValidJson = false;
  validationErrors: ValidationError[] = [];
  importing = false;
  importResult: ImportResult | null = null;

  get lineNumbers(): number[] {
    const lines = this.jsonInput.split('\n').length;
    return Array.from({ length: Math.max(lines, 20) }, (_, i) => i + 1);
  }

  onInputChange(): void {
    this.importResult = null;
    this.validateJson();
  }

  validateJson(): void {
    this.validationErrors = [];
    this.isValidJson = false;

    if (!this.jsonInput.trim()) {
      return;
    }

    try {
      const data = JSON.parse(this.jsonInput) as ResumeImportData;
      this.validateData(data);
      this.isValidJson = this.validationErrors.length === 0;
    } catch (e: any) {
      this.validationErrors.push({
        field: 'JSON',
        message: e.message || 'Invalid JSON syntax',
      });
    }
  }

  private validateData(data: ResumeImportData): void {
    // Validate profile if present
    if (data.profile) {
      if (!data.profile.name?.trim()) {
        this.validationErrors.push({
          field: 'profile.name',
          message: 'Name is required',
        });
      }
      if (!data.profile.title?.trim()) {
        this.validationErrors.push({
          field: 'profile.title',
          message: 'Title is required',
        });
      }
    }

    // Validate experiences
    if (data.experiences) {
      data.experiences.forEach((exp, i) => {
        if (!exp.company?.trim()) {
          this.validationErrors.push({
            field: `experiences[${i}].company`,
            message: 'Company is required',
          });
        }
        if (!exp.role?.trim()) {
          this.validationErrors.push({
            field: `experiences[${i}].role`,
            message: 'Role is required',
          });
        }
        if (!exp.startDate) {
          this.validationErrors.push({
            field: `experiences[${i}].startDate`,
            message: 'Start date is required',
          });
        }
      });
    }

    // Validate projects
    if (data.projects) {
      data.projects.forEach((proj, i) => {
        if (!proj.title?.trim()) {
          this.validationErrors.push({
            field: `projects[${i}].title`,
            message: 'Title is required',
          });
        }
      });
    }

    // Validate skill categories
    if (data.skillCategories) {
      data.skillCategories.forEach((cat, i) => {
        if (!cat.name?.trim()) {
          this.validationErrors.push({
            field: `skillCategories[${i}].name`,
            message: 'Name is required',
          });
        }
        cat.skills?.forEach((skill, j) => {
          if (!skill.name?.trim()) {
            this.validationErrors.push({
              field: `skillCategories[${i}].skills[${j}].name`,
              message: 'Skill name is required',
            });
          }
        });
      });
    }

    // Validate education
    if (data.education) {
      data.education.forEach((edu, i) => {
        if (!edu.institution?.trim()) {
          this.validationErrors.push({
            field: `education[${i}].institution`,
            message: 'Institution is required',
          });
        }
        if (!edu.degree?.trim()) {
          this.validationErrors.push({
            field: `education[${i}].degree`,
            message: 'Degree is required',
          });
        }
        if (!edu.startYear) {
          this.validationErrors.push({
            field: `education[${i}].startYear`,
            message: 'Start year is required',
          });
        }
      });
    }

    // Validate certifications
    if (data.certifications) {
      data.certifications.forEach((cert, i) => {
        if (!cert.name?.trim()) {
          this.validationErrors.push({
            field: `certifications[${i}].name`,
            message: 'Name is required',
          });
        }
        if (!cert.issuer?.trim()) {
          this.validationErrors.push({
            field: `certifications[${i}].issuer`,
            message: 'Issuer is required',
          });
        }
        if (!cert.issueDate) {
          this.validationErrors.push({
            field: `certifications[${i}].issueDate`,
            message: 'Issue date is required',
          });
        }
      });
    }

    // Validate contact settings if present
    if (data.contactSettings) {
      if (!data.contactSettings.email?.trim()) {
        this.validationErrors.push({
          field: 'contactSettings.email',
          message: 'Email is required',
        });
      }
    }
  }

  formatJson(): void {
    try {
      const parsed = JSON.parse(this.jsonInput);
      this.jsonInput = JSON.stringify(parsed, null, 2);
      this.validateJson();
    } catch {
      // If invalid JSON, can't format
    }
  }

  clearJson(): void {
    this.jsonInput = '';
    this.validationErrors = [];
    this.importResult = null;
    this.isValidJson = false;
  }

  loadSample(): void {
    this.http
      .get('assets/resume.sample.json', { responseType: 'text' })
      .subscribe({
        next: (json) => {
          this.jsonInput = json;
          this.validateJson();
        },
        error: () => {
          // Sample file not found, use embedded sample
          this.jsonInput = JSON.stringify(this.getEmbeddedSample(), null, 2);
          this.validateJson();
        },
      });
  }

  private getEmbeddedSample(): ResumeImportData {
    return {
      profile: {
        name: 'Jane Developer',
        title: 'Full Stack Engineer',
        tagline: 'Building beautiful, performant web applications',
        bio: 'Passionate developer with 5+ years of experience building scalable web applications.',
        email: 'jane@example.com',
        githubUrl: 'https://github.com/janedev',
        linkedinUrl: 'https://linkedin.com/in/janedev',
        twitterUrl: 'https://twitter.com/janedev',
        nickname: 'Jane Developer',
      },
      experiences: [
        {
          company: 'Tech Corp',
          role: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          employmentType: 'Full-time',
          startDate: '2022-01-15',
          description: 'Leading frontend development for the core product.',
          techStack: 'React, TypeScript, GraphQL, Node.js',
          published: true,
          bullets: [
            {
              content:
                'Led migration from legacy system to modern React architecture',
            },
            { content: 'Improved application performance by 40%' },
            { content: 'Mentored 3 junior developers' },
          ],
        },
        {
          company: 'StartupXYZ',
          role: 'Full Stack Developer',
          location: 'Remote',
          employmentType: 'Full-time',
          startDate: '2020-03-01',
          endDate: '2021-12-31',
          description: 'Built and maintained multiple web applications.',
          techStack: 'Angular, Java, Spring Boot, PostgreSQL',
          published: true,
          bullets: [
            { content: 'Developed RESTful APIs serving 10k+ daily users' },
            {
              content:
                'Implemented CI/CD pipeline reducing deployment time by 60%',
            },
          ],
        },
      ],
      projects: [
        {
          title: 'Portfolio Builder',
          slug: 'portfolio-builder',
          description: 'A modern portfolio website generator',
          techStack: 'Angular, Spring Boot, PostgreSQL',
          githubUrl: 'https://github.com/janedev/portfolio-builder',
          liveUrl: 'https://portfolio.example.com',
          featured: true,
          published: true,
          bullets: [
            { content: 'Built with Angular 18 and Spring Boot 3' },
            { content: 'Features drag-and-drop content management' },
          ],
        },
      ],
      skillCategories: [
        {
          name: 'Frontend',
          icon: 'code',
          published: true,
          skills: [
            { name: 'React', proficiency: 'Expert' },
            { name: 'Angular', proficiency: 'Expert' },
            { name: 'TypeScript', proficiency: 'Expert' },
            { name: 'CSS/SCSS', proficiency: 'Advanced' },
          ],
        },
        {
          name: 'Backend',
          icon: 'storage',
          published: true,
          skills: [
            { name: 'Java', proficiency: 'Expert' },
            { name: 'Spring Boot', proficiency: 'Expert' },
            { name: 'Node.js', proficiency: 'Advanced' },
            { name: 'PostgreSQL', proficiency: 'Advanced' },
          ],
        },
      ],
      education: [
        {
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          location: 'Boston, MA',
          startYear: 2015,
          endYear: 2019,
          gpa: '3.8/4.0',
          published: true,
        },
      ],
      certifications: [
        {
          name: 'AWS Solutions Architect',
          issuer: 'Amazon Web Services',
          issueDate: '2023-06-15',
          expiryDate: '2026-06-15',
          credentialId: 'AWS-SA-123456',
          credentialUrl: 'https://aws.amazon.com/verification',
          published: true,
        },
      ],
      contactSettings: {
        email: 'jane@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        availabilityStatus: 'Available for new opportunities',
        formEnabled: true,
        successMessage:
          "Thanks for reaching out! I'll get back to you within 24 hours.",
      },
    };
  }

  doImport(): void {
    if (!this.isValidJson) return;

    this.importing = true;
    this.importResult = null;

    try {
      const data = JSON.parse(this.jsonInput) as ResumeImportData;
      this.api.import(data).subscribe({
        next: (result) => {
          this.importing = false;
          this.importResult = result;
        },
        error: (err) => {
          this.importing = false;
          this.importResult = {
            success: false,
            message:
              err.error?.message ||
              'Import failed. Please check your data and try again.',
            counts: {
              experiences: 0,
              projects: 0,
              skillCategories: 0,
              education: 0,
              certifications: 0,
            },
          };
        },
      });
    } catch (e: any) {
      this.importing = false;
      this.importResult = {
        success: false,
        message: e.message || 'Invalid JSON',
        counts: {
          experiences: 0,
          projects: 0,
          skillCategories: 0,
          education: 0,
          certifications: 0,
        },
      };
    }
  }
}
