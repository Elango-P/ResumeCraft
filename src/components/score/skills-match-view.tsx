"use client";

import { useState } from "react";
import { Check, Copy, Target, Sparkles, CheckCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TargetJobMatch } from "@/features/scoring/scoring-engine.types";

interface SkillsMatchViewProps {
  hardSkills: string[];
  softSkills: string[];
  jobMatch?: TargetJobMatch;
}

export function SkillsMatchView({
  hardSkills,
  softSkills,
  jobMatch,
}: SkillsMatchViewProps) {
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const copyToClipboard = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Target Job Description Match Card if present */}
      {jobMatch ? (
        <div className="rounded-xl border bg-card p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Target className="size-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Target Job ATS Keyword Alignment
                </h3>
                <p className="text-xs text-muted-foreground">
                  {jobMatch.targetTitle ? `Role: ${jobMatch.targetTitle}` : "Scanned against provided Job Description"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">ATS Keyword Match:</span>
              <Badge
                variant={jobMatch.matchPercentage >= 75 ? "default" : "secondary"}
                className="text-sm font-bold px-2.5 py-0.5"
              >
                {jobMatch.matchPercentage}% Match
              </Badge>
            </div>
          </div>

          {/* Matched & Missing Keywords Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Matched Keywords */}
            <div className="rounded-lg border bg-emerald-500/5 dark:bg-emerald-500/10 p-3.5 border-emerald-500/20">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <Check className="size-3.5 text-emerald-600" />
                <span>Matched Skills ({jobMatch.matchedKeywords.length})</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                These keywords in your resume matched the job requirements.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {jobMatch.matchedKeywords.length > 0 ? (
                  jobMatch.matchedKeywords.map((kw) => (
                    <Badge
                      key={kw}
                      variant="outline"
                      className="border-emerald-500/30 bg-background text-emerald-700 dark:text-emerald-300 text-xs py-0.5"
                    >
                      ✓ {kw}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No direct keyword overlap found yet.</span>
                )}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="rounded-lg border bg-amber-500/5 dark:bg-amber-500/10 p-3.5 border-amber-500/20">
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
                  <Sparkles className="size-3.5 text-amber-600" />
                  <span>Missing High-Priority Keywords ({jobMatch.missingKeywords.length})</span>
                </div>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Click any keyword to copy and include it in your experience or skills section.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {jobMatch.missingKeywords.length > 0 ? (
                  jobMatch.missingKeywords.map((kw) => {
                    const isCopied = copiedKeyword === kw;
                    return (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => copyToClipboard(kw)}
                        className="group inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-background px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300 transition-colors hover:border-amber-500 hover:bg-amber-500/10"
                        title="Click to copy keyword"
                      >
                        <span>+ {kw}</span>
                        {isCopied ? (
                          <CheckCheck className="size-3 text-emerald-600" />
                        ) : (
                          <Copy className="size-2.5 opacity-50 group-hover:opacity-100" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <span className="text-xs text-emerald-600 font-medium">All key required skills matched!</span>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {jobMatch.recommendations.length > 0 ? (
            <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
              <span className="font-semibold text-foreground">ATS Tailoring Suggestions:</span>
              <ul className="list-disc pl-4 space-y-0.5">
                {jobMatch.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Detected Technical Skills Cloud */}
      <div className="rounded-xl border bg-card p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Detected Technical Skills ({hardSkills.length})
          </h3>
          <span className="text-xs text-muted-foreground">Scanned via 400+ tech dictionaries</span>
        </div>
        {hardSkills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {hardSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs py-0.5">
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            No technical skills detected. Ensure technologies like React, TypeScript, Python, AWS, Docker, or SQL are clearly stated.
          </p>
        )}
      </div>

      {/* Detected Soft & Leadership Skills Cloud */}
      <div className="rounded-xl border bg-card p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Detected Leadership & Cross-Functional Skills ({softSkills.length})
          </h3>
        </div>
        {softSkills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {softSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs py-0.5">
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            No cross-functional or leadership skills found. Consider mentioning mentorship, agile sprint delivery, or code reviews.
          </p>
        )}
      </div>
    </div>
  );
}
