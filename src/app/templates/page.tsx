import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TemplatePreviewCards } from "@/components/landing/template-preview-cards";

export const metadata: Metadata = {
  title: "Templates",
  description: "Choose an ATS-friendly resume template and start editing immediately.",
};

export default function TemplatesPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex-1 max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Resume templates</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Every template is real HTML text you can select, print, and parse. Pick one and
          customize it in the builder.
        </p>
        <TemplatePreviewCards className="mt-10" />
      </main>
      <SiteFooter />
    </>
  );
}
