// Server-side logic ported from the original Node server (server.js).
// Runs on the edge runtime: uses fetch only, no Node built-ins.

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const baseRules = `You are Mehfooz Assistant for Mehfooz Maidan, a Pakistan-focused platform connecting athletes, sports professionals/organisations and lawyers.
Rules:
- Give general information only, never personalised legal advice. Say so when relevant and recommend a verified lawyer on the platform for case-specific issues.
- Never invent statutes, sections, case names or citations. If you are not certain a legal provision exists, say you cannot confirm it. Make jurisdictional uncertainty clear (Pakistan has federal and provincial laws).
- Never claim a contract is valid, enforceable or lawyer-approved. Never guarantee selection or legal outcomes.
- You cannot see other users' private data and cannot perform actions (approve profiles, send messages, sign contracts). Direct users to the relevant page instead.
- Platform pages: athlete portal /athlete, sports portal /sports, lawyer portal /lawyer, Contract Studio (in each portal under Contracts), Legal assistance requests, Athlete rights /athlete-rights, Legal support /legal-support, Opportunities /opportunities, Contact & safeguarding /contact, How it works /how-it-works.
- Verification means an administrator reviewed submitted details; it does not guarantee conduct or outcomes.
- Be concise, warm and practical. Use short paragraphs or bullet points.`;

export function env() {
  return {
    url: (process.env["SUPABASE_URL"] || "").replace(/\/+$/, ""),
    publicKey: process.env["SUPABASE_PUBLISHABLE_KEY"] || "",
    serviceKey: process.env["SUPABASE_SERVICE_ROLE_KEY"] || "",
    adminPassword: process.env["ADMIN_PASSWORD"] || "",
    lovableKey: process.env["LOVABLE_API_KEY"] || "",
  };
}

export function jsonResponse(status: number, value: unknown) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function handle(fn: () => Promise<Response>) {
  try {
    return await fn();
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Unexpected error.";
    if (status >= 500) console.error(error);
    return jsonResponse(status, { error: message });
  }
}

export async function readBody(request: Request): Promise<Record<string, unknown>> {
  const text = await request.text();
  if (text.length > 1_000_000) throw new HttpError(413, "Request is too large.");
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError(400, "Invalid JSON body.");
  }
}

export function tokenFrom(request: Request) {
  const value = request.headers.get("authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7) : "";
}

type FetchOpts = { token?: string; service?: boolean; method?: string; body?: unknown; prefer?: string };

export async function sb(path: string, { token, service = false, method = "GET", body, prefer }: FetchOpts = {}) {
  const e = env();
  const key = service ? e.serviceKey : e.publicKey;
  if (!e.url || !key) throw new HttpError(503, "Backend configuration is incomplete.");
  const headers: Record<string, string> = { apikey: key, "content-type": "application/json" };
  // Opaque sb_ keys are not JWTs: only send Authorization for a real user token.
  if (token) headers["authorization"] = `Bearer ${token}`;
  if (prefer) headers["Prefer"] = prefer;
  const response = await fetch(`${e.url}${path}`, {
    method,
    headers,
    body: body === undefined ? null : JSON.stringify(body),
  });
  const raw = await response.text();
  let data: any = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }
  if (!response.ok) {
    const message = typeof data === "object" && data ? data.message || data.msg || data.error_description : data;
    throw new HttpError(response.status, message || `Backend request failed (${response.status}).`);
  }
  return data;
}

export async function requireUser(request: Request) {
  const token = tokenFrom(request);
  if (!token) throw new HttpError(401, "Sign in to continue.");
  const user = await sb("/auth/v1/user", { token }).catch(() => null);
  if (!user?.id) throw new HttpError(401, "Your session has expired. Sign in again.");
  return { token, user: user as { id: string; email?: string } };
}

