import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex-1 max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 1 September 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">
          <p>
            ResumeCraft is a local-first resume builder. You can create and export a resume
            without creating an account.
          </p>
          <h2 className="text-base font-medium text-foreground">What we store</h2>
          <p>
            Resume drafts are saved in your browser using local storage under a versioned key
            (`resumecraft:v1`). This includes resume content, template choice, and editor
            settings. It does not include passwords or authentication tokens.
          </p>
          <h2 className="text-base font-medium text-foreground">What we do not collect</h2>
          <p>
            This version does not sync resumes to a server, does not require sign-in, and does
            not use advertising trackers. If you print or save a PDF, that file stays on your
            device.
          </p>
          <h2 className="text-base font-medium text-foreground">Your controls</h2>
          <p>
            You can clear a draft from Resume Settings, create a new resume, or remove site
            data from your browser to delete stored drafts.
          </p>
          <h2 className="text-base font-medium text-foreground">Future accounts</h2>
          <p>
            Optional cloud sync may be added later using a provider such as Supabase. If that
            happens, you will be asked to opt in. Authentication tokens will never be stored
            manually in localStorage.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
