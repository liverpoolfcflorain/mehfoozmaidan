import { createHash, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const portArgument = process.argv.indexOf("--port");
const port = Number(process.argv[portArgument + 1] && portArgument >= 0 ? process.argv[portArgument + 1] : process.env.PORT || 3000);
const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/+$/, "");
const publicKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const adminPassword = process.env.ADMIN_PASSWORD || "";
const lovableKey = process.env.LOVABLE_API_KEY || "";

const baseRules = `You are Mehfooz Assistant for Mehfooz Maidan, a Pakistan-focused platform connecting athletes, sports professionals/organisations and lawyers.
Rules:
- Give general information only, never personalised legal advice. Say so when relevant and recommend a verified lawyer on the platform for case-specific issues.
- Never invent statutes, sections, case names or citations. If you are not certain a legal provision exists, say you cannot confirm it. Make jurisdictional uncertainty clear (Pakistan has federal and provincial laws).
- Never claim a contract is valid, enforceable or lawyer-approved. Never guarantee selection or legal outcomes.
- You cannot see other users' private data and cannot perform actions (approve profiles, send messages, sign contracts). Direct users to the relevant page instead.
- Platform pages: athlete portal /athlete, sports portal /sports, lawyer portal /lawyer, Contract Studio (in each portal under Contracts), Legal assistance requests, Athlete rights /athlete-rights, Legal support /legal-support, Opportunities /opportunities, Contact & safeguarding /contact, How it works /how-it-works.
- Verification means an administrator reviewed submitted details; it does not guarantee conduct or outcomes.
- Be concise, warm and practical. Use short paragraphs or bullet points.`;

const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

// Only these files (and everything inside /public/) may be served to the browser.
// This keeps .env, server.js, package.json, supabase/ and drizzle/ private.
const publicFiles = new Set(["/index.html", "/main.js", "/styles.css", "/favicon.ico"]);

function json(res, status, value) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  res.end(JSON.stringify(value));
}

async function readJson(req, limit = 1_000_000) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw Object.assign(new Error("Request is too large."), { status: 413 });
    chunks.push(chunk);
  }
  if (!size) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw Object.assign(new Error("Invalid JSON body."), { status: 400 });
  }
}

function tokenFrom(req) {
  const value = req.headers.authorization || "";
  return value.startsWith("Bearer ") ? value.slice(7) : "";
}

function supabaseHeaders(token, useServiceRole = false) {
  const key = useServiceRole ? serviceKey : publicKey;
  return {
    apikey: key,
    authorization: `Bearer ${token || key}`,
    "content-type": "application/json",
  };
}

async function supabaseFetch(path, { token, useServiceRole = false, method = "GET", body, prefer } = {}) {
  if (!supabaseUrl || !(useServiceRole ? serviceKey : publicKey)) {
    throw Object.assign(new Error("Supabase server configuration is incomplete."), { status: 503 });
  }
  const headers = supabaseHeaders(token, useServiceRole);
  if (prefer) headers.Prefer = prefer;
  const response = await fetch(`${supabaseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const raw = await response.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }
  if (!response.ok) {
    const message = typeof data === "object" && data ? data.message || data.msg || data.error_description : data;
    throw Object.assign(new Error(message || `Supabase request failed (${response.status}).`), { status: response.status });
  }
  return { data, headers: response.headers };
}

async function requireUser(req) {
  const token = tokenFrom(req);
  if (!token) throw Object.assign(new Error("Sign in to continue."), { status: 401 });
  const { data } = await supabaseFetch("/auth/v1/user", { token });
  if (!data?.id) throw Object.assign(new Error("Your session has expired. Sign in again."), { status: 401 });
  return { token, user: data };
}

async function callAI(instructions, input) {
  if (!lovableKey) throw Object.assign(new Error("The AI service is not configured."), { status: 503 });
  const response = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${lovableKey}`,
      "content-type": "application/json",
      "x-lovable-aig-sdk": "fetch",
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
  if (!response.ok || !response.body) {
    let message = "The assistant is unavailable right now. Please try again shortly.";
    if (response.status === 429) message = "The assistant is busy. Please wait a moment and try again.";
    if (response.status === 402) message = "AI usage credits have run out for this platform. Please contact the administrator.";
    try {
      const result = await response.json();
      if (result?.error?.message && response.status < 500) message = String(result.error.message);
    } catch {
      // Use the general message when the gateway response is not JSON.
    }
    throw Object.assign(new Error(message), { status: response.status >= 500 ? 502 : response.status });
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let output = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let boundary;
    while ((boundary = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 1);
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const event = JSON.parse(data);
        if (event.type === "response.output_text.delta" && typeof event.delta === "string") output += event.delta;
        if (event.type === "response.failed" || event.type === "error") {
          throw new Error(event?.response?.error?.message || event?.message || "The AI request failed.");
        }
      } catch (error) {
        if (error instanceof Error && error.message !== "Unexpected end of JSON input") throw error;
      }
    }
  }
  if (!output.trim()) throw Object.assign(new Error("The assistant could not produce a response."), { status: 502 });
  return output;
}

