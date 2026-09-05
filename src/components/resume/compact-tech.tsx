import type { Resume } from "@/features/resume/resume.types";
import { EMPLOYMENT_TYPE_LABELS, formatMonthYear } from "@/features/resume/resume.utils";
import {
  BulletList,
  ContactBits,
  DateRangeText,
  fontSizeClass,
  languageLabel,
  ResumeSection,
  visible,
} from "./shared";

export function CompactTechTemplate({ resume }: { resume: Resume }) {
  const accent = resume.settings.accentColor;
  const { personal } = resume;
  const contacts = ContactBits({ personal });

  return (
    <article
      className={`resume-sheet px-7 py-6 ${fontSizeClass(resume)} text-neutral-900`}
      style={{ ["--resume-accent" as string]: accent }}
    >
      <header className="resume-entry mb-3 flex items-end justify-between gap-4 border-b-2 pb-2" style={{ borderColor: accent }}>
        <div>
          <h1 className="text-[20px] leading-tight font-bold">{personal.fullName || "Your Name"}</h1>
          <p className="text-[12px] font-medium" style={{ color: accent }}>
            {personal.jobTitle || "Full-Stack Developer"}
          </p>
        </div>
        {contacts.length > 0 ? (
          <p className="max-w-[55%] text-right text-[10px] leading-4 text-neutral-700">
            {contacts.join(" · ")}
          </p>
        ) : null}
      </header>

      {visible(resume, "skills") && resume.skills.some((cat) => cat.skills.length > 0) ? (
        <ResumeSection title="Technical Skills" accent={accent} className="text-[10px] font-bold">
          <div className="space-y-0.5">
            {resume.skills
              .filter((category) => category.skills.length > 0)
              .map((category) => (
                <p key={category.id}>
                  <span className="font-semibold">{category.label}: </span>
                  {category.skills.join(" · ")}
                </p>
              ))}
          </div>
        </ResumeSection>
      ) : null}

      {visible(resume, "summary") && resume.summary.trim() ? (
        <ResumeSection title="Summary" accent={accent} className="text-[10px] font-bold">
          <p>{resume.summary}</p>
        </ResumeSection>
      ) : null}

      {visible(resume, "projects") && resume.projects.length > 0 ? (
        <ResumeSection title="Projects" accent={accent} className="text-[10px] font-bold">
          <div className="space-y-1.5">
            {resume.projects.map((item) => (
              <div key={item.id} className="resume-entry">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-semibold">
                    {item.name}
                    {item.role ? ` · ${item.role}` : ""}
                  </p>
                  {item.technologies.length > 0 ? (
                    <p className="text-[10px] text-neutral-700">{item.technologies.join(", ")}</p>
                  ) : null}
                </div>
                <BulletList items={item.description} />
              </div>
            ))}
          </div>
        </ResumeSection>
      ) : null}

      {visible(resume, "experience") && resume.experience.length > 0 ? (
        <ResumeSection title="Experience" accent={accent} className="text-[10px] font-bold">
          <div className="space-y-2">
            {resume.experience.map((item) => (
              <div key={item.id} className="resume-entry">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-semibold">
                    {item.jobTitle} · {item.company}
                  </p>
                  <DateRangeText
                    startDate={item.startDate}
                    endDate={item.endDate}
                    current={item.current}
                  />
                </div>
                <p className="text-[10px] text-neutral-700">
                  {[EMPLOYMENT_TYPE_LABELS[item.employmentType], item.location]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <BulletList items={item.description} />
              </div>
            ))}
          </div>
        </ResumeSection>
      ) : null}

      {visible(resume, "education") && resume.education.length > 0 ? (
        <ResumeSection title="Education" accent={accent} className="text-[10px] font-bold">
          {resume.education.map((item) => (
            <div key={item.id} className="resume-entry flex items-baseline justify-between gap-3">
              <p>
                <span className="font-semibold">{item.degree}</span>
                {item.institution ? ` · ${item.institution}` : ""}
                {item.grade ? ` · ${item.grade}` : ""}
              </p>
              <DateRangeText startDate={item.startDate} endDate={item.endDate} />
            </div>
          ))}
        </ResumeSection>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        {visible(resume, "certifications") && resume.certifications.length > 0 ? (
          <ResumeSection title="Certifications" accent={accent} className="text-[10px] font-bold">
            {resume.certifications.map((item) => (
              <p key={item.id}>
                {item.name}
                {item.issuer ? ` · ${item.issuer}` : ""}
                {item.date ? ` · ${formatMonthYear(item.date)}` : ""}
              </p>
            ))}
          </ResumeSection>
        ) : null}
        {visible(resume, "languages") && resume.languages.length > 0 ? (
          <ResumeSection title="Languages" accent={accent} className="text-[10px] font-bold">
            <p>
              {resume.languages
                .map((lang) => `${lang.name} (${languageLabel(lang.proficiency)})`)
                .join(" · ")}
            </p>
          </ResumeSection>
        ) : null}
      </div>

      {visible(resume, "awards") && resume.awards.length > 0 ? (
        <ResumeSection title="Awards" accent={accent} className="text-[10px] font-bold">
          {resume.awards.map((item) => (
            <p key={item.id}>
              <span className="font-semibold">{item.title}</span>
              {item.date ? ` · ${formatMonthYear(item.date)}` : ""}
              {item.description ? ` — ${item.description}` : ""}
            </p>
          ))}
        </ResumeSection>
      ) : null}

      {visible(resume, "custom")
        ? resume.customSections.map((section) =>
            section.title.trim() ? (
              <ResumeSection key={section.id} title={section.title} accent={accent} className="text-[10px] font-bold">
                {section.entries.map((entry) => (
                  <div key={entry.id} className="resume-entry">
                    <p className="font-semibold">
                      {entry.heading}
                      {entry.subheading ? ` · ${entry.subheading}` : ""}
                      {entry.date ? ` · ${formatMonthYear(entry.date)}` : ""}
                    </p>
                    <BulletList items={entry.description} />
                  </div>
                ))}
              </ResumeSection>
            ) : null,
          )
        : null}
    </article>
  );
}
