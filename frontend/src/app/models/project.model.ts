/**
 * Project models for portfolio projects
 */
export interface ProjectBullet {
  id: string;
  content: string;
  sortOrder: number;
}

export interface Project {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  longDescription?: string;
  techStack?: string;
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  featured: boolean;
  bullets: ProjectBullet[];
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
