import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { callAI, AiError, BASE_RULES } from "./ai.server";

const msgSchema = z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) })).min(1).max(30);

async function references(supabase: { from: (t: string) => any }) {
  const { data } = await supabase.from("site_content").select("title, summary, jurisdiction, references_text, reviewed_on, slug, section")
    .eq("status", "published").in("section", ["athlete_rights", "legal_explainer"]).limit(20);
  if (!data?.length) return "\nNo curated legal resources have been published on the platform yet. Say so when the user asks for specific law, and suggest a verified lawyer.";
  return "\nApproved platform resources you may reference (cite by title; link /athlete-rights):\n" +
    data.map((d: any) => `- ${d.title} [${d.jurisdiction ?? "jurisdiction not stated"}; reviewed ${d.reviewed_on ?? "n/a"}]: ${d.summary} ${d.references_text ? "References: " + d.references_text : ""}`).join("\n");
}

function fail(e: unknown): never {
  if (e instanceof AiError) throw new Error(e.message);
  throw new Error("The assistant is unavailable right now. Please try again shortly.");
}

export const assistantChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ conversationId: z.string().uuid().nullable(), message: z.string().trim().min(1).max(4000) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase.from("profiles").select("primary_role, full_name").eq("id", userId).maybeSingle();
    const role = profile?.primary_role ?? "visitor";
    let convId = data.conversationId;
    if (!convId) {
      const { data: c, error } = await supabase.from("ai_conversations").insert({ user_id: userId, title: data.message.slice(0, 60) }).select("id").single();
      if (error) throw new Error("Could not start a conversation.");
      convId = c.id;
    }
    const { data: history } = await supabase.from("ai_messages").select("role, content").eq("conversation_id", convId).order("created_at").limit(20);
    await supabase.from("ai_messages").insert({ conversation_id: convId, role: "user", content: data.message });
    const input = [...(history ?? []).map((h) => ({ role: h.role as "user" | "assistant", content: h.content })), { role: "user" as const, content: data.message }];
    const roleGuide = role === "athlete" ? "The user is an ATHLETE: focus on profiles, opportunities, applications, contracts and legal support."
      : role === "sports" ? "The user is a SPORTS PROFESSIONAL or ORGANISATION: focus on profile verification, athlete discovery, recruitment pipelines, opportunities and agreements."
      : role === "lawyer" ? "The user is a LAWYER: focus on accepting requests, matters, contract review queue, comments and revisions."
      : "";
    let reply: string;
    try { reply = await callAI(`${BASE_RULES}\n${roleGuide}${await references(supabase)}`, input); } catch (e) { fail(e); }
    await supabase.from("ai_messages").insert({ conversation_id: convId, role: "assistant", content: reply });
    return { conversationId: convId, reply };
  });

export const publicAssistant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ messages: msgSchema.max(10) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const reply = await callAI(`${BASE_RULES}\nThe user is a visitor who is not signed in. Give general public-platform guidance and explain how to join.`, data.messages);
      return { reply };
    } catch (e) { fail(e); }
  });

export const draftContract = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ contractId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: c } = await supabase.from("contracts").select("*").eq("id", data.contractId).maybeSingle();
    if (!c || c.owner_id !== userId) throw new Error("Contract not found.");
    const prompt = `Agreement type: ${c.agreement_type}
Title: ${c.title}
Parties: ${JSON.stringify(c.parties)}
Questionnaire answers: ${JSON.stringify(c.answers)}
Involves a minor: ${c.involves_minor ? "yes" : "no"}

Produce two sections exactly with these headings:
=== REVIEW NOTES ===
Bullet list grouped under "Missing details", "Potential concerns (unclear or possibly unfair terms — not a finding of unlawfulness)", "Recommendations", and "Issues needing a lawyer's review". Never state a legal requirement unless you are certain it exists; if unsure, list it under issues needing review.
=== DRAFT ===
A complete, editable plain-text draft agreement with numbered clauses, placeholders in [SQUARE BRACKETS] for anything missing, governing law stated as the laws of Pakistan subject to lawyer confirmation, and a header line: "DRAFT — AI-generated, not reviewed by a lawyer, not legally binding until reviewed and signed." Do not cite specific statutes or sections.`;
    let out: string;
    try {
      out = await callAI(`${BASE_RULES}\nYou are now acting as a careful drafting assistant inside Contract Studio.`, [{ role: "user", content: prompt }]);
    } catch (e) { fail(e); }
    const [, notesPart = "", draftPart = ""] = out.split(/=== REVIEW NOTES ===|=== DRAFT ===/);
    const draft = (draftPart || out).trim();
    const notes = notesPart.trim();
    const { data: last } = await supabase.from("contract_versions").select("version").eq("contract_id", c.id).order("version", { ascending: false }).limit(1).maybeSingle();
    const version = (last?.version ?? 0) + 1;
    const { error } = await supabase.from("contract_versions").insert({ contract_id: c.id, version, body: draft.slice(0, 60000), created_by: userId, ai_generated: true, note: "AI draft" });
    if (error) throw new Error("Could not save the draft.");
    await supabase.from("contracts").update({ concerns: notes.slice(0, 20000) }).eq("id", c.id);
    return { version, notes };
  });
