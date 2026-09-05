"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Plus, Trash2 } from "lucide-react";
import { SortableCard, SortableList } from "@/components/builder/sortable-list";
import { FormField, SectionIntro } from "@/components/builder/form-field";
import { MonthYearPicker } from "@/components/builder/month-year-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { educationSchema } from "@/features/resume/resume.schema";
import type { Education } from "@/features/resume/resume.types";
import { useResumeDraft } from "@/features/resume/useResumeDraft";
import { useResumeStore } from "@/features/resume/resume.store";
import { emptyEducation, reorderById } from "@/features/resume/resume.utils";

function EducationItem({ item }: { item: Education }) {
  const updateResume = useResumeStore((state) => state.updateResume);
  const form = useForm<Education>({
    resolver: zodResolver(educationSchema),
    defaultValues: item,
    mode: "onChange",
  });

  useEffect(() => {
    const sub = form.watch((value) => {
      updateResume((resume) => ({
        ...resume,
        education: resume.education.map((entry) =>
          entry.id === item.id ? { ...entry, ...(value as Education), id: item.id } : entry,
        ),
      }));
    });
    return () => sub.unsubscribe();
  }, [form, item.id, updateResume]);

  return (
    <SortableCard
      id={item.id}
      title={item.degree || item.institution || "Education"}
      actions={
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Duplicate education"
            onClick={() =>
              updateResume((resume) => {
                const copy = { ...item, id: crypto.randomUUID() };
                const index = resume.education.findIndex((entry) => entry.id === item.id);
                const education = [...resume.education];
                education.splice(index + 1, 0, copy);
                return { ...resume, education };
              })
            }
          >
            <Copy className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove education"
            onClick={() =>
              updateResume((resume) => ({
                ...resume,
                education: resume.education.filter((entry) => entry.id !== item.id),
              }))
            }
          >
            <Trash2 className="size-4" />
          </Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Degree" htmlFor={`${item.id}-degree`}>
          <Input id={`${item.id}-degree`} {...form.register("degree")} />
        </FormField>
        <FormField label="Institution" htmlFor={`${item.id}-institution`}>
          <Input id={`${item.id}-institution`} {...form.register("institution")} />
        </FormField>
        <FormField label="Location" htmlFor={`${item.id}-location`}>
          <Input id={`${item.id}-location`} {...form.register("location")} />
        </FormField>
        <FormField label="Grade or CGPA" htmlFor={`${item.id}-grade`} hint="Optional">
          <Input id={`${item.id}-grade`} {...form.register("grade")} />
        </FormField>
        <FormField label="Start date" htmlFor={`${item.id}-start`}>
          <Controller
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <MonthYearPicker
                id={`${item.id}-start`}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
        <FormField label="End date" htmlFor={`${item.id}-end`}>
          <Controller
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <MonthYearPicker
                id={`${item.id}-end`}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
        <FormField
          label="Description"
          htmlFor={`${item.id}-desc`}
          hint="Optional"
          className="sm:col-span-2"
        >
          <Textarea id={`${item.id}-desc`} rows={3} {...form.register("description")} />
        </FormField>
      </div>
    </SortableCard>
  );
}

export function EducationForm() {
  const { resume, updateResume } = useResumeDraft();

  return (
    <div className="space-y-4">
      <SectionIntro
        title="Education"
        description="Include degrees, bootcamps, or relevant coursework."
      />
      {resume.education.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">No education added yet</p>
        </div>
      ) : (
        <SortableList
          ids={resume.education.map((item) => item.id)}
          onReorder={(activeId, overId) =>
            updateResume((current) => ({
              ...current,
              education: reorderById(current.education, activeId, overId),
            }))
          }
        >
          {resume.education.map((item) => (
            <EducationItem key={item.id} item={item} />
          ))}
        </SortableList>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          updateResume((current) => ({
            ...current,
            education: [...current.education, emptyEducation()],
          }))
        }
      >
        <Plus />
        Add education
      </Button>
    </div>
  );
}
