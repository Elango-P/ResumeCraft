"use client";

import { FormField, SectionIntro, Tips } from "@/components/builder/form-field";
import { TagInput } from "@/components/builder/tag-input";
import { SKILL_CATEGORY_IDS } from "@/features/resume/resume.types";
import { useResumeDraft } from "@/features/resume/useResumeDraft";
import { SKILL_SUGGESTIONS } from "@/features/resume/resume.utils";

export function SkillsForm() {
  const { resume, updateResume } = useResumeDraft();

  return (
    <div className="space-y-5">
      <SectionIntro
        title="Skills"
        description="Group skills by category. ATS templates show them as text, never as proficiency bars."
      />
      {SKILL_CATEGORY_IDS.map((id) => {
        const category = resume.skills.find((item) => item.id === id);
        if (!category) return null;
        return (
          <FormField key={id} label={category.label} htmlFor={`skill-${id}`}>
            <TagInput
              id={`skill-${id}`}
              value={category.skills}
              suggestions={SKILL_SUGGESTIONS[id]}
              onChange={(skills) =>
                updateResume((current) => ({
                  ...current,
                  skills: current.skills.map((item) =>
                    item.id === id ? { ...item, skills } : item,
                  ),
                }))
              }
            />
          </FormField>
        );
      })}
      <Tips
        items={[
          "Match keywords from the job description without stuffing.",
          "Put the stack you want to be hired for first.",
          "Skip decorative skill meters; they hurt ATS parsing.",
        ]}
      />
    </div>
  );
}
