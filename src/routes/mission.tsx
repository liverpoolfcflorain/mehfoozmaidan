import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose, meta } from "@/components/site/SiteLayout";
import runnerAsset from "@/assets/runner.png.asset.json";

const coaching = runnerAsset.url;

export const Route = createFileRoute("/mission")({
  head: () => meta("Our mission and vision", "Why Mehfooz Maidan exists: opportunity, legal protection and accountability in Pakistani sport."),
  component: () => (
    <PageShell eyebrow="Mission & vision" title="Every athlete deserves protected ground." intro="Mehfooz Maidan exists to make sporting opportunity easier to discover, professional relationships more transparent, and legal help more accessible across Pakistan.">
      <img src={coaching} alt="Coach and athlete reviewing paperwork" loading="lazy" width={1504} height={1008} className="mb-24 aspect-[21/9] w-full rounded-3xl object-cover" />
      <Prose sections={[
        { h: "The problems we address", p: ["Access to opportunity: talented athletes often lack a credible way to show their ability to coaches, scouts, academies and boards.", "Legal protection: athletes and organisations sign agreements, sponsorships and payment arrangements without accessible advice.", "Trust: recruitment, credentials and contracts need verification, privacy and safeguards."] },
        { h: "Who we serve", p: ["Athletes at every level, sports professionals and organisations — coaches, scouts, clubs, academies, federations, schools and universities — and lawyers who want to support sport."] },
        { h: "How the three groups work together", p: ["Athletes connect with boards and coaches for discovery and development. Athletes and organisations connect with lawyers for questions, drafting and review. Every interaction respects each person's permissions and privacy settings."] },
        { h: "Our approach", p: ["We verify what we can and say clearly what verification does not guarantee. We never promise selection, legal outcomes or contract enforceability. AI tools help people prepare — qualified lawyers advise."] },
        { h: "Privacy & safeguarding", p: ["We collect only what is necessary, keep sensitive documents private, and apply guardian consent and extra protection for minors."] },
      ]} />
    </PageShell>
  ),
});
