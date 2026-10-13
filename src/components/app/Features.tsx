// @ts-nocheck
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { draftContract } from "@/lib/ai.functions";
import { PageHead, Empty, StatusBadge, btn, btnGhost, inputCls } from "./Portal";
import { useSession } from "./auth";

const card = "rounded-3xl bg-card p-6";
const fmt = (d) => (d ? new Date(d).toLocaleString() : "");
function useUid() { return useSession().user?.id; }
function names(ids) {
  return useQuery({ enabled: ids.length > 0, queryKey: ["names", ids.join()], queryFn: async () => {
    const { data } = await supabase.from("profiles").select("id, full_name").in("id", ids);
    return Object.fromEntries((data ?? []).map((p) => [p.id, p.full_name || "Member"]));
  } }).data ?? {};
}
async function run(p, ok) { const { error } = await p; if (error) toast.error(error.message); else if (ok) toast.success(ok); return !error; }

/* ---------------- Contract Studio ---------------- */
const TYPES = ["Athlete–club agreement", "Sponsorship / endorsement", "Coaching agreement", "Agent / representation", "Image rights licence", "Scholarship / academy agreement", "Other"];

export function ContractStudio() {
  const uid = useUid(); const qc = useQueryClient();
  const [sel, setSel] = useState(null);
  const list = useQuery({ enabled: !!uid, queryKey: ["contracts", uid], queryFn: async () => (await supabase.from("contracts").select("*").eq("owner_id", uid).order("updated_at", { ascending: false })).data ?? [] });
  async function create(e) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget));
    const { data, error } = await supabase.from("contracts").insert({
      owner_id: uid, title: f.title, agreement_type: f.type, involves_minor: f.minor === "on", guardian_consent_confirmed: f.consent === "on",
      parties: { first: f.p1, second: f.p2 }, answers: { term: f.term, payment: f.payment, duties: f.duties, termination: f.termination, other: f.other },
    }).select().single();
    if (error) return toast.error(error.message);
    e.currentTarget.reset(); qc.invalidateQueries({ queryKey: ["contracts"] }); setSel(data.id);
  }
  if (sel) return <ContractDetail id={sel} back={() => setSel(null)} owner />;
  return (
    <>
      <PageHead title="Contract Studio" intro="Answer a few questions and the AI drafts an editable agreement with review notes. AI drafts are not legal advice and are not lawyer-reviewed — send them to a verified lawyer before signing." />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form onSubmit={create} className={`${card} grid gap-3`}>
          <h2 className="text-xl font-semibold">New agreement</h2>
          <input name="title" required placeholder="Title" className={inputCls} />
          <select name="type" className={inputCls}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          <input name="p1" required placeholder="First party (name, role)" className={inputCls} />
          <input name="p2" required placeholder="Second party (name, role)" className={inputCls} />
          <input name="term" placeholder="Duration / term" className={inputCls} />
          <input name="payment" placeholder="Payment / compensation" className={inputCls} />
          <textarea name="duties" placeholder="Duties & obligations" className={inputCls} rows={2} />
          <textarea name="termination" placeholder="Termination conditions" className={inputCls} rows={2} />
          <textarea name="other" placeholder="Anything else" className={inputCls} rows={2} />
          <label className="flex gap-2 text-sm"><input type="checkbox" name="minor" /> Involves a minor (under 18)</label>
          <label className="flex gap-2 text-sm"><input type="checkbox" name="consent" /> Guardian consent obtained</label>
          <button className={btn}>Create</button>
        </form>
        <div className="grid content-start gap-3">
          {!list.data?.length ? <Empty title="No agreements yet" body="Create your first agreement to generate an AI draft." /> :
            list.data.map((c) => (
              <button key={c.id} onClick={() => setSel(c.id)} className={`${card} text-left transition hover:bg-muted`}>
                <div className="flex items-center justify-between gap-2"><span className="font-semibold">{c.title}</span><StatusBadge status={c.status} /></div>
                <p className="mt-1 text-sm text-muted-foreground">{c.agreement_type} · updated {fmt(c.updated_at)}</p>
              </button>
            ))}
        </div>
      </div>
    </>
  );
}

