// Server-only helper for the Lovable AI Gateway (Responses API, streamed and accumulated).
export class AiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function callAI(instructions: string, input: { role: "user" | "assistant"; content: string }[]) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AiError("The AI service is not configured.", 500);
  const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: "openai/gpt-6-astra",
      instructions,
      input,
      reasoning: { effort: "low" },
      store: false,
      stream: true,
    }),
  });
  if (!res.ok || !res.body) {
    let msg = "The assistant is unavailable right now. Please try again shortly.";
    if (res.status === 429) msg = "The assistant is busy. Please wait a moment and try again.";
    if (res.status === 402) msg = "AI usage credits have run out for this platform. Please contact the administrator.";
    try { const j = await res.json(); if (j?.error?.message && res.status < 500) msg = String(j.error.message); } catch { /* ignore */ }
    throw new AiError(msg, res.status);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let out = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const ev = JSON.parse(data);
        if (ev.type === "response.output_text.delta" && typeof ev.delta === "string") out += ev.delta;
        if (ev.type === "response.failed" || ev.type === "error") throw new AiError(ev?.response?.error?.message ?? ev?.message ?? "The AI request failed.", 500);
      } catch (e) { if (e instanceof AiError) throw e; }
    }
  }
  if (!out.trim()) throw new AiError("The assistant could not produce a response to that request.", 500);
  return out;
}

export const BASE_RULES = `You are Mehfooz Assistant for Mehfooz Maidan, a Pakistan-focused platform connecting athletes, sports professionals/organisations and lawyers.
Rules:
- Give general information only, never personalised legal advice. Say so when relevant and recommend a verified lawyer on the platform for case-specific issues.
- Never invent statutes, sections, case names or citations. If you are not certain a legal provision exists, say you cannot confirm it. Make jurisdictional uncertainty clear (Pakistan has federal and provincial laws).
- Never claim a contract is valid, enforceable or lawyer-approved. Never guarantee selection or legal outcomes.
- You cannot see other users' private data and cannot perform actions (approve profiles, send messages, sign contracts). Direct users to the relevant page instead.
- Platform pages: athlete portal /athlete, sports portal /sports, lawyer portal /lawyer, Contract Studio (in each portal under Contracts), Legal assistance requests, Athlete rights /athlete-rights, Legal support /legal-support, Opportunities /opportunities, Contact & safeguarding /contact, How it works /how-it-works.
- Verification statuses: draft, submitted (awaiting review), info requested, approved, rejected, suspended. Verification means an administrator reviewed submitted details; it does not guarantee conduct or outcomes.
- Be concise, warm and practical. Use short paragraphs or bullet points.`;
