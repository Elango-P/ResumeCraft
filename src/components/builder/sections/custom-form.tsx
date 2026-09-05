"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { SortableCard, SortableList } from "@/components/builder/sortable-list";
import { FormField, SectionIntro } from "@/components/builder/form-field";
import { MonthYearPicker } from "@/components/builder/month-year-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { customEntrySchema, customSectionSchema } from "@/features/resume/resume.schema";
import type { CustomEntry, CustomSection } from "@/features/resume/resume.types";
import { useResumeDraft } from "@/features/resume/useResumeDraft";
import { useResumeStore } from "@/features/resume/resume.store";
import {
  bulletsToText,
  emptyCustomEntry,
  emptyCustomSection,
  reorderById,
  textToBullets,
} from "@/features/resume/resume.utils";

const sectionFormSchema = customSectionSchema.omit({ entries: true });
const entryFormSchema = customEntrySchema.omit({ description: true }).extend({
  description: z.string(),
});

function CustomEntryItem({
  sectionId,
  entry,
}: {
  sectionId: string;
  entry: CustomEntry;
}) {
  const updateResume = useResumeStore((state) => state.updateResume);
  const form = useForm({
    resolver: zodResolver(entryFormSchema),
    defaultValues: { ...entry, description: bulletsToText(entry.description) },
    mode: "onChange",
  });

  useEffect(() => {
    const sub = form.watch((value) => {
      updateResume((resume) => ({
        ...resume,
        customSections: resume.customSections.map((section) =>
          section.id !== sectionId
            ? section
            : {
                ...section,
                entries: section.entries.map((item) =>
                  item.id === entry.id
                    ? {
                        ...item,
                        heading: value.heading ?? "",
                        subheading: value.subheading ?? "",
                        date: value.date ?? "",
                        description: textToBullets(value.description ?? ""),
                      }
                    : item,
                ),
              },
        ),
      }));
    });
    return () => sub.unsubscribe();
  }, [entry.id, form, sectionId, updateResume]);

  return (
    <div className="rounded-lg border p-3">
      <div className="mb-3 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Remove entry"
          onClick={() =>
            updateResume((resume) => ({
              ...resume,
              customSections: resume.customSections.map((section) =>
                section.id !== sectionId
                  ? section
                  : {
                      ...section,
                      entries: section.entries.filter((item) => item.id !== entry.id),
                    },
              ),
            }))
          }
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Heading" htmlFor={`${entry.id}-heading`}>
          <Input id={`${entry.id}-heading`} {...form.register("heading")} />
        </FormField>
        <FormField label="Subheading" htmlFor={`${entry.id}-sub`}>
          <Input id={`${entry.id}-sub`} {...form.register("subheading")} />
        </FormField>
        <FormField label="Date" htmlFor={`${entry.id}-date`}>
          <Controller
            control={form.control}
            name="date"
            render={({ field }) => (
              <MonthYearPicker
                id={`${entry.id}-date`}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
        <FormField label="Description" htmlFor={`${entry.id}-desc`} className="sm:col-span-2">
          <Textarea id={`${entry.id}-desc`} rows={3} {...form.register("description")} />
        </FormField>
      </div>
    </div>
  );
}

function CustomSectionItem({ section }: { section: CustomSection }) {
  const updateResume = useResumeStore((state) => state.updateResume);
  const form = useForm({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: { id: section.id, title: section.title },
    mode: "onChange",
  });

  useEffect(() => {
    const sub = form.watch((value) => {
      updateResume((resume) => ({
        ...resume,
        customSections: resume.customSections.map((item) =>
          item.id === section.id ? { ...item, title: value.title ?? item.title } : item,
        ),
      }));
    });
    return () => sub.unsubscribe();
  }, [form, section.id, updateResume]);

  return (
    <SortableCard
      id={section.id}
      title={section.title || "Custom section"}
      actions={
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Duplicate custom section"
            onClick={() =>
              updateResume((resume) => {
                const copy = {
                  ...section,
                  id: crypto.randomUUID(),
                  entries: section.entries.map((entry) => ({
                    ...entry,
                    id: crypto.randomUUID(),
                  })),
                };
                const index = resume.customSections.findIndex((item) => item.id === section.id);
                const customSections = [...resume.customSections];
                customSections.splice(index + 1, 0, copy);
                return { ...resume, customSections };
              })
            }
          >
            <Copy className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove custom section"
            onClick={() =>
              updateResume((resume) => ({
                ...resume,
                customSections: resume.customSections.filter((item) => item.id !== section.id),
              }))
            }
          >
            <Trash2 className="size-4" />
          </Button>
        </>
      }
    >
      <FormField label="Section title" htmlFor={`${section.id}-title`}>
        <Input id={`${section.id}-title`} {...form.register("title")} />
      </FormField>
      <div className="mt-4 space-y-3">
        {section.entries.map((entry) => (
          <CustomEntryItem key={entry.id} sectionId={section.id} entry={entry} />
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3"
        onClick={() =>
          updateResume((resume) => ({
            ...resume,
            customSections: resume.customSections.map((item) =>
              item.id === section.id
                ? { ...item, entries: [...item.entries, emptyCustomEntry()] }
                : item,
            ),
          }))
        }
      >
        <Plus />
        Add entry
      </Button>
    </SortableCard>
  );
}

export function CustomForm() {
  const { resume, updateResume } = useResumeDraft();

  return (
    <div className="space-y-4">
      <SectionIntro
        title="Custom section"
        description="Use this for publications, volunteering, open source, or anything else."
      />
      {resume.customSections.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">No custom sections yet</p>
        </div>
      ) : (
        <SortableList
          ids={resume.customSections.map((item) => item.id)}
          onReorder={(activeId, overId) =>
            updateResume((current) => ({
              ...current,
              customSections: reorderById(current.customSections, activeId, overId),
            }))
          }
        >
          {resume.customSections.map((section) => (
            <CustomSectionItem key={section.id} section={section} />
          ))}
        </SortableList>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          updateResume((current) => ({
            ...current,
            customSections: [...current.customSections, emptyCustomSection()],
          }))
        }
      >
        <Plus />
        Add custom section
      </Button>
    </div>
  );
}
