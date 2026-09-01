"use client";

import { SECTION_IDS } from "@/features/resume/resume.types";
import type { SectionId } from "@/features/resume/resume.types";
import { PersonalForm } from "./personal-form";
import { SummaryForm } from "./summary-form";
import { ExperienceForm } from "./experience-form";
import { EducationForm } from "./education-form";
import { SkillsForm } from "./skills-form";
import { ProjectsForm } from "./projects-form";
import { CertificationsForm } from "./certifications-form";
import { LanguagesForm } from "./languages-form";
import { AwardsForm } from "./awards-form";
import { CustomForm } from "./custom-form";
import { SettingsForm } from "./settings-form";

export function SectionEditor({ section }: { section: SectionId }) {
  switch (section) {
    case "personal":
      return <PersonalForm />;
    case "summary":
      return <SummaryForm />;
    case "experience":
      return <ExperienceForm />;
    case "education":
      return <EducationForm />;
    case "skills":
      return <SkillsForm />;
    case "projects":
      return <ProjectsForm />;
    case "certifications":
      return <CertificationsForm />;
    case "languages":
      return <LanguagesForm />;
    case "awards":
      return <AwardsForm />;
    case "custom":
      return <CustomForm />;
    case "settings":
      return <SettingsForm />;
    default:
      return null;
  }
}

export function sectionIndex(section: SectionId): number {
  return SECTION_IDS.indexOf(section);
}

export function adjacentSection(section: SectionId, delta: number): SectionId {
  const index = sectionIndex(section);
  const next = Math.min(SECTION_IDS.length - 1, Math.max(0, index + delta));
  return SECTION_IDS[next];
}
