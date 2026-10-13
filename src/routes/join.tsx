import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PageShell, meta } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/join")({
  head: () => meta("Join", "Register on Mehfooz Maidan as an athlete, sports professional or organisation, or lawyer."),
  component: Page,
});

const roles = [
  ["athlete", "Athlete", "Build your sporting portfolio and discover opportunities.", "Join this portal →"],
  ["sports", "Sports professional or organisation", "Coaches, scouts, clubs, academies and boards.", "Join this portal →"],
  ["lawyer", "Lawyer", "Verified legal professionals supporting sport.", "Join this portal →"],
] as const;

function Page() {
  return (
    <PageShell eyebrow="Join" title="Choose your path." intro="Each role has its own registration, verification and dashboard. Pick a portal to create your account or sign in.">
      <div className="grid gap-4 md:grid-cols-3">
        {roles.map(([slug, t, d, cta]) => (
          <Link key={slug} to="/$role/login" params={{ role: slug }} className="flex flex-col rounded-3xl bg-card p-8 transition hover:ring-2 hover:ring-ring">
            <h2 className="text-2xl font-semibold">{t}</h2>
            <p className="mt-3 flex-1 text-muted-foreground">{d}</p>
            <span className="mt-8 w-fit rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{cta}</span>
          </Link>
        ))}
      </div>
      <Link to="/$role/login" params={{ role: "admin" }} className="mt-8 inline-block text-xs text-muted-foreground hover:text-foreground">Admin</Link>
    </PageShell>
  );
}
