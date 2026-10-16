import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-primary">ATS-friendly resume builder</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Create a job-winning resume in minutes.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground text-pretty">
          ResumeCraft helps you write a professional, ATS-friendly resume with a live A4
          preview, polished templates, and a clean PDF export. No design skills required.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/builder">
              Create My Resume
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/score">Check Resume Score</Link>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <Link href="/templates">View Templates</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
