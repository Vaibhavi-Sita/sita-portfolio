import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContactSettings, ContactFormData } from '../../models';
import { environment } from '../../../environments/environment';
import { SectionHeaderComponent } from '../../shared';
import { ContactSectionHeaderComponent } from '../../shared/components/section-header/contact-section-header.component';

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
    ContactSectionHeaderComponent,
  ],
  template: `
    <section
      class="contact section parallax-section parallax-contact"
      id="contact"
      data-parallax
      data-parallax-speed="0.12"
      data-parallax-speed2="0.22"
    >
      <app-contact-section-header
        title="Get In Touch"
        subtitle="I'm always interested in hearing about new opportunities, exciting projects, or just having a conversation about technology."
        number="06"
      >
      </app-contact-section-header>

      <div class="contact-content">
        <div class="contact-info reveal-on-scroll">
          <h3 class="info-title">Let's Talk</h3>
          <p class="info-description">
            You can reach out to me by filling out the form or by using the
            contact methods listed below. I would love to hear from you!
          </p>

          <div class="contact-methods">
            @if (settings?.email) {
            <a
              [href]="'mailto:' + settings!.email"
              class="contact-method reveal-on-scroll"
            >
              <div class="method-icon">
                <mat-icon>email</mat-icon>
              </div>
              <div class="method-content">
                <span class="method-label">Email</span>
                <span class="method-value">{{ settings!.email }}</span>
              </div>
            </a>
            } @if (settings?.phone) {
            <a
              [href]="'tel:' + settings!.phone"
              class="contact-method reveal-on-scroll"
            >
              <div class="method-icon method-icon-green">
                <mat-icon>phone</mat-icon>
              </div>
              <div class="method-content">
                <span class="method-label">Phone</span>
                <span class="method-value">{{ settings!.phone }}</span>
              </div>
            </a>
            } @if (settings?.location) {
            <div class="contact-method reveal-on-scroll">
              <div class="method-icon">
                <mat-icon>location_on</mat-icon>
              </div>
              <div class="method-content">
                <span class="method-label">Location</span>
                <span class="method-value">{{ settings!.location }}</span>
              </div>
            </div>
            }
          </div>

          @if (settings?.availabilityStatus) {
          <div class="availability">
            <div class="availability-dot"></div>
            <span>{{ settings!.availabilityStatus }}</span>
          </div>
          }
        </div>

        @if (settings?.formEnabled) {
        <div class="contact-form-wrapper reveal-on-scroll">
          <form
            [formGroup]="contactForm"
            (ngSubmit)="submitForm()"
            class="contact-form"
          >
            <!-- Honeypot field to trap bots -->
            <input
              type="text"
              formControlName="honeypot"
              tabindex="-1"
              autocomplete="off"
              aria-hidden="true"
              style="position: absolute; left: -9999px; opacity: 0;"
            />

            <!-- reCAPTCHA -->
            <div id="recaptcha-container" class="recaptcha-container"></div>

            <mat-form-field appearance="outline">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" placeholder="Your name" />
              @if (contactForm.get('name')?.hasError('required')) {
              <mat-error>Name is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input
                matInput
                formControlName="email"
                type="email"
                placeholder="your.email@example.com"
              />
              @if (contactForm.get('email')?.hasError('required')) {
              <mat-error>Email is required</mat-error>
              } @if (contactForm.get('email')?.hasError('email')) {
              <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Subject</mat-label>
              <input
                matInput
                formControlName="subject"
                placeholder="What's this about?"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Message</mat-label>
              <textarea
                matInput
                formControlName="message"
                rows="5"
                placeholder="Your message..."
              >
              </textarea>
              @if (contactForm.get('message')?.hasError('required')) {
              <mat-error>Message is required</mat-error>
              }
            </mat-form-field>

            <button
              type="submit"
              class="btn-cta submit-btn"
              [disabled]="contactForm.invalid || isSubmitting"
            >
              @if (isSubmitting) {
              <mat-icon class="spinning">sync</mat-icon>
              Sending... } @else { Send Message
              <mat-icon>send</mat-icon>
              }
            </button>
          </form>
        </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .contact {
        background: var(--bg-secondary);
      }

      .contact-content {
        max-width: 1000px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: start;
      }

      .info-title {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 0 1rem;
        background: linear-gradient(
          135deg,
          var(--color-blue-violet),
          var(--color-winter-sky)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .info-description {
        color: var(--text-secondary);
        line-height: 1.7;
        margin-bottom: 2rem;
      }
      .section-title {
        font-size: clamp(2rem, 5vw, 2.75rem);
        font-weight: 700;
        margin: 0;
        background: linear-gradient(
          135deg,
          var(--color-green) 0%,
          var(--color-mango) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 5px var(--color-neon-green);
      }

      .contact-methods {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .contact-method {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        text-decoration: none;
        transition: all var(--transition-base);

        &:hover {
          border-color: var(--color-blue-violet);
          transform: translateX(4px);
          box-shadow: 0 0 20px rgba(131, 56, 236, 0.15);
        }
      }

      .method-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: rgba(131, 56, 236, 0.15);
        color: var(--color-blue-violet);
      }

      .method-icon-pink {
        background: rgba(255, 0, 110, 0.15);
        color: var(--color-winter-sky);
      }
      .method-icon-green {
        background: rgba(44, 255, 5, 0.15);
        color: var(--color-neon-green);
      }

      .method-icon-orange {
        background: rgba(251, 86, 7, 0.15);
        color: var(--color-orange);
      }

      .method-content {
        display: flex;
        flex-direction: column;
      }

      .method-label {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-muted);
      }

      .method-value {
        font-size: 1rem;
        font-weight: 500;
        color: var(--text-primary);
      }

      .availability {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 2rem;
        padding: 0.75rem 1.25rem;
        background: rgba(44, 255, 5, 0.1);
        border: 1px solid rgba(44, 255, 5, 0.3);
        border-radius: 50px;
        color: var(--color-neon-green);
        font-weight: 500;
        font-size: 0.9375rem;
      }

      .availability-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--color-neon-green);
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.5;
          transform: scale(1.2);
        }
      }

      .contact-form-wrapper {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 16px;
        padding: 2rem;
      }

      .contact-form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      mat-form-field {
        width: 100%;
      }

      .submit-btn {
        margin-top: 1rem;
        width: 100%;
      }

      .recaptcha-container {
        margin-bottom: 0.5rem;
      }

      .spinning {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 768px) {
        .contact-content {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
      }
    `,
  ],
})
export class ContactViewComponent implements AfterViewInit, OnChanges {
  @Input() settings: ContactSettings | null = null;
  @Input() isSubmitting = false;
  @Output() formSubmit = new EventEmitter<ContactFormData>();

