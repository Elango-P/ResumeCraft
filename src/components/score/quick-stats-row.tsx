"use client";

import {
  FileText,
  Percent,
  Zap,
  Code2,
  BookOpen,
  Clock,
} from "lucide-react";
import type { DetailedResumeAnalysis } from "@/features/scoring/scoring-engine.types";
import { cn } from "@/lib/utils";

interface QuickStatsRowProps {
  stats: DetailedResumeAnalysis["stats"];
}

export function QuickStatsRow({ stats }: QuickStatsRowProps) {
  const items = [
    {
      label: "Length & Words",
      value: `${stats.wordCount} words`,
      subtext: `~${stats.estimatedPages} page${stats.estimatedPages === 1 ? "" : "s"} (Optimal 450-850)`,
      icon: FileText,
      color: stats.wordCount >= 400 && stats.wordCount <= 900 ? "text-emerald-500" : "text-amber-500",
    },
    {
      label: "Quantified Impact",
      value: `${stats.quantifiedPercentage}%`,
      subtext: `${stats.quantifiedBulletCount} of ${stats.bulletCount} bullets have metrics`,
      icon: Percent,
      color: stats.quantifiedPercentage >= 35 ? "text-emerald-500" : stats.quantifiedPercentage >= 18 ? "text-amber-500" : "text-rose-500",
    },
    {
      label: "Power Action Verbs",
      value: `${stats.actionVerbPercentage}%`,
      subtext: `${stats.actionVerbBulletCount} of ${stats.bulletCount} lead with active verbs`,
      icon: Zap,
      color: stats.actionVerbPercentage >= 70 ? "text-emerald-500" : "text-amber-500",
    },
    {
      label: "Skills Detected",
      value: `${stats.hardSkillsFound.length + stats.softSkillsFound.length} skills`,
      subtext: `${stats.hardSkillsFound.length} tech · ${stats.softSkillsFound.length} leadership`,
      icon: Code2,
      color: stats.hardSkillsFound.length >= 8 ? "text-emerald-500" : "text-amber-500",
    },
    {
      label: "Readability Score",
      value: `${stats.fleschReadingEase}/100`,
      subtext: stats.fleschGradeLevel,
      icon: BookOpen,
      color: stats.fleschReadingEase >= 30 && stats.fleschReadingEase <= 75 ? "text-emerald-500" : "text-amber-500",
    },
    {
      label: "Reading Time",
      value: `${stats.readingTimeSeconds}s`,
      subtext: "Recruiters skim in 6–8s",
      icon: Clock,
      color: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border bg-card/60 p-3 shadow-xs"
          >
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon className={cn("size-3.5", item.color)} />
              <span className="truncate">{item.label}</span>
            </div>
            <div className="mt-2">
              <div className="text-base font-bold tracking-tight text-foreground">
                {item.value}
              </div>
              <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {item.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
