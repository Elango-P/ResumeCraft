"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, Eye } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BuilderToolbar, SaveStatus } from "@/components/builder/builder-toolbar";
import { ResumePreview, ResumePrintRoot } from "@/components/builder/resume-preview";
import { ScorePanel } from "@/components/builder/score-panel";
import { SectionNav } from "@/components/builder/section-nav";
import { SectionEditor, adjacentSection } from "@/components/builder/sections/section-editor";
import { useHydrateResumeStore, useAutoSave, useUnsavedChangesWarning, useClientReady } from "@/features/resume/useAutoSave";
import { useResumeDraft } from "@/features/resume/useResumeDraft";
import { useResumeExport } from "@/features/resume/useResumeExport";
import { isTemplateId, SECTION_LABELS } from "@/features/resume/resume.utils";
import { SECTION_IDS, type SectionId } from "@/features/resume/resume.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BuilderShell() {
  useHydrateResumeStore();
  useAutoSave();
  useUnsavedChangesWarning();
  const clientReady = useClientReady();
  const searchParams = useSearchParams();
  const {
    resume,
    activeSection,
    setActiveSection,
    setTemplate,
    previewOpen,
    setPreviewOpen,
  } = useResumeDraft();
  const { downloadPdf } = useResumeExport();

  useEffect(() => {
    const template = searchParams.get("template");
    if (isTemplateId(template)) {
      setTemplate(template);
    }
  }, [searchParams, setTemplate]);

  if (!clientReady) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader compact />
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Loading your resume…
        </div>
      </div>
    );
  }

  const step = SECTION_IDS.indexOf(activeSection) + 1;

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader compact />
      <div className="print-hidden border-b bg-background px-4 py-3 sm:px-6">
        <BuilderToolbar onPreview={() => setPreviewOpen(true)} />
      </div>
      <div className="mx-auto grid min-h-0 w-full flex-1 grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_minmax(360px,42%)]">
        <aside className="print-hidden hidden border-r bg-background lg:block">
          <SectionNav />
        </aside>
        <section className="print-hidden min-w-0 border-r bg-background">
          <ScrollArea className="h-[calc(100vh-8.5rem)] lg:h-[calc(100vh-7.25rem)]">
            <div className="px-4 py-6 sm:px-6 lg:pb-24">
              <div className="mb-4 lg:hidden">
                <p className="mb-2 text-xs text-muted-foreground">
                  Step {step} of {SECTION_IDS.length}
                </p>
                <Select
                  value={activeSection}
                  onValueChange={(value) => setActiveSection(value as SectionId)}
                >
                  <SelectTrigger className="w-full" aria-label="Resume section">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTION_IDS.map((id) => (
                      <SelectItem key={id} value={id}>
                        {SECTION_LABELS[id]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <SectionEditor key={`${resume.id}-${activeSection}`} section={activeSection} />
              <div className="mt-8 hidden items-center justify-between gap-2 lg:flex">
                <Button
                  type="button"
                  variant="outline"
                  disabled={activeSection === "personal"}
                  onClick={() => setActiveSection(adjacentSection(activeSection, -1))}
                >
                  <ChevronLeft />
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={activeSection === "settings"}
                  onClick={() => setActiveSection(adjacentSection(activeSection, 1))}
                >
                  Next
                  <ChevronRight data-icon="inline-end" />
                </Button>
              </div>
            </div>
          </ScrollArea>
        </section>
        <aside className="print-hidden hidden overflow-auto bg-muted/40 p-4 lg:block">
          <div className="mb-4">
            <ScorePanel />
          </div>
          <ResumePreview resume={resume} />
        </aside>
      </div>
      <div className="print-hidden sticky bottom-0 z-30 border-t bg-background p-3 lg:hidden">
        <div className="mb-3 flex items-center justify-between gap-2">
          <SaveStatus />
          <span className="text-xs text-muted-foreground">
            Step {step} / {SECTION_IDS.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveSection(adjacentSection(activeSection, -1))}
            disabled={activeSection === "personal"}
          >
            Back
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveSection(adjacentSection(activeSection, 1))}
            disabled={activeSection === "settings"}
          >
            Continue
          </Button>
          <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}>
            <Eye />
            Preview
          </Button>
          <Button type="button" onClick={downloadPdf}>
            <Download />
            Download PDF
          </Button>
        </div>
      </div>
      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent side="bottom" className="h-[100dvh] w-full max-w-none overflow-y-auto sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Resume preview</SheetTitle>
            <SheetDescription>Live A4 preview of your current draft.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 p-4">
            <ScorePanel />
            <ResumePreview resume={resume} />
          </div>
        </SheetContent>
      </Sheet>
      <ResumePrintRoot resume={resume} />
    </div>
  );
}
