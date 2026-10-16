"use client";

import { useId } from "react";
import { Award, CheckCircle2, FileDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DetailedResumeAnalysis } from "@/features/scoring/scoring-engine.types";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  analysis: DetailedResumeAnalysis;
  onOpenBuilder?: () => void;
}

export function ScoreGauge({ analysis, onOpenBuilder }: ScoreGaugeProps) {
  const gradientId = useId();
  const score = analysis.overallScore;
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 90) return { stroke: "#10b981", text: "text-emerald-600 dark:text-emerald-400" };
    if (val >= 80) return { stroke: "#0d9488", text: "text-teal-600 dark:text-teal-400" };
    if (val >= 70) return { stroke: "#f59e0b", text: "text-amber-600 dark:text-amber-400" };
    if (val >= 55) return { stroke: "#ea580c", text: "text-orange-600 dark:text-orange-400" };
    return { stroke: "#e11d48", text: "text-rose-600 dark:text-rose-400" };
  };

  const colors = getScoreColor(score);

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
        {/* Left: Gauge Circle */}
        <div className="flex flex-col items-center sm:flex-row sm:gap-8">
          <div className="relative flex size-44 items-center justify-center">
            <svg className="size-full -rotate-90 transform" viewBox="0 0 180 180">
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.stroke} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={colors.stroke} stopOpacity="1" />
                </linearGradient>
              </defs>
              {/* Background circle */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                className="stroke-muted"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke={`url(#${gradientId})`}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={cn("text-4xl font-extrabold tracking-tight", colors.text)}>
                {score}
              </span>
              <span className="text-xs font-medium text-muted-foreground">OUT OF 100</span>
              <span className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Grade {analysis.grade.letter}
              </span>
            </div>
          </div>

          <div className="mt-4 text-center sm:mt-0 sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge variant={analysis.grade.badgeVariant} className="px-3 py-1 text-sm font-semibold">
                <Award className="mr-1.5 size-3.5" />
                {analysis.grade.label}
              </Badge>
              {analysis.isReadyToApply ? (
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="mr-1 size-3" />
                  ATS Screen Ready
                </Badge>
              ) : null}
            </div>

            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              {analysis.grade.description}
            </p>

            <div className="mt-3 flex items-center justify-center gap-2 sm:justify-start">
              <span className="text-xs text-muted-foreground">Estimated ATS Pass Rate:</span>
              <span className={cn("text-xs font-bold", colors.text)}>
                {analysis.grade.interviewProbability}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row lg:flex-col">
          {onOpenBuilder ? (
            <Button onClick={onOpenBuilder} size="lg" className="w-full gap-2 sm:w-auto">
              <Sparkles className="size-4" />
              Fix & Edit in Builder
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.print()}
            className="w-full gap-2 sm:w-auto"
          >
            <FileDown className="size-4" />
            Print Score Report
          </Button>
        </div>
      </div>
    </div>
  );
}
