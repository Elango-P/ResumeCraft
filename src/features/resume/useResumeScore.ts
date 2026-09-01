"use client";

import { useMemo } from "react";
import { scoreResume } from "./scoring";
import { useResumeDraft } from "./useResumeDraft";

export function useResumeScore() {
  const { resume } = useResumeDraft();
  return useMemo(() => (resume ? scoreResume(resume) : null), [resume]);
}
