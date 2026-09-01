import { describe, expect, it } from "vitest";
import { createDemoResume } from "./demo-resume";
import { optionalEmailSchema, persistedResumeStateSchema, resumeSchema } from "./resume.schema";
import { createEmptyResume } from "./resume.utils";

describe("resumeSchema", () => {
  it("accepts the demo resume", () => {
    const result = resumeSchema.safeParse(createDemoResume());
    expect(result.success).toBe(true);
  });

  it("accepts an empty resume scaffold", () => {
    const result = resumeSchema.safeParse(createEmptyResume());
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(optionalEmailSchema.safeParse("not-an-email").success).toBe(false);
    expect(optionalEmailSchema.safeParse("").success).toBe(true);
    expect(optionalEmailSchema.safeParse("ada@example.com").success).toBe(true);
  });

  it("validates persisted local storage payloads", () => {
    const resume = createDemoResume();
    const result = persistedResumeStateSchema.safeParse({
      version: 1,
      drafts: { [resume.id]: resume },
      draftOrder: [resume.id],
      activeDraftId: resume.id,
      lastSavedAt: null,
    });
    expect(result.success).toBe(true);
  });
});
