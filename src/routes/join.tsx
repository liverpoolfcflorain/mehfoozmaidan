import { createFileRoute } from "@tanstack/react-router";
import { PageShell, meta } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/join")({
  head: () => meta("Join", "Register on Mehfooz Maidan as an athlete, sports professional or organisation, or lawyer."),
  component: Page,
});

const roles = [
  ["Athlete", "Build your sporting portfolio and discover opportunities."],
  ["Sports professional or organisation", "Coaches, scouts, clubs, academies and boards."],
  ["Lawyer", "Verified legal professionals supporting sport."],
];

function Page() {
  return (
    <PageShell eyebrow="Join" title="Choose your path." intro="Each role has its own registration, verification and dashboard. Registration opens shortly.">
      <div className="grid gap-4 md:grid-cols-3">
        {roles.map(([t, d]) => (
          <div key={t} className="flex flex-col rounded-3xl bg-card p-8">
            <h2 className="text-2xl font-semibold">{t}</h2>
            <p className="mt-3 flex-1 text-muted-foreground">{d}</p>
            <span className="mt-8 w-fit rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">Opening soon</span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