export function ContractDetail({ id, back, owner }) {
  const uid = useUid(); const qc = useQueryClient();
  const [busy, setBusy] = useState(false); const [edit, setEdit] = useState(null);
  const q = useQuery({ queryKey: ["contract", id], queryFn: async () => {
    const [c, v, cm] = await Promise.all([
      supabase.from("contracts").select("*").eq("id", id).single(),
      supabase.from("contract_versions").select("*").eq("contract_id", id).order("version", { ascending: false }),
      supabase.from("contract_comments").select("*").eq("contract_id", id).order("created_at"),
    ]);
    return { c: c.data, versions: v.data ?? [], comments: cm.data ?? [] };
  } });
  const lawyers = useQuery({ enabled: !!owner, queryKey: ["lawyers-approved"], queryFn: async () => {
    const { data } = await supabase.from("lawyer_profiles").select("user_id, expertise, jurisdiction").eq("status", "approved");
    return data ?? [];
  } });
  const nm = names([...(lawyers.data ?? []).map((l) => l.user_id), ...(q.data?.comments ?? []).map((c) => c.author_id)]);
  const refresh = () => { qc.invalidateQueries({ queryKey: ["contract", id] }); qc.invalidateQueries({ queryKey: ["contracts"] }); };
  if (!q.data?.c) return <p className="text-muted-foreground">Loading…</p>;
  const { c, versions, comments } = q.data; const latest = versions[0];
  async function ai() {
    setBusy(true);
    try { await draftContract({ data: { contractId: id } }); toast.success("AI draft created"); refresh(); } catch (e) { toast.error(e.message); }
    setBusy(false);
  }
  async function saveVersion() {
    if (await run(supabase.from("contract_versions").insert({ contract_id: id, version: (latest?.version ?? 0) + 1, body: edit, created_by: uid, ai_generated: false, note: owner ? "Edited by owner" : "Lawyer revision" }), "Version saved")) { setEdit(null); refresh(); }
  }
  async function comment(e) {
    e.preventDefault(); const body = new FormData(e.currentTarget).get("body"); e.currentTarget.reset();
    if (await run(supabase.from("contract_comments").insert({ contract_id: id, author_id: uid, body }))) refresh();
  }
  const status = (s) => run(supabase.from("contracts").update({ status: s }).eq("id", id), "Updated").then(refresh);
  return (
    <>
      <button onClick={back} className="mb-6 text-sm text-muted-foreground">← Back</button>
      <PageHead title={c.title} intro={`${c.agreement_type}${c.involves_minor ? " · involves a minor" : ""}`} action={<StatusBadge status={c.status} />} />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid content-start gap-4">
          <div className="flex flex-wrap gap-2">
            {owner && <button disabled={busy} onClick={ai} className={btn}>{busy ? "Drafting…" : latest ? "Regenerate AI draft" : "Generate AI draft"}</button>}
            {latest && edit === null && <button onClick={() => setEdit(latest.body)} className={btnGhost}>Edit as new version</button>}
            {latest && <button onClick={() => { const b = new Blob([latest.body], { type: "text/plain" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `${c.title}.txt`; a.click(); }} className={btnGhost}>Download</button>}
            {owner && c.status !== "finalized" && latest && <button onClick={() => status("finalized")} className={btnGhost}>Mark finalized</button>}
            {!owner && ["in_review", "revisions_proposed", "reviewed"].map((s) => <button key={s} onClick={() => status(s)} className={btnGhost}>{s.replace("_", " ")}</button>)}
          </div>
          {edit !== null ? (
            <div className={card}><textarea value={edit} onChange={(e) => setEdit(e.target.value)} rows={24} className={`${inputCls} font-mono`} />
              <div className="mt-3 flex gap-2"><button onClick={saveVersion} className={btn}>Save version</button><button onClick={() => setEdit(null)} className={btnGhost}>Cancel</button></div></div>
          ) : latest ? (
            <div className={card}><p className="eyebrow mb-3 text-muted-foreground">Version {latest.version} · {latest.ai_generated ? "AI-generated — not lawyer-reviewed" : latest.note}</p>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{latest.body}</pre></div>
          ) : <Empty title="No draft yet" body={owner ? "Generate an AI draft from your answers." : "The owner hasn't drafted this yet."} />}
          {c.concerns && <div className={card}><h3 className="font-semibold">AI review notes</h3><pre className="mt-3 whitespace-pre-wrap font-sans text-sm text-muted-foreground">{c.concerns}</pre></div>}
        </div>
        <div className="grid content-start gap-4">
          {owner && (
            <div className={card}>
              <h3 className="font-semibold">Request lawyer review</h3>
              {c.lawyer_id ? <p className="mt-2 text-sm">Shared with {nm[c.lawyer_id] ?? "your lawyer"}.</p> : !lawyers.data?.length ? <p className="mt-2 text-sm text-muted-foreground">No verified lawyers available yet.</p> : (
                <select className={`${inputCls} mt-3`} defaultValue="" onChange={(e) => run(supabase.from("contracts").update({ lawyer_id: e.target.value }).eq("id", id), "Sent for review").then(refresh)}>
                  <option value="" disabled>Choose a verified lawyer</option>
                  {lawyers.data.map((l) => <option key={l.user_id} value={l.user_id}>{nm[l.user_id] ?? "Lawyer"} — {l.expertise ?? l.jurisdiction ?? ""}</option>)}
                </select>
              )}
            </div>
          )}
          <div className={card}>
            <h3 className="font-semibold">Comments</h3>
            <div className="mt-3 grid gap-3">{comments.map((m) => <div key={m.id} className="rounded-2xl bg-muted p-3 text-sm"><b>{nm[m.author_id] ?? "Member"}</b> <span className="text-xs text-muted-foreground">{fmt(m.created_at)}</span><p className="mt-1">{m.body}</p></div>)}</div>
            <form onSubmit={comment} className="mt-3 flex gap-2"><input name="body" required className={inputCls} placeholder="Add a comment" /><button className={btn}>Post</button></form>
          </div>
          <div className={card}><h3 className="font-semibold">Version history</h3>
            {versions.map((v) => <p key={v.id} className="mt-2 text-sm text-muted-foreground">v{v.version} · {v.ai_generated ? "AI" : v.note} · {fmt(v.created_at)}</p>)}</div>
        </div>
      </div>
    </>
  );
}

export function LawyerContracts() {
  const uid = useUid(); const [sel, setSel] = useState(null);
  const q = useQuery({ enabled: !!uid, queryKey: ["contracts-lawyer", uid], queryFn: async () => (await supabase.from("contracts").select("*").eq("lawyer_id", uid).order("updated_at", { ascending: false })).data ?? [] });
  if (sel) return <ContractDetail id={sel} back={() => setSel(null)} />;
  return (<><PageHead title="Contract review queue" intro="Agreements clients have shared with you for review." />
    {!q.data?.length ? <Empty title="Queue is empty" body="Contracts shared with you will appear here." /> :
      <div className="grid gap-3">{q.data.map((c) => <button key={c.id} onClick={() => setSel(c.id)} className={`${card} flex items-center justify-between text-left hover:bg-muted`}><span><b>{c.title}</b><br /><span className="text-sm text-muted-foreground">{c.agreement_type}</span></span><StatusBadge status={c.status} /></button>)}</div>}</>);
}

/* ---------------- Legal requests ---------------- */
export function LegalRequests() {
  const uid = useUid(); const qc = useQueryClient();
  const q = useQuery({ enabled: !!uid, queryKey: ["legal-mine", uid], queryFn: async () => (await supabase.from("legal_requests").select("*").eq("requester_id", uid).order("created_at", { ascending: false })).data ?? [] });
  const nm = names((q.data ?? []).filter((r) => r.lawyer_id).map((r) => r.lawyer_id));
  async function submit(e) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)); const el = e.currentTarget;
    if (await run(supabase.from("legal_requests").insert({ requester_id: uid, category: f.category, jurisdiction: f.jurisdiction, summary: f.summary, description: f.description, language: f.language || null, deadline: f.deadline || null }), "Request submitted to verified lawyers")) { el.reset(); qc.invalidateQueries({ queryKey: ["legal-mine"] }); }
  }
  return (<><PageHead title="Legal assistance" intro="Describe your issue. Verified lawyers can accept it, then a private case chat opens in Messages." />
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={submit} className={`${card} grid gap-3`}>
        <select name="category" className={inputCls}>{["Contract dispute", "Selection / discrimination", "Safeguarding / harassment", "Doping / disciplinary", "Payment / wages", "Image rights / sponsorship", "Other"].map((c) => <option key={c}>{c}</option>)}</select>
        <select name="jurisdiction" className={inputCls}>{["Federal (Pakistan)", "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "AJK", "Not sure"].map((c) => <option key={c}>{c}</option>)}</select>
        <input name="summary" required maxLength={160} placeholder="One-line summary" className={inputCls} />
        <textarea name="description" required rows={5} placeholder="What happened? Avoid sharing sensitive documents here." className={inputCls} />
        <div className="grid grid-cols-2 gap-3"><input name="language" placeholder="Preferred language" className={inputCls} /><input name="deadline" type="date" className={inputCls} /></div>
        <button className={btn}>Submit request</button>
      </form>
      <div className="grid content-start gap-3">{!q.data?.length ? <Empty title="No requests yet" body="Your legal requests will appear here." /> : q.data.map((r) => (
        <div key={r.id} className={card}><div className="flex justify-between gap-2"><b>{r.summary}</b><StatusBadge status={r.status} /></div>
          <p className="mt-1 text-sm text-muted-foreground">{r.category} · {r.jurisdiction}{r.lawyer_id ? ` · Lawyer: ${nm[r.lawyer_id] ?? ""}` : ""}</p>
          {["open", "accepted", "in_progress"].includes(r.status) && <button onClick={() => run(supabase.from("legal_requests").update({ status: r.status === "open" ? "withdrawn" : "closed" }).eq("id", r.id)).then(() => qc.invalidateQueries({ queryKey: ["legal-mine"] }))} className={`${btnGhost} mt-3`}>{r.status === "open" ? "Withdraw" : "Close"}</button>}
        </div>))}</div>
    </div></>);
}

export function LawyerRequests({ matters }) {
  const uid = useUid(); const qc = useQueryClient();
  const q = useQuery({ enabled: !!uid, queryKey: ["legal-lawyer", matters, uid], queryFn: async () => {
    if (matters) return (await supabase.from("legal_requests").select("*").eq("lawyer_id", uid).order("created_at", { ascending: false })).data ?? [];
    const [{ data }, { data: dec }] = await Promise.all([supabase.from("legal_requests").select("*").eq("status", "open").order("created_at", { ascending: false }), supabase.from("legal_request_declines").select("request_id").eq("lawyer_id", uid)]);
    const d = new Set((dec ?? []).map((x) => x.request_id)); return (data ?? []).filter((r) => !d.has(r.id));
  } });
  const nm = names((q.data ?? []).map((r) => r.requester_id));
  const inv = () => qc.invalidateQueries({ queryKey: ["legal-lawyer"] });
  return (<><PageHead title={matters ? "Assigned matters" : "Incoming requests"} intro={matters ? "Requests you've accepted. Case chats are in Messages." : "Open requests from athletes and sports professionals. Only verified lawyers can accept."} />
    {!q.data?.length ? <Empty title="Nothing here" body={matters ? "Accepted requests will appear here." : "No open requests right now."} /> :
      <div className="grid gap-3">{q.data.map((r) => (
        <div key={r.id} className={card}><div className="flex justify-between gap-2"><b>{r.summary}</b><StatusBadge status={r.status} /></div>
          <p className="mt-1 text-sm text-muted-foreground">{r.category} · {r.jurisdiction}{r.deadline ? ` · by ${r.deadline}` : ""} · {nm[r.requester_id] ?? "Member"}</p>
          <p className="mt-3 text-sm">{r.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {!matters && <><button className={btn} onClick={async () => { const { error } = await supabase.rpc("accept_legal_request", { _id: r.id }); if (error) toast.error(error.message); else { toast.success("Accepted — case chat opened in Messages"); inv(); } }}>Accept</button>
              <button className={btnGhost} onClick={() => run(supabase.from("legal_request_declines").insert({ request_id: r.id, lawyer_id: uid })).then(inv)}>Decline</button></>}
            {matters && ["in_progress", "closed"].map((s) => r.status !== s && <button key={s} className={btnGhost} onClick={() => run(supabase.from("legal_requests").update({ status: s }).eq("id", r.id), "Updated").then(inv)}>Mark {s.replace("_", " ")}</button>)}
          </div>
        </div>))}</div>}</>);
}

/* ---------------- Notifications & Settings ---------------- */
export function Notifications() {
  const uid = useUid(); const qc = useQueryClient();
  const q = useQuery({ enabled: !!uid, queryKey: ["notifs", uid], queryFn: async () => (await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(100)).data ?? [] });
  const readAll = async () => { await supabase.from("notifications").update({ read_at: new Date().toISOString() }).is("read_at", null); qc.invalidateQueries(); };
  return (<><PageHead title="Notifications" action={<button onClick={readAll} className={btnGhost}>Mark all read</button>} />
    {!q.data?.length ? <Empty title="All caught up" body="Updates about your account will appear here." /> :
      <div className="grid gap-2">{q.data.map((n) => <div key={n.id} className={`${card} ${n.read_at ? "opacity-60" : ""}`}><b>{n.title}</b>{n.body && <p className="text-sm text-muted-foreground">{n.body}</p>}<p className="mt-1 text-xs text-muted-foreground">{fmt(n.created_at)}</p></div>)}</div>}</>);
}

export function Settings() {
  const uid = useUid(); const qc = useQueryClient();
  const q = useQuery({ enabled: !!uid, queryKey: ["me-settings", uid], queryFn: async () => (await supabase.from("profiles").select("*").eq("id", uid).single()).data });
  if (!q.data) return null;
  async function save(e) { e.preventDefault(); const f = new FormData(e.currentTarget);
    if (await run(supabase.from("profiles").update({ full_name: f.get("full_name"), region: f.get("region"), contact_open: f.get("contact_open") === "on" }).eq("id", uid), "Saved")) qc.invalidateQueries(); }
  async function pw(e) { e.preventDefault(); const p = String(new FormData(e.currentTarget).get("pw")); if (p.length < 8) return toast.error("Use at least 8 characters");
    const { error } = await supabase.auth.updateUser({ password: p }); error ? toast.error(error.message) : toast.success("Password updated"); }
  return (<><PageHead title="Settings" />
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={save} className={`${card} grid gap-3`}><h3 className="font-semibold">Account</h3>
        <input name="full_name" defaultValue={q.data.full_name} placeholder="Full name" className={inputCls} />
        <input name="region" defaultValue={q.data.region ?? ""} placeholder="City / region" className={inputCls} />
        <label className="flex gap-2 text-sm"><input type="checkbox" name="contact_open" defaultChecked={q.data.contact_open} /> Allow message requests from people I'm not connected with</label>
        <button className={btn}>Save</button></form>
      <form onSubmit={pw} className={`${card} grid content-start gap-3`}><h3 className="font-semibold">Change password</h3><input name="pw" type="password" placeholder="New password" className={inputCls} /><button className={btn}>Update password</button></form>
    </div></>);
}

/* ---------------- Admin ---------------- */
export function AdminStats() {
  const q = useQuery({ queryKey: ["admin-stats"], queryFn: async () => { const { data, error } = await supabase.rpc("admin_stats"); if (error) throw error; return data; } });
  return (<><PageHead title="Platform analytics" />
    <div className="grid gap-4 sm:grid-cols-3">{Object.entries(q.data ?? {}).map(([k, v]) => <div key={k} className={card}><p className="eyebrow text-muted-foreground">{k.replace("_", " ")}</p><p className="mt-2 text-4xl font-semibold">{v}</p></div>)}</div></>);
}

const TABLES = { athlete: "athlete_profiles", sports: "sports_profiles", lawyer: "lawyer_profiles" };
export function AdminPeople({ kind, pendingOnly }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-people", kind ?? "all", pendingOnly], queryFn: async () => {
    const kinds = kind ? [kind] : Object.keys(TABLES); const out = [];
    for (const k of kinds) { let s = supabase.from(TABLES[k]).select("*").order("updated_at", { ascending: false }); if (pendingOnly) s = s.in("status", ["submitted"]); const { data } = await s; (data ?? []).forEach((r) => out.push({ ...r, _k: k })); }
    return out;
  } });
  const nm = names((q.data ?? []).map((r) => r.user_id));
  async function decide(u, d) { const reason = d === "approved" ? "" : prompt("Reason / note for the user") ?? ""; const { error } = await supabase.rpc("admin_decide", { _user: u, _decision: d, _reason: reason }); error ? toast.error(error.message) : (toast.success("Saved"), qc.invalidateQueries({ queryKey: ["admin-people"] })); }
  return (<><PageHead title={pendingOnly ? "Verification queue" : kind === "athlete" ? "Athletes" : kind === "sports" ? "Sports & organisations" : "Lawyers"} intro={pendingOnly ? "Profiles submitted for review." : undefined} />
    {!q.data?.length ? <Empty title="Nothing here" body="No matching profiles." /> :
      <div className="grid gap-3">{q.data.map((r) => (
        <div key={r.user_id} className={card}><div className="flex flex-wrap items-center justify-between gap-2"><b>{nm[r.user_id] ?? "Member"} <span className="text-sm font-normal text-muted-foreground">· {r._k}</span></b><StatusBadge status={r.status} /></div>
          <p className="mt-2 text-sm text-muted-foreground">{[r.sport, r.level, r.subtype, r.org_name, r.sports, r.bar_enrollment, r.jurisdiction, r.expertise].filter(Boolean).join(" · ")}</p>
          {r.bio && <p className="mt-2 text-sm">{r.bio}</p>}
          {r.is_minor && <p className="mt-2 text-sm">Minor — guardian: {r.guardian_name} ({r.guardian_email}) · consent {r.guardian_consent_at ? "recorded" : "not recorded"} {!r.guardian_consent_at && <button className="ml-2 underline" onClick={() => run(supabase.rpc("admin_record_guardian_consent", { _user: r.user_id }), "Recorded").then(() => qc.invalidateQueries())}>Record consent</button>}</p>}
          <div className="mt-4 flex flex-wrap gap-2">{[["approved", "Approve"], ["info_requested", "Request info"], ["rejected", "Reject"], ["suspended", "Suspend"]].map(([d, l]) => <button key={d} onClick={() => decide(r.user_id, d)} className={d === "approved" ? btn : btnGhost}>{l}</button>)}</div>
        </div>))}</div>}</>);
}

