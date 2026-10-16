"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Lightbulb,
  ChevronDown,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  DetailedScoreIssue,
  IssueSeverity,
  ScoreCategory,
} from "@/features/scoring/scoring-engine.types";
import { cn } from "@/lib/utils";

interface IssueListProps {
  issues: DetailedScoreIssue[];
  selectedCategory: ScoreCategory | "all";
  onSelectCategory: (category: ScoreCategory | "all") => void;
}

export function IssueList({
  issues,
  selectedCategory,
  onSelectCategory,
}: IssueListProps) {
  const [severityFilter, setSeverityFilter] = useState<IssueSeverity | "all">("all");
  const [expandedIssueIds, setExpandedIssueIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIssueIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredIssues = issues.filter((issue) => {
    if (selectedCategory !== "all" && issue.category !== selectedCategory) return false;
    if (severityFilter !== "all" && issue.severity !== severityFilter) return false;
    return true;
  });

  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const suggestionCount = issues.filter((i) => i.severity === "suggestion").length;
  const successCount = issues.filter((i) => i.severity === "success").length;

  const getSeverityIcon = (sev: IssueSeverity) => {
    switch (sev) {
      case "critical":
        return <XCircle className="size-4 shrink-0 text-rose-500" />;
      case "warning":
        return <AlertTriangle className="size-4 shrink-0 text-amber-500" />;
      case "suggestion":
        return <Info className="size-4 shrink-0 text-blue-500" />;
      case "success":
        return <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />;
    }
  };

  const getSeverityBadge = (sev: IssueSeverity) => {
    switch (sev) {
      case "critical":
        return (
          <Badge variant="destructive" className="text-[11px] font-semibold">
            Critical Fix
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-semibold">
            Warning
          </Badge>
        );
      case "suggestion":
        return (
          <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-semibold">
            Tip
          </Badge>
        );
      case "success":
        return (
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
            Passed
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            size="sm"
            variant={severityFilter === "all" ? "default" : "outline"}
            onClick={() => setSeverityFilter("all")}
            className="h-8 text-xs"
          >
            All Items ({issues.length})
          </Button>
          {criticalCount > 0 ? (
            <Button
              size="sm"
              variant={severityFilter === "critical" ? "destructive" : "outline"}
              onClick={() => setSeverityFilter("critical")}
              className="h-8 text-xs"
            >
              Critical ({criticalCount})
            </Button>
          ) : null}
          {warningCount > 0 ? (
            <Button
              size="sm"
              variant={severityFilter === "warning" ? "secondary" : "outline"}
              onClick={() => setSeverityFilter("warning")}
              className="h-8 text-xs"
            >
              Warnings ({warningCount})
            </Button>
          ) : null}
          {suggestionCount > 0 ? (
            <Button
              size="sm"
              variant={severityFilter === "suggestion" ? "secondary" : "outline"}
              onClick={() => setSeverityFilter("suggestion")}
              className="h-8 text-xs"
            >
              Tips ({suggestionCount})
            </Button>
          ) : null}
          {successCount > 0 ? (
            <Button
              size="sm"
              variant={severityFilter === "success" ? "secondary" : "outline"}
              onClick={() => setSeverityFilter("success")}
              className="h-8 text-xs"
            >
              Strengths ({successCount})
            </Button>
          ) : null}
        </div>

        {selectedCategory !== "all" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectCategory("all")}
            className="h-8 self-start text-xs text-muted-foreground hover:text-foreground sm:self-auto"
          >
            Clear category filter ({selectedCategory})
          </Button>
        ) : null}
      </div>

      {/* Issues Accordion / List */}
      {filteredIssues.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
          <CheckCircle2 className="size-8 text-emerald-500" />
          <p className="mt-2 text-sm font-semibold text-foreground">
            No issues match the selected filter!
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try switching filters or viewing all checks.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue) => {
            const isExpanded = expandedIssueIds[issue.id] ?? (issue.severity === "critical" || issue.severity === "warning");
            const hasExample = Boolean(issue.exampleFix);

            return (
              <div
                key={issue.id}
                className={cn(
                  "overflow-hidden rounded-xl border bg-card transition-all",
                  issue.severity === "critical" && "border-rose-500/30 dark:border-rose-500/20",
                  issue.severity === "warning" && "border-amber-500/30 dark:border-amber-500/20",
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(issue.id)}
                  className="flex w-full items-start justify-between gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getSeverityIcon(issue.severity)}</div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {issue.title}
                        </span>
                        {getSeverityBadge(issue.severity)}
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {issue.category}
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                        {issue.message}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform duration-200 mt-1",
                      isExpanded && "rotate-180",
                    )}
                  />
                </button>

                {isExpanded ? (
                  <div className="border-t bg-muted/20 px-4 py-3.5 space-y-3">
                    {/* Why recruiters care */}
                    <div className="flex items-start gap-2.5 rounded-lg bg-background p-3 border">
                      <Info className="size-4 shrink-0 text-primary mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-foreground">
                          Why ATS & Recruiters Care:
                        </span>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                          {issue.whyItMatters}
                        </p>
                      </div>
                    </div>

                    {/* Example Fix / Recommended Action */}
                    {hasExample ? (
                      <div className="flex items-start gap-2.5 rounded-lg bg-emerald-500/5 dark:bg-emerald-500/10 p-3 border border-emerald-500/20">
                        <Lightbulb className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                        <div>
                          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                            Actionable Recommended Fix:
                          </span>
                          <p className="mt-0.5 text-xs text-foreground/90 font-mono leading-relaxed bg-background/80 rounded p-2 border mt-1.5">
                            {issue.exampleFix}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
