export interface Metric {
  value: string;
  label: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
  metrics: Metric[];
}

export interface ProjectEntry {
  name: string;
  tagline: string;
  stack: string[];
  bullets: string[];
  link?: string;
  docsLink?: string;
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
  quickFacts: { label: string; value: string }[];
  skills: Record<string, string[]>;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
  resumePdfUrl: string;
}
