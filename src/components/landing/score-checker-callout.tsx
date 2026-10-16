import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ScoreCheckerCallout() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-card to-background p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary font-semibold">
                <Sparkles className="mr-1.5 size-3.5" />
                Free ATS Score Checker
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Real Recruiter Heuristics
              </Badge>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Will your resume pass the 6-second recruiter test?
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Top tech companies filter out up to 75% of resumes with applicant tracking systems. Test your resume with our real scoring engine to analyze data-driven metrics, power verbs, and ATS keyword gaps before you apply.
            </p>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 pt-2 text-xs text-foreground font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Real 0–100 score &amp; letter grade</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Quantified impact &amp; metrics check</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Target job description keyword match</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Actionable line-by-line recommendations</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild className="gap-2">
                <Link href="/score">
                  Check My Resume Score
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/builder">Open Resume Builder</Link>
              </Button>
            </div>
          </div>

          {/* Interactive Graphic / Preview Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" />
                  <span className="text-xs font-bold text-foreground">ATS Diagnostic Score</span>
                </div>
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-[11px] font-bold">
                  Grade A+ · Top 5%
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-4 py-2">
                <div>
                  <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    92<span className="text-xs font-normal text-muted-foreground">/100</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground font-medium">
                    Strong Callback Likelihood
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-[11px] text-right font-medium text-muted-foreground">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ 75% Quantified Impact</span>
                  <span className="text-teal-600 dark:text-teal-400 font-semibold">✓ 88% Power Action Verbs</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">✓ 84% ATS Job Match</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Impact &amp; Metrics</span>
                  <span className="font-semibold text-foreground">24/25 pts</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "96%" }} />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">ATS Structure &amp; Format</span>
                  <span className="font-semibold text-foreground">25/25 pts</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
