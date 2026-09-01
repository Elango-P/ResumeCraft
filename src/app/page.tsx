import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TemplatePreviewCards } from "@/components/landing/template-preview-cards";
import { TrustRow } from "@/components/landing/trust-row";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TrustRow />
        <HowItWorks />
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Professional templates</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Start from a layout that already follows current hiring standards.
          </p>
          <TemplatePreviewCards className="mt-8" />
        </section>
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
