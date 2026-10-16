import type { Resume } from "@/features/resume/resume.types";
import {
  collectResumeText,
  countWords,
  estimatePageCount,
} from "@/features/resume/resume.utils";
import {
  BUZZWORDS_MAP,
  POWER_ACTION_VERBS,
  SECTION_PATTERNS,
  SOFT_SKILLS_KEYWORDS,
  TECH_SKILLS_KEYWORDS,
  WEAK_VERB_PATTERNS,
} from "./constants";
import type {
  BulletAnalysis,
  CategoryScore,
  DetailedResumeAnalysis,
  DetailedScoreIssue,
  ParsedContactInfo,
  ResumeInputPayload,
  ScoreCategory,
  TargetJobMatch,
} from "./scoring-engine.types";

const METRIC_PATTERNS = [
  /\b\d+(\.\d+)?%\b/, // Percentages: 45%, 99.9%
  /\b[\$€£₹]\s?\d+(?:,\d{3})*(?:\.\d+)?(?:\s?(?:k|m|b|million|billion|thousand|lakh|crore))?\b/i, // Currency
  /\b\d+(?:,\d{3})+\b/, // Large numbers with commas: 10,000
  /\b\d+\s?(?:k|m|million|billion)\b/i, // Suffix numbers: 50k, 2M
  /\b\d+x\b/i, // Multipliers: 10x, 3x
  /\b\d+\s*\+\s*(?:users|clients|engineers|customers|services|repos|nodes|teams|projects)\b/i, // Scaled units
  /\b(?:reduced|increased|improved|cut|saved|grew|scaled|accelerated)\s+(?:by\s+)?(?:\$|\d+)/i, // Verb + metric
  /\b(?:latency|load\s*time|costs?|turnaround)\s*(?:by|from|to)\s*\d+/i, // Performance deltas
  /\bp9[0-9]\b/i, // Latency percentiles: p99, p95
  /\b(?:top|first)\s+(?:10|5|1)%?\b/i, // Ranking
];

const FIRST_PERSON_REGEX = /\b(i|me|my|mine|we|our|ours|us)\b/i;

function cleanWord(str: string): string {
  return str.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  const cleaned = w.replace(/(?:[^laeiouy]|ed|es|e)$/, "").replace(/^y/, "");
  const matches = cleaned.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

function calculateFleschScore(text: string): { score: number; label: string } {
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (words.length < 5 || sentences.length === 0) {
    return { score: 65, label: "Standard Professional" };
  }

  const totalWords = words.length;
  const totalSentences = Math.max(1, sentences.length);
  let totalSyllables = 0;
  for (const w of words) {
    totalSyllables += countSyllables(w);
  }

  // Flesch Reading Ease Formula
  const score =
    206.835 -
    1.015 * (totalWords / totalSentences) -
    84.6 * (totalSyllables / totalWords);
  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  let label = "Standard Professional";
  if (clamped >= 70) label = "Easy to Read";
  else if (clamped >= 50) label = "Standard Professional";
  else if (clamped >= 30) label = "Dense / Technical";
  else label = "Overly Complex";

  return { score: clamped, label };
}

export function extractContactInfo(text: string): ParsedContactInfo {
  const info: ParsedContactInfo = {};

  // Email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  if (emailMatch) info.email = emailMatch[0];

  // Phone
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/);
  if (phoneMatch) info.phone = phoneMatch[0];

  // LinkedIn
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) info.linkedin = linkedinMatch[0];

  // GitHub
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  if (githubMatch) info.github = githubMatch[0];

  // Portfolio / Website (non-linkedin, non-github)
  const portfolioMatch = text.match(/(?:https?:\/\/)(?!(?:www\.)?(?:linkedin|github)\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/i);
  if (portfolioMatch) info.portfolio = portfolioMatch[0];

  // Location heuristic: City, ST or City, Country
  const locationMatch = text.match(/\b([A-Z][a-zA-Z\s.-]+),\s*([A-Z]{2}|[A-Z][a-zA-Z]+)\b/);
  if (locationMatch && !locationMatch[0].includes("University") && !locationMatch[0].includes("Company")) {
    info.location = locationMatch[0];
  }

  // Name heuristic: usually the first non-empty line without symbols or "resume"
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 4)) {
    if (
      line.length >= 3 &&
      line.length <= 40 &&
      !line.includes("@") &&
      !line.includes("http") &&
      !line.includes("Resume") &&
      !line.includes("Curriculum") &&
      !line.match(/\d/)
    ) {
      info.name = line;
      break;
    }
  }

  return info;
}

export function extractSectionsFromText(text: string): {
  detected: string[];
  sections: Record<string, string>;
} {
  const lines = text.split("\n");
  const detected: string[] = [];
  const sections: Record<string, string[]> = {};
  let currentSection = "header";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line matches a known section header
    let matchedHeader: string | null = null;
    for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (pattern.test(trimmed)) {
        matchedHeader = key;
        break;
      }
    }

    if (matchedHeader) {
      currentSection = matchedHeader;
      if (!detected.includes(matchedHeader)) {
        detected.push(matchedHeader);
      }
      sections[currentSection] = sections[currentSection] ?? [];
    } else {
      sections[currentSection] = sections[currentSection] ?? [];
      sections[currentSection].push(trimmed);
    }
  }

  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(sections)) {
    result[k] = v.join("\n");
  }

  return { detected, sections: result };
}

