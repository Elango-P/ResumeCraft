"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { SortableCard, SortableList } from "@/components/builder/sortable-list";
import { FormField, SectionIntro, Tips } from "@/components/builder/form-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { experienceSchema } from "@/features/resume/resume.schema";
import type { EmploymentType, Experience } from "@/features/resume/resume.types";
import { useResumeDraft } from "@/features/resume/useResumeDraft";
import { useResumeStore } from "@/features/resume/resume.store";
import {
  bulletsToText,
  emptyExperience,
  EMPLOYMENT_TYPE_LABELS,
  reorderById,
  textToBullets,
} from "@/features/resume/resume.utils";

const formSchema = experienceSchema.omit({ description: true }).extend({
  description: z.string(),
});

type ExperienceFormValues = z.infer<typeof formSchema>;

function ExperienceItem({ item }: { item: Experience }) {
  const updateResume = useResumeStore((state) => state.updateResume);
  const duplicateExperience = useResumeStore((state) => state.duplicateExperience);
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...item, description: bulletsToText(item.description) },
    mode: "onChange",
  });

  useEffect(() => {
    const sub = form.watch((value) => {
      updateResume((resume) => ({
        ...resume,
        experience: resume.experience.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                ...(value as ExperienceFormValues),
                id: item.id,
                description: textToBullets(value.description ?? ""),
              }
            : entry,
        ),
      }));
    });
    return () => sub.unsubscribe();
  }, [form, item.id, updateResume]);

  const current = form.watch("current");
  const errors = form.formState.errors;

  return (
    <SortableCard
      id={item.id}
      title={item.jobTitle || item.company || "New role"}
      actions={
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Duplicate experience"
            onClick={() => duplicateExperience(item.id)}
          >
            <Copy className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove experience"
            onClick={() =>
              updateResume((resume) => ({
                ...resume,
                experience: resume.experience.filter((entry) => entry.id !== item.id),
              }))
            }
          >
            <Trash2 className="size-4" />
          </Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Job title" htmlFor={`${item.id}-title`} error={errors.jobTitle?.message}>
          <Input id={`${item.id}-title`} {...form.register("jobTitle")} />
        </FormField>
        <FormField label="Company" htmlFor={`${item.id}-company`}>
          <Input id={`${item.id}-company`} {...form.register("company")} />
        </FormField>
        <FormField label="Employment type">
          <Select
            value={form.watch("employmentType")}
            onValueChange={(value) =>
              form.setValue("employmentType", value as EmploymentType, { shouldDirty: true })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Location" htmlFor={`${item.id}-location`}>
          <Input id={`${item.id}-location`} {...form.register("location")} />
        </FormField>
        <FormField label="Start date" htmlFor={`${item.id}-start`}>
          <Input id={`${item.id}-start`} type="month" {...form.register("startDate")} />
        </FormField>
        <FormField label="End date" htmlFor={`${item.id}-end`}>
          <Input
            id={`${item.id}-end`}
            type="month"
            disabled={current}
            {...form.register("endDate")}
          />
        </FormField>
        <div className="flex items-center gap-2 sm:col-span-2">
          <Checkbox
            id={`${item.id}-current`}
            checked={current}
            onCheckedChange={(checked) => form.setValue("current", checked === true)}
          />
          <label htmlFor={`${item.id}-current`} className="text-sm">
            Currently working here
          </label>
        </div>
        <FormField
          label="Description"
          htmlFor={`${item.id}-desc`}
          hint="One bullet per line."
          className="sm:col-span-2"
        >
          <Textarea id={`${item.id}-desc`} rows={5} {...form.register("description")} />
        </FormField>
      </div>
    </SortableCard>
  );
}

export function ExperienceForm() {
  const { resume, updateResume } = useResumeDraft();

  return (
    <div className="space-y-4">
      <SectionIntro
        title="Work experience"
        description="List roles in reverse chronological order. Focus on impact, not duties."
      />
      {resume.experience.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">No experience added yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a role or lean on projects if you are earlier in your career.
          </p>
        </div>
      ) : (
        <SortableList
          ids={resume.experience.map((item) => item.id)}
          onReorder={(activeId, overId) =>
            updateResume((current) => ({
              ...current,
              experience: reorderById(current.experience, activeId, overId),
            }))
          }
        >
          {resume.experience.map((item) => (
            <ExperienceItem key={item.id} item={item} />
          ))}
        </SortableList>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          updateResume((current) => ({
            ...current,
            experience: [...current.experience, emptyExperience()],
          }))
        }
      >
        <Plus />
        Add experience
      </Button>
      <Tips
        items={[
          "Start bullets with action verbs.",
          "Include measurable impact where possible.",
          "Example: “Improved dashboard load time by 35% by optimizing API requests.”",
        ]}
      />
    </div>
  );
}
