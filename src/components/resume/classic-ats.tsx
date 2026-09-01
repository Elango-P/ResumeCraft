import type { Resume } from "@/features/resume/resume.types";
import { EMPLOYMENT_TYPE_LABELS } from "@/features/resume/resume.utils";
import {
  BulletList,
  ContactBits,
  DateRangeText,
  fontSizeClass,
  languageLabel,
  ResumeSection,
  visible,
} from "./shared";

export function ClassicAtsTemplate({ resume }: { resume: Resume }) {
  const { personal } = resume;
  const contacts = ContactBits({ personal });

  return (
    <article className={`resume-sheet px-8 py-8 ${fontSizeClass(resume)} text-neutral-900`}>
      <header className="resume-entry mb-4 border-b border-neutral-800 pb-3 text-center">
        <h1 className="text-[22px] leading-tight font-bold tracking-tight">
          {personal.fullName || "Your Name"}
        </h1>
        <p className="mt-0.5 text-[12px] font-medium">{personal.jobTitle || "Job Title"}</p>
        {contacts.length > 0 ? (
          <p className="mt-1.5 text-[10.5px] text-neutral-700">{contacts.join("  ·  ")}</p>
        ) : null}
      </header>

      {visible(resume, "summary") && resume.summary.trim() ? (
        <ResumeSection title="Professional Summary">
          <p>{resume.summary}</p>
        </ResumeSection>
      ) : null}

      {visible(resume, "experience") && resume.experience.length > 0 ? (
        <ResumeSection title="Work Experience">
          <div className="space-y-2.5">
            {resume.experience.map((item) => (
              <div key={item.id} className="resume-entry">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-semibold">
                    {item.jobTitle}
                    {item.company ? ` · ${item.company}` : ""}
                  </p>
                  <p className="shrink-0 text-[10.5px] text-neutral-700">
                    <DateRangeText
                      startDate={item.startDate}
                      endDate={item.endDate}
                      current={item.current}
                    />
                  </p>
                </div>
                <p className="text-[10.5px] text-neutral-700">
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

      {visible(resume, "projects") && resume.projects.length > 0 ? (
        <ResumeSection title="Projects">
          <div className="space-y-2">
            {resume.projects.map((item) => (
              <div key={item.id} className="resume-entry">
                <p className="font-semibold">
                  {item.name}
                  {item.role ? ` · ${item.role}` : ""}
                </p>
                {item.technologies.length > 0 ? (
                  <p className="text-[10.5px] text-neutral-700">{item.technologies.join(", ")}</p>
                ) : null}
                <p className="text-[10.5px] text-neutral-700">
                  {[item.projectUrl, item.githubUrl].filter(Boolean).join(" · ")}
                </p>
                <BulletList items={item.description} />
              </div>
            ))}
          </div>
        </ResumeSection>
      ) : null}

      {visible(resume, "education") && resume.education.length > 0 ? (
        <ResumeSection title="Education">
          {resume.education.map((item) => (
            <div key={item.id} className="resume-entry mb-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-semibold">
                  {item.degree}
                  {item.institution ? ` · ${item.institution}` : ""}
                </p>
                <p className="shrink-0 text-[10.5px] text-neutral-700">
                  <DateRangeText startDate={item.startDate} endDate={item.endDate} />
                </p>
              </div>
              <p className="text-[10.5px] text-neutral-700">
                {[item.location, item.grade].filter(Boolean).join(" · ")}
              </p>
              {item.description ? <p className="mt-0.5">{item.description}</p> : null}
            </div>
          ))}
        </ResumeSection>
      ) : null}

      {visible(resume, "skills") && resume.skills.some((cat) => cat.skills.length > 0) ? (
        <ResumeSection title="Skills">
          <div className="space-y-0.5">
            {resume.skills
              .filter((category) => category.skills.length > 0)
              .map((category) => (
                <p key={category.id}>
                  <span className="font-semibold">{category.label}: </span>
                  {category.skills.join(", ")}
                </p>
              ))}
          </div>
        </ResumeSection>
      ) : null}

      {visible(resume, "certifications") && resume.certifications.length > 0 ? (
        <ResumeSection title="Certifications">
          {resume.certifications.map((item) => (
            <p key={item.id} className="resume-entry">
              <span className="font-semibold">{item.name}</span>
              {item.issuer ? ` · ${item.issuer}` : ""}
              {item.date ? ` · ${item.date}` : ""}
            </p>
          ))}
        </ResumeSection>
      ) : null}

      {visible(resume, "languages") && resume.languages.length > 0 ? (
        <ResumeSection title="Languages">
          <p>
            {resume.languages
              .map((item) => `${item.name} (${languageLabel(item.proficiency)})`)
              .join(" · ")}
          </p>
        </ResumeSection>
      ) : null}

      {visible(resume, "awards") && resume.awards.length > 0 ? (
        <ResumeSection title="Awards">
          {resume.awards.map((item) => (
            <p key={item.id} className="resume-entry">
              <span className="font-semibold">{item.title}</span>
              {item.issuer ? ` · ${item.issuer}` : ""}
              {item.description ? ` — ${item.description}` : ""}
            </p>
          ))}
        </ResumeSection>
      ) : null}

      {visible(resume, "custom")
        ? resume.customSections.map((section) =>
            section.title.trim() ? (
              <ResumeSection key={section.id} title={section.title}>
                {section.entries.map((entry) => (
                  <div key={entry.id} className="resume-entry mb-1.5">
                    <p className="font-semibold">
                      {entry.heading}
                      {entry.subheading ? ` · ${entry.subheading}` : ""}
                    </p>
                    {entry.date ? <p className="text-[10.5px]">{entry.date}</p> : null}
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