export function AdminReports() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-reports"], queryFn: async () => (await supabase.from("reports").select("*").order("created_at", { ascending: false })).data ?? [] });
  const nm = names((q.data ?? []).flatMap((r) => [r.reporter_id, r.target_user_id].filter(Boolean)));
  return (<><PageHead title="Reports & safeguarding" />
    {!q.data?.length ? <Empty title="No reports" body="User reports will appear here." /> : <div className="grid gap-3">{q.data.map((r) => (
      <div key={r.id} className={card}><div className="flex justify-between"><b>{r.category}</b><StatusBadge status={r.status} /></div>
        <p className="mt-1 text-sm text-muted-foreground">By {nm[r.reporter_id] ?? "Member"}{r.target_user_id ? ` about ${nm[r.target_user_id] ?? "a user"}` : ""} · {fmt(r.created_at)}</p><p className="mt-2 text-sm">{r.reason}</p>
        <div className="mt-3 flex gap-2">{["reviewing", "resolved", "dismissed"].map((s) => <button key={s} className={btnGhost} onClick={() => run(supabase.from("reports").update({ status: s }).eq("id", r.id), "Updated").then(() => qc.invalidateQueries({ queryKey: ["admin-reports"] }))}>{s}</button>)}
          {r.target_user_id && <button className={btnGhost} onClick={async () => { const { error } = await supabase.rpc("admin_decide", { _user: r.target_user_id, _decision: "suspended", _reason: "Safeguarding report: " + r.category }); error ? toast.error(error.message) : toast.success("User suspended"); }}>Suspend user</button>}</div>
      </div>))}</div>}</>);
}

