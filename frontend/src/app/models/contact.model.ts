/**
 * Contact settings model
 */
export interface ContactSettings {
  id: string;
  email: string;
  phone?: string;
  location?: string;
  availabilityStatus?: string;
  formEnabled: boolean;
  formRecipient?: string;
  successMessage?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Contact form submission
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  honeypot?: string;
  captchaToken: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: string;
  userAgent?: string;
  ipAddress?: string;
}
