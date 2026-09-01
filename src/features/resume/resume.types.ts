export const TEMPLATE_IDS = [
  "classic-ats",
  "modern-professional",
  "compact-tech",
] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];

export const SECTION_IDS = [
  "personal",
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "awards",
  "custom",
  "settings",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const TOGGLEABLE_SECTION_IDS = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "awards",
  "custom",
] as const;

export type ToggleableSectionId = (typeof TOGGLEABLE_SECTION_IDS)[number];

export const EMPLOYMENT_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "freelance",
] as const;

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export const SKILL_CATEGORY_IDS = [
  "frontend",
  "backend",
  "database",
  "cloud",
  "tools",
  "soft",
] as const;

export type SkillCategoryId = (typeof SKILL_CATEGORY_IDS)[number];

export const FONT_SIZES = ["small", "medium", "large"] as const;
export type FontSize = (typeof FONT_SIZES)[number];

export const LANGUAGE_LEVELS = [
  "native",
  "fluent",
  "professional",
  "intermediate",
  "basic",
] as const;

export type LanguageLevel = (typeof LANGUAGE_LEVELS)[number];

export interface PersonalDetails {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  showPhoto: boolean;
  photoUrl: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  employmentType: EmploymentType;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

export interface SkillCategory {
  id: SkillCategoryId;
  label: string;
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  role: string;
  technologies: string[];
  projectUrl: string;
  githubUrl: string;
  description: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: LanguageLevel;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface CustomEntry {
  id: string;
  heading: string;
  subheading: string;
  date: string;
  description: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  entries: CustomEntry[];
}

export interface ResumeSettings {
  resumeName: string;
  fontSize: FontSize;
  accentColor: string;
  sectionVisibility: Record<ToggleableSectionId, boolean>;
}

export interface Resume {
  id: string;
  templateId: TemplateId;
  updatedAt: string;
  personal: PersonalDetails;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  awards: Award[];
  customSections: CustomSection[];
  settings: ResumeSettings;
}

export interface PersistedResumeState {
  version: 1;
  drafts: Record<string, Resume>;
  draftOrder: string[];
  activeDraftId: string;
  lastSavedAt: string | null;
}
