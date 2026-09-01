import type { Metadata } from "next";
import { Suspense } from "react";
import { BuilderShell } from "@/components/builder/builder-shell";

export const metadata: Metadata = {
  title: "Builder",
  description: "Create and export an ATS-friendly resume with a live A4 preview.",
};

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading builder…</div>}>
      <BuilderShell />
    </Suspense>
  );
}
