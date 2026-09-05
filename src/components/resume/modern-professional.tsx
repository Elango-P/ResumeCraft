import { FolderGit2, Globe, Link2, Mail, MapPin, Phone } from "lucide-react";
import type { Resume } from "@/features/resume/resume.types";
import {
  displayUrl,
  EMPLOYMENT_TYPE_LABELS,
  formatMonthYear,
} from "@/features/resume/resume.utils";
import {
  BulletList,
  DateRangeText,
  fontSizeClass,
  languageLabel,
  ResumeSection,
  resumeSectionClass,
  SectionHeading,
  visible,
} from "./shared";

export function ModernProfessionalTemplate({ resume }: { resume: Resume }) {
  const accent = resume.settings.accentColor;
  const { personal } = resume;

  return (
    <article
      className={`resume-sheet grid min-h-[297mm] grid-cols-[34%_1fr] ${fontSizeClass(resume)}`}
      style={{ ["--resume-accent" as string]: accent }}
    >
      <aside className="space-y-1 px-5 py-8 text-slate-800">
        <header className="resume-entry pb-3">
          <h1 className="text-[20px] leading-tight font-bold text-slate-900">
            {personal.fullName || "Your Name"}
          </h1>
          <p className="mt-1 text-[12px] font-medium" style={{ color: accent }}>
            {personal.jobTitle || "Job Title"}
          </p>
        </header>
        <section className={`resume-entry ${resumeSectionClass}`}>
          <SectionHeading title="Contact" accent={accent} className="text-[10px]" />
          <ul className="space-y-1.5">
            {personal.email ? (
              <li className="flex items-start gap-1.5">
                <Mail className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                <span>{personal.email}</span>
              </li>
            ) : null}
            {personal.phone ? (
              <li className="flex items-start gap-1.5">
                <Phone className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                <span>{personal.phone}</span>
              </li>
            ) : null}
            {personal.location ? (
              <li className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                <span>{personal.location}</span>
              </li>
            ) : null}
            {personal.linkedin ? (
              <li className="flex items-start gap-1.5">
                <Link2 className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                <span>{displayUrl(personal.linkedin)}</span>
              </li>
            ) : null}
            {personal.github ? (
              <li className="flex items-start gap-1.5">
                <FolderGit2 className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                <span>{displayUrl(personal.github)}</span>
              </li>
            ) : null}
            {personal.portfolio ? (
              <li className="flex items-start gap-1.5">
                <Globe className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                <span>{displayUrl(personal.portfolio)}</span>
              </li>
            ) : null}
          </ul>
        </section>
        {visible(resume, "skills") && resume.skills.some((cat) => cat.skills.length > 0) ? (
          <section className={`resume-entry ${resumeSectionClass}`}>
            <SectionHeading title="Skills" accent={accent} className="text-[10px]" />
            <div className="space-y-2">
              {resume.skills
                .filter((category) => category.skills.length > 0)
                .map((category) => (
                  <div key={category.id}>
                    <p className="font-semibold text-slate-900">{category.label}</p>
                    <p>{category.skills.join(", ")}</p>
                  </div>
                ))}
            </div>
          </section>
        ) : null}
        {visible(resume, "languages") && resume.languages.length > 0 ? (
          <section className={`resume-entry ${resumeSectionClass}`}>
            <SectionHeading title="Languages" accent={accent} className="text-[10px]" />
            <ul className="space-y-1">
              {resume.languages.map((item) => (
                <li key={item.id}>
                  {item.name} · {languageLabel(item.proficiency)}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {visible(resume, "certifications") && resume.certifications.length > 0 ? (
          <section className={`resume-entry ${resumeSectionClass}`}>
            <SectionHeading title="Certifications" accent={accent} className="text-[10px]" />
            <ul className="space-y-1.5">
              {resume.certifications.map((item) => (
                <li key={item.id}>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p>
                    {item.issuer}
                    {item.date ? ` · ${formatMonthYear(item.date)}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </aside>
      <div className="space-y-1 px-6 py-8 text-slate-900">
        {visible(resume, "summary") && resume.summary.trim() ? (
          <ResumeSection title="Summary" accent={accent} className="text-[10px]">
            <p>{resume.summary}</p>
          </ResumeSection>
        ) : null}
        {visible(resume, "experience") && resume.experience.length > 0 ? (
          <ResumeSection title="Experience" accent={accent} className="text-[10px]">
            <div className="space-y-3">
              {resume.experience.map((item) => (
                <div key={item.id} className="resume-entry">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold">{item.jobTitle}</p>
                    <DateRangeText
                      startDate={item.startDate}
                      endDate={item.endDate}
                      current={item.current}
                    />
                  </div>
                  <p className="text-[10.5px]">
                    {[item.company, EMPLOYMENT_TYPE_LABELS[item.employmentType], item.location]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <BulletList items={item.description} />
                </div>
              ))}
            </div>
          </ResumeSection>
        ) : null}
        {visible(resume, "projects") && resume.projects.length > 0 ? (
          <ResumeSection title="Projects" accent={accent} className="text-[10px]">
            <div className="space-y-2.5">
              {resume.projects.map((item) => (
                <div key={item.id} className="resume-entry">
                  <p className="font-semibold">
                    {item.name}
                    {item.role ? ` · ${item.role}` : ""}
                  </p>
                  {item.technologies.length > 0 ? (
                    <p className="text-[10.5px]">{item.technologies.join(" · ")}</p>
                  ) : null}
                  <BulletList items={item.description} />
                </div>
              ))}
            </div>
          </ResumeSection>
        ) : null}
        {visible(resume, "education") && resume.education.length > 0 ? (
          <ResumeSection title="Education" accent={accent} className="text-[10px]">
            {resume.education.map((item) => (
              <div key={item.id} className="resume-entry mb-2">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-semibold">{item.degree}</p>
                  <DateRangeText startDate={item.startDate} endDate={item.endDate} />
                </div>
                <p>
                  {[item.institution, item.location, item.grade].filter(Boolean).join(" · ")}
                </p>
                {item.description ? <p className="mt-0.5">{item.description}</p> : null}
              </div>
            ))}
          </ResumeSection>
        ) : null}
        {visible(resume, "awards") && resume.awards.length > 0 ? (
          <ResumeSection title="Awards" accent={accent} className="text-[10px]">
            {resume.awards.map((item) => (
              <p key={item.id} className="resume-entry">
                <span className="font-semibold">{item.title}</span>
                {item.issuer ? ` · ${item.issuer}` : ""}
                {item.date ? ` · ${formatMonthYear(item.date)}` : ""}
                {item.description ? ` — ${item.description}` : ""}
              </p>
            ))}
          </ResumeSection>
        ) : null}
        {visible(resume, "custom")
          ? resume.customSections.map((section) =>
              section.title.trim() ? (
                <ResumeSection key={section.id} title={section.title} accent={accent} className="text-[10px]">
                  {section.entries.map((entry) => (
                    <div key={entry.id} className="resume-entry mb-2">
                      <p className="font-semibold">
                        {entry.heading}
                        {entry.subheading ? ` · ${entry.subheading}` : ""}
                      </p>
                      {entry.date ? (
                        <p className="text-[10.5px]">{formatMonthYear(entry.date)}</p>
                      ) : null}
                      <BulletList items={entry.description} />
                    </div>
                  ))}
                </ResumeSection>
              ) : null,
            )
          : null}
      </div>
    </article>
  );
}
