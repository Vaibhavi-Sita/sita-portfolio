/**
 * Education model for academic background
 */
export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startYear: number;
  endYear?: number;
  gpa?: string;
  description?: string;
  logoUrl?: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
