"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Plus, Trash2 } from "lucide-react";
import { SortableCard, SortableList } from "@/components/builder/sortable-list";
import { FormField, SectionIntro } from "@/components/builder/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languageSchema } from "@/features/resume/resume.schema";
import type { Language, LanguageLevel } from "@/features/resume/resume.types";
import { useResumeDraft } from "@/features/resume/useResumeDraft";
import { useResumeStore } from "@/features/resume/resume.store";
import { emptyLanguage, LANGUAGE_LEVEL_LABELS, reorderById } from "@/features/resume/resume.utils";

function LanguageItem({ item }: { item: Language }) {
  const updateResume = useResumeStore((state) => state.updateResume);
  const form = useForm<Language>({
    resolver: zodResolver(languageSchema),
    defaultValues: item,
    mode: "onChange",
  });

  useEffect(() => {
    const sub = form.watch((value) => {
      updateResume((resume) => ({
        ...resume,
        languages: resume.languages.map((entry) =>
          entry.id === item.id ? { ...entry, ...(value as Language), id: item.id } : entry,
        ),
      }));
    });
    return () => sub.unsubscribe();
  }, [form, item.id, updateResume]);

  return (
    <SortableCard
      id={item.id}
      title={item.name || "Language"}
      actions={
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Duplicate language"
            onClick={() =>
              updateResume((resume) => {
                const copy = { ...item, id: crypto.randomUUID() };
                const index = resume.languages.findIndex((entry) => entry.id === item.id);
                const languages = [...resume.languages];
                languages.splice(index + 1, 0, copy);
                return { ...resume, languages };
              })
            }
          >
            <Copy className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove language"
            onClick={() =>
              updateResume((resume) => ({
                ...resume,
                languages: resume.languages.filter((entry) => entry.id !== item.id),
              }))
            }
          >
            <Trash2 className="size-4" />
          </Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Language" htmlFor={`${item.id}-name`}>
          <Input id={`${item.id}-name`} {...form.register("name")} />
        </FormField>
        <FormField label="Proficiency">
          <Select
            value={form.watch("proficiency")}
            onValueChange={(value) =>
              form.setValue("proficiency", value as LanguageLevel, { shouldDirty: true })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGE_LEVEL_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </SortableCard>
  );
}

export function LanguagesForm() {
  const { resume, updateResume } = useResumeDraft();

  return (
    <div className="space-y-4">
      <SectionIntro title="Languages" description="List languages you can work in. Use words, not bars." />
      {resume.languages.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">No languages added yet</p>
        </div>
      ) : (
        <SortableList
          ids={resume.languages.map((item) => item.id)}
          onReorder={(activeId, overId) =>
            updateResume((current) => ({
              ...current,
              languages: reorderById(current.languages, activeId, overId),
            }))
          }
        >
          {resume.languages.map((item) => (
            <LanguageItem key={item.id} item={item} />
          ))}
        </SortableList>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          updateResume((current) => ({
            ...current,
            languages: [...current.languages, emptyLanguage()],
          }))
        }
      >
        <Plus />
        Add language
      </Button>
    </div>
  );
}
