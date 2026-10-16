"use client";

import Link from "next/link";
import { ArrowRight, CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeScore } from "@/features/resume/useResumeScore";
import { useResumeDraft } from "@/features/resume/useResumeDraft";
import { cn } from "@/lib/utils";

export function ScorePanel() {
  const score = useResumeScore();
  const { setActiveSection } = useResumeDraft();
  if (!score) return null;

  return (
    <section className="rounded-xl border bg-card p-4 shadow-sm" aria-labelledby="resume-score-heading">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="resume-score-heading" className="text-sm font-medium">
            Resume Score
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            A writing checklist, not a guarantee of interviews or ATS selection.
          </p>
        </div>
        <p className="text-2xl font-semibold tabular-nums" aria-label={`Score ${score.score} out of 100`}>
          {score.score}
        </p>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        About {score.estimatedPages} page{score.estimatedPages === 1 ? "" : "s"} · {score.wordCount} words
      </p>
      <ul className="mt-3 space-y-2">
        {score.issues.map((issue) => (
          <li key={issue.id}>
            <button
              type="button"
              className={cn(
                "flex w-full items-start gap-2 rounded-lg p-2 text-left text-xs hover:bg-muted",
                issue.severity === "success" && "text-emerald-700 dark:text-emerald-400",
              )}
              onClick={() => {
                if (issue.section) setActiveSection(issue.section);
              }}
            >
              {issue.severity === "error" ? (
                <CircleAlert className="mt-0.5 size-3.5 text-destructive" />
              ) : issue.severity === "warning" ? (
                <TriangleAlert className="mt-0.5 size-3.5 text-amber-500" />
              ) : issue.severity === "success" ? (
                <CircleCheck className="mt-0.5 size-3.5" />
              ) : (
                <Info className="mt-0.5 size-3.5 text-primary" />
              )}
              <span>{issue.message}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t pt-3">
        <Button variant="ghost" size="sm" asChild className="w-full justify-between text-xs font-semibold text-primary hover:text-primary">
          <Link href="/score?from=draft" target="_blank">
            <span>Full ATS Heuristics Report</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