export function extractBulletsFromText(text: string): string[] {
  const { sections } = extractSectionsFromText(text);
  
  // Prefer bullets from experience and projects sections if detected
  const expAndProjText = [
    sections["experience"] ?? "",
    sections["projects"] ?? "",
  ].filter(Boolean).join("\n");

  const sourceText = expAndProjText.trim().length > 40 ? expAndProjText : text;
  const lines = sourceText.split("\n").map((l) => l.trim()).filter(Boolean);
  const bullets: string[] = [];

  for (const line of lines) {
    // Skip skill categories or headers like "Languages & Tools:" or "Frontend: React..."
    if (/^(technical\s+skills|skills|languages|education|certifications)/i.test(line)) continue;
    if (/^[a-zA-Z\s&/]+:\s+[a-zA-Z0-9]/.test(line.replace(/^[•\-*–—►▪]\s+/, ""))) continue;

    // Check if line starts with common bullet symbols
    const isBulletSymbol = /^([•\-*–—►▪]|\d+\.)\s+/.test(line);
    const cleaned = line.replace(/^([•\-*–—►▪]|\d+\.)\s+/, "").trim();

    if (isBulletSymbol) {
      if (cleaned.length > 10) bullets.push(cleaned);
    } else {
      // Heuristic: check if line looks like an experience bullet (starts with action verb or capital letter, >25 chars, not a header)
      const firstWord = cleaned.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "") ?? "";
      const isPowerVerb = POWER_ACTION_VERBS.includes(firstWord as (typeof POWER_ACTION_VERBS)[number]);
      if (isPowerVerb && cleaned.length >= 25) {
        bullets.push(cleaned);
      }
    }
  }

  return bullets;
}

export function analyzeSingleBullet(bullet: string): BulletAnalysis {
  const words = bullet.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Check metrics
  let hasMetric = false;
  let metricFound: string | undefined;
  for (const pattern of METRIC_PATTERNS) {
    const match = bullet.match(pattern);
    if (match) {
      hasMetric = true;
      metricFound = match[0];
      break;
    }
  }

  // Check action verbs
  const firstWord = cleanWord(words[0] ?? "");
  const startsWithActionVerb = POWER_ACTION_VERBS.includes(
    firstWord as (typeof POWER_ACTION_VERBS)[number],
  );
  const actionVerb = startsWithActionVerb ? words[0] : undefined;

  // Check weak verbs
  let isWeakVerb = false;
  let weakVerb: string | undefined;
  for (const weak of WEAK_VERB_PATTERNS) {
    if (weak.pattern.test(bullet)) {
      isWeakVerb = true;
      weakVerb = weak.label;
      break;
    }
  }

  // Check first person
  const hasFirstPerson = FIRST_PERSON_REGEX.test(bullet);

  // Status determination
  let status: BulletAnalysis["status"] = "strong";
  if (hasFirstPerson) {
    status = "first-person";
  } else if (isWeakVerb) {
    status = "weak-verb";
  } else if (!hasMetric && wordCount >= 10) {
    status = "needs-metric";
  } else if (wordCount < 8) {
    status = "too-short";
  } else if (wordCount > 38) {
    status = "too-long";
  }

  return {
    text: bullet,
    wordCount,
    hasMetric,
    metricFound,
    startsWithActionVerb,
    actionVerb,
    isWeakVerb,
    weakVerb,
    hasFirstPerson,
    status,
  };
}

export function detectSkillsInText(text: string): {
  hardSkills: string[];
  softSkills: string[];
} {
  const lower = text.toLowerCase();
  const hardSkills: string[] = [];
  const softSkills: string[] = [];

  for (const skill of TECH_SKILLS_KEYWORDS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, "i");
    if (regex.test(lower)) {
      if (!hardSkills.includes(skill)) hardSkills.push(skill);
    }
  }

  for (const skill of SOFT_SKILLS_KEYWORDS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, "i");
    if (regex.test(lower)) {
      if (!softSkills.includes(skill)) softSkills.push(skill);
    }
  }

  return { hardSkills, softSkills };
}

export function detectBuzzwordsInText(text: string): { word: string; suggestion: string }[] {
  const found: { word: string; suggestion: string }[] = [];
  const lower = text.toLowerCase();

  for (const [buzzword, suggestion] of Object.entries(BUZZWORDS_MAP)) {
    const regex = new RegExp(`\\b${buzzword}\\b`, "i");
    if (regex.test(lower)) {
      found.push({ word: buzzword, suggestion });
    }
  }

  return found;
}

