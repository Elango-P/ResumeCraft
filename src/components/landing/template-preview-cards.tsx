import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TEMPLATE_IDS } from "@/features/resume/resume.types";
import { TEMPLATE_META } from "@/features/resume/resume.utils";
import { cn } from "@/lib/utils";

function TemplateSketch({ id }: { id: (typeof TEMPLATE_IDS)[number] }) {
  if (id === "modern-professional") {
    return (
      <div className="grid h-40 grid-cols-[32%_1fr] overflow-hidden rounded-lg border bg-white text-[7px] text-slate-800">
        <div className="space-y-2 bg-slate-100 p-3">
          <div className="h-2.5 w-16 bg-slate-800" />
          <div className="h-1.5 w-12 bg-indigo-500" />
          <div className="mt-3 space-y-1">
            <div className="h-1 w-full bg-slate-300" />
            <div className="h-1 w-4/5 bg-slate-300" />
          </div>
        </div>
        <div className="space-y-2 p-3">
          <div className="h-1.5 w-14 bg-indigo-400" />
          <div className="h-1 w-full bg-slate-200" />
          <div className="h-1 w-5/6 bg-slate-200" />
          <div className="h-1 w-full bg-slate-200" />
        </div>
      </div>
    );
  }
  if (id === "compact-tech") {
    return (
      <div className="h-40 space-y-2 overflow-hidden rounded-lg border bg-white p-3 text-[7px]">
        <div className="flex items-end justify-between border-b-2 border-indigo-500 pb-2">
          <div>
            <div className="h-2.5 w-20 bg-slate-800" />
            <div className="mt-1 h-1.5 w-16 bg-indigo-500" />
          </div>
          <div className="h-6 w-24 bg-slate-100" />
        </div>
        <div className="h-1.5 w-16 bg-indigo-400" />
        <div className="h-1 w-full bg-slate-200" />
        <div className="h-1 w-4/5 bg-slate-200" />
        <div className="h-1 w-full bg-slate-200" />
      </div>
    );
  }
  return (
    <div className="h-40 space-y-2 overflow-hidden rounded-lg border bg-white p-4 text-center">
      <div className="mx-auto h-2.5 w-24 bg-slate-900" />
      <div className="mx-auto h-1.5 w-16 bg-slate-500" />
      <div className="mx-auto mt-2 h-px w-full bg-slate-800" />
      <div className="mx-auto h-1.5 w-20 bg-slate-700" />
      <div className="h-1 w-full bg-slate-200" />
      <div className="h-1 w-5/6 bg-slate-200" />
      <div className="h-1 w-full bg-slate-200" />
    </div>
  );
}

export function TemplatePreviewCards({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-3", className)}>
      {TEMPLATE_IDS.map((id) => {
        const meta = TEMPLATE_META[id];
        return (
          <article key={id} className="flex flex-col rounded-2xl border bg-card p-4 shadow-sm">
            <TemplateSketch id={id} />
            <h3 className="mt-4 font-medium">{meta.name}</h3>
            <p className="mt-1 flex-1 text-sm leading-6 text-muted-foreground">{meta.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">{meta.bestFor}</p>
            <Button className="mt-4" asChild>
              <Link href={`/builder?template=${id}`}>Use this template</Link>
            </Button>
          </article>
        );
      })}
    </div>
  );
}
