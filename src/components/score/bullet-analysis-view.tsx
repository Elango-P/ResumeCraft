"use client";

import { useState } from "react";
import { Check, AlertTriangle, XCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { BulletAnalysis } from "@/features/scoring/scoring-engine.types";
import { cn } from "@/lib/utils";

interface BulletAnalysisViewProps {
  bullets: BulletAnalysis[];
}

export function BulletAnalysisView({ bullets }: BulletAnalysisViewProps) {
  const [filter, setFilter] = useState<"all" | "needs-metric" | "weak-verb" | "strong">("all");
  const [search, setSearch] = useState("");

  const filteredBullets = bullets.filter((b) => {
    if (filter === "needs-metric" && b.hasMetric) return false;
    if (filter === "weak-verb" && !b.isWeakVerb) return false;
    if (filter === "strong" && b.status !== "strong") return false;
    if (search.trim() && !b.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (bullets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center text-muted-foreground text-sm">
        No individual bullet points were detected. Add experience bullets starting with action verbs to inspect them.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant={filter === "all" ? "default" : "outline"}
            className="cursor-pointer px-2.5 py-1 text-xs"
            onClick={() => setFilter("all")}
          >
            All Bullets ({bullets.length})
          </Badge>
          <Badge
            variant={filter === "strong" ? "default" : "outline"}
            className="cursor-pointer px-2.5 py-1 text-xs"
            onClick={() => setFilter("strong")}
          >
            High Impact ({bullets.filter((b) => b.status === "strong").length})
          </Badge>
          <Badge
            variant={filter === "needs-metric" ? "default" : "outline"}
            className="cursor-pointer px-2.5 py-1 text-xs"
            onClick={() => setFilter("needs-metric")}
          >
            Missing Metric ({bullets.filter((b) => !b.hasMetric).length})
          </Badge>
          <Badge
            variant={filter === "weak-verb" ? "default" : "outline"}
            className="cursor-pointer px-2.5 py-1 text-xs"
            onClick={() => setFilter("weak-verb")}
          >
            Passive Openings ({bullets.filter((b) => b.isWeakVerb).length})
          </Badge>
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search bullets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      {/* Bullets List */}
      <div className="space-y-2.5">
        {filteredBullets.map((bullet, idx) => (
          <div
            key={idx}
            className={cn(
              "rounded-xl border bg-card p-3.5 transition-all",
              bullet.status === "strong"
                ? "border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/5"
                : bullet.isWeakVerb || bullet.hasFirstPerson
                ? "border-rose-500/30"
                : "border-border",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs leading-relaxed text-foreground font-normal">
                {bullet.text}
              </p>
              <span className="shrink-0 text-[10px] text-muted-foreground font-mono">
                {bullet.wordCount} words
              </span>
            </div>

            {/* Badges row */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {bullet.hasMetric ? (
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] py-0">
                  <Check className="mr-1 size-2.5" />
                  Metric: {bullet.metricFound}
                </Badge>
              ) : (
                <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] py-0">
                  <AlertTriangle className="mr-1 size-2.5" />
                  No metric detected
                </Badge>
              )}

              {bullet.startsWithActionVerb ? (
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] py-0">
                  <Check className="mr-1 size-2.5" />
                  Power Verb: {bullet.actionVerb}
                </Badge>
              ) : bullet.isWeakVerb ? (
                <Badge variant="outline" className="border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[10px] py-0">
                  <XCircle className="mr-1 size-2.5" />
                  Passive phrasing: &quot;{bullet.weakVerb}&quot;
                </Badge>
              ) : (
                <Badge variant="outline" className="border-muted text-muted-foreground text-[10px] py-0">
                  Missing action verb start
                </Badge>
              )}

              {bullet.hasFirstPerson ? (
                <Badge variant="outline" className="border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[10px] py-0">
                  <XCircle className="mr-1 size-2.5" />
                  First-person pronoun
                </Badge>
              ) : null}

              {bullet.wordCount < 8 ? (
                <Badge variant="outline" className="border-amber-500/30 text-amber-600 text-[10px] py-0">
                  Very short (&lt;8 words)
                </Badge>
              ) : bullet.wordCount > 35 ? (
                <Badge variant="outline" className="border-amber-500/30 text-amber-600 text-[10px] py-0">
                  Long bullet (&gt;35 words)
                </Badge>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
