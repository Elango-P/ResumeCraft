"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { FormField, SectionIntro, Tips } from "@/components/builder/form-field";
import { summarySchema } from "@/features/resume/resume.schema";
import { useResumeDraft } from "@/features/resume/useResumeDraft";

const PLACEHOLDER =
  "Full-stack developer with 5+ years of experience building production web products with React, Next.js, Node.js, and PostgreSQL. Comfortable owning features from API design through UI delivery.";

export function SummaryForm() {
  const { resume, updateResume } = useResumeDraft();
  const form = useForm({
    resolver: zodResolver(summarySchema),
    defaultValues: { summary: resume.summary },
    mode: "onChange",
  });

  useEffect(() => {
    const sub = form.watch((value) => {
      updateResume((current) => ({ ...current, summary: value.summary ?? "" }));
    });
    return () => sub.unsubscribe();
  }, [form, updateResume]);

  const summary = form.watch("summary");

  return (
    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
      <SectionIntro
        title="Professional summary"
        description="Write 2–4 lines that explain who you are, the roles you target, and the impact you bring."
      />
      <FormField
        label="Summary"
        htmlFor="summary"
        error={form.formState.errors.summary?.message}
      >
        <Textarea
          id="summary"
          rows={6}
          placeholder={PLACEHOLDER}
          {...form.register("summary")}
        />
      </FormField>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {summary.length} / 800 characters
      </p>
      <Tips
        items={[
          "Lead with your role and years of experience.",
          "Name the stack you want to be hired for, such as React, Node.js, and PostgreSQL.",
          "Mention a measurable outcome if you have one.",
          "Avoid first-person phrases like “I am a passionate developer.”",
        ]}
      />
    </form>
  );
}
