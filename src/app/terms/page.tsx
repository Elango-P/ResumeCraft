import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex-1 max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Terms of use</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 1 September 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">
          <p>
            ResumeCraft is provided as a tool for creating professional resumes. You are
            responsible for the accuracy of the information you enter and for how you use
            exported files.
          </p>
          <h2 className="text-base font-medium text-foreground">No employment guarantee</h2>
          <p>
            The Resume Score panel is a practical writing checklist. It does not guarantee
            interviews, ATS selection, or job offers.
          </p>
          <h2 className="text-base font-medium text-foreground">Local drafts</h2>
          <p>
            Drafts stored in your browser can be lost if you clear site data, switch browsers,
            or use another device. Export a PDF if you need a lasting copy.
          </p>
          <h2 className="text-base font-medium text-foreground">Acceptable use</h2>
          <p>
            Do not use ResumeCraft to create misleading credentials or to impersonate another
            person. Templates and software are provided for personal career use.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
