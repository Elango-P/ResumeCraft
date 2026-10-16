import type { Resume } from "@/features/resume/resume.types";

export type ScoreCategory = "impact" | "parsability" | "skills" | "readability";

export type IssueSeverity = "critical" | "warning" | "suggestion" | "success";

export interface CategoryScore {
  id: ScoreCategory;
  name: string;
  score: number; // 0 to 25
  maxScore: number; // 25
  percentage: number; // 0 to 100
  status: "excellent" | "good" | "needs-work" | "poor";
  summary: string;
}

export interface DetailedScoreIssue {
  id: string;
  category: ScoreCategory;
  severity: IssueSeverity;
  title: string;
  message: string;
  whyItMatters: string;
  exampleFix?: string;
  section?: string;
}

export interface BulletAnalysis {
  text: string;
  wordCount: number;
  hasMetric: boolean;
  metricFound?: string;
  startsWithActionVerb: boolean;
  actionVerb?: string;
  isWeakVerb: boolean;
  weakVerb?: string;
  hasFirstPerson: boolean;
  status: "strong" | "needs-metric" | "weak-verb" | "first-person" | "too-short" | "too-long";
}

export interface TargetJobMatch {
  targetTitle?: string;
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export interface ParsedContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface DetailedResumeAnalysis {
  overallScore: number; // 0 to 100
  grade: {
    letter: "A+" | "A" | "B" | "C" | "D";
    label: string;
    description: string;
    badgeVariant: "default" | "secondary" | "destructive" | "outline";
    colorClass: string;
    interviewProbability: string;
  };
  categories: Record<ScoreCategory, CategoryScore>;
  stats: {
    wordCount: number;
    estimatedPages: number;
    readingTimeSeconds: number;
    bulletCount: number;
    quantifiedBulletCount: number;
    quantifiedPercentage: number;
    actionVerbBulletCount: number;
    actionVerbPercentage: number;
    firstPersonCount: number;
    hardSkillsFound: string[];
    softSkillsFound: string[];
    buzzwordsFound: { word: string; suggestion: string }[];
    fleschReadingEase: number;
    fleschGradeLevel: string;
  };
  issues: DetailedScoreIssue[];
  bulletDetails: BulletAnalysis[];
  jobMatch?: TargetJobMatch;
  parsedContact: ParsedContactInfo;
  detectedSections: string[];
  isReadyToApply: boolean;
}

export interface ResumeInputPayload {
  rawText?: string;
  resume?: Resume;
  targetJobTitle?: string;
  targetJobDescription?: string;
}
