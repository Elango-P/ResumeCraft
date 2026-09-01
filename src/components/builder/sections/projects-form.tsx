"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { SortableCard, SortableList } from "@/components/builder/sortable-list";
import { FormField, SectionIntro } from "@/components/builder/form-field";
import { TagInput } from "@/components/builder/tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { projectSchema } from "@/features/resume/resume.schema";
import type { Project } from "@/features/resume/resume.types";
import { useResumeDraft } from "@/features/resume/useResumeDraft";
import { useResumeStore } from "@/features/resume/resume.store";
import {
  bulletsToText,
  emptyProject,
  reorderById,
  textToBullets,
} from "@/features/resume/resume.utils";

const formSchema = projectSchema.omit({ description: true, technologies: true }).extend({
  description: z.string(),
});

type ProjectFormValues = z.infer<typeof formSchema>;

function ProjectItem({ item }: { item: Project }) {
  const updateResume = useResumeStore((state) => state.updateResume);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...item, description: bulletsToText(item.description) },
    mode: "onChange",
  });

  useEffect(() => {
    const sub = form.watch((value) => {
      updateResume((resume) => ({
        ...resume,
        projects: resume.projects.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                ...(value as ProjectFormValues),
                id: item.id,
                technologies: entry.technologies,
                description: textToBullets(value.description ?? ""),
              }
            : entry,
        ),
      }));
    });
    return () => sub.unsubscribe();
  }, [form, item.id, updateResume]);

  const errors = form.formState.errors;

  return (
    <SortableCard
      id={item.id}
      title={item.name || "Project"}
      actions={
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Duplicate project"
            onClick={() =>
              updateResume((resume) => {
                const copy = { ...item, id: crypto.randomUUID() };
                const index = resume.projects.findIndex((entry) => entry.id === item.id);
                const projects = [...resume.projects];
                projects.splice(index + 1, 0, copy);
                return { ...resume, projects };
              })
            }
          >
            <Copy className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove project"
            onClick={() =>
              updateResume((resume) => ({
                ...resume,
                projects: resume.projects.filter((entry) => entry.id !== item.id),
              }))
            }
          >
            <Trash2 className="size-4" />
          </Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Project name" htmlFor={`${item.id}-name`} error={errors.name?.message}>
          <Input id={`${item.id}-name`} {...form.register("name")} />
        </FormField>
        <FormField label="Role" htmlFor={`${item.id}-role`}>
          <Input id={`${item.id}-role`} {...form.register("role")} />
        </FormField>
        <FormField
          label="Project link"
          htmlFor={`${item.id}-url`}
          error={errors.projectUrl?.message}
        >
          <Input id={`${item.id}-url`} type="url" {...form.register("projectUrl")} />
        </FormField>
        <FormField
          label="GitHub link"
          htmlFor={`${item.id}-github`}
          error={errors.githubUrl?.message}
        >
          <Input id={`${item.id}-github`} type="url" {...form.register("githubUrl")} />
        </FormField>
        <FormField label="Technologies" className="sm:col-span-2">
          <TagInput
            value={item.technologies}
            suggestions={["React.js", "Next.js", "Node.js", "PostgreSQL", "AWS", "TypeScript"]}
            onChange={(technologies) =>
              updateResume((resume) => ({
                ...resume,
                projects: resume.projects.map((entry) =>
                  entry.id === item.id ? { ...entry, technologies } : entry,
                ),
              }))
            }
          />
        </FormField>
        <FormField
          label="Description"
          htmlFor={`${item.id}-desc`}
          hint="One bullet per line."
          className="sm:col-span-2"
        >
          <Textarea id={`${item.id}-desc`} rows={4} {...form.register("description")} />
        </FormField>
      </div>
    </SortableCard>
  );
}

export function ProjectsForm() {
  const { resume, updateResume } = useResumeDraft();

  return (
    <div className="space-y-4">
      <SectionIntro
        title="Projects"
        description="Feature work that shows your stack, ownership, and outcomes."
      />
      {resume.projects.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">No projects added yet</p>
        </div>
      ) : (
        <SortableList
          ids={resume.projects.map((item) => item.id)}
          onReorder={(activeId, overId) =>
            updateResume((current) => ({
              ...current,
              projects: reorderById(current.projects, activeId, overId),
            }))
          }
        >
          {resume.projects.map((item) => (
            <ProjectItem key={item.id} item={item} />
          ))}
        </SortableList>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          updateResume((current) => ({
            ...current,
            projects: [...current.projects, emptyProject()],
          }))
        }
      >
        <Plus />
        Add project
      </Button>
    </div>
  );
}
