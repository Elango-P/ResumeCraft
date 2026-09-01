import type { Resume } from "@/features/resume/resume.types";
import { ClassicAtsTemplate } from "./classic-ats";
import { CompactTechTemplate } from "./compact-tech";
import { ModernProfessionalTemplate } from "./modern-professional";
import { cn } from "@/lib/utils";

export function ResumeDocument({
  resume,
  className,
}: {
  resume: Resume;
  className?: string;
}) {
  return (
    <div className={cn("resume-document bg-white text-neutral-900", className)}>
      {resume.templateId === "modern-professional" ? (
        <ModernProfessionalTemplate resume={resume} />
      ) : resume.templateId === "compact-tech" ? (
        <CompactTechTemplate resume={resume} />
      ) : (
        <ClassicAtsTemplate resume={resume} />
      )}
    </div>
  );
}
