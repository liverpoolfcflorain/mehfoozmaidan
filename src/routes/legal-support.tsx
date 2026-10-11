import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose, meta } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/legal-support")({
  head: () => meta("Legal support", "Request help from verified lawyers and draft sporting agreements in Contract Studio."),
  component: () => (
    <PageShell eyebrow="Legal support" title="Lawyers who understand sport." intro="Athletes, coaches and organisations can request legal assistance from verified lawyers.">
      <Prose sections={[
        { h: "Request assistance", p: ["Describe your issue, jurisdiction, deadline and preferred language. Eligible lawyers are notified without unnecessary personal detail."] },
        { h: "Protected workspaces", p: ["When a lawyer accepts, a private workspace holds messages, documents, drafts, comments and deadlines — visible only to participants."] },
        { h: "Contract Studio", p: ["Draft club, academy, coaching, sponsorship, representation, image-rights and prize-money agreements with AI assistance, then request real lawyer review. Every AI draft remains a draft."] },
        { h: "What this is not", p: ["Submitting a request does not by itself create a lawyer–client relationship, and no outcome is guaranteed."] },
      ]} />
    </PageShell>
  ),
});