const SECTIONS = [["blog", "Blog post"], ["athlete_rights", "Athlete rights"], ["legal_explainer", "Legal explainer"], ["story", "Story"], ["page", "Page copy"]];
export function AdminContent() {
  const uid = useUid(); const qc = useQueryClient(); const [ed, setEd] = useState(null);
  const q = useQuery({ queryKey: ["admin-content"], queryFn: async () => (await supabase.from("site_content").select("*").order("updated_at", { ascending: false })).data ?? [] });
  async function save(e) {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget));
    const row = { section: f.section, title: f.title, slug: (f.slug || f.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), summary: f.summary || null, body: f.body, jurisdiction: f.jurisdiction || null, references_text: f.references_text || null, reviewed_on: f.reviewed_on || null, status: f.status, updated_by: uid };
    const p = ed?.id ? supabase.from("site_content").update(row).eq("id", ed.id) : supabase.from("site_content").insert(row);
    if (await run(p, "Saved")) { setEd(null); qc.invalidateQueries({ queryKey: ["admin-content"] }); }
  }
  return (<><PageHead title="Content & blog" intro="Write blog posts, athlete-rights guides and legal explainers. Published items appear on the public site; legal items also inform the AI assistant." action={<button className={btn} onClick={() => setEd({ section: "blog", status: "draft" })}>New post</button>} />
    {ed && <form onSubmit={save} className={`${card} mb-6 grid gap-3`}>
      <div className="grid gap-3 sm:grid-cols-3"><select name="section" defaultValue={ed.section} className={inputCls}>{SECTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        <select name="status" defaultValue={ed.status} className={inputCls}><option value="draft">Draft</option><option value="published">Published</option></select>
        <input name="slug" defaultValue={ed.slug} placeholder="url-slug (optional)" className={inputCls} /></div>
      <input name="title" required defaultValue={ed.title} placeholder="Title" className={inputCls} />
      <input name="summary" defaultValue={ed.summary ?? ""} placeholder="Short summary" className={inputCls} />
      <textarea name="body" required rows={12} defaultValue={ed.body} placeholder="Body (blank lines separate paragraphs)" className={inputCls} />
      <div className="grid gap-3 sm:grid-cols-3"><input name="jurisdiction" defaultValue={ed.jurisdiction ?? ""} placeholder="Jurisdiction (legal items)" className={inputCls} /><input name="references_text" defaultValue={ed.references_text ?? ""} placeholder="References" className={inputCls} /><input name="reviewed_on" type="date" defaultValue={ed.reviewed_on ?? ""} className={inputCls} /></div>
      <div className="flex gap-2"><button className={btn}>Save</button><button type="button" onClick={() => setEd(null)} className={btnGhost}>Cancel</button></div>
    </form>}
    {!q.data?.length ? <Empty title="No content yet" body="Create your first blog post." /> : <div className="grid gap-2">{q.data.map((c) => (
      <div key={c.id} className={`${card} flex flex-wrap items-center justify-between gap-2`}><span><b>{c.title}</b><br /><span className="text-sm text-muted-foreground">{SECTIONS.find((s) => s[0] === c.section)?.[1] ?? c.section} · /{c.slug}</span></span>
        <span className="flex items-center gap-2"><StatusBadge status={c.status} /><button className={btnGhost} onClick={() => setEd(c)}>Edit</button><button className={btnGhost} onClick={() => confirm("Delete?") && run(supabase.from("site_content").delete().eq("id", c.id), "Deleted").then(() => qc.invalidateQueries({ queryKey: ["admin-content"] }))}>Delete</button></span></div>))}</div>}</>);
}

