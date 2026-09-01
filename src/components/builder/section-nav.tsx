"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SECTION_IDS } from "@/features/resume/resume.types";
import { SECTION_LABELS } from "@/features/resume/resume.utils";
import { useResumeDraft } from "@/features/resume/useResumeDraft";
import { cn } from "@/lib/utils";

export function SectionNav() {
  const { activeSection, setActiveSection, completion } = useResumeDraft();

  return (
    <nav aria-label="Resume sections">
      <ScrollArea className="h-full">
        <ul className="space-y-1 p-2">
          {SECTION_IDS.map((id, index) => {
            const complete = completion[id];
            const selected = activeSection === id;
            return (
              <li key={id}>
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "h-auto w-full justify-start gap-2 px-2 py-2 text-left whitespace-normal",
                    selected && "bg-muted text-foreground",
                  )}
                  aria-current={selected ? "page" : undefined}
                  onClick={() => setActiveSection(id)}
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                      complete
                        ? "border-primary bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                    aria-hidden="true"
                  >
                    {complete ? <Check className="size-3" /> : index + 1}
                  </span>
                  <span className="text-sm">{SECTION_LABELS[id]}</span>
                  <span className="sr-only">{complete ? "complete" : "incomplete"}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </nav>
  );
}
