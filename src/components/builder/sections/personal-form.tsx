"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormField, SectionIntro } from "@/components/builder/form-field";
import { personalDetailsSchema } from "@/features/resume/resume.schema";
import type { PersonalDetails } from "@/features/resume/resume.types";
import { useResumeDraft } from "@/features/resume/useResumeDraft";

export function PersonalForm() {
  const { resume, updateResume } = useResumeDraft();
  const form = useForm<PersonalDetails>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: resume.personal,
    mode: "onChange",
  });

  useEffect(() => {
    const sub = form.watch((value) => {
      updateResume((current) => ({
        ...current,
        personal: value as PersonalDetails,
      }));
    });
    return () => sub.unsubscribe();
  }, [form, updateResume]);

  const errors = form.formState.errors;
  const showPhoto = form.watch("showPhoto");

  return (
    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
      <SectionIntro
        title="Personal details"
        description="This information appears at the top of your resume. Keep it accurate and easy to parse."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
          <Input id="fullName" autoComplete="name" {...form.register("fullName")} />
        </FormField>
        <FormField label="Job title" htmlFor="jobTitle" error={errors.jobTitle?.message}>
          <Input
            id="jobTitle"
            placeholder="Full-Stack Developer"
            {...form.register("jobTitle")}
          />
        </FormField>
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
        </FormField>
        <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" autoComplete="tel" {...form.register("phone")} />
        </FormField>
        <FormField label="Location" htmlFor="location" className="sm:col-span-2">
          <Input
            id="location"
            placeholder="Bengaluru, India"
            autoComplete="address-level2"
            {...form.register("location")}
          />
        </FormField>
        <FormField label="LinkedIn URL" htmlFor="linkedin" error={errors.linkedin?.message}>
          <Input id="linkedin" type="url" {...form.register("linkedin")} />
        </FormField>
        <FormField label="GitHub URL" htmlFor="github" error={errors.github?.message}>
          <Input id="github" type="url" {...form.register("github")} />
        </FormField>
        <FormField
          label="Portfolio URL"
          htmlFor="portfolio"
          error={errors.portfolio?.message}
          className="sm:col-span-2"
        >
          <Input id="portfolio" type="url" {...form.register("portfolio")} />
        </FormField>
      </div>
      <div className="flex items-start gap-3 rounded-xl border p-4">
        <Checkbox
          id="showPhoto"
          checked={showPhoto}
          onCheckedChange={(checked) => form.setValue("showPhoto", checked === true)}
        />
        <div>
          <label htmlFor="showPhoto" className="text-sm font-medium">
            Include a profile photo
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Disabled by default. Classic ATS never shows a photo, which is safer for most
            applications.
          </p>
        </div>
      </div>
    </form>
  );
}
