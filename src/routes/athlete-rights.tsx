import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose, meta } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/athlete-rights")({
  head: () => meta("Athlete rights", "General guidance for athletes in Pakistan on contracts, payments, image rights and safeguarding."),
  component: () => (
    <PageShell eyebrow="Athlete rights" title="Know before you sign." intro="General educational information. It is not legal advice — for your situation, speak to a verified lawyer.">
      <Prose sections={[
        { h: "Read every agreement", p: ["You can ask for time to read a contract and to have it reviewed. Make sure duration, payment, termination and obligations are written clearly."] },
        { h: "Payments & prize money", p: ["Ask how and when you will be paid, what deductions apply, and what happens if payment is late. Keep written records."] },
        { h: "Your image and name", p: ["Media and sponsorship agreements may let others use your image. Understand where, for how long and whether you are compensated."] },
        { h: "Minors & guardians", p: ["Athletes under 18 should involve a parent or guardian in any agreement. Mehfooz Maidan applies guardian consent and extra safeguards for minors."] },
        { h: "Jurisdiction & review", p: ["Resources here concern Pakistan. Curated references with review dates will be added by our legal team; where none are listed, we say so rather than guess."] },
      ]} />
    </PageShell>
  ),
});
