import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession, type Role } from "./auth";
import { Empty, PageHead, StatusBadge, btn, btnGhost, inputCls } from "./Portal";

export function usePeopleActions(role: Role) {
  const { user } = useSession();
  const qc = useQueryClient();
  const navigate = useNavigate();
  return {
    async connect(id: string) {
      const { error } = await supabase.from("connections").insert({ requester_id: user!.id, addressee_id: id });
      if (error) return toast.error(error.code === "23505" ? "A request already exists." : error.message);
      toast.success("Connection request sent.");
      qc.invalidateQueries({ queryKey: ["connections"] });
    },
    async save(id: string) {
      const { error } = await supabase.from("saved_profiles").insert({ user_id: user!.id, saved_user_id: id });
      if (error && error.code !== "23505") return toast.error(error.message);
      toast.success("Saved.");
      qc.invalidateQueries({ queryKey: ["saved"] });
    },
    async message(id: string) {
      const { data, error } = await supabase.rpc("start_conversation", { _other: id });
      if (error) return toast.error(error.message);
      navigate({ to: `/${role}/messages` as "/athlete/messages", search: { c: data as string } as never });
    },
    async report(id: string) {
      const reason = prompt("Describe the concern. Safeguarding concerns are prioritised.");
      if (!reason || reason.trim().length < 3) return;
      const category = confirm("Is this a safeguarding concern involving a child or vulnerable person?") ? "safeguarding" : "other";
      const { error } = await supabase.from("reports").insert({ reporter_id: user!.id, target_user_id: id, reason: reason.slice(0, 2000), category });
      if (error) return toast.error(error.message);
      toast.success("Report submitted to the moderation team.");
    },
    async block(id: string) {
      if (!confirm("Block this account? They won't be able to message you.")) return;
      await supabase.from("connections").delete().or(`and(requester_id.eq.${user!.id},addressee_id.eq.${id}),and(requester_id.eq.${id},addressee_id.eq.${user!.id})`);
      const { error } = await supabase.from("connections").insert({ requester_id: user!.id, addressee_id: id, status: "pending" });
      if (!error) await supabase.from("connections").update({ status: "blocked" }).eq("requester_id", user!.id).eq("addressee_id", id);
      toast.success("Account blocked.");
      qc.invalidateQueries({ queryKey: ["connections"] });
    },
  };
}

export function PersonActions({ id, role, inviteSlot }: { id: string; role: Role; inviteSlot?: React.ReactNode }) {
  const a = usePeopleActions(role);
  return (
    <div className="flex flex-wrap gap-2">
      <button className={btn} onClick={() => a.connect(id)}>Connect</button>
      <button className={btnGhost} onClick={() => a.message(id)}>Message</button>
      <button className={btnGhost} onClick={() => a.save(id)}>Save</button>
      {inviteSlot}
      <button className="text-xs text-muted-foreground underline" onClick={() => a.report(id)}>Report</button>
      <button className="text-xs text-muted-foreground underline" onClick={() => a.block(id)}>Block</button>
    </div>
  );
}

type Tab = "athletes" | "sports" | "lawyers";

