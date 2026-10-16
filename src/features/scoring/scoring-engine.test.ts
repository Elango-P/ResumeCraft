import { describe, expect, it } from "vitest";
import { createDemoResume } from "@/features/resume/demo-resume";
import { createEmptyResume } from "@/features/resume/resume.utils";
import { SAMPLE_RESUMES } from "./sample-resumes";
import {
  analyzeResumeData,
  detectSkillsInText,
  extractContactInfo,
  matchJobDescription,
} from "./scoring-engine";

describe("scoring-engine", () => {
  it("scores the interview-ready sample resume above 88 with high impact", () => {
    const seniorSample = SAMPLE_RESUMES.find((s) => s.id === "senior-fullstack")!;
    const result = analyzeResumeData({
      rawText: seniorSample.text,
      targetJobTitle: seniorSample.targetJobTitle,
      targetJobDescription: seniorSample.targetJobDescription,
    });

    expect(result.overallScore).toBeGreaterThanOrEqual(88);
    expect(result.grade.letter).toMatch(/A\+?/);
    expect(result.categories.impact.score).toBeGreaterThanOrEqual(20);
    expect(result.categories.parsability.score).toBeGreaterThanOrEqual(20);
    expect(result.categories.skills.score).toBeGreaterThanOrEqual(20);
    expect(result.stats.quantifiedPercentage).toBeGreaterThanOrEqual(35);
    expect(result.parsedContact.email).toBe("alex.morgan@techcorp.dev");
    expect(result.parsedContact.phone).toContain("555");
    expect(result.isReadyToApply).toBe(true);
  });

  it("detects issues and gives lower score for the draft resume", () => {
    const draftSample = SAMPLE_RESUMES.find((s) => s.id === "draft-resume")!;
    const result = analyzeResumeData({ rawText: draftSample.text });

    expect(result.overallScore).toBeLessThan(60);
    expect(result.grade.letter).toMatch(/C|D/);
    expect(result.isReadyToApply).toBe(false);
    const issueIds = result.issues.map((i) => i.id);
    expect(issueIds).toContain("first-person-used");
    expect(issueIds).toContain("buzzwords-detected");
    expect(issueIds).toContain("word-count-very-short");
  });

  it("calculates job description keyword match accurately", () => {
    const resumeText = "Experienced with React, Next.js, TypeScript, PostgreSQL, and AWS.";
    const jd = "Looking for a React developer proficient in TypeScript and GraphQL.";
    const match = matchJobDescription(resumeText, jd, "Frontend Engineer");

    expect(match).toBeDefined();
    expect(match!.matchedKeywords).toContain("React");
    expect(match!.matchedKeywords).toContain("TypeScript");
    expect(match!.missingKeywords).toContain("GraphQL");
    expect(match!.matchPercentage).toBeGreaterThanOrEqual(50);
  });

  it("analyzes structured Resume object from ResumeCraft builder correctly", () => {
    const demo = createDemoResume();
    const result = analyzeResumeData({ resume: demo });

    expect(result.overallScore).toBeGreaterThanOrEqual(80);
    expect(result.stats.bulletCount).toBeGreaterThan(0);
    expect(result.parsedContact.email).toBe(demo.personal.email);
  });

  it("handles empty resume gracefully", () => {
    const empty = createEmptyResume();
    const result = analyzeResumeData({ resume: empty });

    expect(result.overallScore).toBeLessThan(50);
    expect(result.isReadyToApply).toBe(false);
  });
});
