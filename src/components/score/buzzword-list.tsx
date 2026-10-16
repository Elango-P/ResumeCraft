"use client";

import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BuzzwordListProps {
  buzzwords: { word: string; suggestion: string }[];
}

export function BuzzwordList({ buzzwords }: BuzzwordListProps) {
  if (buzzwords.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-emerald-800 dark:text-emerald-300">
        <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
        <div>
          <span className="text-sm font-semibold">Zero Overused Buzzwords Found</span>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Your resume is free of filler phrases like &quot;team player&quot; or &quot;results-driven&quot;. This keeps your resume credible and professional.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Clichés & Generic Buzzwords Detected ({buzzwords.length})
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Recruiters view these as generic claims. Replace them with concrete outcomes.
          </p>
        </div>
        <Badge variant="outline" className="border-amber-500/40 text-amber-600 text-xs">
          <AlertTriangle className="mr-1 size-3" />
          {buzzwords.length} Cliché{buzzwords.length === 1 ? "" : "s"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {buzzwords.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-lg border bg-muted/20 p-3.5 space-y-2"
          >
            <div className="flex items-center gap-2">
              <span className="rounded bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400 line-through">
                &quot;{item.word}&quot;
              </span>
            </div>
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <ArrowRight className="size-3.5 shrink-0 text-primary mt-0.5" />
              <span>{item.suggestion}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
