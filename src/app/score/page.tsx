import type { Metadata } from "next";
import { Suspense } from "react";
import { ScoreCheckerClient } from "./score-checker-client";

export const metadata: Metadata = {
  title: "Free ATS Resume Score Checker | Real & Accurate Evaluation",
  description:
    "Test your resume with our real ATS score checker. Get instant feedback on quantifiable impact, action verbs, keyword gaps, and recruiter formatting.",
  keywords: [
    "resume score checker",
    "ats resume checker",
    "free resume review",
    "resume score",
    "applicant tracking system",
    "resume impact",
    "ats keyword match",
  ],
};

export default function ScoreCheckerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading Resume Score Checker…</div>}>
      <ScoreCheckerClient />
    </Suspense>
  );
}
