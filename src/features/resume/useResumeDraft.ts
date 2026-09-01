"use client";

import { useMemo } from "react";
import { createDemoResume } from "./demo-resume";
import { useResumeStore } from "./resume.store";
import { isSectionComplete } from "./resume.utils";
import type { Resume, SectionId } from "./resume.types";

export function useResumeDraft() {
  const drafts = useResumeStore((state) => state.drafts);
  const draftOrder = useResumeStore((state) => state.draftOrder);
  const activeDraftId = useResumeStore((state) => state.activeDraftId);
  const activeSection = useResumeStore((state) => state.activeSection);
  const hasHydrated = useResumeStore((state) => state.hasHydrated);
  const isDirty = useResumeStore((state) => state.isDirty);
  const lastSavedAt = useResumeStore((state) => state.lastSavedAt);
  const isSaving = useResumeStore((state) => state.isSaving);
  const previewOpen = useResumeStore((state) => state.previewOpen);
  const updateResume = useResumeStore((state) => state.updateResume);
  const setActiveSection = useResumeStore((state) => state.setActiveSection);
  const setTemplate = useResumeStore((state) => state.setTemplate);
  const createDraft = useResumeStore((state) => state.createDraft);
  const switchDraft = useResumeStore((state) => state.switchDraft);
  const deleteDraft = useResumeStore((state) => state.deleteDraft);
  const resetDemo = useResumeStore((state) => state.resetDemo);
  const setPreviewOpen = useResumeStore((state) => state.setPreviewOpen);

  const resume: Resume = drafts[activeDraftId] ?? createDemoResume();
  const draftList = useMemo(
    () => draftOrder.map((id) => drafts[id]).filter((item): item is Resume => Boolean(item)),
    [draftOrder, drafts],
  );

  const completion = useMemo(() => {
    if (!resume) return {} as Record<SectionId, boolean>;
    return {
      personal: isSectionComplete(resume, "personal"),
      summary: isSectionComplete(resume, "summary"),
      experience: isSectionComplete(resume, "experience"),
      education: isSectionComplete(resume, "education"),
      skills: isSectionComplete(resume, "skills"),
      projects: isSectionComplete(resume, "projects"),
      certifications: isSectionComplete(resume, "certifications"),
      languages: isSectionComplete(resume, "languages"),
      awards: isSectionComplete(resume, "awards"),
      custom: isSectionComplete(resume, "custom"),
      settings: isSectionComplete(resume, "settings"),
    } satisfies Record<SectionId, boolean>;
  }, [resume]);

  return {
    resume,
    draftList,
    activeDraftId,
    activeSection,
    hasHydrated,
    isDirty,
    lastSavedAt,
    isSaving,
    previewOpen,
    completion,
    updateResume,
    setActiveSection,
    setTemplate,
    createDraft,
    switchDraft,
    deleteDraft,
    resetDemo,
    setPreviewOpen,
  };
}
