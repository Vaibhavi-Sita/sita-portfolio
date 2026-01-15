/**
 * Skill models for technical skills
 */
export interface SkillItem {
  id: string;
  name: string;
  iconUrl?: string;
  proficiency?: string;
  sortOrder: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon?: string;
  skills: SkillItem[];
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
