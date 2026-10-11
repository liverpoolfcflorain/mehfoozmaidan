import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose, meta } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => meta("Terms of use", "The terms that govern use of Mehfooz Maidan."),
  component: () => (
    <PageShell eyebrow="Terms" title="Terms of use." intro="Draft terms — to be reviewed by counsel before launch.">
      <Prose sections={[
        { h: "Accounts", p: ["Provide accurate information, keep your credentials secure and use only the role you are entitled to."] },
        { h: "Conduct", p: ["No harassment, impersonation, fraud or exploitation. We may suspend accounts that breach these terms."] },
        { h: "No guarantees", p: ["We do not guarantee selection, legal outcomes or contract enforceability."] },
      ]} />
    </PageShell>
  ),
});
