import type { ReactNode } from "react";
import {
  displayUrl,
  formatDateRange,
  LANGUAGE_LEVEL_LABELS,
} from "@/features/resume/resume.utils";
import type { PersonalDetails, Resume } from "@/features/resume/resume.types";
import { cn } from "@/lib/utils";

export function ResumeSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <section className={cn("resume-entry mb-3", className)}>
      <h2 className="mb-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase">
        {title}
      </h2>
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
