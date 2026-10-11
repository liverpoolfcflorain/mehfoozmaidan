import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose, meta } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => meta("Contact and safeguarding", "Contact Mehfooz Maidan and report safeguarding concerns."),
  component: () => (
    <PageShell eyebrow="Contact & safeguarding" title="We're listening." intro="For safeguarding concerns involving a minor or immediate danger, contact local emergency services first.">
      <Prose sections={[
        { h: "Safeguarding", p: ["Signed-in users can report or block any account from its profile or conversation. Safeguarding reports are escalated to our moderation team."] },
        { h: "General enquiries", p: ["A secure contact form will be available here once accounts launch."] },
      ]} />
    </PageShell>
  ),
});
