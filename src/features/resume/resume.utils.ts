import {
  SKILL_CATEGORY_IDS,
  TOGGLEABLE_SECTION_IDS,
  type Award,
  type Certification,
  type CustomEntry,
  type CustomSection,
  type Education,
  type Experience,
  type Language,
  type Project,
  type Resume,
  type SectionId,
  type SkillCategory,
  type TemplateId,
  type ToggleableSectionId,
} from "./resume.types";

export const STORAGE_KEY = "resumecraft:v1";

export const SKILL_CATEGORY_LABELS: Record<SkillCategory["id"], string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  cloud: "Cloud / DevOps",
  tools: "Tools",
  soft: "Soft skills",
};

export const SECTION_LABELS: Record<SectionId, string> = {
  personal: "Personal Details",
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  awards: "Awards",
  custom: "Custom Section",
  settings: "Resume Settings",
};

export const TEMPLATE_META: Record<
  TemplateId,
  { name: string; description: string; bestFor: string }
> = {
  "classic-ats": {
    name: "Classic ATS",
    description:
      "Single-column, text-first layout with no icons or photos. Built for applicant tracking systems and corporate applications.",
    bestFor: "Corporate, government, and ATS-heavy applications",
  },
  "modern-professional": {
    name: "Modern Professional",
    description:
      "Two-column layout with a restrained accent color and optional icons. Clean enough for both recruiters and software.",
    bestFor: "Product, design-adjacent, and professional roles",
  },
  "compact-tech": {
    name: "Compact Tech",
    description:
      "Space-efficient developer resume that leads with skills and projects. Optimized for React, Node.js, and full-stack roles.",
    bestFor: "Software engineers and full-stack developers",
  },
};

export const ACCENT_COLORS = [
  { name: "Indigo", value: "#4f46e5" },
  { name: "Blue", value: "#2563eb" },
  { name: "Teal", value: "#0f766e" },
  { name: "Slate", value: "#334155" },
  { name: "Emerald", value: "#047857" },
] as const;

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  freelance: "Freelance",
};

export const LANGUAGE_LEVEL_LABELS: Record<string, string> = {
  native: "Native",
  fluent: "Fluent",
  professional: "Professional working",
  intermediate: "Intermediate",
  basic: "Basic",
};

