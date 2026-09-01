import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Start free. Upgrade later if you need cloud sync and extra exports.",
};

const FREE = [
  "Unlimited local drafts",
  "All three templates",
  "Live A4 preview",
  "ATS quality checker",
  "Print and PDF export",
];

const PRO = [
  "Everything in Free",
  "Optional account sync across devices",
  "Priority template updates",
  "Cover letter workspace",
  "Custom domain portfolio page",
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex-1 max-w-5xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Simple pricing</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          The full resume builder is free to use on this device. Pro is listed for a future
          cloud sync release and is not billed yet.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>For job seekers who want a serious resume today.</CardDescription>
              <p className="pt-2 text-3xl font-semibold">$0</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {FREE.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 size-4 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild>
                <Link href="/builder">Create My Resume</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>Coming later for teams and multi-device sync.</CardDescription>
              <p className="pt-2 text-3xl font-semibold">$12<span className="text-base font-normal text-muted-foreground">/mo</span></p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {PRO.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 size-4 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" disabled>
                Not available yet
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
