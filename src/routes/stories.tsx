import { createFileRoute } from "@tanstack/react-router";
import { PageShell, EmptyState, meta } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/stories")({
  head: () => meta("Research and stories", "Research, explainers and real stories from Pakistani sport."),
  component: () => (
    <PageShell eyebrow="Research & stories" title="Real voices only." intro="We publish genuine research and stories — never fabricated interviews or findings.">
      <EmptyState title="Nothing published yet" body="Our editorial team will publish research, explainers and stories here." />
    </PageShell>
  ),
});