async function publishedReferences(token) {
  try {
    const url = new URL(`${supabaseUrl}/rest/v1/site_content`);
    url.searchParams.set("select", "title,summary,jurisdiction,references_text,reviewed_on,slug,section");
    url.searchParams.set("status", "eq.published");
    url.searchParams.set("section", "in.(athlete_rights,legal_explainer)");
    url.searchParams.set("limit", "20");
    const { data } = await supabaseFetch(url.pathname + url.search, { token });
    if (!data?.length) return "\nNo curated legal resources have been published on the platform yet. Say so when asked about specific law and suggest a verified lawyer.";
    return "\nApproved platform resources you may reference (cite by title; link /athlete-rights):\n" +
      data.map((item) => `- ${item.title} [${item.jurisdiction || "jurisdiction not stated"}; reviewed ${item.reviewed_on || "n/a"}]: ${item.summary || ""} ${item.references_text ? `References: ${item.references_text}` : ""}`).join("\n");
  } catch {
    return "";
  }
}

async function assistant(req, body, isPublic) {
  let token = "";
  let roleGuide = "The user is a visitor who is not signed in. Give general public-platform guidance and explain how to join.";
  if (!isPublic) {
    const auth = await requireUser(req);
    token = auth.token;
    const url = new URL(`${supabaseUrl}/rest/v1/profiles`);
    url.searchParams.set("select", "primary_role,full_name");
    url.searchParams.set("id", `eq.${auth.user.id}`);
    const { data: profiles } = await supabaseFetch(url.pathname + url.search, { token });
    const role = profiles?.[0]?.primary_role || "visitor";
    roleGuide = role === "athlete" ? "The user is an ATHLETE: focus on profiles, opportunities, applications, contracts and legal support."
      : role === "sports" ? "The user is a SPORTS PROFESSIONAL or ORGANISATION: focus on profile verification, athlete discovery, recruitment pipelines, opportunities and agreements."
        : role === "lawyer" ? "The user is a LAWYER: focus on accepting requests, matters, contract review queue, comments and revisions."
          : "";
  }
  const input = isPublic ? (Array.isArray(body.messages) ? body.messages : []) : [{ role: "user", content: String(body.message || "").trim() }];
  const maxMessages = isPublic ? 10 : 1;
  if (!input.length || input.length > maxMessages || input.some((message) =>
    !["user", "assistant"].includes(message?.role) || typeof message?.content !== "string" ||
    !message.content.trim() || message.content.length > 4000)) {
    throw Object.assign(new Error("Please send a valid message."), { status: 400 });
  }

  if (isPublic) return { reply: await callAI(`${baseRules}\n${roleGuide}`, input) };

  const userId = tokenFrom(req) ? (await requireUser(req)).user.id : "";
  let conversationId = typeof body.conversationId === "string" ? body.conversationId : null;
  if (!conversationId) {
    const { data: created } = await supabaseFetch("/rest/v1/ai_conversations", {
      token, method: "POST", body: { user_id: userId, title: input[0].content.slice(0, 60) }, prefer: "return=representation",
    });
    conversationId = created?.[0]?.id;
    if (!conversationId) throw Object.assign(new Error("Could not start a conversation."), { status: 500 });
  }
  const historyUrl = new URL(`${supabaseUrl}/rest/v1/ai_messages`);
  historyUrl.searchParams.set("select", "role,content");
  historyUrl.searchParams.set("conversation_id", `eq.${conversationId}`);
  historyUrl.searchParams.set("order", "created_at.asc");
  historyUrl.searchParams.set("limit", "20");
  const { data: history } = await supabaseFetch(historyUrl.pathname + historyUrl.search, { token });
  await supabaseFetch("/rest/v1/ai_messages", {
    token, method: "POST", body: { conversation_id: conversationId, role: "user", content: input[0].content },
  });
  const messages = [...(history || []).map((item) => ({ role: item.role, content: item.content })), input[0]];
  const reply = await callAI(`${baseRules}\n${roleGuide}${await publishedReferences(token)}`, messages);
  await supabaseFetch("/rest/v1/ai_messages", {
    token, method: "POST", body: { conversation_id: conversationId, role: "assistant", content: reply },
  });
  return { conversationId, reply };
}

