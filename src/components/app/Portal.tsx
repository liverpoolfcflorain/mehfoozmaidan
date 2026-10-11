import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Wordmark } from "@/components/site/SiteLayout";
import { homeFor, roleLabel, useMe, useSession, type Role } from "./auth";
import { AssistantWidget } from "./Assistant";

export type NavItem = { to: string; label: string };

export const portalNav: Record<Role, NavItem[]> = {
  athlete: [
    { to: "/athlete", label: "Overview" },
    { to: "/athlete/profile", label: "Profile & portfolio" },
    { to: "/athlete/opportunities", label: "Discover opportunities" },
    { to: "/athlete/applications", label: "Applications & invitations" },
    { to: "/athlete/network", label: "Connections & saved" },
    { to: "/athlete/messages", label: "Messages" },
    { to: "/athlete/legal", label: "Legal assistance" },
    { to: "/athlete/contracts", label: "Contract Studio" },
    { to: "/athlete/assistant", label: "AI Assistant" },
    { to: "/athlete/notifications", label: "Notifications" },
    { to: "/athlete/settings", label: "Settings" },
  ],
  sports: [
    { to: "/sports", label: "Overview" },
    { to: "/sports/profile", label: "Profile & verification" },
    { to: "/sports/discover", label: "Athlete discovery" },
    { to: "/sports/opportunities", label: "Opportunities & recruitment" },
    { to: "/sports/network", label: "Connections & shortlist" },
    { to: "/sports/messages", label: "Messages" },
    { to: "/sports/legal", label: "Legal support" },
    { to: "/sports/contracts", label: "Contract Studio" },
    { to: "/sports/assistant", label: "AI Assistant" },
    { to: "/sports/notifications", label: "Notifications" },
    { to: "/sports/settings", label: "Settings" },
  ],
  lawyer: [
    { to: "/lawyer", label: "Overview" },
    { to: "/lawyer/profile", label: "Profile & credentials" },
    { to: "/lawyer/requests", label: "Incoming requests" },
    { to: "/lawyer/matters", label: "Assigned matters" },
    { to: "/lawyer/contracts", label: "Contract review queue" },
    { to: "/lawyer/network", label: "Connections" },
    { to: "/lawyer/messages", label: "Case & general messages" },
    { to: "/lawyer/assistant", label: "AI Assistant" },
    { to: "/lawyer/notifications", label: "Notifications" },
    { to: "/lawyer/settings", label: "Settings" },
  ],
  admin: [
    { to: "/admin", label: "Analytics" },
    { to: "/admin/verification", label: "Verification" },
    { to: "/admin/athletes", label: "Athletes" },
    { to: "/admin/sports", label: "Sports & organisations" },
    { to: "/admin/lawyers", label: "Lawyers" },
    { to: "/admin/reports", label: "Reports & safeguarding" },
    { to: "/admin/content", label: "Content" },
    { to: "/admin/media", label: "Media & mission video" },
    { to: "/admin/audit", label: "Audit log" },
  ],
};

export function Portal({ role, children }: { role: Role; children: ReactNode }) {
  const { user, loading } = useSession();
  const me = useMe(user?.id);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: `/${role}/login` as "/athlete/login" });
  }, [loading, user, role, navigate]);

  const unread = useQuery({
    enabled: !!user,
    queryKey: ["unread", user?.id],
    refetchInterval: 30000,
    queryFn: async () => {
      const { count } = await supabase.from("notifications").select("id", { count: "exact", head: true }).is("read_at", null);
      return count ?? 0;
    },
  });

  if (loading || !user || me.isLoading || !me.data) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading your workspace…</div>;
  }
  const allowed = role === "admin" ? me.data.roles.includes("admin") : me.data.profile?.primary_role === role;
  if (!allowed) {
    const own = me.data.profile?.primary_role as Role | undefined;
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-semibold">This area is for {roleLabel[role].toLowerCase()}s</h1>
          <p className="mt-3 text-muted-foreground">Your account doesn't have access to this portal.</p>
          <Link to={homeFor(own)} className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Go to my dashboard</Link>
        </div>
      </div>
    );
  }

  const nav = portalNav[role];
  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/" }); };

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[280px_1fr]">
      <aside className={`${open ? "fixed inset-0 z-50 block" : "hidden"} bg-charcoal text-on-image lg:sticky lg:top-0 lg:block lg:h-screen`}>
        <div className="flex h-full flex-col overflow-y-auto p-6">
          <div className="flex items-center justify-between">
            <Wordmark light />
            <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
          </div>
          <p className="eyebrow mt-8 text-gold">{roleLabel[role]}</p>
          <p className="mt-1 truncate text-sm opacity-70">{me.data.profile?.full_name || user.email}</p>
          <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Dashboard">
            {nav.map((n) => (
              <Link key={n.to} to={n.to as "/athlete"} onClick={() => setOpen(false)} activeOptions={{ exact: n.to.split("/").length === 2 }}
                className="rounded-xl px-3 py-2 text-sm opacity-75 transition hover:bg-on-image/10 hover:opacity-100"
                activeProps={{ className: "bg-on-image/10 opacity-100 text-gold" }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <button onClick={signOut} className="mt-6 flex items-center gap-2 rounded-xl px-3 py-2 text-sm opacity-75 hover:bg-on-image/10"><LogOut size={16} /> Sign out</button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="glass sticky top-0 z-30 flex items-center justify-between border-b px-6 py-3">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
          <Link to="/" className="hidden text-sm text-muted-foreground hover:text-foreground lg:block">← Public site</Link>
          {role !== "admin" && (
            <Link to={`/${role}/notifications` as "/athlete/notifications"} className="relative rounded-full p-2 hover:bg-muted" aria-label="Notifications">
              <Bell size={20} />
              {!!unread.data && <span className="absolute -right-0.5 -top-0.5 rounded-full bg-gold px-1.5 text-[10px] font-bold text-charcoal">{unread.data}</span>}
            </Link>
          )}
        </header>
        <main className="mx-auto max-w-6xl px-6 py-10 md:px-10">{children}</main>
      </div>
      {role !== "admin" && <AssistantWidget />}
    </div>
  );
}

export function PageHead({ title, intro, action }: { title: string; intro?: string; action?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-4xl font-semibold md:text-5xl">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-muted-foreground">{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-3xl bg-card px-8 py-16 text-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone = status === "approved" || status === "accepted" || status === "published" || status === "finalized" || status === "reviewed"
    ? "bg-primary text-primary-foreground"
    : status === "rejected" || status === "suspended" || status === "declined"
      ? "bg-destructive text-destructive-foreground"
      : "bg-secondary text-secondary-foreground";
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${tone}`}>{status.replace(/_/g, " ")}</span>;
}

export const btn = "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50";
export const btnGhost = "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:bg-muted disabled:opacity-50";
export const inputCls = "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";
