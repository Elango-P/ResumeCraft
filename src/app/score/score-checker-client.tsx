"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  FileCheck2,
  ListChecks,
  Code2,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ScoreGauge } from "@/components/score/score-gauge";
import { CategoryCards } from "@/components/score/category-cards";
import { QuickStatsRow } from "@/components/score/quick-stats-row";
import { IssueList } from "@/components/score/issue-list";
import { BulletAnalysisView } from "@/components/score/bullet-analysis-view";
import { SkillsMatchView } from "@/components/score/skills-match-view";
import { BuzzwordList } from "@/components/score/buzzword-list";
import { ResumeInputForm } from "@/components/score/resume-input-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useResumeDraft } from "@/features/resume/useResumeDraft";
import { createEmptyResume, emptyExperience } from "@/features/resume/resume.utils";
import { SAMPLE_RESUMES } from "@/features/scoring/sample-resumes";
import {
  analyzeResumeData,
  extractContactInfo,
  extractSectionsFromText,
} from "@/features/scoring/scoring-engine";
import type {
  DetailedResumeAnalysis,
  ResumeInputPayload,
  ScoreCategory,
} from "@/features/scoring/scoring-engine.types";

export function ScoreCheckerClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromDraftParam = searchParams.get("from") === "draft";
  const { resume: activeDraft, importResumeDraft } = useResumeDraft();

  const [analysis, setAnalysis] = useState<DetailedResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ScoreCategory | "all">("all");
  const [activeResultsTab, setActiveResultsTab] = useState<"issues" | "bullets" | "skills" | "buzzwords">("issues");
  const [lastPayload, setLastPayload] = useState<ResumeInputPayload | null>(null);

  // Initialize with senior sample if no param, or active draft if ?from=draft
  useEffect(() => {
    if (fromDraftParam && activeDraft) {
      const result = analyzeResumeData({ resume: activeDraft });
      setAnalysis(result);
      setLastPayload({ resume: activeDraft });
    } else if (!analysis) {
      // Default to senior sample to show a populated, beautiful score initially
      const seniorSample = SAMPLE_RESUMES[0];
      const result = analyzeResumeData({
        rawText: seniorSample.text,
        targetJobTitle: seniorSample.targetJobTitle,
        targetJobDescription: seniorSample.targetJobDescription,
      });
      setAnalysis(result);
      setLastPayload({
        rawText: seniorSample.text,
        targetJobTitle: seniorSample.targetJobTitle,
        targetJobDescription: seniorSample.targetJobDescription,
      });
    }
  }, [fromDraftParam]);

  const handleAnalyze = (payload: ResumeInputPayload) => {
    setIsAnalyzing(true);
    setLastPayload(payload);
    setTimeout(() => {
      const result = analyzeResumeData(payload);
      setAnalysis(result);
      setIsAnalyzing(false);
      // Smooth scroll to results on mobile/desktop
      const resultsEl = document.getElementById("score-results-section");
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 350);
  };

  const handleOpenBuilder = () => {
    if (lastPayload?.resume) {
      router.push("/builder");
      return;
    }

    if (lastPayload?.rawText) {
      // Convert raw text into a drafted resume
      const text = lastPayload.rawText;
      const contact = extractContactInfo(text);
      const parsed = extractSectionsFromText(text);

      const empty = createEmptyResume();
      empty.personal.fullName = contact.name ?? empty.personal.fullName;
      empty.personal.email = contact.email ?? empty.personal.email;
      empty.personal.phone = contact.phone ?? empty.personal.phone;
      empty.personal.location = contact.location ?? empty.personal.location;
      empty.personal.linkedin = contact.linkedin ?? empty.personal.linkedin;
      empty.personal.github = contact.github ?? empty.personal.github;
      empty.personal.portfolio = contact.portfolio ?? empty.personal.portfolio;
      empty.summary = parsed.sections["summary"] ?? empty.summary;

      // Experience bullets
      const expBullets = analysis?.bulletDetails.map((b) => b.text) ?? [];
      if (expBullets.length > 0) {
        const exp1 = emptyExperience();
        exp1.jobTitle = "Software Engineer";
        exp1.company = "Company Experience";
        exp1.current = true;
        exp1.description = expBullets.slice(0, 5);
        empty.experience = [exp1];
      }

      if (analysis && analysis.stats.hardSkillsFound.length > 0) {
        empty.skills[0].skills = analysis.stats.hardSkillsFound.slice(0, 10);
      }

      importResumeDraft(empty);
      router.push("/builder");
    } else {
      router.push("/builder");
    }
  };

  return (
    <>
      <SiteHeader />

      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <section className="border-b bg-muted/20 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary font-semibold">
                  <ShieldCheck className="mr-1.5 size-3.5" />
                  Free ATS Resume Score Checker
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Real Heuristics · 0 Data Stored
                </Badge>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Real Resume Score Checker
              </h1>

              <p className="mt-3 text-base text-muted-foreground sm:text-lg leading-relaxed">
                Scan your resume against modern Applicant Tracking System (ATS) heuristics and recruiter review guidelines. Get an accurate score with quantified impact analysis, keyword gap detection, and actionable fixes.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Zap className="size-3.5 text-primary" />
                  Quantified Metrics Engine
                </span>
                <span className="flex items-center gap-1.5">
                  <Target className="size-3.5 text-primary" />
                  Target Job ATS Keyword Matching
                </span>
                <span className="flex items-center gap-1.5">
                  <FileCheck2 className="size-3.5 text-primary" />
                  Bullet-by-Bullet Inspector
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Input & Upload Form */}
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <ResumeInputForm
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            initialFromDraft={fromDraftParam}
          />
        </section>

        {/* Results Dashboard */}
        {analysis ? (
          <section id="score-results-section" className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 space-y-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Evaluation Report &amp; Scorecard
                </h2>
                <p className="text-xs text-muted-foreground">
                  Scanned across 4 weighted dimensions: Impact, Parsability, Skills, and Readability.
                </p>
              </div>
            </div>

            {/* Overall Score Meter Card */}
            <ScoreGauge analysis={analysis} onOpenBuilder={handleOpenBuilder} />

            {/* Quick Stats Ribbon */}
            <QuickStatsRow stats={analysis.stats} />

            {/* 4 Dimension Category Cards */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Dimensional Breakdown (Click to filter issues)
                </h3>
                {selectedCategory !== "all" ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                    className="h-7 text-xs text-muted-foreground"
                  >
                    Reset Filter
                  </Button>
                ) : null}
              </div>
              <CategoryCards
                categories={analysis.categories}
                activeCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Deep Inspection Tabs */}
            <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-6">
              <Tabs
                value={activeResultsTab}
                onValueChange={(val) =>
                  setActiveResultsTab(val as "issues" | "bullets" | "skills" | "buzzwords")
                }
                className="w-full"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 sm:w-auto">
                    <TabsTrigger value="issues" className="gap-1.5 text-xs">
                      <ListChecks className="size-3.5" />
                      Checklist ({analysis.issues.length})
                    </TabsTrigger>
                    <TabsTrigger value="bullets" className="gap-1.5 text-xs">
                      <FileText className="size-3.5" />
                      Bullets ({analysis.stats.bulletCount})
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="gap-1.5 text-xs">
                      <Code2 className="size-3.5" />
                      Skills &amp; Match
                    </TabsTrigger>
                    <TabsTrigger value="buzzwords" className="gap-1.5 text-xs">
                      <AlertTriangle className="size-3.5" />
                      Buzzwords ({analysis.stats.buzzwordsFound.length})
                    </TabsTrigger>
                  </TabsList>

                  <span className="text-xs text-muted-foreground">
                    Filter:{" "}
                    <strong className="text-foreground capitalize">{selectedCategory}</strong>
                  </span>
                </div>

                {/* Tab 1: Actionable Checklist */}
                <TabsContent value="issues" className="mt-5">
                  <IssueList
                    issues={analysis.issues}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </TabsContent>

                {/* Tab 2: Bullet-by-Bullet Deep Dive */}
                <TabsContent value="bullets" className="mt-5">
                  <BulletAnalysisView bullets={analysis.bulletDetails} />
                </TabsContent>

                {/* Tab 3: Skills & Keywords Match */}
                <TabsContent value="skills" className="mt-5">
                  <SkillsMatchView
                    hardSkills={analysis.stats.hardSkillsFound}
                    softSkills={analysis.stats.softSkillsFound}
                    jobMatch={analysis.jobMatch}
                  />
                </TabsContent>

                {/* Tab 4: Buzzwords & Clichés */}
                <TabsContent value="buzzwords" className="mt-5">
                  <BuzzwordList buzzwords={analysis.stats.buzzwordsFound} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Bottom Callout to Builder */}
            <div className="rounded-2xl border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-1 max-w-xl">
                <h3 className="text-lg font-bold text-foreground">
                  Ready to achieve a 90+ score?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use ResumeCraft&apos;s ATS-optimized templates, live A4 formatting, and instant export to turn these recommendations into an interview-winning resume.
                </p>
              </div>
              <Button size="lg" onClick={handleOpenBuilder} className="gap-2 shrink-0">
                <Sparkles className="size-4" />
                Edit &amp; Fix in Builder
              </Button>
            </div>
          </section>
        ) : null}

        {/* Informational / Heuristics Section */}
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
          <div className="rounded-2xl border bg-card/50 p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              How Real Applicant Tracking Systems (ATS) Evaluate Resumes
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                  1
                </div>
                <h3 className="text-sm font-semibold text-foreground">Quantified Business Impact</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Recruiters and hiring managers spend only 6 to 8 seconds on initial scans. Resumes with numbers (e.g., &ldquo;reduced latency by 45%&rdquo;, &ldquo;scaled to 2.5M users&rdquo;, &ldquo;saved $120k&rdquo;) receive 3.2x more interview invitations.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                  2
                </div>
                <h3 className="text-sm font-semibold text-foreground">Standard Heading Architecture</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Workday, Taleo, and Greenhouse parse sections using standard keywords like &ldquo;Work Experience&rdquo;, &ldquo;Education&rdquo;, and &ldquo;Skills&rdquo;. Unconventional headings or non-standard graphics lead to parsing errors.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                  3
                </div>
                <h3 className="text-sm font-semibold text-foreground">Target Role Keyword Density</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ATS algorithms match resumes against specific required skill taxonomies. Ensuring technical frameworks (e.g., Next.js, PostgreSQL, Docker) are clearly stated in dedicated skills groups improves candidate ranking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
