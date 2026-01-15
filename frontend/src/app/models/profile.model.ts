/**
 * Profile model representing the portfolio owner's information
 */
export interface Profile {
  id: string;
  name: string;
  title: string;
  tagline?: string;
  bio?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  createdAt: string;
  updatedAt: string;
}
