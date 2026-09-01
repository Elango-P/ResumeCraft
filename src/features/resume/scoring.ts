import type { Resume, SectionId } from "./resume.types";
import {
  collectResumeText,
  countWords,
  estimatePageCount,
  latestExperience,
  totalSkills,
} from "./resume.utils";

export type ScoreSeverity = "error" | "warning" | "suggestion" | "success";

export interface ScoreIssue {
  id: string;
  severity: ScoreSeverity;
  message: string;
  section?: SectionId;
}

export interface ResumeScore {
  score: number;
  issues: ScoreIssue[];
  estimatedPages: number;
  wordCount: number;
  isReadyToDownload: boolean;
}

export const ACTION_VERBS = [
  "achieved",
  "architected",
  "automated",
  "built",
  "created",
  "delivered",
  "designed",
  "developed",
  "improved",
  "increased",
  "integrated",
  "launched",
  "led",
  "managed",
  "optimized",
  "reduced",
  "shipped",
  "implemented",
  "migrated",
  "mentored",
  "owned",
  "scaled",
  "streamlined",
  "refactored",
  "collaborated",
] as const;

const FIRST_PERSON = /\b(i|me|my|mine|we|our)\b/i;
const METRIC = /\d/;

function firstWord(value: string): string {
  return (
    value
      .trim()
      .split(/\s+/)[0]
      ?.replace(/[^a-zA-Z]/g, "")
      .toLowerCase() ?? ""
  );
}

function allBullets(resume: Resume): string[] {
  return [
    ...resume.experience.flatMap((item) => item.description),
    ...resume.projects.flatMap((item) => item.description),
    ...resume.customSections.flatMap((section) =>
      section.entries.flatMap((entry) => entry.description),
    ),
  ].filter((line) => line.trim().length > 0);
}

export function scoreResume(resume: Resume): ResumeScore {
  const issues: ScoreIssue[] = [];
  let score = 100;
  const wordCount = countWords(collectResumeText(resume));
  const estimatedPages = estimatePageCount(resume);

  const add = (deduction: number, issue: ScoreIssue) => {
    score -= deduction;
    issues.push(issue);
  };

  if (!resume.personal.fullName.trim()) {
    add(8, {
      id: "missing-name",
      severity: "error",
      section: "personal",
      message: "Add your full name so recruiters can identify you.",
    });
  }

  if (!resume.personal.email.trim()) {
    add(15, {
      id: "missing-email",
      severity: "error",
      section: "personal",
      message: "Add an email address so employers can contact you.",
    });
  }

  if (!resume.personal.phone.trim()) {
    add(10, {
      id: "missing-phone",
      severity: "error",
      section: "personal",
      message: "Add a phone number to your contact details.",
    });
  }

  if (!resume.personal.jobTitle.trim()) {
    add(8, {
      id: "missing-title",
      severity: "error",
      section: "personal",
      message: "Add a target job title so the resume has a clear role focus.",
    });
  }

  if (!resume.summary.trim()) {
    add(12, {
      id: "missing-summary",
      severity: "error",
      section: "summary",
      message: "Write a 2–4 line professional summary.",
    });
  } else if (resume.summary.trim().length < 80) {
    add(6, {
      id: "short-summary",
      severity: "warning",
      section: "summary",
      message: "Expand your summary to 2–4 lines that highlight impact and stack.",
    });
  }

  if (resume.experience.length === 0 && resume.projects.length === 0) {
    add(20, {
      id: "no-experience-or-projects",
      severity: "error",
      section: "experience",
      message: "Add work experience or projects so the resume has substance.",
    });
  }

  if (totalSkills(resume) === 0) {
    add(10, {
      id: "missing-skills",
      severity: "error",
      section: "skills",
      message: "Add relevant skills. Recruiters and ATS parsers look for keywords.",
    });
  }

  const latest = latestExperience(resume);
  if (latest && latest.description.length < 3) {
    add(6, {
      id: "few-bullets",
      severity: "warning",
      section: "experience",
      message: "Add at least 3 bullet points to your latest experience.",
    });
  }

  const bullets = allBullets(resume);
  const shortBullets = bullets.filter((line) => countWords(line) < 8);
  if (shortBullets.length >= 2) {
    add(5, {
      id: "short-descriptions",
      severity: "warning",
      section: "experience",
      message:
        "Some descriptions are very short. Add context about what you did and the result.",
    });
  }

  const weakVerbs = bullets.filter((line) => {
    const verb = firstWord(line);
    return verb.length > 0 && !ACTION_VERBS.includes(verb as (typeof ACTION_VERBS)[number]);
  });
  if (bullets.length > 0 && weakVerbs.length / bullets.length >= 0.5) {
    add(5, {
      id: "weak-verbs",
      severity: "warning",
      section: "experience",
      message:
        "Start bullets with action verbs such as Built, Improved, Led, or Optimized.",
    });
  }

  const firstPerson = bullets.filter((line) => FIRST_PERSON.test(line));
  if (firstPerson.length >= 2) {
    add(4, {
      id: "first-person",
      severity: "warning",
      section: "experience",
      message: "Avoid first-person words such as “I” or “my” in bullet points.",
    });
  }

  const withMetrics = bullets.filter((line) => METRIC.test(line));
  if (bullets.length >= 3 && withMetrics.length === 0) {
    add(4, {
      id: "no-metrics",
      severity: "suggestion",
      section: "experience",
      message:
        "Include measurable outcomes such as percentage, revenue, time saved, or users served.",
    });
  }

  if (!resume.personal.linkedin.trim() && !resume.personal.portfolio.trim()) {
    add(3, {
      id: "missing-links",
      severity: "suggestion",
      section: "personal",
      message: "Add a LinkedIn or portfolio URL so reviewers can learn more.",
    });
  }

  if (estimatedPages > 2) {
    add(5, {
      id: "too-long",
      severity: "warning",
      section: "settings",
      message:
        "This resume may run longer than two pages. Tighten older roles or extra sections.",
    });
  } else if (wordCount < 140) {
    add(5, {
      id: "too-short",
      severity: "warning",
      section: "settings",
      message: "Your resume is quite short. Add more detail to experience or projects.",
    });
  }

  const clamped = Math.max(0, Math.min(100, score));
  const isReadyToDownload = !issues.some((issue) => issue.severity === "error");

  if (isReadyToDownload) {
    issues.unshift({
      id: "ready",
      severity: "success",
      message: "Your resume is complete enough to download.",
    });
  }

  return {
    score: clamped,
    issues,
    estimatedPages,
    wordCount,
    isReadyToDownload,
  };
}
