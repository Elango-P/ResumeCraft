const STEPS = [
  {
    step: "01",
    title: "Choose a template",
    text: "Start with Classic ATS, Modern Professional, or Compact Tech.",
  },
  {
    step: "02",
    title: "Add your details",
    text: "Fill guided sections while a live A4 preview updates as you type.",
  },
  {
    step: "03",
    title: "Download PDF",
    text: "Export a print-ready, ATS-friendly resume you can submit today.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Three steps from a blank page to a professional resume.
      </p>
      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {STEPS.map((item) => (
          <li key={item.step} className="rounded-2xl border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-primary">{item.step}</p>
            <h3 className="mt-3 text-lg font-medium">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
