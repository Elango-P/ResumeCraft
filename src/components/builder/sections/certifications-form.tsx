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
import { certificationSchema } from "@/features/resume/resume.schema";
import type { Certification } from "@/features/resume/resume.types";
import { useResumeDraft } from "@/features/resume/useResumeDraft";
import { useResumeStore } from "@/features/resume/resume.store";
import { emptyCertification, reorderById } from "@/features/resume/resume.utils";

function CertificationItem({ item }: { item: Certification }) {
  const updateResume = useResumeStore((state) => state.updateResume);
  const form = useForm<Certification>({
    resolver: zodResolver(certificationSchema),
    defaultValues: item,
    mode: "onChange",
  });

  useEffect(() => {
    const sub = form.watch((value) => {
      updateResume((resume) => ({
        ...resume,
        certifications: resume.certifications.map((entry) =>
          entry.id === item.id ? { ...entry, ...(value as Certification), id: item.id } : entry,
        ),
      }));
    });
    return () => sub.unsubscribe();
  }, [form, item.id, updateResume]);

  return (
    <SortableCard
      id={item.id}
      title={item.name || "Certification"}
      actions={
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Duplicate certification"
            onClick={() =>
              updateResume((resume) => {
                const copy = { ...item, id: crypto.randomUUID() };
                const index = resume.certifications.findIndex((entry) => entry.id === item.id);
                const certifications = [...resume.certifications];
                certifications.splice(index + 1, 0, copy);
                return { ...resume, certifications };
              })
            }
          >
            <Copy className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove certification"
            onClick={() =>
              updateResume((resume) => ({
                ...resume,
                certifications: resume.certifications.filter((entry) => entry.id !== item.id),
              }))
            }
          >
            <Trash2 className="size-4" />
          </Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Name" htmlFor={`${item.id}-name`} error={form.formState.errors.name?.message}>
          <Input id={`${item.id}-name`} {...form.register("name")} />
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
        <FormField label="Credential URL" htmlFor={`${item.id}-url`} error={form.formState.errors.url?.message}>
          <Input id={`${item.id}-url`} type="url" {...form.register("url")} />
        </FormField>
      </div>
    </SortableCard>
  );
}

export function CertificationsForm() {
  const { resume, updateResume } = useResumeDraft();

  return (
    <div className="space-y-4">
      <SectionIntro title="Certifications" description="Add credentials that support the role you want." />
      {resume.certifications.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">No certifications added yet</p>
        </div>
      ) : (
        <SortableList
          ids={resume.certifications.map((item) => item.id)}
          onReorder={(activeId, overId) =>
            updateResume((current) => ({
              ...current,
              certifications: reorderById(current.certifications, activeId, overId),
            }))
          }
        >
          {resume.certifications.map((item) => (
            <CertificationItem key={item.id} item={item} />
          ))}
        </SortableList>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          updateResume((current) => ({
            ...current,
            certifications: [...current.certifications, emptyCertification()],
          }))
        }
      >
        <Plus />
        Add certification
      </Button>
    </div>
  );
}
