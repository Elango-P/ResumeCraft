import { describe, expect, it } from "vitest";
import { createDemoResume } from "./demo-resume";
import { createEmptyResume } from "./resume.utils";
import { scoreResume } from "./scoring";

describe("scoreResume", () => {
  it("flags an empty resume with errors and a low score", () => {
    const result = scoreResume(createEmptyResume());
    const ids = result.issues.map((issue) => issue.id);

    expect(result.score).toBeLessThan(50);
    expect(result.isReadyToDownload).toBe(false);
    expect(ids).toContain("missing-email");
    expect(ids).toContain("missing-phone");
    expect(ids).toContain("missing-summary");
    expect(ids).toContain("no-experience-or-projects");
    expect(ids).toContain("missing-skills");
    expect(ids).toContain("missing-title");
  });

  it("marks the demo resume as complete enough to download", () => {
    const result = scoreResume(createDemoResume());
    expect(result.isReadyToDownload).toBe(true);
    expect(result.score).toBeGreaterThan(80);
    expect(result.issues.some((issue) => issue.id === "ready")).toBe(true);
    expect(result.estimatedPages).toBeGreaterThanOrEqual(1);
    expect(result.estimatedPages).toBeLessThanOrEqual(2);
  });

  it("warns about first-person bullets and missing action verbs", () => {
    const resume = createEmptyResume();
    resume.personal = {
      ...resume.personal,
      fullName: "Test User",
      jobTitle: "Developer",
      email: "test@example.com",
      phone: "1234567890",
    };
    resume.summary =
      "Software developer with experience shipping web applications for product teams.";
    resume.skills[0].skills = ["React.js", "Node.js", "PostgreSQL", "AWS", "TypeScript"];
    resume.experience = [
      {
        id: "exp-1",
        jobTitle: "Developer",
        company: "Acme",
        employmentType: "full-time",
        location: "Remote",
        startDate: "2022-01",
        endDate: "",
        current: true,
        description: [
          "I worked on the dashboard and my tasks included meetings.",
          "I helped my team with daily standups and planning.",
          "Did some work on the website.",
        ],
      },
    ];

    const result = scoreResume(resume);
    const ids = result.issues.map((issue) => issue.id);
    expect(ids).toContain("first-person");
    expect(ids).toContain("weak-verbs");
    expect(ids).toContain("no-metrics");
  });

  it("asks for more bullets on the latest role", () => {
    const resume = createDemoResume();
    resume.experience[0].description = ["Built a feature."];
    const result = scoreResume(resume);
    expect(result.issues.some((issue) => issue.id === "few-bullets")).toBe(true);
  });
});
