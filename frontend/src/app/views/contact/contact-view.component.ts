import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContactSettings, ContactFormData } from '../../models';
import { SectionHeaderComponent } from '../../shared';

/**
 * Contact section view - displays contact info and form
 */
@Component({
  selector: 'app-contact-view',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule, 
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, 
    MatIconModule,
    SectionHeaderComponent
  ],
  template: `
    <section class="contact" id="contact">
      <app-section-header 
        title="Get In Touch" 
        subtitle="Let's connect and discuss opportunities">
      </app-section-header>

      <div class="contact-content">
        <div class="contact-info">
          @if (settings?.email) {
            <div class="info-item">
              <mat-icon>email</mat-icon>
              <a [href]="'mailto:' + settings!.email">{{ settings!.email }}</a>
            </div>
          }
          @if (settings?.phone) {
            <div class="info-item">
              <mat-icon>phone</mat-icon>
              <a [href]="'tel:' + settings!.phone">{{ settings!.phone }}</a>
            </div>
          }
          @if (settings?.location) {
            <div class="info-item">
              <mat-icon>location_on</mat-icon>
              <span>{{ settings!.location }}</span>
            </div>
          }
          @if (settings?.availabilityStatus) {
            <div class="availability">
              <mat-icon>schedule</mat-icon>
              <span>{{ settings!.availabilityStatus }}</span>
            </div>
          }
        </div>

        @if (settings?.formEnabled) {
          <mat-card class="contact-form-card">
            <form [formGroup]="contactForm" (ngSubmit)="submitForm()">
              <mat-form-field appearance="outline">
                <mat-label>Name</mat-label>
                <input matInput formControlName="name" placeholder="Your name" />
                @if (contactForm.get('name')?.hasError('required')) {
                  <mat-error>Name is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" placeholder="your.email@example.com" />
                @if (contactForm.get('email')?.hasError('required')) {
                  <mat-error>Email is required</mat-error>
                }
                @if (contactForm.get('email')?.hasError('email')) {
                  <mat-error>Please enter a valid email</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Subject</mat-label>
                <input matInput formControlName="subject" placeholder="What's this about?" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Message</mat-label>
                <textarea 
                  matInput 
                  formControlName="message" 
                  rows="5" 
                  placeholder="Your message...">
                </textarea>
                @if (contactForm.get('message')?.hasError('required')) {
                  <mat-error>Message is required</mat-error>
                }
              </mat-form-field>

              <button 
                mat-raised-button 
                color="primary" 
                type="submit" 
                [disabled]="contactForm.invalid || isSubmitting">
                @if (isSubmitting) {
                  Sending...
                } @else {
                  Send Message
                }
              </button>
            </form>
          </mat-card>
        }
      </div>
    </section>
  `,
  styles: [`
    .contact {
      padding: 5rem 2rem;
    }

    .contact-content {
      max-width: 900px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
    }

    .contact-info {
      padding: 2rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .info-item mat-icon {
      color: var(--primary-color);
    }

    .info-item a {
      color: var(--text-primary);
      text-decoration: none;
    }

    .info-item a:hover {
      color: var(--primary-color);
    }

    .availability {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--primary-color);
      color: white;
      border-radius: 0.5rem;
      margin-top: 2rem;
    }

    .contact-form-card {
      padding: 2rem;
      background: var(--bg-card);
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    mat-form-field {
      width: 100%;
    }

    @media (max-width: 768px) {
      .contact-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContactViewComponent {
  @Input() settings: ContactSettings | null = null;
  @Input() isSubmitting = false;
  @Output() formSubmit = new EventEmitter<ContactFormData>();

  private readonly fb = inject(FormBuilder);
  contactForm: FormGroup;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required]
    });
  }

  submitForm(): void {
    if (this.contactForm.valid) {
      this.formSubmit.emit(this.contactForm.value as ContactFormData);
    }
  }
}
