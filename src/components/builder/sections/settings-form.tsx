"use client";

import { toast } from "sonner";
import { FormField, SectionIntro } from "@/components/builder/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TEMPLATE_IDS, TOGGLEABLE_SECTION_IDS } from "@/features/resume/resume.types";
import type { FontSize, TemplateId } from "@/features/resume/resume.types";
import { useResumeDraft } from "@/features/resume/useResumeDraft";
import {
  ACCENT_COLORS,
  SECTION_LABELS,
  TEMPLATE_META,
} from "@/features/resume/resume.utils";

export function SettingsForm() {
  const {
    resume,
    draftList,
    activeDraftId,
    updateResume,
    setTemplate,
    createDraft,
    switchDraft,
    deleteDraft,
    resetDemo,
  } = useResumeDraft();

  return (
    <div className="space-y-8">
      <SectionIntro
        title="Resume settings"
        description="Name this draft, switch templates, and manage what appears on the page."
      />

      <FormField label="Resume name" htmlFor="resumeName">
        <Input
          id="resumeName"
          value={resume.settings.resumeName}
          onChange={(event) =>
            updateResume((current) => ({
              ...current,
              settings: { ...current.settings, resumeName: event.target.value || "Untitled resume" },
            }))
          }
        />
      </FormField>

      <div>
        <h3 className="mb-2 text-sm font-medium">Drafts</h3>
        <div className="space-y-2">
          {draftList.map((draft) => (
            <div
              key={draft.id}
              className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
            >
              <button
                type="button"
                className="flex-1 text-left text-sm"
                onClick={() => switchDraft(draft.id)}
              >
                {draft.settings.resumeName}
                {draft.id === activeDraftId ? (
                  <span className="ml-2 text-xs text-primary">Current</span>
                ) : null}
              </button>
              {draftList.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    deleteDraft(draft.id);
                    toast.success("Draft removed");
                  }}
                >
                  Delete
                </Button>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              createDraft("blank");
              toast.success("New resume created");
            }}
          >
            New blank resume
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              createDraft("duplicate");
              toast.success("Draft duplicated");
            }}
          >
            Duplicate current
          </Button>
        </div>
      </div>

      <FormField label="Template">
        <Select
          value={resume.templateId}
          onValueChange={(value) => setTemplate(value as TemplateId)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATE_IDS.map((id) => (
              <SelectItem key={id} value={id}>
                {TEMPLATE_META[id].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Font size">
        <Select
          value={resume.settings.fontSize}
          onValueChange={(value) =>
            updateResume((current) => ({
              ...current,
              settings: { ...current.settings, fontSize: value as FontSize },
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <div>
        <h3 className="mb-2 text-sm font-medium">Accent color</h3>
        <div className="flex flex-wrap gap-2">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              aria-label={color.name}
              className="size-8 rounded-full border ring-offset-2 focus-visible:ring-2"
              style={{
                background: color.value,
                outline:
                  resume.settings.accentColor === color.value ? `2px solid ${color.value}` : undefined,
              }}
              onClick={() =>
                updateResume((current) => ({
                  ...current,
                  settings: { ...current.settings, accentColor: color.value },
                }))
              }
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">Visible sections</h3>
        <div className="space-y-3">
          {TOGGLEABLE_SECTION_IDS.map((id) => (
            <div key={id} className="flex items-center justify-between gap-3">
              <label htmlFor={`vis-${id}`} className="text-sm">
                {SECTION_LABELS[id]}
              </label>
              <Switch
                id={`vis-${id}`}
                checked={resume.settings.sectionVisibility[id]}
                onCheckedChange={(checked) =>
                  updateResume((current) => ({
                    ...current,
                    settings: {
                      ...current.settings,
                      sectionVisibility: {
                        ...current.settings.sectionVisibility,
                        [id]: checked,
                      },
                    },
                  }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" variant="destructive">
            Reset demo data
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace this draft with demo data?</AlertDialogTitle>
            <AlertDialogDescription>
              This overwrites the current resume with the sample Full-Stack Developer profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetDemo();
                toast.success("Demo resume restored");
              }}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
