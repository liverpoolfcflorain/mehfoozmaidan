import { createFileRoute } from "@tanstack/react-router";
import { PageShell, meta } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/how-it-works")({
  head: () => meta("How it works", "Register, get verified, connect and get legal support on Mehfooz Maidan."),
  component: Page,
});

const steps = [
  ["Register by role", "Choose athlete, sports professional or organisation, or lawyer. Each has its own registration flow and dashboard."],
  ["Get verified", "Submit the relevant credentials. Our team records every approval, so a verified badge always means a real review took place."],
  ["Connect & discover", "Search permitted profiles, send connection requests, and control exactly who can find and contact you."],
  ["Recruit & apply", "Organisations publish opportunities and manage pipelines from invitation to trial, offer and outcome."],
  ["Get legal support", "Request help from verified lawyers, draft agreements in Contract Studio and track real lawyer review."],
];

function Page() {
  return (
    <PageShell eyebrow="How it works" title="Five steps to a fairer game." intro="One platform, three distinct experiences — each with its own permissions and tools.">
      <ol className="grid gap-px overflow-hidden rounded-3xl bg-border">
        {steps.map(([t, d], i) => (
          <li key={t} className="grid gap-4 bg-background p-8 md:grid-cols-12 md:p-12">
            <span className="font-display text-5xl font-light text-gold md:col-span-2">0{i + 1}</span>
            <h2 className="text-3xl font-semibold md:col-span-4">{t}</h2>
            <p className="text-lg text-muted-foreground md:col-span-6">{d}</p>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
