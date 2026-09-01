import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function SiteFooter() {
  return (
    <footer className="print-hidden border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-semibold">ResumeCraft</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            A privacy-first resume builder. Drafts stay on your device until you choose to
            export them.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm" aria-label="Footer">
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