export function AdminMedia() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-media"], queryFn: async () => (await supabase.from("media_items").select("*").order("updated_at", { ascending: false })).data ?? [] });
  async function add(e) { e.preventDefault(); const f = Object.fromEntries(new FormData(e.currentTarget)); const el = e.currentTarget;
    if (await run(supabase.from("media_items").insert({ slot: f.slot, kind: f.kind, title: f.title || null, url: f.url, poster_url: f.poster_url || null, caption: f.caption || null, transcript: f.transcript || null, published: f.published === "on" }), "Added")) { el.reset(); qc.invalidateQueries({ queryKey: ["admin-media"] }); } }
  return (<><PageHead title="Media & mission video" intro="Add the mission video or images by URL. Captions and transcripts keep media accessible." />
    <form onSubmit={add} className={`${card} mb-6 grid gap-3 sm:grid-cols-2`}>
      <select name="slot" className={inputCls}><option value="mission_video">Mission video</option><option value="home_hero">Home hero</option><option value="gallery">Gallery</option></select>
      <select name="kind" className={inputCls}><option value="video">Video</option><option value="image">Image</option></select>
      <input name="title" placeholder="Title" className={inputCls} /><input name="url" required type="url" placeholder="Media URL" className={inputCls} />
      <input name="poster_url" type="url" placeholder="Poster image URL" className={inputCls} /><input name="caption" placeholder="Caption / alt text" className={inputCls} />
      <textarea name="transcript" placeholder="Transcript" className={`${inputCls} sm:col-span-2`} rows={3} />
      <label className="flex gap-2 text-sm"><input type="checkbox" name="published" /> Published</label><button className={btn}>Add media</button>
    </form>
    <div className="grid gap-2">{(q.data ?? []).map((m) => <div key={m.id} className={`${card} flex flex-wrap items-center justify-between gap-2`}><span><b>{m.title || m.slot}</b><br /><span className="text-sm text-muted-foreground">{m.kind} · {m.slot} · {m.url}</span></span>
      <span className="flex gap-2"><button className={btnGhost} onClick={() => run(supabase.from("media_items").update({ published: !m.published }).eq("id", m.id)).then(() => qc.invalidateQueries({ queryKey: ["admin-media"] }))}>{m.published ? "Unpublish" : "Publish"}</button>
        <button className={btnGhost} onClick={() => run(supabase.from("media_items").delete().eq("id", m.id)).then(() => qc.invalidateQueries({ queryKey: ["admin-media"] }))}>Delete</button></span></div>)}</div></>);
}

export function AdminAudit() {
  const q = useQuery({ queryKey: ["admin-audit"], queryFn: async () => (await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200)).data ?? [] });
  const nm = names((q.data ?? []).map((r) => r.actor_id).filter(Boolean));
  return (<><PageHead title="Audit log" />{!q.data?.length ? <Empty title="No activity yet" body="Administrative actions are recorded here." /> :
    <div className={`${card} divide-y`}>{q.data.map((a) => <div key={a.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><span><b>{a.action}</b> by {nm[a.actor_id] ?? "system"}</span><span className="text-muted-foreground">{fmt(a.created_at)}</span></div>)}</div>}</>);
}