export function matchJobDescription(
  resumeText: string,
  jobDescription?: string,
  jobTitle?: string,
): TargetJobMatch | undefined {
  if (!jobDescription?.trim() && !jobTitle?.trim()) return undefined;

  const jdText = `${jobTitle ?? ""} ${jobDescription ?? ""}`.trim();
  const jdSkills = detectSkillsInText(jdText);
  const resumeSkills = detectSkillsInText(resumeText);

  const allJdKeywords = Array.from(new Set([...jdSkills.hardSkills, ...jdSkills.softSkills]));
  const resumeSkillsSet = new Set(
    [...resumeSkills.hardSkills, ...resumeSkills.softSkills].map((s) => s.toLowerCase()),
  );

  if (allJdKeywords.length === 0) {
    return {
      targetTitle: jobTitle,
      matchPercentage: 70,
      matchedKeywords: resumeSkills.hardSkills.slice(0, 6),
      missingKeywords: [],
      recommendations: ["Ensure your target job title matches the position explicitly."],
    };
  }

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of allJdKeywords) {
    if (resumeSkillsSet.has(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  const matchPercentage = Math.round(
    (matchedKeywords.length / Math.max(1, allJdKeywords.length)) * 100,
  );

  const recommendations: string[] = [];
  if (missingKeywords.length > 0) {
    recommendations.push(
      `Incorporate missing skills you have experience with: ${missingKeywords.slice(0, 4).join(", ")}.`,
    );
  }
  if (jobTitle && !resumeText.toLowerCase().includes(jobTitle.toLowerCase())) {
    recommendations.push(
      `Align your headline or professional summary with the exact title "${jobTitle}".`,
    );
  }

  return {
    targetTitle: jobTitle,
    matchPercentage,
    matchedKeywords,
    missingKeywords,
    recommendations,
  };
}

export function convertResumeToText(resume: Resume): string {
  const parts: string[] = [];

  if (resume.personal.fullName) parts.push(resume.personal.fullName);
  if (resume.personal.jobTitle) parts.push(resume.personal.jobTitle);
  const contacts = [
    resume.personal.email,
    resume.personal.phone,
    resume.personal.location,
    resume.personal.linkedin,
    resume.personal.github,
    resume.personal.portfolio,
  ].filter(Boolean);
  if (contacts.length > 0) parts.push(contacts.join(" | "));

  if (resume.summary) {
    parts.push("\nProfessional Summary");
    parts.push(resume.summary);
  }

  if (resume.experience.length > 0) {
    parts.push("\nWork Experience");
    for (const exp of resume.experience) {
      parts.push(`${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.current ? "Present" : exp.endDate})`);
      for (const bullet of exp.description) {
        if (bullet.trim()) parts.push(`• ${bullet}`);
      }
    }
  }

  if (resume.education.length > 0) {
    parts.push("\nEducation");
    for (const edu of resume.education) {
      parts.push(`${edu.degree} - ${edu.institution}`);
      if (edu.description) parts.push(edu.description);
    }
  }

  if (resume.skills.length > 0) {
    parts.push("\nSkills");
    for (const cat of resume.skills) {
      if (cat.skills.length > 0) {
        parts.push(`${cat.label}: ${cat.skills.join(", ")}`);
      }
    }
  }

  if (resume.projects.length > 0) {
    parts.push("\nProjects");
    for (const proj of resume.projects) {
      parts.push(`${proj.name} - ${proj.role}`);
      if (proj.technologies.length > 0) {
        parts.push(`Tech stack: ${proj.technologies.join(", ")}`);
      }
      for (const bullet of proj.description) {
        if (bullet.trim()) parts.push(`• ${bullet}`);
      }
    }
  }

  return parts.join("\n");
}

export function analyzeResumeData(payload: ResumeInputPayload): DetailedResumeAnalysis {
  let fullText = payload.rawText ?? "";
  let contact: ParsedContactInfo = {};
  let detectedSections: string[] = [];
  let bullets: string[] = [];

  if (payload.resume) {
    fullText = convertResumeToText(payload.resume);
    contact = {
      name: payload.resume.personal.fullName,
      email: payload.resume.personal.email,
      phone: payload.resume.personal.phone,
      location: payload.resume.personal.location,
      linkedin: payload.resume.personal.linkedin,
      github: payload.resume.personal.github,
      portfolio: payload.resume.personal.portfolio,
    };
    detectedSections = ["personal", "summary", "experience", "education", "skills"];
    bullets = [
      ...payload.resume.experience.flatMap((e) => e.description),
      ...payload.resume.projects.flatMap((p) => p.description),
    ].filter((b) => b.trim().length > 0);
  } else {
    contact = extractContactInfo(fullText);
    const parsed = extractSectionsFromText(fullText);
    detectedSections = parsed.detected;
    bullets = extractBulletsFromText(fullText);
  }

  const wordCount = countWords(fullText);
  const estimatedPages = wordCount < 400 ? 1 : wordCount < 850 ? 2 : 3;
  const readingTimeSeconds = Math.max(15, Math.round((wordCount / 220) * 60));

  const bulletDetails = bullets.map(analyzeSingleBullet);
  const bulletCount = bulletDetails.length;
  const quantifiedBullets = bulletDetails.filter((b) => b.hasMetric);
  const actionVerbBullets = bulletDetails.filter((b) => b.startsWithActionVerb);
  const firstPersonBullets = bulletDetails.filter((b) => b.hasFirstPerson);

  const quantifiedPercentage =
    bulletCount > 0 ? Math.round((quantifiedBullets.length / bulletCount) * 100) : 0;
  const actionVerbPercentage =
    bulletCount > 0 ? Math.round((actionVerbBullets.length / bulletCount) * 100) : 0;

  const { hardSkills, softSkills } = detectSkillsInText(fullText);
  const buzzwordsFound = detectBuzzwordsInText(fullText);
  const { score: fleschReadingEase, label: fleschGradeLevel } = calculateFleschScore(fullText);
  const jobMatch = matchJobDescription(fullText, payload.targetJobDescription, payload.targetJobTitle);

  const issues: DetailedScoreIssue[] = [];

  // ==========================================
  // 1. IMPACT & METRICS (Max 25 pts)
  // ==========================================
  let impactScore = 25;

  if (wordCount < 40) {
    impactScore = 0;
    issues.push({
      id: "no-content",
      category: "impact",
      severity: "critical",
      title: "No Resume Content Detected",
      message: "Your resume appears to be empty or contains virtually no text.",
      whyItMatters: "An empty resume cannot be evaluated by recruiters or applicant tracking systems.",
      exampleFix: "Add your work experience, education, and technical skills.",
    });
  } else if (bulletCount === 0) {
    impactScore -= 15;
    issues.push({
      id: "no-bullets",
      category: "impact",
      severity: "critical",
      title: "No Experience Bullet Points Found",
      message: "Recruiters and ATS scanners look for structured bullet points detailing your achievements.",
      whyItMatters: "Bullet points are 400% more readable than paragraph text and allow ATS algorithms to parse accomplishments.",
      exampleFix: "Add 3–5 bullet points per role starting with strong action verbs.",
    });
  } else if (quantifiedPercentage >= 35) {
    issues.push({
      id: "metrics-pass",
      category: "impact",
      severity: "success",
      title: "Exceptional Quantifiable Impact",
      message: `${quantifiedPercentage}% of your bullet points contain tangible metrics, percentages, or scale.`,
      whyItMatters: "Data-driven proof differentiates top 5% candidates from average applicants.",
    });
  } else if (quantifiedPercentage >= 18) {
    impactScore -= 3;
    issues.push({
      id: "metrics-moderate",
      category: "impact",
      severity: "suggestion",
      title: "Add More Quantifiable Metrics",
      message: `${quantifiedPercentage}% of bullets have numbers. Aim for at least 35–40% to maximize recruiter callback rates.`,
      whyItMatters: "Hiring managers look for verifiable proof of business results and technical scale.",
      exampleFix: "Instead of 'Improved page loading speed', write 'Reduced initial page load latency by 42% from 2.8s to 1.6s'.",
    });
  } else {
    impactScore -= 7;
    issues.push({
      id: "metrics-low",
      category: "impact",
      severity: "warning",
      title: "Few or No Measurable Results Found",
      message: `Only ${quantifiedPercentage}% of bullets contain numerical outcomes. Recruiter attention drops significantly without numbers.`,
      whyItMatters: "Bullet points without metrics read like job descriptions rather than personal achievements.",
      exampleFix: "Use the Google XYZ Formula: 'Accomplished [X], as measured by [Y], by doing [Z]'. Example: 'Increased test coverage to 92% by introducing Vitest unit test suites.'",
    });
  }

  // B. Action Verbs evaluation (8 pts)
  if (bulletCount > 0) {
    if (actionVerbPercentage >= 75) {
      issues.push({
        id: "verbs-pass",
        category: "impact",
        severity: "success",
        title: "Strong Action-Oriented Verbs",
        message: `${actionVerbPercentage}% of your bullet points start with high-impact power verbs.`,
        whyItMatters: "Action verbs showcase ownership, initiative, and decisive contribution.",
      });
    } else if (actionVerbPercentage >= 45) {
      impactScore -= 3;
      issues.push({
        id: "verbs-moderate",
        category: "impact",
        severity: "suggestion",
        title: "Strengthen Opening Verbs",
        message: `${actionVerbPercentage}% of bullets lead with action verbs. Replace passive phrasing with decisive verbs.`,
        whyItMatters: "First words of each bullet point receive the highest eye-tracking priority from recruiters.",
        exampleFix: "Replace 'Worked on REST API development' with 'Architected and deployed 14 resilient RESTful endpoints'.",
      });
    } else {
      impactScore -= 6;
      issues.push({
        id: "verbs-weak",
        category: "impact",
        severity: "warning",
        title: "Weak or Missing Action Verbs",
        message: "Most bullet points lack strong opening power verbs like 'Architected', 'Spearheaded', 'Optimized', or 'Scaled'.",
        whyItMatters: "Passive openings make your contributions look subordinate rather than proactive.",
        exampleFix: "Begin bullets with past-tense power verbs: 'Automated CI/CD pipelines', 'Engineered microservices', 'Spearheaded migration'.",
      });
    }
  }

  // C. First Person penalty (4 pts)
  if (firstPersonBullets.length > 0) {
    impactScore -= Math.min(4, firstPersonBullets.length * 2);
    issues.push({
      id: "first-person-used",
      category: "impact",
      severity: "warning",
      title: "First-Person Pronouns Detected",
      message: `Found ${firstPersonBullets.length} bullet point(s) using personal pronouns ('I', 'me', 'my', 'we').`,
      whyItMatters: "Standard professional resume etiquette requires third-person implied style with no personal pronouns.",
      exampleFix: "Change 'I built a dashboard for my team' to 'Built an internal real-time analytics dashboard used by 25 engineers.'",
    });
  }

  // D. Weak Verb Detection (3 pts)
  const weakVerbsFound = bulletDetails.filter((b) => b.isWeakVerb);
  if (weakVerbsFound.length >= 2) {
    impactScore -= 3;
    issues.push({
      id: "passive-phrasing",
      category: "impact",
      severity: "suggestion",
      title: "Replace Passive Phrasing",
      message: `Phrases like 'responsible for' or 'helped with' were found in ${weakVerbsFound.length} place(s).`,
      whyItMatters: "'Responsible for' describes duties assigned to you, not the impact you delivered.",
      exampleFix: "Change 'Responsible for customer issues' to 'Resolved 150+ high-priority technical escalations with a 98% CSAT rating.'",
    });
  }

  impactScore = Math.max(0, Math.min(25, impactScore));

  // ==========================================
  // 2. ATS PARSABILITY & STRUCTURE (Max 25 pts)
  // ==========================================
  let parsabilityScore = 25;

  // Contact checks (7 pts)
  if (!contact.email) {
    parsabilityScore -= 3;
    issues.push({
      id: "missing-email",
      category: "parsability",
      severity: "critical",
      title: "Missing Email Address",
      message: "No valid email address was detected in your contact information.",
      whyItMatters: "Automated ATS filters immediately discard resumes without valid contact endpoints.",
      exampleFix: "Include a clean professional email address (e.g. name@domain.com) at the top.",
    });
  }

  if (!contact.phone) {
    parsabilityScore -= 2;
    issues.push({
      id: "missing-phone",
      category: "parsability",
      severity: "warning",
      title: "Missing Phone Number",
      message: "No phone number was detected in the header.",
      whyItMatters: "Recruiters frequently do initial telephone screens before sending online invitations.",
      exampleFix: "Add a phone number in standard format: +1 (555) 012-3456.",
    });
  }

  if (!contact.name) {
    parsabilityScore -= 2;
    issues.push({
      id: "missing-name",
      category: "parsability",
      severity: "critical",
      title: "Candidate Name Unclear or Missing",
      message: "A distinct candidate name could not be identified at the top of the resume.",
      whyItMatters: "ATS systems parse the top header to establish candidate profiles.",
      exampleFix: "Place your full legal or professional name as the first line of the document.",
    });
  }

  if (contact.email && contact.phone && contact.name) {
    issues.push({
      id: "contact-pass",
      category: "parsability",
      severity: "success",
      title: "Contact Details Complete",
      message: "Name, email, and phone number are formatted cleanly for ATS parsers.",
      whyItMatters: "Ensures recruiters have all essential channels to reach out immediately.",
    });
  }

  // Links check
  if (!contact.linkedin && !contact.github && !contact.portfolio) {
    parsabilityScore -= 1;
    issues.push({
      id: "missing-links",
      category: "parsability",
      severity: "suggestion",
      title: "No Professional Profile Links Found",
      message: "Adding a LinkedIn profile, GitHub repository, or online portfolio URL boosts credibility.",
      whyItMatters: "Over 85% of tech recruiters view LinkedIn or GitHub profiles prior to interview invitations.",
      exampleFix: "Add 'linkedin.com/in/yourname' or 'github.com/yourname' in your contact section.",
    });
  }

  // Section architecture (8 pts)
  const hasExp = detectedSections.includes("experience") || payload.resume?.experience.length! > 0;
  const hasEdu = detectedSections.includes("education") || payload.resume?.education.length! > 0;
  const hasSkills = detectedSections.includes("skills") || hardSkills.length >= 3;
  const hasSummary = detectedSections.includes("summary") || Boolean(payload.resume?.summary);

  if (!hasExp) {
    parsabilityScore -= 4;
    issues.push({
      id: "missing-experience-section",
      category: "parsability",
      severity: "critical",
      title: "Work Experience Section Not Recognized",
      message: "Could not find a standard 'Work Experience' or 'Employment History' section header.",
      whyItMatters: "ATS parsers look for exact section headings to index your career timeline.",
      exampleFix: "Use standard headings like 'Work Experience' or 'Professional Experience'.",
    });
  }

  if (!hasEdu) {
    parsabilityScore -= 2;
    issues.push({
      id: "missing-education-section",
      category: "parsability",
      severity: "warning",
      title: "Education Section Not Recognized",
      message: "No standard 'Education' section heading was found.",
      whyItMatters: "Many corporate screening algorithms verify degree requirements automatically.",
      exampleFix: "Include an 'Education' section with degree, university name, and graduation year.",
    });
  }

  if (!hasSkills) {
    parsabilityScore -= 2;
    issues.push({
      id: "missing-skills-section",
      category: "parsability",
      severity: "critical",
      title: "Dedicated Skills Section Missing",
      message: "A standalone 'Skills' or 'Technologies' section is essential for keyword parsing.",
      whyItMatters: "ATS scanners extract keywords directly from skills categories.",
      exampleFix: "Add a 'Skills' section listing your languages, frameworks, and cloud tools.",
    });
  }

  // Word count evaluation (10 pts)
  if (wordCount < 40) {
    parsabilityScore = 0;
  } else if (wordCount < 180) {
    parsabilityScore -= 6;
    issues.push({
      id: "word-count-very-short",
      category: "parsability",
      severity: "critical",
      title: "Resume is Extremely Short",
      message: `Your resume has only ${wordCount} words. Standard professional resumes range between 450 and 850 words.`,
      whyItMatters: "Resumes under 200 words are often treated as draft fragments or incomplete submissions.",
      exampleFix: "Expand each role with 3–5 accomplishment-focused bullet points and add project details.",
    });
  } else if (wordCount < 350) {
    parsabilityScore -= 2;
    issues.push({
      id: "word-count-short",
      category: "parsability",
      severity: "warning",
      title: "Resume is on the Shorter Side",
      message: `At ${wordCount} words, your resume might leave valuable experience or skills unmentioned.`,
      whyItMatters: "More detailed context increases keyword density and matches more ATS filters.",
      exampleFix: "Add bullet points covering technologies used, system architecture, and team collaboration.",
    });
  } else if (wordCount > 1200) {
    parsabilityScore -= 3;
    issues.push({
      id: "word-count-long",
      category: "parsability",
      severity: "warning",
      title: "Resume May Be Overly Verbose",
      message: `At ${wordCount} words, this resume is likely 3+ pages long. Aim for 450–850 words for 1–2 pages.`,
      whyItMatters: "Recruiters spend 6–8 seconds on initial scans; dense resumes lead to skim fatigue.",
      exampleFix: "Condense roles older than 7–10 years and remove repetitive bullet points.",
    });
  } else {
    issues.push({
      id: "word-count-optimal",
      category: "parsability",
      severity: "success",
      title: "Optimal Length & Word Count",
      message: `${wordCount} words fits comfortably across ${estimatedPages} page${estimatedPages === 1 ? "" : "s"} without truncation.`,
      whyItMatters: "Matches recruiter reading preferences for technical and professional roles.",
    });
  }

  parsabilityScore = Math.max(0, Math.min(25, parsabilityScore));

  // ==========================================
  // 3. SKILLS & KEYWORDS (Max 25 pts)
  // ==========================================
  let skillsScore = 25;

  const totalSkillsCount = hardSkills.length + softSkills.length;

  if (wordCount < 40 || totalSkillsCount === 0) {
    skillsScore = 0;
    issues.push({
      id: "skills-none",
      category: "skills",
      severity: "critical",
      title: "No Technical Skills Found",
      message: "No recognized technical or professional skills were detected.",
      whyItMatters: "Applicant tracking algorithms require skill keyword matching to advance candidates.",
      exampleFix: "Add a dedicated Skills section with your core programming languages, frameworks, and tools.",
    });
  } else if (hardSkills.length >= 8) {
    issues.push({
      id: "skills-rich",
      category: "skills",
      severity: "success",
      title: "Rich Technical Competency Breadth",
      message: `Detected ${hardSkills.length} industry-standard technical skills and tools in your resume.`,
      whyItMatters: "Higher keyword density ensures high relevance scoring across modern ATS parsers.",
    });
  } else if (hardSkills.length >= 4) {
    skillsScore -= 3;
    issues.push({
      id: "skills-moderate",
      category: "skills",
      severity: "suggestion",
      title: "Add More Core Technical Skills",
      message: `Detected ${hardSkills.length} technical skills. Expanding to 8–15 relevant tools increases matching probability.`,
      whyItMatters: "Recruiters filter candidate pools by querying specific toolchains and databases.",
      exampleFix: "List databases (e.g. PostgreSQL, Redis), cloud services (AWS, Docker), and testing tools (Jest, Playwright).",
    });
  } else {
    skillsScore -= 8;
    issues.push({
      id: "skills-sparse",
      category: "skills",
      severity: "critical",
      title: "Few Technical Skills Detected",
      message: `Only ${hardSkills.length} technical keywords were detected. This significantly lowers ATS search rank.`,
      whyItMatters: "Applicant Tracking Systems rank candidates primarily on matching required technical keywords.",
      exampleFix: "Group skills into categories: Frontend, Backend, Databases, Cloud & DevOps, Testing, and Methodologies.",
    });
  }

  // Soft skills balance (4 pts)
  if (wordCount >= 40 && totalSkillsCount > 0) {
    if (softSkills.length >= 1) {
      issues.push({
        id: "soft-skills-pass",
        category: "skills",
        severity: "success",
        title: "Balanced Leadership & Soft Competencies",
        message: `Included competencies like ${softSkills.slice(0, 3).join(", ")}.`,
        whyItMatters: "Shows interpersonal impact, mentorship, and cross-functional leadership.",
      });
    } else {
      skillsScore -= 2;
      issues.push({
        id: "soft-skills-low",
        category: "skills",
        severity: "suggestion",
        title: "Highlight Cross-Functional & Soft Skills",
        message: "Integrate skills such as 'Cross-functional Collaboration', 'Mentorship', or 'Agile Methodologies'.",
        whyItMatters: "Hiring managers look for engineering maturity and team synergy.",
        exampleFix: "Include bullet points demonstrating code reviews, sprint leadership, or stakeholder updates.",
      });
    }
  }

  // Job Description Matching impact (if JD provided)
  if (jobMatch) {
    if (jobMatch.matchPercentage >= 75) {
      issues.push({
        id: "jd-match-high",
        category: "skills",
        severity: "success",
        title: `High Target Role Match (${jobMatch.matchPercentage}%)`,
        message: `Your resume aligns strongly with key requirements: ${jobMatch.matchedKeywords.slice(0, 5).join(", ")}.`,
        whyItMatters: "High keyword alignment places your resume in the top tier of automated ATS rankings.",
      });
    } else if (jobMatch.matchPercentage >= 50) {
      skillsScore -= 2;
      issues.push({
        id: "jd-match-med",
        category: "skills",
        severity: "suggestion",
        title: `Moderate Job Description Match (${jobMatch.matchPercentage}%)`,
        message: `Matched ${jobMatch.matchedKeywords.length} keywords, but missing ${jobMatch.missingKeywords.length} key skills.`,
        whyItMatters: "Closing the keyword gap moves your resume past automated rejection thresholds.",
        exampleFix: `Consider adding: ${jobMatch.missingKeywords.slice(0, 4).join(", ")}.`,
      });
    } else {
      skillsScore -= 5;
      issues.push({
        id: "jd-match-low",
        category: "skills",
        severity: "warning",
        title: `Low Target Role Keyword Alignment (${jobMatch.matchPercentage}%)`,
        message: `Your resume is missing critical keywords from the job description: ${jobMatch.missingKeywords.slice(0, 5).join(", ")}.`,
        whyItMatters: "Recruiters configure ATS systems to filter out resumes scoring under 60% keyword match.",
        exampleFix: "Review the missing keywords checklist and weave them into your experience bullets.",
      });
    }
  }

  skillsScore = Math.max(0, Math.min(25, skillsScore));

  // ==========================================
  // 4. BREVITY & READABILITY (Max 25 pts)
  // ==========================================
  let readabilityScore = 25;

  if (wordCount < 40) {
    readabilityScore = 0;
  } else {
    // Summary quality (7 pts)
    const summaryText = payload.resume?.summary ?? "";
    if (hasSummary) {
      const summaryWords = countWords(summaryText || fullText.slice(0, 400));
      if (summaryWords >= 25 && summaryWords <= 100) {
        issues.push({
          id: "summary-good",
          category: "readability",
          severity: "success",
          title: "Concise Professional Summary",
          message: "Your summary provides a quick, high-impact elevator pitch for recruiters.",
          whyItMatters: "Hook recruiters in the first 3 seconds before they skim your work experience.",
        });
      } else if (summaryWords < 25) {
        readabilityScore -= 2;
        issues.push({
          id: "summary-short",
          category: "readability",
          severity: "suggestion",
          title: "Expand Professional Summary",
          message: "Your summary is quite brief. Aim for 2–4 lines highlighting years of experience and core specialties.",
          whyItMatters: "A well-crafted summary establishes your seniority level and domain authority immediately.",
          exampleFix: "Structure: '[Title] with [X] years experience building [Stack/Domain]. Proven track record of [Key Impact].'",
        });
      } else {
        readabilityScore -= 2;
        issues.push({
          id: "summary-long",
          category: "readability",
          severity: "suggestion",
          title: "Tighten Professional Summary",
          message: "Summary is slightly long. Keep it under 4 punchy sentences to prevent visual crowding.",
          whyItMatters: "Overly long summaries push valuable work experience below the first screen fold.",
        });
      }
    } else {
      readabilityScore -= 4;
      issues.push({
        id: "summary-missing",
        category: "readability",
        severity: "warning",
        title: "Missing Professional Summary",
        message: "No opening professional summary or profile statement was found.",
        whyItMatters: "Gives recruiters immediate context on your career specialization and seniority.",
        exampleFix: "Add a 3-line summary: 'Full-stack software engineer with 4+ years building high-throughput web applications with Next.js and TypeScript.'",
      });
    }

    // Clichés & Buzzwords (6 pts)
    if (buzzwordsFound.length > 0) {
      readabilityScore -= Math.min(6, buzzwordsFound.length * 2);
      const wordsList = buzzwordsFound.map((b) => `"${b.word}"`).join(", ");
      issues.push({
        id: "buzzwords-detected",
        category: "readability",
        severity: "warning",
        title: "Overused Clichés or Buzzwords Detected",
        message: `Found filler phrases: ${wordsList}. Recruiters view these as generic claims rather than actual achievements.`,
        whyItMatters: "Replacing buzzwords with quantifiable accomplishments makes your resume stand out.",
        exampleFix: buzzwordsFound[0]?.suggestion ?? "Show specific measurable output instead of generic claims.",
      });
    } else {
      issues.push({
        id: "buzzwords-clean",
        category: "readability",
        severity: "success",
        title: "Zero Fluff or Generic Clichés",
        message: "Free of overused buzzwords like 'team player', 'hard worker', or 'think outside the box'.",
        whyItMatters: "Signals authenticity, professionalism, and high communication standards.",
      });
    }

    // Readability / Sentence Complexity (7 pts)
    if (fleschReadingEase >= 25 && fleschReadingEase <= 80) {
      issues.push({
        id: "readability-pass",
        category: "readability",
        severity: "success",
        title: "Strong Professional Readability",
        message: `Reading ease score of ${fleschReadingEase}/100 (${fleschGradeLevel}). Well-structured professional phrasing.`,
        whyItMatters: "Easy-to-scan bullet points reduce cognitive fatigue during rapid recruiter reviews.",
      });
    } else if (fleschReadingEase < 25) {
      readabilityScore -= 3;
      issues.push({
        id: "readability-dense",
        category: "readability",
        severity: "suggestion",
        title: "Complex or Run-on Sentences",
        message: `Reading ease score is ${fleschReadingEase}/100 (${fleschGradeLevel}). Some sentences are dense.`,
        whyItMatters: "Long compound sentences are often skimmed over or misread.",
        exampleFix: "Break compound sentences into shorter, single-idea bullet points (15–25 words each).",
      });
    }

    // Bullet Length Consistency (5 pts)
    const tooShortBullets = bulletDetails.filter((b) => b.wordCount < 6);
    const tooLongBullets = bulletDetails.filter((b) => b.wordCount > 35);
    if (tooShortBullets.length >= 2) {
      readabilityScore -= 2;
      issues.push({
        id: "bullets-too-short",
        category: "readability",
        severity: "suggestion",
        title: "Some Bullets Lack Context",
        message: `${tooShortBullets.length} bullet point(s) have fewer than 6 words and lack sufficient technical detail.`,
        whyItMatters: "Ultra-brief bullets fail to convey the scale, tech stack, or result of your work.",
        exampleFix: "Expand short bullets with the tech stack used and business outcome achieved.",
      });
    }
    if (tooLongBullets.length >= 2) {
      readabilityScore -= 2;
      issues.push({
        id: "bullets-too-long",
        category: "readability",
        severity: "suggestion",
        title: "Some Bullets Are Too Long",
        message: `${tooLongBullets.length} bullet point(s) exceed 35 words. These turn into walls of text.`,
        whyItMatters: "Recruiters rarely read past the second line of any individual bullet.",
        exampleFix: "Split long bullets into two distinct bullet points highlighting different phases or wins.",
      });
    }
  }

  readabilityScore = Math.max(0, Math.min(25, readabilityScore));

  // ==========================================
  // FINAL SCORE & GRADE CALCULATION
  // ==========================================
  const overallScore = Math.max(
    0,
    Math.min(100, Math.round(impactScore + parsabilityScore + skillsScore + readabilityScore)),
  );

  let gradeLetter: "A+" | "A" | "B" | "C" | "D" = "C";
  let gradeLabel = "Needs Work";
  let gradeDesc = "Significant gaps in metrics, keywords, or structure.";
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "destructive";
  let colorClass = "text-rose-600 dark:text-rose-400";
  let interviewProbability = "10–25% (High ATS Filter Risk)";

  if (overallScore >= 90) {
    gradeLetter = "A+";
    gradeLabel = "Interview Ready · Top 5%";
    gradeDesc = "Exceptional quantified impact, optimal formatting, and dense relevant keywords.";
    badgeVariant = "default";
    colorClass = "text-emerald-600 dark:text-emerald-400";
    interviewProbability = "80–95% (Strong Callback Likelihood)";
  } else if (overallScore >= 80) {
    gradeLetter = "A";
    gradeLabel = "Competitive · Top 15%";
    gradeDesc = "Strong resume that passes most ATS filters. A few metric or keyword tweaks will maximize interviews.";
    badgeVariant = "default";
    colorClass = "text-teal-600 dark:text-teal-400";
    interviewProbability = "65–80% (Competitive ATS Pass Rate)";
  } else if (overallScore >= 70) {
    gradeLetter = "B";
    gradeLabel = "Above Average";
    gradeDesc = "Good baseline, but missing quantifiable metrics or key technical keywords required by recruiters.";
    badgeVariant = "secondary";
    colorClass = "text-amber-600 dark:text-amber-400";
    interviewProbability = "40–60% (Moderate ATS Pass Rate)";
  } else if (overallScore >= 55) {
    gradeLetter = "C";
    gradeLabel = "Needs Improvement";
    gradeDesc = "High risk of automated rejection. Bullet points lack metrics or structure requires reorganization.";
    badgeVariant = "outline";
    colorClass = "text-orange-600 dark:text-orange-400";
    interviewProbability = "25–40% (Below Average Callback Rate)";
  }

  const getStatus = (score: number): CategoryScore["status"] => {
    if (score >= 21) return "excellent";
    if (score >= 17) return "good";
    if (score >= 13) return "needs-work";
    return "poor";
  };

  const categories: Record<ScoreCategory, CategoryScore> = {
    impact: {
      id: "impact",
      name: "Impact & Quantifiable Metrics",
      score: impactScore,
      maxScore: 25,
      percentage: Math.round((impactScore / 25) * 100),
      status: getStatus(impactScore),
      summary:
        impactScore >= 20
          ? "Exceptional use of numbers, scale, and action verbs."
          : "Needs more quantifiable outcomes and stronger power verbs.",
    },
    parsability: {
      id: "parsability",
      name: "ATS Parsability & Structure",
      score: parsabilityScore,
      maxScore: 25,
      percentage: Math.round((parsabilityScore / 25) * 100),
      status: getStatus(parsabilityScore),
      summary:
        parsabilityScore >= 20
          ? "Standard section hierarchy and complete contact information."
          : "Formatting or contact information gaps detected.",
    },
    skills: {
      id: "skills",
      name: "Skills & Keywords Match",
      score: skillsScore,
      maxScore: 25,
      percentage: Math.round((skillsScore / 25) * 100),
      status: getStatus(skillsScore),
      summary:
        skillsScore >= 20
          ? "Broad domain keyword coverage matching hiring algorithms."
          : "Keyword density is lower than benchmark for target positions.",
    },
    readability: {
      id: "readability",
      name: "Brevity & Readability",
      score: readabilityScore,
      maxScore: 25,
      percentage: Math.round((readabilityScore / 25) * 100),
      status: getStatus(readabilityScore),
      summary:
        readabilityScore >= 20
          ? "Crisp, easy-to-scan prose free of clichés."
          : "Some sentences or bullet points are dense or use filler words.",
    },
  };

  const isReadyToApply = !issues.some((i) => i.severity === "critical") && overallScore >= 75;

  return {
    overallScore,
    grade: {
      letter: gradeLetter,
      label: gradeLabel,
      description: gradeDesc,
      badgeVariant,
      colorClass,
      interviewProbability,
    },
    categories,
    stats: {
      wordCount,
      estimatedPages,
      readingTimeSeconds,
      bulletCount,
      quantifiedBulletCount: quantifiedBullets.length,
      quantifiedPercentage,
      actionVerbBulletCount: actionVerbBullets.length,
      actionVerbPercentage,
      firstPersonCount: firstPersonBullets.length,
      hardSkillsFound: hardSkills,
      softSkillsFound: softSkills,
      buzzwordsFound,
      fleschReadingEase,
      fleschGradeLevel,
    },
    issues,
    bulletDetails,
    jobMatch,
    parsedContact: contact,
    detectedSections,
    isReadyToApply,
  };
}
