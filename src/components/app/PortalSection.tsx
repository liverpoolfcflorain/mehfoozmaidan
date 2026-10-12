// @ts-nocheck
import { Link } from "@tanstack/react-router";
import { Portal, PageHead, Empty, portalNav } from "./Portal";
import { ProfileEditor } from "./Profile";
import { AthleteOpportunities, AthleteApplications, SportsOpportunities } from "./Opportunities";
import { Discover, NetworkPage } from "./Network";
import { MessagesPage } from "./Messages";
import { AssistantPage } from "./Assistant";
import type { Role } from "./auth";

function Body({ role, section }: { role: Role; section: string }) {
  if (section === "profile") return <ProfileEditor role={role} />;
  if (section === "network") return <NetworkPage role={role} />;
  if (section === "messages") return <MessagesPage />;
  if (section === "assistant") return <AssistantPage />;
  if (role === "athlete" && section === "opportunities") return <AthleteOpportunities />;
  if (role === "athlete" && section === "applications") return <AthleteApplications />;
  if (role === "sports" && section === "opportunities") return <SportsOpportunities />;
  if (role === "sports" && section === "discover") return <Discover role={role} tabs={["athletes", "sports", "lawyers"]} />;
  const nav = portalNav[role];
  const item = nav.find((n) => n.to === `/${role}${section ? "/" + section : ""}`);
  if (!item) return <Empty title="Page not found" body="This section doesn't exist." />;
  if (!section)
    return (
      <>
        <PageHead title="Welcome back" intro="Everything in your workspace, one click away." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {nav.slice(1).map((n) => (
            <Link key={n.to} to={n.to} className="rounded-3xl bg-card p-6 font-semibold transition hover:bg-muted">{n.label} →</Link>
          ))}
        </div>
      </>
    );
  return (
    <>
      <PageHead title={item.label} />
      <Empty title="Nothing here yet" body="Activity for this section will appear here." />
    </>
  );
}

export function PortalSection({ role, section }: { role: Role; section: string }) {
  return <Portal role={role}><Body role={role} section={section} /></Portal>;
}