async function draftContract(req, body) {
  const { token, user } = await requireUser(req);
  const id = String(body.contractId || "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw Object.assign(new Error("Invalid contract."), { status: 400 });
  const url = new URL(`${supabaseUrl}/rest/v1/contracts`);
  url.searchParams.set("select", "*");
  url.searchParams.set("id", `eq.${id}`);
  const { data: contracts } = await supabaseFetch(url.pathname + url.search, { token });
  const contract = contracts?.[0];
  if (!contract || contract.owner_id !== user.id) throw Object.assign(new Error("Contract not found."), { status: 404 });

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
  const latestUrl = new URL(`${supabaseUrl}/rest/v1/contract_versions`);
  latestUrl.searchParams.set("select", "version");
  latestUrl.searchParams.set("contract_id", `eq.${id}`);
  latestUrl.searchParams.set("order", "version.desc");
  latestUrl.searchParams.set("limit", "1");
  const { data: versions } = await supabaseFetch(latestUrl.pathname + latestUrl.search, { token });
  const version = (versions?.[0]?.version || 0) + 1;
  await supabaseFetch("/rest/v1/contract_versions", {
    token, method: "POST",
    body: { contract_id: id, version, body: (draftText || output).trim().slice(0, 60000), created_by: user.id, ai_generated: true, note: "AI draft" },
  });
  await supabaseFetch(`/rest/v1/contracts?id=eq.${encodeURIComponent(id)}`, {
    token, method: "PATCH", body: { concerns: notesText.trim().slice(0, 20000) },
  });
  return { version, notes: notesText.trim() };
}

function passwordMatches(candidate) {
  if (!adminPassword || !candidate) return false;
  const supplied = createHash("sha256").update(candidate).digest();
  const expected = createHash("sha256").update(adminPassword).digest();
  return timingSafeEqual(supplied, expected);
}

async function adminLogin(body) {
  if (!passwordMatches(String(body.password || ""))) {
    throw Object.assign(new Error("Incorrect password."), { status: 401 });
  }
  if (!serviceKey || !supabaseUrl || !publicKey) {
    throw Object.assign(new Error("Admin login is not configured on the server."), { status: 503 });
  }
  const email = "admin@mehfoozmaidan.app";
  let userId = "";
  try {
    const { data } = await supabaseFetch("/auth/v1/admin/users", {
      useServiceRole: true,
      method: "POST",
      body: { email, password: String(body.password), email_confirm: true, user_metadata: { full_name: "Platform Administrator" } },
    });
    userId = data?.user?.id || data?.id || "";
  } catch {
    const { data } = await supabaseFetch("/auth/v1/admin/users?page=1&per_page=1000", { useServiceRole: true });
    userId = data?.users?.find((item) => item.email === email)?.id || "";
    if (userId) {
      await supabaseFetch(`/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
        useServiceRole: true, method: "PUT",
        body: { password: String(body.password), email_confirm: true },
      });
    }
  }
  if (!userId) throw Object.assign(new Error("Could not prepare the admin account."), { status: 500 });
  await supabaseFetch("/rest/v1/user_roles?on_conflict=user_id%2Crole", {
    useServiceRole: true,
    method: "POST",
    body: { user_id: userId, role: "admin" },
    prefer: "resolution=ignore-duplicates,return=minimal",
  });
  return { email };
}

async function api(req, res, pathname) {
  if (req.method === "GET" && pathname === "/api/config") {
    return json(res, 200, { supabaseUrl, publishableKey: publicKey });
  }
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed." });
  const body = await readJson(req);
  if (pathname === "/api/assistant/public") return json(res, 200, await assistant(req, body, true));
  if (pathname === "/api/assistant") return json(res, 200, await assistant(req, body, false));
  if (pathname === "/api/contracts/draft") return json(res, 200, await draftContract(req, body));
  if (pathname === "/api/admin/login") return json(res, 200, await adminLogin(body));
  return json(res, 404, { error: "API route not found." });
}

async function sendIndex(req, res) {
  const contents = await readFile(resolve(root, "index.html"));
  res.writeHead(200, {
    "content-type": mime[".html"],
    "cache-control": "no-cache",
    "x-content-type-options": "nosniff",
  });
  return res.end(req.method === "HEAD" ? undefined : contents);
}

async function staticFile(req, res, pathname) {
  let requested;
  try {
    requested = decodeURIComponent(pathname);
  } catch {
    res.writeHead(400);
    return res.end("Bad request");
  }

  // Home page: "/" and "/index.html" always open the app.
  if (requested === "/" || requested === "/index.html") return sendIndex(req, res);
  if (requested === "/favicon.ico") requested = "/public/favicon.ico";
  // Serve only the installed browser OAuth SDK, never arbitrary dependency files.
  if (requested === "/public/cloud-auth.js") {
    const contents = await readFile(resolve(root, "node_modules/@lovable.dev/cloud-auth-js/dist/index.js"));
    res.writeHead(200, { "content-type": mime[".js"], "cache-control": "no-cache", "x-content-type-options": "nosniff" });
    return res.end(req.method === "HEAD" ? undefined : contents);
  }

  const allowed = publicFiles.has(requested) || requested.startsWith("/public/");
  if (allowed) {
    const candidate = resolve(root, `.${requested}`);
    if (candidate.startsWith(root + sep)) {
      try {
        const fileStat = await stat(candidate);
        if (fileStat.isFile()) {
          const contents = await readFile(candidate);
          res.writeHead(200, {
            "content-type": mime[extname(candidate).toLowerCase()] || "application/octet-stream",
            "x-content-type-options": "nosniff",
            "cache-control": "public, max-age=300",
          });
          return res.end(req.method === "HEAD" ? undefined : contents);
        }
      } catch {
        // fall through
      }
    }
    // A missing asset should 404, not return the app shell.
    res.writeHead(404);
    return res.end("Not found");
  }

  // Anything else that looks like a file (has an extension) is not public.
  if (/\.[a-z0-9]+$/i.test(requested)) {
    res.writeHead(404);
    return res.end("Not found");
  }

  // Client-side routes (/join, /athlete/login, /blog/some-post, ...) get the app shell.
  return sendIndex(req, res);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", "http://localhost");
    if (url.pathname.startsWith("/api/")) return await api(req, res, url.pathname);
    if (req.method !== "GET" && req.method !== "HEAD") {
      return json(res, 405, { error: "Method not allowed." });
    }
    return await staticFile(req, res, url.pathname);
  } catch (error) {
    const status = Number(error?.status) || 500;
    if (status >= 500) console.error("[server]", error);
    if (res.headersSent) return res.end();
    return json(res, status, { error: error?.message || "An unexpected server error occurred." });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Mehfooz Maidan is listening on port ${port}.`);
});
