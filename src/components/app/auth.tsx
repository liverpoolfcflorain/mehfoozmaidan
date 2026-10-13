// @ts-nocheck
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Wordmark } from "@/components/site/SiteLayout";

export type Role = "athlete" | "sports" | "lawyer" | "admin";

export const roleLabel: Record<Role, string> = {
  athlete: "Athlete",
  sports: "Sports professional or organisation",
  lawyer: "Lawyer",
  admin: "Administrator",
};

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const qc = useQueryClient();
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") qc.invalidateQueries();
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, [qc]);
  return { session, user: session?.user ?? null, loading };
}

export function useMe(userId: string | undefined) {
  return useQuery({
    enabled: !!userId,
    queryKey: ["me", userId],
    queryFn: async () => {
      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId!).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId!),
      ]);
      return { profile, roles: (roles ?? []).map((r) => r.role as Role) };
    },
  });
}

export function homeFor(role: Role | undefined) {
  return role === "sports" ? "/sports" : role === "lawyer" ? "/lawyer" : role === "admin" ? "/admin" : "/athlete";
}

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Use at least 8 characters").max(72),
  full_name: z.string().trim().max(120).optional(),
});

export function AuthForm({ role }: { role: Role }) {
  if (role === "admin") return <AdminLogin />;
  return <UserAuthForm role={role} />;
}

function AdminLogin() {
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    setBusy(true);
    try {
      const { adminPasswordLogin } = await import("@/lib/admin.functions");
      const { email } = await adminPasswordLogin({ data: { password } });
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (err) { toast.error(err?.message || "Incorrect password."); }
    setBusy(false);
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-6 text-on-image">
      <form onSubmit={submit} className="w-full max-w-sm">
        <Wordmark light />
        <h1 className="mt-10 text-4xl font-semibold">Admin access</h1>
        <p className="mt-2 text-sm opacity-70">Enter the administrator password.</p>
        <input name="password" type="password" required autoFocus aria-label="Admin password" className="mt-6 w-full rounded-xl border bg-background px-4 py-3 text-foreground" />
        <button disabled={busy} className="mt-4 w-full rounded-full bg-gold px-6 py-3 font-semibold text-charcoal disabled:opacity-60">{busy ? "Checking…" : "Enter"}</button>
        <Link to="/join" className="mt-6 block text-sm opacity-70">← Back</Link>
      </form>
    </div>
  );
}

function UserAuthForm({ role }: { role: Role }) {
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [busy, setBusy] = useState(false);
  const [kind, setKind] = useState<"individual" | "organization">("individual");
  const navigate = useNavigate();
  const { session } = useSession();
  const me = useMe(session?.user.id);

  useEffect(() => {
    if (!session || !me.data) return;
    const r = role === "admin" ? (me.data.roles.includes("admin") ? "admin" : undefined) : (me.data.profile?.primary_role as Role);
    if (r) navigate({ to: homeFor(r) });
  }, [session, me.data, role, navigate]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (mode === "reset") {
      const email = String(f.get("email") ?? "").trim();
      setBusy(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
      setBusy(false);
      if (error) return toast.error(error.message);
      return toast.success("If that email is registered, a reset link is on its way.");
    }
    const parsed = schema.safeParse({ email: f.get("email"), password: f.get("password"), full_name: f.get("full_name") ?? undefined });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/${role}/login`,
          data: { role, full_name: parsed.data.full_name ?? "", kind },
        },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Check your email to verify your account, then sign in.");
      setMode("signin");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
      setBusy(false);
      if (error) return toast.error(error.message);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/athlete/login` });
    if (r.error) toast.error("Google sign-in failed. Please try again.");
  }

  const canRegister = role !== "admin";
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Wordmark light />
        <div>
          <p className="eyebrow text-gold">{roleLabel[role]} portal</p>
          <h1 className="mt-4 text-6xl font-semibold leading-[0.95]">
            {role === "athlete" && "Your sporting story, protected."}
            {role === "sports" && "Discover talent, accountably."}
            {role === "lawyer" && "Legal expertise where sport needs it."}
            {role === "admin" && "Platform administration."}
          </h1>
        </div>
        <p className="text-sm opacity-70">Verification is reviewed by people. It does not guarantee selection, outcomes or the conduct of any user.</p>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden"><Wordmark /></div>
          <h2 className="mt-8 text-4xl font-semibold">
            {mode === "signin" ? "Sign in" : mode === "signup" ? "Create your account" : "Reset password"}
          </h2>
          <p className="mt-2 text-muted-foreground">{roleLabel[role]}</p>
          <form onSubmit={submit} className="mt-8 grid gap-4">
            {mode === "signup" && (
              <>
                <Field label={role === "sports" && kind === "organization" ? "Representative's full name" : "Full name"} name="full_name" required />
                {role === "sports" && (
                  <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
                    {(["individual", "organization"] as const).map((k) => (
                      <button type="button" key={k} onClick={() => setKind(k)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${kind === k ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                        {k === "individual" ? "Individual professional" : "Organisation"}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
            <Field label="Email" name="email" type="email" required />
            {mode !== "reset" && <Field label="Password" name="password" type="password" required />}
            <button disabled={busy} className="mt-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-60">
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
            </button>
          </form>
          {role === "athlete" && mode !== "reset" && (
            <button onClick={google} className="mt-3 w-full rounded-full border px-6 py-3 font-semibold hover:bg-muted">Continue with Google</button>
          )}
          <div className="mt-6 flex flex-wrap justify-between gap-2 text-sm">
            {canRegister && mode === "signin" && <button className="font-semibold text-primary" onClick={() => setMode("signup")}>Create an account</button>}
            {mode !== "signin" && <button className="font-semibold text-primary" onClick={() => setMode("signin")}>Back to sign in</button>}
            {mode === "signin" && <button className="text-muted-foreground" onClick={() => setMode("reset")}>Forgot password?</button>}
          </div>
          {role === "admin" && <p className="mt-6 text-xs text-muted-foreground">Administrator accounts are provisioned by the platform owner. Public registration never grants admin access.</p>}
          <p className="mt-10 text-sm text-muted-foreground">Not a {roleLabel[role].toLowerCase()}? <Link to="/join" className="font-semibold text-primary">Choose another portal</Link></p>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, name, type = "text", required, defaultValue, textarea, rows = 4, placeholder }: {
  label: string; name: string; type?: string; required?: boolean; defaultValue?: string | number | null; textarea?: boolean; rows?: number; placeholder?: string;
}) {
  const cls = "mt-1.5 w-full rounded-xl border bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring";
  return (
    <label className="block text-sm font-medium">
      {label}
      {textarea ? (
        <textarea name={name} required={required} defaultValue={defaultValue ?? ""} rows={rows} placeholder={placeholder} className={cls} />
      ) : (
        <input name={name} type={type} required={required} defaultValue={defaultValue ?? ""} placeholder={placeholder} className={cls} />
      )}
    </label>
  );
}
