import { createFileRoute } from "@tanstack/react-router";
import { PageShell, EmptyState, meta } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/opportunities")({
  head: () => meta("Opportunities", "Trials, scholarships, coaching roles and recruitment published by verified sports organisations."),
  component: () => (
    <PageShell eyebrow="Opportunities" title="Open doors, verified sources." intro="Only approved organisations can publish opportunities here.">
      <EmptyState title="No opportunities published yet" body="When verified boards, clubs and academies publish trials or roles, they will appear here." cta={{ to: "/join", label: "Join as an organisation" }} />
    </PageShell>
  ),
});
