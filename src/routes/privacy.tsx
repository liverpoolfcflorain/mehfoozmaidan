import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose, meta } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => meta("Privacy policy", "How Mehfooz Maidan collects, protects and lets you control your data."),
  component: () => (
    <PageShell eyebrow="Privacy" title="Privacy policy." intro="Draft policy — to be reviewed by counsel before launch.">
      <Prose sections={[
        { h: "What we collect", p: ["Only information needed to run the platform: account details, profile content you choose to add, and verification documents you submit."] },
        { h: "How we protect it", p: ["Identity documents, credentials, contracts and evidence are kept in private storage with strict access controls."] },
        { h: "Your controls", p: ["You control profile visibility and contact preferences, and can request export or deletion of your account."] },
        { h: "AI processing", p: ["We avoid sending confidential documents or sensitive personal data to AI providers unnecessarily and tell you when AI is used."] },
      ]} />
    </PageShell>
  ),
});
