import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose, meta } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/disclaimer")({
  head: () => meta("Legal disclaimer", "Information and AI drafts on Mehfooz Maidan are not legal advice."),
  component: () => (
    <PageShell eyebrow="Disclaimer" title="Legal disclaimer.">
      <Prose sections={[
        { h: "Not legal advice", p: ["General information, resources and AI-generated content on this platform are not personalised legal advice."] },
        { h: "AI drafts", p: ["Contract Studio output is always a draft. It is not enforceable, signed or lawyer-approved unless that process actually occurs."] },
        { h: "Verification", p: ["A verified badge means our team reviewed specific documents. It does not guarantee a person's conduct or future performance."] },
      ]} />
    </PageShell>
  ),
});
