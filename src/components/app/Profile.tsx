import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Field, useSession, type Role } from "./auth";
import { PageHead, StatusBadge, btn, btnGhost } from "./Portal";

const table = { athlete: "athlete_profiles", sports: "sports_profiles", lawyer: "lawyer_profiles" } as const;

export function useRoleProfile(role: Exclude<Role, "admin">) {
  const { user } = useSession();
  return useQuery({
    enabled: !!user,
    queryKey: ["role-profile", role, user?.id],
    queryFn: async () => {
      const [{ data: p }, { data: base }, { data: decisions }] = await Promise.all([
        supabase.from(table[role]).select("*").eq("user_id", user!.id).maybeSingle(),
        supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle(),
        supabase.from("verification_decisions").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
      ]);
      return { p: p as Record<string, any> | null, base, decisions: decisions ?? [] };
    },
  });
}

export function completion(role: Exclude<Role, "admin">, p: Record<string, any> | null | undefined) {
  if (!p) return 0;
  const keys = role === "athlete" ? ["sport", "discipline", "level", "bio", "goals", "achievements", "statistics"]
    : role === "sports" ? ["subtype", "sports", "bio", "qualifications", "title"]
    : ["bar_enrollment", "jurisdiction", "expertise", "languages", "bio"];
  return Math.round((keys.filter((k) => String(p[k] ?? "").trim()).length / keys.length) * 100);
}

