import { z } from "zod";
import {
  EMPLOYMENT_TYPES,
  FONT_SIZES,
  LANGUAGE_LEVELS,
  SKILL_CATEGORY_IDS,
  TEMPLATE_IDS,
  TOGGLEABLE_SECTION_IDS,
} from "./resume.types";

const optionalText = z.string();

export const optionalEmailSchema = z
  .string()
  .refine((value) => value.trim() === "" || z.email().safeParse(value).success, {
    message: "Enter a valid email address",
  });

export const optionalUrlSchema = z
  .string()
  .refine((value) => value.trim() === "" || z.url().safeParse(value).success, {
    message: "Enter a valid URL",
  });

export const personalDetailsSchema = z.object({
  fullName: z.string().max(80),
  jobTitle: z.string().max(80),
  email: optionalEmailSchema,
  phone: z.string().max(40),
  location: z.string().max(80),
  linkedin: optionalUrlSchema,
  github: optionalUrlSchema,
  portfolio: optionalUrlSchema,
  showPhoto: z.boolean(),
  photoUrl: optionalText,
});

export const experienceSchema = z.object({
  id: z.string().min(1),
  jobTitle: z.string().max(80),
  company: z.string().max(80),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  location: z.string().max(80),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  description: z.array(z.string()),
});

export const educationSchema = z.object({
  id: z.string().min(1),
  degree: z.string().max(120),
  institution: z.string().max(120),
  location: z.string().max(80),
  startDate: z.string(),
  endDate: z.string(),
  grade: z.string().max(40),
  description: z.string().max(400),
});

export const skillCategorySchema = z.object({
  id: z.enum(SKILL_CATEGORY_IDS),
  label: z.string().min(1),
  skills: z.array(z.string()),
});

export const projectSchema = z.object({
  id: z.string().min(1),
  name: z.string().max(120),
  role: z.string().max(80),
  technologies: z.array(z.string()),
  projectUrl: optionalUrlSchema,
  githubUrl: optionalUrlSchema,
  description: z.array(z.string()),
});

export const certificationSchema = z.object({
  id: z.string().min(1),
  name: z.string().max(120),
  issuer: z.string().max(120),
  date: z.string(),
  url: optionalUrlSchema,
});

export const languageSchema = z.object({
  id: z.string().min(1),
  name: z.string().max(60),
  proficiency: z.enum(LANGUAGE_LEVELS),
});

export const awardSchema = z.object({
  id: z.string().min(1),
  title: z.string().max(120),
  issuer: z.string().max(120),
  date: z.string(),
  description: z.string().max(400),
});

export const customEntrySchema = z.object({
  id: z.string().min(1),
  heading: z.string().max(120),
  subheading: z.string().max(120),
  date: z.string(),
  description: z.array(z.string()),
});

export const customSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().max(80),
  entries: z.array(customEntrySchema),
});

export const sectionVisibilitySchema = z.object({
  summary: z.boolean(),
  experience: z.boolean(),
  education: z.boolean(),
  skills: z.boolean(),
  projects: z.boolean(),
  certifications: z.boolean(),
  languages: z.boolean(),
  awards: z.boolean(),
  custom: z.boolean(),
});

export const resumeSettingsSchema = z.object({
  resumeName: z.string().min(1).max(80),
  fontSize: z.enum(FONT_SIZES),
  accentColor: z.string().min(4).max(20),
  sectionVisibility: sectionVisibilitySchema,
});

export const resumeSchema = z.object({
  id: z.string().min(1),
  templateId: z.enum(TEMPLATE_IDS),
  updatedAt: z.string().min(1),
  personal: personalDetailsSchema,
  summary: z.string().max(800),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillCategorySchema),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema),
  languages: z.array(languageSchema),
  awards: z.array(awardSchema),
  customSections: z.array(customSectionSchema),
  settings: resumeSettingsSchema,
});

export const persistedResumeStateSchema = z.object({
  version: z.literal(1),
  drafts: z.record(z.string(), resumeSchema),
  draftOrder: z.array(z.string()),
  activeDraftId: z.string(),
  lastSavedAt: z.string().nullable(),
});

export const summarySchema = z.object({
  summary: z.string().max(800),
});

export { TOGGLEABLE_SECTION_IDS };
