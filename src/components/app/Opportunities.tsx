import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Field, useSession } from "./auth";
import { Empty, PageHead, StatusBadge, btn, btnGhost, inputCls } from "./Portal";
import { useRoleProfile } from "./Profile";

export const oppTypes = ["trial", "recruitment", "scholarship", "coaching", "tournament", "sponsorship", "camp", "other"];
const stages = ["invited", "applied", "shortlisted", "trial", "offer", "accepted", "rejected", "withdrawn"];

export function AthleteOpportunities() {
  const { user } = useSession();
  const qc = useQueryClient();
  const [filter, setFilter] = useState({ q: "", type: "" });
  const opps = useQuery({
    queryKey: ["opps-published"],
    queryFn: async () => (await supabase.from("opportunities").select("*").eq("status", "published").order("created_at", { ascending: false })).data ?? [],
  });
  const mine = useQuery({
    enabled: !!user,
    queryKey: ["my-apps", user?.id],
    queryFn: async () => (await supabase.from("applications").select("opportunity_id").eq("athlete_id", user!.id)).data ?? [],
  });
  const applied = new Set(mine.data?.map((a) => a.opportunity_id));
  const list = (opps.data ?? []).filter((o) => (!filter.type || o.opp_type === filter.type) && `${o.title} ${o.sport} ${o.region}`.toLowerCase().includes(filter.q.toLowerCase()));

  async function apply(id: string) {
    const message = prompt("Add a short message to the organiser (optional)") ?? "";
    const { error } = await supabase.from("applications").insert({ opportunity_id: id, athlete_id: user!.id, message: message.slice(0, 2000) });
    if (error) return toast.error(error.message);
    toast.success("Application sent.");
    qc.invalidateQueries({ queryKey: ["my-apps"] });
  }
  return (
    <div>
      <PageHead title="Discover opportunities" intro="Published trials, recruitment drives, scholarships and more from sports professionals and organisations. Opportunities do not guarantee selection." />
      <div className="mb-6 flex flex-wrap gap-3">
        <input className={`${inputCls} max-w-xs`} placeholder="Search sport, region, title" value={filter.q} onChange={(e) => setFilter({ ...filter, q: e.target.value })} />
        <select className={`${inputCls} max-w-[200px]`} value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
          <option value="">All types</option>{oppTypes.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      {list.length === 0 ? <Empty title="No opportunities yet" body="When verified organisations publish opportunities, they will appear here." /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((o) => (
            <article key={o.id} className="flex flex-col rounded-3xl bg-card p-6">
              <p className="eyebrow text-primary">{o.opp_type} · {o.sport}</p>
              <h3 className="mt-2 text-xl font-semibold">{o.title}</h3>
              <p className="mt-2 line-clamp-4 flex-1 whitespace-pre-wrap text-sm text-muted-foreground">{o.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{o.region}{o.deadline && ` · closes ${o.deadline}`}</span>
                {applied.has(o.id) ? <StatusBadge status="applied" /> : <button className={btn} onClick={() => apply(o.id)}>Apply</button>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function AthleteApplications() {
  const { user } = useSession();
  const qc = useQueryClient();
  const apps = useQuery({
    enabled: !!user,
    queryKey: ["my-apps-full", user?.id],
    queryFn: async () => (await supabase.from("applications").select("*, opportunities(title, sport, opp_type, region)").eq("athlete_id", user!.id).order("updated_at", { ascending: false })).data ?? [],
  });
  async function setStage(id: string, stage: string) {
    const { error } = await supabase.from("applications").update({ stage }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["my-apps-full"] });
  }
  return (
    <div>
      <PageHead title="Applications & invitations" intro="Track every application and respond to recruitment invitations." />
      {!apps.data?.length ? <Empty title="Nothing here yet" body="Apply to an opportunity or wait for an invitation from a verified organisation." /> : (
        <ul className="divide-y rounded-3xl bg-card">
          {apps.data.map((a: any) => (
            <li key={a.id} className="flex flex-wrap items-center gap-4 px-6 py-5">
              <div className="flex-1"><p className="font-semibold">{a.opportunities?.title}</p><p className="text-sm text-muted-foreground">{a.opportunities?.opp_type} · {a.opportunities?.sport} · updated {new Date(a.updated_at).toLocaleDateString()}</p></div>
              <StatusBadge status={a.stage} />
              {a.stage === "invited" && <button className={btn} onClick={() => setStage(a.id, "applied")}>Accept invitation</button>}
              {a.stage === "offer" && <button className={btn} onClick={() => setStage(a.id, "accepted")}>Accept offer</button>}
              {!["withdrawn", "rejected", "accepted"].includes(a.stage) && <button className={btnGhost} onClick={() => setStage(a.id, "withdrawn")}>{a.stage === "invited" ? "Decline" : "Withdraw"}</button>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SportsOpportunities() {
  const { user } = useSession();
  const qc = useQueryClient();
  const prof = useRoleProfile("sports");
  const [creating, setCreating] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const opps = useQuery({
    enabled: !!user,
    queryKey: ["my-opps", user?.id],
    queryFn: async () => (await supabase.from("opportunities").select("*, applications(id, stage, athlete_id, message, notes, profiles:athlete_id(full_name))").eq("owner_id", user!.id).order("created_at", { ascending: false })).data ?? [],
  });
  const approved = prof.data?.p?.status === "approved";

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "").trim();
    const { error } = await supabase.from("opportunities").insert({
      owner_id: user!.id, title: g("title"), opp_type: g("opp_type"), sport: g("sport"), region: g("region"),
      description: g("description"), deadline: g("deadline") || null, status: f.get("publish") === "on" ? "published" : "draft",
    });
    if (error) return toast.error(error.message);
    toast.success("Opportunity saved.");
    setCreating(false);
    qc.invalidateQueries({ queryKey: ["my-opps"] });
  }
  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("opportunities").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["my-opps"] });
  }
  async function setStage(id: string, stage: string) {
    const { error } = await supabase.from("applications").update({ stage }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["my-opps"] });
  }
  async function saveNote(id: string, notes: string) {
    const { error } = await supabase.from("applications").update({ notes: notes.slice(0, 4000) }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Note saved (visible only to you).");
  }

  return (
    <div>
      <PageHead title="Opportunities & recruitment" intro="Publish opportunities and move applicants through your pipeline: applied → shortlisted → trial → offer → outcome."
        action={approved ? <button className={btn} onClick={() => setCreating(!creating)}>{creating ? "Cancel" : "New opportunity"}</button> : undefined} />
      {!approved && <div className="mb-6 rounded-2xl bg-secondary p-4 text-sm">Only verified accounts can publish opportunities. Complete your profile and submit it for verification.</div>}
      {creating && (
        <form onSubmit={create} className="mb-10 grid gap-4 rounded-3xl bg-card p-6 md:grid-cols-2">
          <Field label="Title" name="title" required />
          <label className="text-sm font-medium">Type<select name="opp_type" className={`${inputCls} mt-1.5`}>{oppTypes.map((t) => <option key={t}>{t}</option>)}</select></label>
          <Field label="Sport" name="sport" required />
          <Field label="Region" name="region" />
          <Field label="Application deadline" name="deadline" type="date" />
          <label className="flex items-center gap-2 self-end text-sm"><input type="checkbox" name="publish" /> Publish immediately</label>
          <div className="md:col-span-2"><Field label="Description, eligibility and how selection works" name="description" textarea rows={6} required /></div>
          <button className={`${btn} md:col-span-2 md:w-fit`}>Save opportunity</button>
        </form>
      )}
      {!opps.data?.length ? <Empty title="No opportunities yet" body="Create your first opportunity to start recruiting." /> : (
        <div className="grid gap-4">
          {opps.data.map((o: any) => (
            <div key={o.id} className="rounded-3xl bg-card p-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1"><h3 className="text-lg font-semibold">{o.title}</h3><p className="text-sm text-muted-foreground">{o.opp_type} · {o.sport} · {o.applications.length} applicants</p></div>
                <StatusBadge status={o.status} />
                {o.status !== "published" && <button className={btnGhost} onClick={() => setStatus(o.id, "published")}>Publish</button>}
                {o.status === "published" && <button className={btnGhost} onClick={() => setStatus(o.id, "closed")}>Close</button>}
                <button className={btnGhost} onClick={() => setOpenId(openId === o.id ? null : o.id)}>{openId === o.id ? "Hide pipeline" : "Pipeline"}</button>
              </div>
              {openId === o.id && (
                <div className="mt-6 grid gap-3">
                  {o.applications.length === 0 && <p className="text-sm text-muted-foreground">No applicants yet. Invite athletes from Athlete discovery.</p>}
                  {o.applications.map((a: any) => (
                    <div key={a.id} className="rounded-2xl bg-background p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="flex-1 font-medium">{a.profiles?.full_name || "Athlete"}</p>
                        <select value={a.stage} onChange={(e) => setStage(a.id, e.target.value)} className={`${inputCls} w-auto`}>
                          {stages.filter((s) => s !== "withdrawn" || a.stage === "withdrawn").map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      {a.message && <p className="mt-2 text-sm text-muted-foreground">“{a.message}”</p>}
                      <textarea defaultValue={a.notes} onBlur={(e) => e.target.value !== a.notes && saveNote(a.id, e.target.value)} placeholder="Private evaluation notes (saved on blur)" className={`${inputCls} mt-3`} rows={2} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
