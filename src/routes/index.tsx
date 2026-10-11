import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import heroAsset from "@/assets/stadium.png.asset.json";
import footballAsset from "@/assets/football.png.asset.json";
import runnerAsset from "@/assets/runner.png.asset.json";

const hero = heroAsset.url;
const cricket = footballAsset.url;
const coaching = runnerAsset.url;
import { SiteHeader, SiteFooter, meta } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/")({
  head: () => meta("Protected ground for Pakistani sport", "Mehfooz Maidan connects athletes, sports boards and coaches, and lawyers in one accountable ecosystem."),
  component: Home,
});

const tags = ["Verified profiles", "Recruitment", "Legal requests", "Contract Studio", "Safeguarding"];

const groups = [
  { n: "01", t: "Athletes", d: "Build a credible sporting portfolio, control who sees it, discover opportunities and request legal help before you sign." },
  { n: "02", t: "Boards & coaches", d: "Find athletes by sport, level and region, run transparent recruitment, and manage your organisation's staff and permissions." },
  { n: "03", t: "Lawyers", d: "Receive matched requests, review agreements in protected workspaces, and support sport with verified credentials." },
];

function Home() {
  return (
    <div>
      <section className="relative p-3 md:p-4">
        <SiteHeader overlay />
        <div className="relative h-[94vh] min-h-[640px] overflow-hidden rounded-[2rem]">
          <img src={hero} alt="Field hockey player striking the ball at sunset" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-charcoal/25" />
          <div className="relative flex h-full flex-col justify-between px-6 pb-8 pt-36 text-on-image md:px-12">
            <div className="max-w-3xl">
              <h1 className="display-xl fade-up">Protected<br />ground.</h1>
              <p className="fade-up mt-8 max-w-md text-lg opacity-90">
                Opportunity, professional connection and legal access for Pakistani sport — in one accountable platform.
              </p>
              <div className="fade-up mt-8 flex items-center gap-3">
                <Link to="/join" className="rounded-full bg-on-image px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-gold">Join Mehfooz Maidan</Link>
                <Link to="/mission" aria-label="Read our mission" className="grid h-11 w-11 place-items-center rounded-full bg-on-image text-charcoal transition hover:bg-gold"><ArrowUpRight size={18} /></Link>
              </div>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <p className="font-display text-[18vw] font-semibold leading-[0.75] tracking-[-0.06em] opacity-30 md:text-[13vw]">maidan</p>
              <div className="hidden max-w-sm flex-wrap justify-end gap-2 md:flex">
                {tags.map((t) => <span key={t} className="glass-dark rounded-full px-4 py-1.5 text-xs">{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-32 md:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <p className="eyebrow text-primary">// Three groups, one ecosystem</p>
          <h2 className="text-6xl font-semibold leading-none md:text-9xl">Together.</h2>
        </div>
        <div className="mt-20 grid gap-px overflow-hidden rounded-3xl bg-border md:grid-cols-3">
          {groups.map((g) => (
            <div key={g.n} className="bg-background p-8 md:p-10">
              <span className="font-display text-sm text-gold">{g.n}</span>
              <h3 className="mt-10 text-3xl font-semibold">{g.t}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{g.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pt-32 md:grid-cols-12 md:px-8">
        <div className="relative overflow-hidden rounded-3xl md:col-span-5">
          <img src={cricket} alt="Young cricketer batting in the nets" loading="lazy" width={1200} height={1504} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col gap-6 md:col-span-7">
          <div className="rounded-3xl bg-card p-10 md:p-14">
            <p className="eyebrow text-primary">Why it matters</p>
            <h2 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">Talent deserves a fair contract — and a fair chance to be seen.</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Many athletes sign agreements they do not fully understand, and many are never discovered at all. Mehfooz Maidan brings recruitment, verification and legal support into the same accountable space.
            </p>
            <Link to="/mission" className="mt-8 inline-flex items-center gap-2 font-semibold text-primary">Read our mission <ArrowRight size={16} /></Link>
          </div>
          <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-3xl">
            <img src={coaching} alt="Athlete and coach reviewing a document trackside" loading="lazy" width={1504} height={1008} className="absolute inset-0 h-full w-full object-cover" />
            <div className="glass-dark absolute bottom-5 left-5 right-5 rounded-2xl p-5 md:right-auto md:max-w-xs">
              <p className="text-sm font-semibold">Contract Studio</p>
              <p className="mt-1 text-sm opacity-80">Draft with AI, then request review from a verified lawyer. Drafts are never presented as legal approval.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="mission-video" className="mx-auto max-w-7xl px-6 pt-32 md:px-8">
        <div className="grid gap-10 rounded-3xl bg-primary p-10 text-primary-foreground md:grid-cols-2 md:p-16">
          <div>
            <p className="eyebrow text-gold">Mission film</p>
            <h2 className="mt-6 text-4xl font-semibold md:text-6xl">Our story, in our athletes' words.</h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-lg opacity-85">The mission film will be published here by the Mehfooz Maidan team. We will not show staged or borrowed footage.</p>
            <Link to="/how-it-works" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-on-image px-6 py-3 text-sm font-semibold text-charcoal hover:bg-gold">See how it works <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
