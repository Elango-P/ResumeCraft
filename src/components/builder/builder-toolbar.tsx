"use client";

import { Download, Eye, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TEMPLATE_IDS } from "@/features/resume/resume.types";
import type { TemplateId } from "@/features/resume/resume.types";
import { TEMPLATE_META } from "@/features/resume/resume.utils";
import { useResumeDraft } from "@/features/resume/useResumeDraft";
import { useResumeExport } from "@/features/resume/useResumeExport";

export function SaveStatus() {
  const { isSaving, lastSavedAt, isDirty, hasHydrated } = useResumeDraft();
  if (!hasHydrated) return <span className="text-xs text-muted-foreground">Loading…</span>;
  if (isSaving || isDirty) return <span className="text-xs text-muted-foreground">Saving…</span>;
  if (!lastSavedAt) return <span className="text-xs text-muted-foreground">Not saved yet</span>;
  const time = new Date(lastSavedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return <span className="text-xs text-muted-foreground">Saved {time}</span>;
}

export function BuilderToolbar({ onPreview }: { onPreview?: () => void }) {
  const { resume, setTemplate } = useResumeDraft();
  const { downloadPdf, printResume } = useResumeExport();

  return (
    <div className="print-hidden flex flex-wrap items-center gap-2">
      <Select
        value={resume.templateId}
        onValueChange={(value) => setTemplate(value as TemplateId)}
      >
        <SelectTrigger className="w-[190px]" aria-label="Resume template">
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
      <SaveStatus />
      <div className="ml-auto flex items-center gap-2">
        {onPreview ? (
          <Button type="button" variant="outline" size="sm" className="lg:hidden" onClick={onPreview}>
            <Eye />
            Preview
          </Button>
        ) : null}
        <Button type="button" variant="outline" size="sm" onClick={printResume}>
          <Printer />
          Print
        </Button>
        <Button type="button" size="sm" onClick={downloadPdf}>
          <Download />
          Download PDF
        </Button>
      </div>
    </div>
  );
}
