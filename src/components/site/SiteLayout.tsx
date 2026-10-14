import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

export const navLinks = [
  { to: "/mission", label: "Mission" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/athlete-rights", label: "Athlete rights" },
  { to: "/legal-support", label: "Legal support" },
  { to: "/stories", label: "Stories" },
  { to: "/blog", label: "Blog" },
] as const;

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className={`flex items-baseline gap-1.5 ${light ? "text-on-image" : "text-foreground"}`}>
      <span className="font-display text-xl font-bold tracking-tight">Mehfooz</span>
      <span className="font-display text-xl font-light tracking-tight">Maidan</span>
      <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
    </Link>
  );
}

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header className={`${overlay ? "absolute" : "relative"} inset-x-0 top-0 z-40 px-4 pt-4 md:px-8`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 ${overlay ? "glass-dark" : "glass border-border"}`}>
        <Wordmark light={overlay} />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium opacity-80 transition hover:opacity-100" activeProps={{ className: "opacity-100 text-gold" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/join" className={`hidden rounded-full px-4 py-2 text-sm font-semibold transition sm:inline-flex ${overlay ? "bg-on-image text-charcoal hover:bg-gold" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
            Join the platform
          </Link>
          <button className="rounded-full p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="glass mx-auto mt-2 flex max-w-7xl flex-col gap-1 rounded-3xl p-4 text-foreground lg:hidden" aria-label="Mobile">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 font-medium hover:bg-muted">{l.label}</Link>
          ))}
          <Link to="/join" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-primary px-4 py-2 text-center font-semibold text-primary-foreground">Join the platform</Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-32 bg-charcoal text-on-image">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <Wordmark light />
          <p className="mt-4 max-w-sm text-sm opacity-70">
            One accountable ecosystem for athletes, sports professionals and lawyers in Pakistan.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="eyebrow mb-2 text-gold">Platform</span>
          <Link to="/about" className="opacity-75 hover:opacity-100">About</Link>
          <Link to="/how-it-works" className="opacity-75 hover:opacity-100">How it works</Link>
          <Link to="/opportunities" className="opacity-75 hover:opacity-100">Opportunities</Link>
          <Link to="/contact" className="opacity-75 hover:opacity-100">Contact & safeguarding</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="eyebrow mb-2 text-gold">Legal</span>
          <Link to="/privacy" className="opacity-75 hover:opacity-100">Privacy policy</Link>
          <Link to="/terms" className="opacity-75 hover:opacity-100">Terms of use</Link>
          <Link to="/disclaimer" className="opacity-75 hover:opacity-100">Legal disclaimer</Link>
        </div>
      </div>
      <div className="border-t border-on-image/10 px-6 py-6 text-center text-xs opacity-50">
        © {new Date().getFullYear()} Mehfooz Maidan. Information on this platform is not legal advice.
      </div>
    </footer>
  );
}

export function PageShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string | undefined; children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 pt-20 md:px-8 md:pt-28">
        <p className="eyebrow fade-up text-primary">{eyebrow}</p>
        <h1 className="fade-up mt-4 max-w-5xl text-5xl font-semibold leading-[0.95] md:text-8xl">{title}</h1>
        {intro && <p className="fade-up mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">{intro}</p>}
      </section>
      <div className="mx-auto max-w-7xl px-6 pt-20 md:px-8">{children}</div>
      <SiteFooter />
    </div>
  );
}

export function Prose({ sections }: { sections: { h: string; p: string[] }[] }) {
  return (
    <div className="grid gap-16">
      {sections.map((s) => (
        <div key={s.h} className="grid gap-6 border-t pt-10 md:grid-cols-12">
          <h2 className="text-2xl font-semibold md:col-span-4 md:text-3xl">{s.h}</h2>
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground md:col-span-8">
            {s.p.map((t, i) => <p key={i}>{t}</p>)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, body, cta }: { title: string; body: string; cta?: { to: string; label: string } }) {
  return (
    <div className="rounded-3xl bg-card px-8 py-20 text-center">
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">{body}</p>
      {cta && (
        <Link to={cta.to} className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">{cta.label}</Link>
      )}
    </div>
  );
}

export function meta(title: string, description: string) {
  return {
    meta: [
      { title: `${title} — Mehfooz Maidan` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — Mehfooz Maidan` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
