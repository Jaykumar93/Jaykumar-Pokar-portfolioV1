export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface ProjectEntry {
  name: string;
  tagline: string;
  stack: string[];
  bullets: string[];
  link?: string;
}

export interface EducationEntry {
  degree: string;
  school: string;
  location: string;
  detail: string;
}

export interface ResumeData {
  name: string;
  title: string;
  phone: string;
  email: string;
  links: { label: string; url: string }[];
  summary: string;
  skills: Record<string, string[]>;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
  resumePdfUrl: string;
}