async function callAI(instructions: string, input: { role: string; content: string }[]) {
  const { lovableKey } = env();
  if (!lovableKey) throw new HttpError(503, "The AI service is not configured.");
  const response = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${lovableKey}`, "content-type": "application/json", "x-lovable-aig-sdk": "fetch" },
    body: JSON.stringify({ model: "openai/gpt-6-astra", instructions, input, reasoning: { effort: "low" }, store: false }),
  });
  if (!response.ok) {
    let message = "The assistant is unavailable right now. Please try again shortly.";
    if (response.status === 429) message = "The assistant is busy. Please wait a moment and try again.";
    if (response.status === 402) message = "AI usage credits have run out for this platform. Please contact the administrator.";
    const text = await response.text();
    console.error(`AI gateway failed [${response.status}]: ${text}`);
    throw new HttpError(response.status >= 500 ? 502 : response.status, message);
  }
  const result: any = await response.json();
  const output: string =
    result.output_text ||
    (result.output || [])
      .flatMap((o: any) => o.content || [])
      .filter((c: any) => c.type === "output_text")
      .map((c: any) => c.text)
      .join("");
  if (!output?.trim()) throw new HttpError(502, "The assistant could not produce a response.");
  return output;
}

async function publishedReferences(token: string) {
  try {
    const q = new URLSearchParams({
      select: "title,summary,jurisdiction,references_text,reviewed_on,slug,section",
      status: "eq.published",
      section: "in.(athlete_rights,legal_explainer)",
      limit: "20",
    });
    const data = await sb(`/rest/v1/site_content?${q}`, { token });
    if (!data?.length)
      return "\nNo curated legal resources have been published on the platform yet. Say so when asked about specific law and suggest a verified lawyer.";
    return (
      "\nApproved platform resources you may reference (cite by title; link /athlete-rights):\n" +
      data
        .map(
          (i: any) =>
            `- ${i.title} [${i.jurisdiction || "jurisdiction not stated"}; reviewed ${i.reviewed_on || "n/a"}]: ${i.summary || ""} ${i.references_text ? `References: ${i.references_text}` : ""}`,
        )
        .join("\n")
    );
  } catch {
    return "";
  }
}

export async function assistant(request: Request, body: any, isPublic: boolean) {
  let token = "";
  let userId = "";
  let roleGuide = "The user is a visitor who is not signed in. Give general public-platform guidance and explain how to join.";
  if (!isPublic) {
    const auth = await requireUser(request);
    token = auth.token;
    userId = auth.user.id;
    const profiles = await sb(`/rest/v1/profiles?select=primary_role&id=eq.${userId}`, { token });
    const role = profiles?.[0]?.primary_role || "visitor";
    roleGuide =
      role === "athlete"
        ? "The user is an ATHLETE: focus on profiles, opportunities, applications, contracts and legal support."
        : role === "sports"
          ? "The user is a SPORTS PROFESSIONAL or ORGANISATION: focus on profile verification, athlete discovery, recruitment pipelines, opportunities and agreements."
          : role === "lawyer"
            ? "The user is a LAWYER: focus on accepting requests, matters, contract review queue, comments and revisions."
            : "";
  }
  const input = isPublic
    ? Array.isArray(body.messages) ? body.messages : []
    : [{ role: "user", content: String(body.message || "").trim() }];
  const max = isPublic ? 10 : 1;
  if (
    !input.length || input.length > max ||
    input.some((m: any) => !["user", "assistant"].includes(m?.role) || typeof m?.content !== "string" || !m.content.trim() || m.content.length > 4000)
  )
    throw new HttpError(400, "Please send a valid message.");

  if (isPublic) return { reply: await callAI(`${baseRules}\n${roleGuide}`, input) };

  let conversationId = typeof body.conversationId === "string" ? body.conversationId : null;
  if (!conversationId) {
    const created = await sb("/rest/v1/ai_conversations", {
      token, method: "POST", body: { user_id: userId, title: input[0].content.slice(0, 60) }, prefer: "return=representation",
    });
    conversationId = created?.[0]?.id;
    if (!conversationId) throw new HttpError(500, "Could not start a conversation.");
  }
  const history = await sb(
    `/rest/v1/ai_messages?select=role,content&conversation_id=eq.${conversationId}&order=created_at.asc&limit=20`,
    { token },
  );
  await sb("/rest/v1/ai_messages", { token, method: "POST", body: { conversation_id: conversationId, role: "user", content: input[0].content } });
  const messages = [...(history || []).map((i: any) => ({ role: i.role, content: i.content })), input[0]];
  const reply = await callAI(`${baseRules}\n${roleGuide}${await publishedReferences(token)}`, messages);
  await sb("/rest/v1/ai_messages", { token, method: "POST", body: { conversation_id: conversationId, role: "assistant", content: reply } });
  return { conversationId, reply };
}

export async function draftContract(request: Request, body: any) {
  const { token, user } = await requireUser(request);
  const id = String(body.contractId || "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new HttpError(400, "Invalid contract.");
  const contracts = await sb(`/rest/v1/contracts?select=*&id=eq.${id}`, { token });
  const contract = contracts?.[0];
  if (!contract || contract.owner_id !== user.id) throw new HttpError(404, "Contract not found.");
  const prompt = `Agreement type: ${contract.agreement_type}
Title: ${contract.title}
Parties: ${JSON.stringify(contract.parties)}
Questionnaire answers: ${JSON.stringify(contract.answers)}
Involves a minor: ${contract.involves_minor ? "yes" : "no"}

Produce two sections exactly with these headings:
=== REVIEW NOTES ===
Bullet list grouped under "Missing details", "Potential concerns (unclear or possibly unfair terms — not a finding of unlawfulness)", "Recommendations", and "Issues needing a lawyer's review". Never state a legal requirement unless you are certain it exists; if unsure, list it under issues needing review.
=== DRAFT ===
A complete, editable plain-text draft agreement with numbered clauses, placeholders in [SQUARE BRACKETS] for anything missing, governing law stated as the laws of Pakistan subject to lawyer confirmation, and a header line: "DRAFT — AI-generated, not reviewed by a lawyer, not legally binding until reviewed and signed." Do not cite specific statutes or sections.`;
  const output = await callAI(`${baseRules}\nYou are now acting as a careful drafting assistant inside Contract Studio.`, [{ role: "user", content: prompt }]);
  const [, notesText = "", draftText = ""] = output.split(/=== REVIEW NOTES ===|=== DRAFT ===/);
  const versions = await sb(`/rest/v1/contract_versions?select=version&contract_id=eq.${id}&order=version.desc&limit=1`, { token });
  const version = (versions?.[0]?.version || 0) + 1;
  await sb("/rest/v1/contract_versions", {
    token, method: "POST",
    body: { contract_id: id, version, body: (draftText || output).trim().slice(0, 60000), created_by: user.id, ai_generated: true, note: "AI draft" },
  });
  await sb(`/rest/v1/contracts?id=eq.${encodeURIComponent(id)}`, { token, method: "PATCH", body: { concerns: notesText.trim().slice(0, 20000) } });
  return { version, notes: notesText.trim() };
}

async function sha256(text: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}

export async function passwordMatches(candidate: string, expected: string) {
  if (!expected || !candidate) return false;
  const [a, b] = await Promise.all([sha256(candidate), sha256(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

export async function adminLogin(body: any) {
  const e = env();
  if (!e.adminPassword) throw new HttpError(503, "Admin login is not configured yet.");
  const password = String(body.password || "");
  if (!(await passwordMatches(password, e.adminPassword))) throw new HttpError(401, "Incorrect password.");
  const email = "admin@mehfoozmaidan.app";
  let userId = "";
  try {
    const data = await sb("/auth/v1/admin/users", {
      service: true, method: "POST",
      body: { email, password, email_confirm: true, user_metadata: { full_name: "Platform Administrator" } },
    });
    userId = data?.user?.id || data?.id || "";
  } catch {
    const data = await sb("/auth/v1/admin/users?page=1&per_page=1000", { service: true });
    userId = data?.users?.find((u: any) => u.email === email)?.id || "";
    if (userId) {
      await sb(`/auth/v1/admin/users/${encodeURIComponent(userId)}`, { service: true, method: "PUT", body: { password, email_confirm: true } });
    }
  }
  if (!userId) throw new HttpError(500, "Could not prepare the admin account.");
  await sb("/rest/v1/user_roles?on_conflict=user_id%2Crole", {
    service: true, method: "POST", body: { user_id: userId, role: "admin" }, prefer: "resolution=ignore-duplicates,return=minimal",
  });
  return { email };
}
