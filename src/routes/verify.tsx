import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Check a verification certificate — Mehfooz Maidan" },
      { name: "description", content: "Confirm that a Mehfooz Maidan verification certificate is genuine and still valid." },
      { property: "og:title", content: "Check a verification certificate — Mehfooz Maidan" },
      { property: "og:description", content: "Confirm that a Mehfooz Maidan verification certificate is genuine and still valid." },
    ],
  }),
  component: VerifyPage,
});

type Result = { certificate_no: string; holder_name: string; role: string; issued_at: string; valid: boolean } | null;

function VerifyPage() {
  const [no, setNo] = useState("");
  const [result, setResult] = useState<Result | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  async function check(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { data } = await supabase.rpc("check_certificate", { _no: no });
    setResult((data as Result) ?? null);
    setBusy(false);
  }

  return (
    <main id="main" className="section">
      <div className="container" style={{ maxWidth: 640, padding: "4rem 1.2rem" }}>
        <p className="eyebrow">Mehfooz Maidan</p>
        <h1>Check a verification certificate</h1>
        <p className="muted">Enter the certificate number printed on the PDF.</p>
        <form className="panel form" onSubmit={check} style={{ marginTop: "1.5rem" }}>
          <label className="field">
            Certificate number
            <input value={no} onChange={(e) => setNo(e.target.value)} placeholder="MM-2026-XXXXXXXX" required />
          </label>
          <button className="button" type="submit" disabled={busy}>
            {busy ? "Checking…" : "Check"}
          </button>
        </form>
        {result === null && <p className="notice" style={{ marginTop: "1rem" }}>No certificate found with that number.</p>}
        {result && (
          <div className="panel" style={{ marginTop: "1rem" }}>
            <h3>{result.valid ? "Valid certificate" : "This certificate has been withdrawn"}</h3>
            <p>
              {result.holder_name} — {result.role}
            </p>
            <p className="small muted">Issued {new Date(result.issued_at).toLocaleDateString("en-GB")}</p>
          </div>
        )}
      </div>
    </main>
  );
}
