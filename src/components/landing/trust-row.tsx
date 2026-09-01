import { Download, Lock, ShieldCheck, Sparkles } from "lucide-react";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "ATS-friendly",
    text: "Selectable HTML text, simple structure, and no graphics that break parsers.",
  },
  {
    icon: Download,
    title: "PDF export",
    text: "Print to a clean A4 PDF with page-break support and professional margins.",
  },
  {
    icon: Lock,
    title: "Privacy-first",
    text: "Drafts save on your device. You can export without creating an account.",
  },
  {
    icon: Sparkles,
    title: "No design skills",
    text: "Guided sections and live preview keep the layout professional for you.",
  },
];

export function TrustRow() {
  return (
    <section className="border-y bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex gap-3">
            <item.icon className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-medium">{item.title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