export function Discover({ role, tabs }: { role: Role; tabs: Tab[] }) {
  const [tab, setTab] = useState<Tab>(tabs[0]);
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("");
  const { user } = useSession();
  const [inviteFor, setInviteFor] = useState<string | null>(null);
  const qc = useQueryClient();

  const results = useQuery({
    queryKey: ["discover", tab],
    queryFn: async () => {
      if (tab === "athletes") return (await supabase.from("athlete_profiles").select("*, profiles!inner(full_name, region)").eq("status", "approved").neq("user_id", user!.id)).data ?? [];
      if (tab === "sports") return (await supabase.from("sports_profiles").select("*, profiles!inner(full_name, region)").eq("status", "approved").neq("user_id", user!.id)).data ?? [];
      return (await supabase.from("lawyer_profiles").select("*, profiles!inner(full_name, region)").eq("status", "approved").neq("user_id", user!.id)).data ?? [];
    },
  });
  const myOpps = useQuery({
    enabled: role === "sports",
    queryKey: ["my-opps-min"],
    queryFn: async () => (await supabase.from("opportunities").select("id, title").eq("owner_id", user!.id).eq("status", "published")).data ?? [],
  });
  const list = (results.data ?? []).filter((r: any) => {
    const hay = JSON.stringify([r.profiles?.full_name, r.profiles?.region, r.sport, r.discipline, r.level, r.achievements, r.sports, r.subtype, r.org_name, r.expertise, r.jurisdiction, r.languages]).toLowerCase();
    return hay.includes(q.toLowerCase()) && (!level || String(r.level ?? "").toLowerCase().includes(level.toLowerCase()));
  });

  async function invite(athleteId: string, oppId: string) {
    const { error } = await supabase.from("applications").insert({ opportunity_id: oppId, athlete_id: athleteId, stage: "invited" });
    if (error) return toast.error(error.code === "23505" ? "This athlete is already in that pipeline." : error.message);
    toast.success("Invitation sent.");
    setInviteFor(null);
    qc.invalidateQueries({ queryKey: ["my-opps"] });
  }

  return (
    <div>
      <PageHead title={role === "sports" ? "Athlete discovery" : "Find professionals"} intro="Only verified profiles appear here, and athletes control who can see them. Connecting never grants access to contracts or private records." />
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.length > 1 && tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={tab === t ? btn : btnGhost}>{t === "sports" ? "Coaches & organisations" : t[0].toUpperCase() + t.slice(1)}</button>)}
        <input className={`${inputCls} max-w-xs`} placeholder={tab === "athletes" ? "Sport, discipline, region, achievement" : tab === "lawyers" ? "Expertise, jurisdiction, language" : "Sport, type, region"} value={q} onChange={(e) => setQ(e.target.value)} />
        {tab === "athletes" && <input className={`${inputCls} max-w-[200px]`} placeholder="Competition level" value={level} onChange={(e) => setLevel(e.target.value)} />}
      </div>
      {results.isLoading ? <p className="text-muted-foreground">Searching…</p> : list.length === 0 ? (
        <Empty title="No matching verified profiles" body={tab === "athletes" && role === "sports" ? "Athlete profiles appear once they are verified and visible to professionals. Your own account must also be verified." : "Verified profiles will appear here as people join."} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((r: any) => (
            <article key={r.user_id} className="rounded-3xl bg-card p-6">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{r.profiles?.full_name || "Member"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tab === "athletes" && `${r.sport}${r.discipline ? " · " + r.discipline : ""}${r.level ? " · " + r.level : ""}`}
                    {tab === "sports" && `${String(r.subtype).replace("_", " ")}${r.org_name ? " · " + r.org_name : ""}${r.sports ? " · " + r.sports : ""}`}
                    {tab === "lawyers" && `${r.jurisdiction} · ${r.experience_years} yrs · ${r.languages}`}
                    {r.profiles?.region && ` · ${r.profiles.region}`}
                  </p>
                </div>
                <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground" title="An administrator reviewed this profile">Verified</span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm">{tab === "athletes" ? r.achievements || r.bio : tab === "lawyers" ? r.expertise : r.bio}</p>
              {tab === "athletes" && r.statistics && <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">Stats: {r.statistics}</p>}
              <div className="mt-4">
                <PersonActions id={r.user_id} role={role} inviteSlot={role === "sports" && tab === "athletes" ? <button className={btnGhost} onClick={() => setInviteFor(inviteFor === r.user_id ? null : r.user_id)}>Invite</button> : undefined} />
                {inviteFor === r.user_id && (
                  <div className="mt-3 rounded-2xl bg-background p-3 text-sm">
                    {!myOpps.data?.length ? "Publish an opportunity first." : myOpps.data.map((o) => <button key={o.id} className="block w-full rounded-lg px-2 py-1.5 text-left hover:bg-muted" onClick={() => invite(r.user_id, o.id)}>Invite to “{o.title}”</button>)}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function NetworkPage({ role }: { role: Role }) {
  const { user } = useSession();
  const qc = useQueryClient();
  const a = usePeopleActions(role);
  const conns = useQuery({
    enabled: !!user,
    queryKey: ["connections", user?.id],
    queryFn: async () => (await supabase.from("connections").select("*, req:requester_id(full_name, primary_role), add:addressee_id(full_name, primary_role)").order("created_at", { ascending: false })).data ?? [],
  });
  const saved = useQuery({
    enabled: !!user,
    queryKey: ["saved", user?.id],
    queryFn: async () => (await supabase.from("saved_profiles").select("*, p:saved_user_id(full_name, primary_role)").eq("user_id", user!.id)).data ?? [],
  });
  async function update(id: string, status: string) {
    const { error } = await supabase.from("connections").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["connections"] });
  }
  async function remove(id: string) {
    await supabase.from("connections").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["connections"] });
  }
  async function unsave(id: string) {
    await supabase.from("saved_profiles").delete().eq("user_id", user!.id).eq("saved_user_id", id);
    qc.invalidateQueries({ queryKey: ["saved"] });
  }
  const all = conns.data ?? [];
  const incoming = all.filter((c: any) => c.addressee_id === user?.id && c.status === "pending");
  const outgoing = all.filter((c: any) => c.requester_id === user?.id && c.status === "pending");
  const accepted = all.filter((c: any) => c.status === "accepted");
  const other = (c: any) => (c.requester_id === user?.id ? { id: c.addressee_id, ...c.add } : { id: c.requester_id, ...c.req });

  return (
    <div>
      <PageHead title={role === "sports" ? "Connections & shortlist" : "Connections"} intro="Manage requests, your network and saved profiles." />
      <div className="grid gap-10">
        <Block title={`Incoming requests (${incoming.length})`}>
          {incoming.map((c: any) => <Row key={c.id} name={other(c).full_name} sub={other(c).primary_role}><button className={btn} onClick={() => update(c.id, "accepted")}>Accept</button><button className={btnGhost} onClick={() => update(c.id, "declined")}>Decline</button></Row>)}
        </Block>
        <Block title={`Connections (${accepted.length})`}>
          {accepted.map((c: any) => <Row key={c.id} name={other(c).full_name} sub={other(c).primary_role}><button className={btnGhost} onClick={() => a.message(other(c).id)}>Message</button><button className="text-xs underline" onClick={() => remove(c.id)}>Remove</button></Row>)}
        </Block>
        <Block title={`Sent requests (${outgoing.length})`}>
          {outgoing.map((c: any) => <Row key={c.id} name={other(c).full_name} sub="Pending"><button className={btnGhost} onClick={() => remove(c.id)}>Withdraw</button></Row>)}
        </Block>
        <Block title={`Saved profiles (${saved.data?.length ?? 0})`}>
          {saved.data?.map((s: any) => <Row key={s.saved_user_id} name={s.p?.full_name} sub={s.p?.primary_role}><button className={btnGhost} onClick={() => a.message(s.saved_user_id)}>Message</button><button className="text-xs underline" onClick={() => unsave(s.saved_user_id)}>Remove</button></Row>)}
        </Block>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  const arr = Array.isArray(children) ? children : [children];
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      {arr.filter(Boolean).length === 0 ? <p className="rounded-2xl bg-card p-5 text-sm text-muted-foreground">Nothing here yet.</p> : <ul className="divide-y rounded-3xl bg-card">{children}</ul>}
    </section>
  );
}
function Row({ name, sub, children }: { name?: string; sub?: string; children: React.ReactNode }) {
  return <li className="flex flex-wrap items-center gap-3 px-6 py-4"><div className="flex-1"><p className="font-medium">{name || "Member"}</p>{sub && <p className="text-sm capitalize text-muted-foreground">{sub}</p>}</div>{children}</li>;
}

export { StatusBadge };
