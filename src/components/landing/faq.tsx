import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = [
  {
    q: "Do I need an account?",
    a: "No. You can create, edit, preview, and download a resume without signing in. Drafts are saved in your browser.",
  },
  {
    q: "Is the resume ATS-friendly?",
    a: "Templates use real HTML text, not images or canvases. Classic ATS is a single-column layout without photos, icons, or skill bars.",
  },
  {
    q: "Where is my data stored?",
    a: "On this device, in local storage. ResumeCraft does not upload your resume unless you later connect an optional cloud account.",
  },
  {
    q: "How does PDF download work?",
    a: "Download PDF opens your browser’s print dialog with A4 page settings. Choose “Save as PDF” to keep selectable text.",
  },
  {
    q: "Can I make more than one resume?",
    a: "Yes. Create, duplicate, and switch between multiple drafts from Resume Settings in the builder.",
  },
];

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
      <Accordion className="mt-6" type="single" collapsible>
        {FAQ.map((item, index) => (
          <AccordionItem key={item.q} value={`item-${index}`}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
