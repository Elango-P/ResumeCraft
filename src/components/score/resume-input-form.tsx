"use client";

import { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  FileCode,
  Sparkles,
  Target,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResumeDraft } from "@/features/resume/useResumeDraft";
import { extractTextFromFile } from "@/features/scoring/file-extractor";
import { SAMPLE_RESUMES } from "@/features/scoring/sample-resumes";
import { convertResumeToText } from "@/features/scoring/scoring-engine";
import type { ResumeInputPayload } from "@/features/scoring/scoring-engine.types";
import { cn } from "@/lib/utils";

interface ResumeInputFormProps {
  onAnalyze: (payload: ResumeInputPayload) => void;
  isAnalyzing: boolean;
  initialFromDraft?: boolean;
}

export function ResumeInputForm({
  onAnalyze,
  isAnalyzing,
  initialFromDraft = false,
}: ResumeInputFormProps) {
  const { resume: activeDraft, hasHydrated } = useResumeDraft();
  const [activeTab, setActiveTab] = useState<"upload" | "paste" | "draft">(
    initialFromDraft ? "draft" : "upload",
  );
  const [pastedText, setPastedText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedFileText, setExtractedFileText] = useState("");
  const [fileWordCount, setFileWordCount] = useState<number | null>(null);
  const [fileWarning, setFileWarning] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  // Job Description Matching
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [targetJobDescription, setTargetJobDescription] = useState("");
  const [showJdPanel, setShowJdPanel] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // If initialFromDraft is set, load active draft immediately
  useEffect(() => {
    if (initialFromDraft && hasHydrated && activeDraft) {
      setActiveTab("draft");
      const text = convertResumeToText(activeDraft);
      setPastedText(text);
      onAnalyze({ resume: activeDraft, targetJobTitle, targetJobDescription });
    }
  }, [initialFromDraft, hasHydrated]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setUploadedFile(file);
    setIsExtracting(true);
    setFileWarning(null);
    try {
      const result = await extractTextFromFile(file);
      setExtractedFileText(result.text);
      setFileWordCount(result.wordCount);
      setPastedText(result.text);
      if (result.warnings && result.warnings.length > 0) {
        setFileWarning(result.warnings[0]);
      }
      if (result.text && result.text.trim().length > 10) {
        onAnalyze({
          rawText: result.text,
          targetJobTitle,
          targetJobDescription,
        });
      }
    } catch {
      setFileWarning("Could not parse PDF/file. Please copy and paste the resume text into the Paste tab.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_RESUMES.find((s) => s.id === sampleId);
    if (!sample) return;
    setActiveTab("paste");
    setPastedText(sample.text);
    if (sample.targetJobTitle) {
      setTargetJobTitle(sample.targetJobTitle);
    }
    if (sample.targetJobDescription) {
      setTargetJobDescription(sample.targetJobDescription);
      setShowJdPanel(true);
    }
    onAnalyze({
      rawText: sample.text,
      targetJobTitle: sample.targetJobTitle,
      targetJobDescription: sample.targetJobDescription,
    });
  };

  const handleLoadDraft = () => {
    if (!activeDraft) return;
    const text = convertResumeToText(activeDraft);
    setPastedText(text);
    setActiveTab("draft");
    onAnalyze({
      resume: activeDraft,
      targetJobTitle,
      targetJobDescription,
    });
  };

  const handleAnalyzeClick = () => {
    if (activeTab === "draft") {
      onAnalyze({
        resume: activeDraft,
        targetJobTitle,
        targetJobDescription,
      });
    } else if (activeTab === "upload") {
      onAnalyze({
        rawText: extractedFileText,
        targetJobTitle,
        targetJobDescription,
      });
    } else {
      onAnalyze({
        rawText: pastedText,
        targetJobTitle,
        targetJobDescription,
      });
    }
  };

  const currentWordCount =
    activeTab === "paste"
      ? pastedText.split(/\s+/).filter(Boolean).length
      : activeTab === "upload"
      ? fileWordCount ?? 0
      : activeDraft
      ? convertResumeToText(activeDraft).split(/\s+/).filter(Boolean).length
      : 0;

  const canAnalyze =
    (activeTab === "paste" && pastedText.trim().length > 10) ||
    (activeTab === "upload" && extractedFileText.trim().length > 10) ||
    (activeTab === "draft" && Boolean(activeDraft));

  return (
    <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header & Sample Chips */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            1. Select or Paste Your Resume
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Upload a PDF, Word doc, or text file, or check your active ResumeCraft draft.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-1">Test with sample:</span>
          {SAMPLE_RESUMES.map((sample) => (
            <Button
              key={sample.id}
              variant="outline"
              size="sm"
              onClick={() => handleLoadSample(sample.id)}
              className="h-7 text-xs"
            >
              {sample.scoreTag === "high" ? "🌟" : sample.scoreTag === "medium" ? "📈" : "⚠️"}{" "}
              {sample.role}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Mode Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "upload" | "paste" | "draft")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="upload" className="gap-1.5 text-xs font-medium">
            <UploadCloud className="size-3.5" />
            Upload PDF / Doc
          </TabsTrigger>
          <TabsTrigger value="paste" className="gap-1.5 text-xs font-medium">
            <FileText className="size-3.5" />
            Paste Text
          </TabsTrigger>
          <TabsTrigger value="draft" className="gap-1.5 text-xs font-medium">
            <FileCode className="size-3.5" />
            Active Draft
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Upload File */}
        <TabsContent value="upload" className="mt-4 space-y-3">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
              uploadedFile
                ? "border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/5"
                : "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30",
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.json,.md"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              {uploadedFile ? <FileCheck className="size-6 text-emerald-600 dark:text-emerald-400" /> : <UploadCloud className="size-6" />}
            </div>
            {uploadedFile ? (
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-foreground flex items-center justify-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-primary border-primary/30">
                    {uploadedFile.name.split(".").pop()?.toUpperCase()}
                  </Badge>
                  {uploadedFile.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isExtracting ? (
                    <span className="text-primary font-medium animate-pulse">
                      Parsing PDF text and calculating ATS heuristics...
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Successfully parsed {fileWordCount ?? 0} words · Click to replace
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-foreground">
                  Click to upload or drag &amp; drop your PDF
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Supports PDF (standard ATS format), Word (.docx), TXT, or JSON
                </p>
              </div>
            )}
          </div>

          {uploadedFile && extractedFileText ? (
            <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border">
              <span>Extracted {fileWordCount ?? 0} words from {uploadedFile.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("paste");
                }}
                className="h-7 text-xs text-primary hover:text-primary gap-1"
              >
                <FileText className="size-3" />
                Review / Edit Extracted Text
              </Button>
            </div>
          ) : null}

          {fileWarning ? (
            <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 border border-amber-500/20">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-600" />
              <span>{fileWarning}</span>
            </div>
          ) : null}
        </TabsContent>

        {/* Tab 2: Paste Resume Text */}
        <TabsContent value="paste" className="mt-4 space-y-2">
          <div className="relative">
            <Textarea
              placeholder="Paste your full resume text here (including Work Experience, Education, and Skills)..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              rows={10}
              className="font-mono text-xs leading-relaxed resize-y"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{currentWordCount} words</span>
            {pastedText ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPastedText("")}
                className="h-6 text-[11px] gap-1"
              >
                <RotateCcw className="size-3" />
                Clear
              </Button>
            ) : null}
          </div>
        </TabsContent>

        {/* Tab 3: Use Current Draft from Builder */}
        <TabsContent value="draft" className="mt-4 space-y-3">
          <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">Active ResumeCraft Draft:</span>
                <p className="text-sm font-semibold text-foreground">
                  {activeDraft?.settings.resumeName || "Untitled resume"}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {activeDraft?.experience.length ?? 0} role(s) · {activeDraft?.skills.length ?? 0} skill group(s)
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Directly scan your current draft in ResumeCraft with zero manual export or copy-pasting.
            </p>
            <Button size="sm" onClick={handleLoadDraft} className="gap-2">
              <Sparkles className="size-3.5" />
              Analyze Active Draft
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Target Job Description Section (Optional ATS Keyword Matcher) */}
      <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
        <button
          type="button"
          onClick={() => setShowJdPanel((prev) => !prev)}
          className="flex w-full items-center justify-between text-left text-xs font-semibold text-foreground hover:text-primary transition-colors"
        >
          <div className="flex items-center gap-2">
            <Target className="size-4 text-primary" />
            <span>Optional: Match Against a Specific Job Description (ATS Match Rate)</span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {showJdPanel ? "Hide" : "+ Add Job Description"}
          </span>
        </button>

        {showJdPanel ? (
          <div className="space-y-3 pt-2 border-t">
            <div>
              <label className="text-xs font-medium text-foreground">Target Role Title</label>
              <Input
                placeholder="e.g. Senior Full-Stack Engineer, Product Manager"
                value={targetJobTitle}
                onChange={(e) => setTargetJobTitle(e.target.value)}
                className="mt-1 h-8 text-xs"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Job Description Text</label>
                <button
                  type="button"
                  onClick={() => {
                    const sample = SAMPLE_RESUMES[0];
                    setTargetJobTitle(sample.targetJobTitle ?? "");
                    setTargetJobDescription(sample.targetJobDescription ?? "");
                  }}
                  className="text-[11px] text-primary hover:underline"
                >
                  Load sample job posting
                </button>
              </div>
              <Textarea
                placeholder="Paste the requirements or job posting text here to calculate your real ATS match percentage and see missing keywords..."
                value={targetJobDescription}
                onChange={(e) => setTargetJobDescription(e.target.value)}
                rows={4}
                className="mt-1 text-xs resize-y"
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Primary Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div className="text-xs text-muted-foreground">
          {canAnalyze ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ Ready to scan · {currentWordCount} words detected
            </span>
          ) : (
            <span>Upload a file or paste resume text above to check your score.</span>
          )}
        </div>

        <Button
          size="lg"
          onClick={handleAnalyzeClick}
          disabled={!canAnalyze || isAnalyzing || isExtracting}
          className="gap-2 font-semibold sm:w-auto w-full"
        >
          {isAnalyzing ? (
            <>Evaluating Heuristics...</>
          ) : (
            <>
              Check Resume Score
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
