import type { Resume } from "@/features/resume/resume.types";
import { EMPLOYMENT_TYPE_LABELS } from "@/features/resume/resume.utils";
import {
  BulletList,
  ContactBits,
  DateRangeText,
  fontSizeClass,
  languageLabel,
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
        <section className="resume-entry mb-2.5">
          <h2 className="mb-1 text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: accent }}>
            Technical Skills
          </h2>
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
        </section>
      ) : null}

      {visible(resume, "summary") && resume.summary.trim() ? (
        <section className="resume-entry mb-2.5">
          <h2 className="mb-1 text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: accent }}>
            Summary
          </h2>
          <p>{resume.summary}</p>
        </section>
      ) : null}

      {visible(resume, "projects") && resume.projects.length > 0 ? (
        <section className="mb-2.5">
          <h2 className="mb-1 text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: accent }}>
            Projects
          </h2>
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
        </section>
      ) : null}

      {visible(resume, "experience") && resume.experience.length > 0 ? (
        <section className="mb-2.5">
          <h2 className="mb-1 text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: accent }}>
            Experience
          </h2>
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
        </section>
      ) : null}

      {visible(resume, "education") && resume.education.length > 0 ? (
        <section className="mb-2.5">
          <h2 className="mb-1 text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: accent }}>
            Education
          </h2>
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
        </section>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        {visible(resume, "certifications") && resume.certifications.length > 0 ? (
          <section className="resume-entry">
            <h2 className="mb-1 text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: accent }}>
              Certifications
            </h2>
            {resume.certifications.map((item) => (
              <p key={item.id}>
                {item.name}
                {item.issuer ? ` · ${item.issuer}` : ""}
              </p>
            ))}
          </section>
        ) : null}
        {visible(resume, "languages") && resume.languages.length > 0 ? (
          <section className="resume-entry">
            <h2 className="mb-1 text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: accent }}>
              Languages
            </h2>
            <p>
              {resume.languages
                .map((item) => `${item.name} (${languageLabel(item.proficiency)})`)
                .join(" · ")}
            </p>
          </section>
        ) : null}
      </div>

      {visible(resume, "awards") && resume.awards.length > 0 ? (
        <section className="resume-entry mt-2.5">
          <h2 className="mb-1 text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: accent }}>
            Awards
          </h2>
          {resume.awards.map((item) => (
            <p key={item.id}>
              <span className="font-semibold">{item.title}</span>
              {item.description ? ` — ${item.description}` : ""}
            </p>
          ))}
        </section>
      ) : null}

      {visible(resume, "custom")
        ? resume.customSections.map((section) =>
            section.title.trim() ? (
              <section key={section.id} className="mt-2.5">
                <h2 className="mb-1 text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: accent }}>
                  {section.title}
                </h2>
                {section.entries.map((entry) => (
                  <div key={entry.id} className="resume-entry">
                    <p className="font-semibold">
                      {entry.heading}
                      {entry.subheading ? ` · ${entry.subheading}` : ""}
                    </p>
                    <BulletList items={entry.description} />
                  </div>
                ))}
              </section>
            ) : null,
          )
        : null}
    </article>
  );
}
