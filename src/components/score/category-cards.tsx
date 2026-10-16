"use client";

import { CheckCircle2, AlertTriangle, XCircle, ArrowUpRight } from "lucide-react";
import type { CategoryScore, ScoreCategory } from "@/features/scoring/scoring-engine.types";
import { cn } from "@/lib/utils";

interface CategoryCardsProps {
  categories: Record<ScoreCategory, CategoryScore>;
  activeCategory?: ScoreCategory | "all";
  onSelectCategory?: (category: ScoreCategory | "all") => void;
}

export function CategoryCards({
  categories,
  activeCategory = "all",
  onSelectCategory,
}: CategoryCardsProps) {
  const getStatusBadge = (status: CategoryScore["status"]) => {
    switch (status) {
      case "excellent":
        return {
          icon: CheckCircle2,
          color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          text: "Excellent",
        };
      case "good":
        return {
          icon: CheckCircle2,
          color: "text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20",
          text: "Good",
        };
      case "needs-work":
        return {
          icon: AlertTriangle,
          color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
          text: "Needs Work",
        };
      case "poor":
      default:
        return {
          icon: XCircle,
          color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
          text: "Critical",
        };
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 21) return "bg-emerald-500";
    if (score >= 17) return "bg-teal-500";
    if (score >= 13) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Object.values(categories).map((cat) => {
        const badge = getStatusBadge(cat.status);
        const Icon = badge.icon;
        const isSelected = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory?.(isSelected ? "all" : cat.id)}
            className={cn(
              "group relative flex flex-col justify-between rounded-xl border bg-card p-4 text-left transition-all hover:border-foreground/20 hover:shadow-sm",
              isSelected && "ring-2 ring-primary border-primary",
            )}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {cat.id}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                    badge.color,
                  )}
                >
                  <Icon className="size-3" />
                  {badge.text}
                </span>
              </div>

              <h3 className="mt-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </h3>

              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {cat.score}
                </span>
                <span className="text-xs text-muted-foreground">/ {cat.maxScore} pts</span>
                <span className="ml-auto text-xs font-semibold text-muted-foreground">
                  {cat.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", getProgressColor(cat.score))}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>

              <p className="mt-2.5 line-clamp-2 text-xs text-muted-foreground">
                {cat.summary}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-primary">
              <span>{isSelected ? "Showing related issues" : "Filter related issues"}</span>
              <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
