/**
 * Experience models for work history
 */
export interface ExperienceBullet {
  id: string;
  content: string;
  sortOrder: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  employmentType?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  techStack?: string;
  companyUrl?: string;
  logoUrl?: string;
  bullets: ExperienceBullet[];
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
