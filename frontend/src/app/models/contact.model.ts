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
}