  private readonly fb = inject(FormBuilder);
  contactForm: FormGroup;
  recaptchaReady = false;
  private recaptchaWidgetId: number | null = null;
  private readonly siteKey = environment.recaptchaSiteKey;
  private wasSubmitting = false;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required],
      honeypot: [''], // hidden anti-spam field
      captchaToken: ['', Validators.required],
    });

    if (!this.siteKey) {
      // If no site key configured, do not block submission, but backend will enforce if enabled there.
      this.contactForm.get('captchaToken')?.clearValidators();
      this.contactForm.get('captchaToken')?.updateValueAndValidity();
    }
  }

  ngAfterViewInit(): void {
    this.loadRecaptchaScript();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['isSubmitting'] &&
      this.wasSubmitting &&
      this.isSubmitting === false
    ) {
      this.resetRecaptcha();
    }
    this.wasSubmitting = this.isSubmitting;
  }

  submitForm(): void {
    if (this.contactForm.valid) {
      this.formSubmit.emit(this.contactForm.value as ContactFormData);
    }
  }

  private loadRecaptchaScript(): void {
    if (!this.siteKey) {
      console.warn(
        'reCAPTCHA site key missing; form will submit without captcha.'
      );
      return;
    }
    if (document.getElementById('recaptcha-script')) {
      this.renderRecaptcha();
      return;
    }
    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => this.renderRecaptcha();
    document.body.appendChild(script);
  }

  private renderRecaptcha(): void {
    // @ts-ignore
    const grecaptcha = (window as any).grecaptcha;
    if (!grecaptcha || !this.siteKey) {
      return;
    }
    this.recaptchaWidgetId = grecaptcha.render('recaptcha-container', {
      sitekey: this.siteKey,
      callback: (token: string) => {
        this.contactForm.patchValue({ captchaToken: token });
        this.recaptchaReady = true;
      },
      'expired-callback': () => {
        this.contactForm.patchValue({ captchaToken: '' });
      },
      'error-callback': () => {
        this.contactForm.patchValue({ captchaToken: '' });
      },
    });
  }

  resetRecaptcha(): void {
    // @ts-ignore
    const grecaptcha = (window as any).grecaptcha;
    if (this.recaptchaWidgetId !== null && grecaptcha) {
      grecaptcha.reset(this.recaptchaWidgetId);
      this.contactForm.patchValue({ captchaToken: '' });
    }
  }
}
