import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose, meta } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => meta("About", "About Mehfooz Maidan, a Pakistan-focused sports opportunity and legal-access platform."),
  component: () => (
    <PageShell eyebrow="About" title="A serious institution for sport." intro="Mehfooz Maidan — 'protected ground' — is a Pakistan-focused platform for sporting opportunity, professional networking and legal access.">
      <Prose sections={[
        { h: "What we are", p: ["One accountable ecosystem where athletes, sports professionals and lawyers interact through verified profiles and clear permissions."] },
        { h: "What we are not", p: ["Not a news site, a law-firm directory or a chatbot. We do not guarantee selection, legal outcomes or the legitimacy of unverified information."] },
      ]} />
    </PageShell>
  ),
});
