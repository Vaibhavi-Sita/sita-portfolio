/**
 * Certification model for professional certifications
 */
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  badgeUrl?: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
