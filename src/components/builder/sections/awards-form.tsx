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
import { awardSchema } from "@/features/resume/resume.schema";
import type { Award } from "@/features/resume/resume.types";
import { useResumeDraft } from "@/features/resume/useResumeDraft";
import { useResumeStore } from "@/features/resume/resume.store";
import { emptyAward, reorderById } from "@/features/resume/resume.utils";

function AwardItem({ item }: { item: Award }) {
  const updateResume = useResumeStore((state) => state.updateResume);
  const form = useForm<Award>({
    resolver: zodResolver(awardSchema),
    defaultValues: item,
    mode: "onChange",
  });

  useEffect(() => {
    const sub = form.watch((value) => {
      updateResume((resume) => ({
        ...resume,
        awards: resume.awards.map((entry) =>
          entry.id === item.id ? { ...entry, ...(value as Award), id: item.id } : entry,
        ),
      }));
    });
    return () => sub.unsubscribe();
  }, [form, item.id, updateResume]);

  return (
    <SortableCard
      id={item.id}
      title={item.title || "Award"}
      actions={
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Duplicate award"
            onClick={() =>
              updateResume((resume) => {
                const copy = { ...item, id: crypto.randomUUID() };
                const index = resume.awards.findIndex((entry) => entry.id === item.id);
                const awards = [...resume.awards];
                awards.splice(index + 1, 0, copy);
                return { ...resume, awards };
              })
            }
          >
            <Copy className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove award"
            onClick={() =>
              updateResume((resume) => ({
                ...resume,
                awards: resume.awards.filter((entry) => entry.id !== item.id),
              }))
            }
          >
            <Trash2 className="size-4" />
          </Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Title" htmlFor={`${item.id}-title`}>
          <Input id={`${item.id}-title`} {...form.register("title")} />
        </FormField>
        <FormField label="Issuer" htmlFor={`${item.id}-issuer`}>
          <Input id={`${item.id}-issuer`} {...form.register("issuer")} />
        </FormField>
        <FormField label="Date" htmlFor={`${item.id}-date`}>
          <Controller
            control={form.control}
            name="date"
            render={({ field }) => (
              <MonthYearPicker
                id={`${item.id}-date`}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
        <FormField label="Description" htmlFor={`${item.id}-desc`} className="sm:col-span-2">
          <Textarea id={`${item.id}-desc`} rows={3} {...form.register("description")} />
        </FormField>
      </div>
    </SortableCard>
  );
}

export function AwardsForm() {
  const { resume, updateResume } = useResumeDraft();

  return (
    <div className="space-y-4">
      <SectionIntro title="Awards" description="Keep only awards that strengthen the role you want." />
      {resume.awards.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">No awards added yet</p>
        </div>
      ) : (
        <SortableList
          ids={resume.awards.map((item) => item.id)}
          onReorder={(activeId, overId) =>
            updateResume((current) => ({
              ...current,
              awards: reorderById(current.awards, activeId, overId),
            }))
          }
        >
          {resume.awards.map((item) => (
            <AwardItem key={item.id} item={item} />
          ))}
        </SortableList>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          updateResume((current) => ({
            ...current,
            awards: [...current.awards, emptyAward()],
          }))
        }
      >
        <Plus />
        Add award
      </Button>
    </div>
  );
}