export const SKILL_SUGGESTIONS: Record<SkillCategory["id"], string[]> = {
  frontend: [
    "React.js",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "React Native",
    "Redux",
  ],
  backend: [
    "Node.js",
    "Express",
    "REST APIs",
    "GraphQL",
    "Python",
    "Java",
    "NestJS",
  ],
  database: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma", "SQL"],
  cloud: [
    "AWS",
    "Firebase",
    "Firebase Cloud Messaging",
    "Docker",
    "CI/CD",
    "Vercel",
    "Linux",
  ],
  tools: ["Git", "GitHub", "Jira", "Figma", "Postman", "VS Code"],
  soft: [
    "Communication",
    "Mentoring",
    "Problem solving",
    "Ownership",
    "Collaboration",
  ],
};

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Math.random().toString(36).slice(2, 11)}${Date.now().toString(36)}`;
}

export function defaultSkillCategories(): SkillCategory[] {
  return SKILL_CATEGORY_IDS.map((id) => ({
    id,
    label: SKILL_CATEGORY_LABELS[id],
    skills: [],
  }));
}

export function defaultSectionVisibility(): Record<
  ToggleableSectionId,
  boolean
> {
  return {
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    languages: true,
    awards: true,
    custom: true,
  };
}

export function emptyExperience(): Experience {
  return {
    id: createId(),
    jobTitle: "",
    company: "",
    employmentType: "full-time",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: [],
  };
}

export function emptyEducation(): Education {
  return {
    id: createId(),
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    grade: "",
    description: "",
  };
}

export function emptyProject(): Project {
  return {
    id: createId(),
    name: "",
    role: "",
    technologies: [],
    projectUrl: "",
    githubUrl: "",
    description: [],
  };
}

export function emptyCertification(): Certification {
  return {
    id: createId(),
    name: "",
    issuer: "",
    date: "",
    url: "",
  };
}

export function emptyLanguage(): Language {
  return {
    id: createId(),
    name: "",
    proficiency: "professional",
  };
}

export function emptyAward(): Award {
  return {
    id: createId(),
    title: "",
    issuer: "",
    date: "",
    description: "",
  };
}

export function emptyCustomSection(): CustomSection {
  return {
    id: createId(),
    title: "Custom section",
    entries: [emptyCustomEntry()],
  };
}

export function emptyCustomEntry(): CustomEntry {
  return {
    id: createId(),
    heading: "",
    subheading: "",
    date: "",
    description: [],
  };
}

export function createEmptyResume(
  overrides: Partial<Pick<Resume, "id" | "templateId">> = {},
): Resume {
  const now = new Date().toISOString();
  return {
    id: overrides.id ?? createId(),
    templateId: overrides.templateId ?? "classic-ats",
    updatedAt: now,
    personal: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
      showPhoto: false,
      photoUrl: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: defaultSkillCategories(),
    projects: [],
    certifications: [],
    languages: [],
    awards: [],
    customSections: [],
    settings: {
      resumeName: "Untitled resume",
      fontSize: "medium",
      accentColor: "#4f46e5",
      sectionVisibility: defaultSectionVisibility(),
    },
  };
}

export function reorderById<T extends { id: string }>(
  items: T[],
  activeId: string,
  overId: string,
): T[] {
  const oldIndex = items.findIndex((item) => item.id === activeId);
  const newIndex = items.findIndex((item) => item.id === overId);
  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
    return items;
  }
  const next = [...items];
  const [moved] = next.splice(oldIndex, 1);
  next.splice(newIndex, 0, moved);
  return next;
}

export function bulletsToText(bullets: string[]): string {
  return bullets.join("\n");
}

export function textToBullets(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.replace(/^[\s•\-*]+/, "").trim())
    .filter(Boolean);
}

export function formatMonthYear(value: string): string {
  if (!value) return "";
  const [year, month] = value.split("-");
  if (!year || !month) return value;
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function formatDateRange(
  startDate: string,
  endDate: string,
  current = false,
): string {
  const start = formatMonthYear(startDate);
  const end = current ? "Present" : formatMonthYear(endDate);
  if (start && end) return `${start} – ${end}`;
  return start || end;
}

export function displayUrl(value: string): string {
  return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function collectResumeText(resume: Resume): string {
  const skillText = resume.skills.flatMap((category) => category.skills).join(" ");
  const experienceText = resume.experience
    .flatMap((item) => [item.jobTitle, item.company, ...item.description])
    .join(" ");
  const projectText = resume.projects
    .flatMap((item) => [item.name, item.role, ...item.description])
    .join(" ");
  const educationText = resume.education
    .map((item) => `${item.degree} ${item.institution} ${item.description}`)
    .join(" ");
  const customText = resume.customSections
    .flatMap((section) =>
      section.entries.flatMap((entry) => [entry.heading, ...entry.description]),
    )
    .join(" ");

  return [
    resume.personal.fullName,
    resume.personal.jobTitle,
    resume.summary,
    skillText,
    experienceText,
    projectText,
    educationText,
    customText,
  ].join(" ");
}

export function estimatePageCount(resume: Resume): number {
  const words = countWords(collectResumeText(resume));
  if (words < 380) return 1;
  if (words < 780) return 2;
  return 3;
}

export function latestExperience(resume: Resume): Experience | undefined {
  return resume.experience[0];
}

export function totalSkills(resume: Resume): number {
  return resume.skills.reduce((sum, category) => sum + category.skills.length, 0);
}

export function isSectionComplete(resume: Resume, section: SectionId): boolean {
  switch (section) {
    case "personal":
      return Boolean(
        resume.personal.fullName.trim() &&
          resume.personal.jobTitle.trim() &&
          resume.personal.email.trim() &&
          resume.personal.phone.trim(),
      );
    case "summary":
      return resume.summary.trim().length >= 80;
    case "experience":
      return resume.experience.some(
        (item) => item.jobTitle.trim() && item.company.trim(),
      );
    case "education":
      return resume.education.some(
        (item) => item.degree.trim() && item.institution.trim(),
      );
    case "skills":
      return totalSkills(resume) >= 5;
    case "projects":
      return resume.projects.some((item) => item.name.trim());
    case "certifications":
      return resume.certifications.some((item) => item.name.trim());
    case "languages":
      return resume.languages.some((item) => item.name.trim());
    case "awards":
      return resume.awards.some((item) => item.title.trim());
    case "custom":
      return resume.customSections.some(
        (sectionItem) =>
          sectionItem.title.trim() &&
          sectionItem.entries.some((entry) => entry.heading.trim()),
      );
    case "settings":
      return Boolean(resume.settings.resumeName.trim());
    default:
      return false;
  }
}

export function isToggleableSection(
  section: SectionId,
): section is ToggleableSectionId {
  return (TOGGLEABLE_SECTION_IDS as readonly string[]).includes(section);
}

export function cloneResume(resume: Resume, resumeName?: string): Resume {
  const copy = structuredClone(resume);
  copy.id = createId();
  copy.updatedAt = new Date().toISOString();
  copy.settings.resumeName = resumeName ?? `${resume.settings.resumeName} copy`;
  return copy;
}

export function isTemplateId(value: string | null): value is TemplateId {
  return value === "classic-ats" ||
    value === "modern-professional" ||
    value === "compact-tech";
}
