"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  return (
    <header className="print-hidden sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <div
        className={cn(
          "mx-auto flex items-center justify-between gap-4 px-4 sm:px-6",
          compact ? "h-14 max-w-none" : "h-16 max-w-6xl",
        )}
      >
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="size-4" aria-hidden="true" />
          </span>
          <span>ResumeCraft</span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              asChild
              className={cn(pathname === item.href && "bg-muted text-foreground")}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {pathname !== "/builder" ? (
            <Button size="sm" asChild>
              <Link href="/builder">Create My Resume</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