export function ProfileEditor({ role }: { role: Exclude<Role, "admin"> }) {
  const q = useRoleProfile(role);
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { user } = useSession();
  if (q.isLoading || !q.data) return <p className="text-muted-foreground">Loading…</p>;
  const { p, base, decisions } = q.data;
  if (!p) return <p>Profile not found.</p>;
  const locked = p.status === "submitted" || p.status === "suspended";

  async function save(e: React.FormEvent<HTMLFormElement>, submit = false) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const update: Record<string, any> = {};
    if (role === "athlete") {
      Object.assign(update, {
        sport: get("sport"), discipline: get("discipline"), level: get("level"), bio: get("bio"), goals: get("goals"),
        achievements: get("achievements"), statistics: get("statistics"), qualifications: get("qualifications"),
        visibility: get("visibility"), is_minor: f.get("is_minor") === "on", guardian_name: get("guardian_name") || null, guardian_email: get("guardian_email") || null,
      });
    } else if (role === "sports") {
      Object.assign(update, { subtype: get("subtype"), org_name: get("org_name"), title: get("title"), sports: get("sports"), qualifications: get("qualifications"), bio: get("bio"), website: get("website") });
    } else {
      Object.assign(update, { bar_enrollment: get("bar_enrollment"), jurisdiction: get("jurisdiction"), expertise: get("expertise"), experience_years: Number(get("experience_years") || 0), languages: get("languages"), bio: get("bio"), available: f.get("available") === "on" });
    }
    if (submit) update.status = "submitted";
    setBusy(true);
    const [{ error }, { error: e2 }] = await Promise.all([
      supabase.from(table[role]).update(update).eq("user_id", user!.id),
      supabase.from("profiles").update({ full_name: get("full_name"), region: get("region") || null, contact_open: f.get("contact_open") === "on" }).eq("id", user!.id),
    ]);
    setBusy(false);
    if (error || e2) return toast.error((error ?? e2)!.message);
    toast.success(submit ? "Submitted for verification." : "Profile saved.");
    qc.invalidateQueries({ queryKey: ["role-profile"] });
  }

  return (
    <div>
      <PageHead title={role === "athlete" ? "Profile & sporting portfolio" : role === "sports" ? "Professional profile" : "Professional profile & credentials"}
        intro="Complete your details, then submit for verification. An administrator reviews submissions and records every decision." action={<StatusBadge status={p.status} />} />
      {p.status === "info_requested" && <div className="mb-6 rounded-2xl bg-secondary p-4 text-sm">An administrator requested more information. See the decision note below, update your profile and resubmit.</div>}
      {locked && <div className="mb-6 rounded-2xl bg-muted p-4 text-sm">{p.status === "submitted" ? "Your profile is awaiting review. You can still edit, but resubmission is not needed." : "Your account is suspended. Contact the platform team via the contact page."}</div>}
      <form onSubmit={(e) => save(e)} className="grid gap-8">
        <Section title="Basics">
          <Field label="Full name" name="full_name" defaultValue={base?.full_name} required />
          <Field label="Region / city" name="region" defaultValue={base?.region} />
          <Check name="contact_open" label="Allow message requests from people I'm not connected with" defaultChecked={base?.contact_open ?? true} />
        </Section>
        {role === "athlete" && (
          <>
            <Section title="Sport">
              <Field label="Sport" name="sport" defaultValue={p.sport} required />
              <Field label="Discipline / position" name="discipline" defaultValue={p.discipline} />
              <Field label="Competition level" name="level" defaultValue={p.level} placeholder="e.g. district, provincial, national" />
            </Section>
            <Section title="Portfolio">
              <Field label="Biography" name="bio" textarea defaultValue={p.bio} />
              <Field label="Sporting goals" name="goals" textarea defaultValue={p.goals} />
              <Field label="Achievements, rankings & competition history" name="achievements" textarea rows={6} defaultValue={p.achievements} />
              <Field label="Statistics & personal bests" name="statistics" textarea defaultValue={p.statistics} />
              <Field label="Qualifications & certificates" name="qualifications" textarea defaultValue={p.qualifications} />
            </Section>
            <Section title="Visibility & safeguarding">
              <label className="block text-sm font-medium">Who can find my profile
                <select name="visibility" defaultValue={p.visibility} className="mt-1.5 w-full rounded-xl border bg-background px-4 py-3">
                  <option value="public">Any signed-in member (adults only)</option>
                  <option value="professionals">Verified sports professionals only</option>
                  <option value="private">Nobody — hidden from discovery</option>
                </select>
              </label>
              <Check name="is_minor" label="I am under 18" defaultChecked={p.is_minor} />
              <Field label="Parent / guardian name (required if under 18)" name="guardian_name" defaultValue={p.guardian_name} />
              <Field label="Parent / guardian email" name="guardian_email" type="email" defaultValue={p.guardian_email} />
              {p.is_minor && <p className="text-sm text-muted-foreground">Guardian consent: {p.guardian_consent_at ? `recorded ${new Date(p.guardian_consent_at).toLocaleDateString()}` : "not yet recorded by the safeguarding team"}. Minors are never shown publicly and are discoverable only by verified professionals.</p>}
            </Section>
          </>
        )}
        {role === "sports" && (
          <Section title="Professional details">
            <label className="block text-sm font-medium">Account type: <span className="capitalize">{p.kind}</span>
              <select name="subtype" defaultValue={p.subtype} className="mt-1.5 w-full rounded-xl border bg-background px-4 py-3">
                {(p.kind === "organization" ? ["board", "federation", "club", "academy", "school", "university", "training_centre"] : ["coach", "scout", "trainer", "other_professional"]).map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
            </label>
            <Field label={p.kind === "organization" ? "Organisation name" : "Affiliation (optional)"} name="org_name" defaultValue={p.org_name} />
            <Field label={p.kind === "organization" ? "Your position at the organisation" : "Professional title"} name="title" defaultValue={p.title} />
            <Field label="Sports covered" name="sports" defaultValue={p.sports} />
            <Field label="Qualifications & licences" name="qualifications" textarea defaultValue={p.qualifications} />
            <Field label="About" name="bio" textarea defaultValue={p.bio} />
            <Field label="Website" name="website" defaultValue={p.website} />
          </Section>
        )}
        {role === "lawyer" && (
          <Section title="Credentials & practice">
            <Field label="Bar enrolment number & council" name="bar_enrollment" defaultValue={p.bar_enrollment} required />
            <Field label="Jurisdiction" name="jurisdiction" defaultValue={p.jurisdiction} placeholder="e.g. Punjab, Islamabad High Court" />
            <Field label="Areas of expertise" name="expertise" defaultValue={p.expertise} placeholder="sports contracts, sponsorship, employment…" />
            <Field label="Years of experience" name="experience_years" type="number" defaultValue={p.experience_years} />
            <Field label="Languages" name="languages" defaultValue={p.languages} placeholder="Urdu, English, Punjabi" />
            <Field label="Professional profile" name="bio" textarea defaultValue={p.bio} />
            <Check name="available" label="Available for new requests" defaultChecked={p.available} />
          </Section>
        )}
        <div className="flex flex-wrap gap-3">
          <button disabled={busy} className={btnGhost}>Save changes</button>
          {["draft", "info_requested", "rejected"].includes(p.status) && (
            <button type="button" disabled={busy} className={btn} onClick={(e) => save({ preventDefault() {}, currentTarget: (e.currentTarget as HTMLButtonElement).form! } as any, true)}>Save & submit for verification</button>
          )}
        </div>
      </form>
      <div className="mt-16">
        <h2 className="text-2xl font-semibold">Verification history</h2>
        <p className="mt-2 text-sm text-muted-foreground">Verification confirms an administrator reviewed the details you submitted{role === "lawyer" ? ", including your bar enrolment" : ""}. It does not guarantee ability, conduct or outcomes.</p>
        {decisions.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No decisions yet.</p> : (
          <ul className="mt-4 divide-y rounded-2xl bg-card">
            {decisions.map((d) => <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 text-sm"><StatusBadge status={d.decision} /><span className="flex-1 px-3">{d.reason || "—"}</span><span className="text-muted-foreground">{new Date(d.created_at).toLocaleString()}</span></li>)}
          </ul>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <fieldset className="grid gap-4 rounded-3xl bg-card p-6 md:p-8"><legend className="sr-only">{title}</legend><h2 className="text-xl font-semibold">{title}</h2>{children}</fieldset>;
}
function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return <label className="flex items-center gap-3 text-sm"><input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-[var(--primary)]" />{label}</label>;
}
