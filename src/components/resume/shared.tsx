import type { ReactNode } from "react";
import {
  displayUrl,
  formatDateRange,
  LANGUAGE_LEVEL_LABELS,
} from "@/features/resume/resume.utils";
import type { PersonalDetails, Resume } from "@/features/resume/resume.types";
import { cn } from "@/lib/utils";

/** Section spacing; horizontal rule is only on the heading (border-b). */
export const resumeSectionClass = "resume-section mt-4 mb-2";

const sectionHeadingClass =
  "section-heading mb-1.5 border-b border-neutral-300 pb-1 text-[11px] font-semibold tracking-[0.14em] uppercase";

export function SectionHeading({
  title,
  accent,
  className,
}: {
  title: string;
  accent?: string;
  className?: string;
}) {
  return (
    <h2
      className={cn(sectionHeadingClass, className)}
      style={accent ? { borderColor: accent, color: accent } : undefined}
    >
      {title}
    </h2>
  );
}

export function ResumeSection({
  title,
  children,
  className,
  accent,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  accent?: string;
}) {
  if (!children) return null;
  return (
    <section className={cn(resumeSectionClass, "resume-entry", className)}>
      <SectionHeading title={title} accent={accent} />
      {children}
    </section>
  );
}

export function BulletList({ items }: { items: string[] }) {
  const cleaned = items.filter((item) => item.trim());
  if (cleaned.length === 0) return null;
  return (
    <ul className="mt-1 list-disc space-y-0.5 pl-4">
      {cleaned.map((item, index) => (
        <li key={`bullet-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

export function DateRangeText({
  startDate,
  endDate,
  current,
}: {
  startDate: string;
  endDate: string;
  current?: boolean;
}) {
  const value = formatDateRange(startDate, endDate, current);
  if (!value) return null;
  return <span>{value}</span>;
}

export function ContactBits({ personal }: { personal: PersonalDetails }) {
  const items = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin ? displayUrl(personal.linkedin) : "",
    personal.github ? displayUrl(personal.github) : "",
    personal.portfolio ? displayUrl(personal.portfolio) : "",
  ].filter(Boolean);
  return items;
}

export function fontSizeClass(resume: Resume): string {
  if (resume.settings.fontSize === "small") return "text-[10px] leading-4";
  if (resume.settings.fontSize === "large") return "text-[12.5px] leading-[1.45]";
  return "text-[11px] leading-[1.4]";
}

export function languageLabel(value: string): string {
  return LANGUAGE_LEVEL_LABELS[value] ?? value;
}

export function visible(resume: Resume, key: keyof Resume["settings"]["sectionVisibility"]) {
  return resume.settings.sectionVisibility[key];
}
