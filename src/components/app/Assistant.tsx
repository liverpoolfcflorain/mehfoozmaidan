// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Send, Trash2, X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { assistantChat, publicAssistant } from "@/lib/ai.functions";
import { useSession } from "./auth";
import { PageHead, btnGhost } from "./Portal";

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  "How does verification work?",
  "What should I check before signing a sponsorship agreement?",
  "Help me prepare questions for a lawyer",
  "How do I use Contract Studio?",
];

function Thread({ messages, pending, error, onRetry }: { messages: Msg[]; pending: boolean; error: string | null; onRetry: () => void }) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, pending]);
  return (
    <div className="flex flex-col gap-4" aria-live="polite">
      {messages.map((m, i) => (
        <div key={i} className={m.role === "user" ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground" : "max-w-[95%] whitespace-pre-wrap text-sm leading-relaxed"}>
          {m.content}
        </div>
      ))}
      {pending && <div className="text-sm text-muted-foreground">Mehfooz Assistant is thinking…</div>}
      {error && (
        <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error} <button onClick={onRetry} className="ml-2 font-semibold underline">Retry</button>
        </div>
      )}
      <div ref={end} />
    </div>
  );
}

function useChat() {
  const { user } = useSession();
  const chat = useServerFn(assistantChat);
  const pub = useServerFn(publicAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState("");
  const qc = useQueryClient();

  async function send(text: string, retry = false) {
    const t = text.trim();
    if (!t || pending) return;
    setError(null);
    setLastInput(t);
    const next = retry ? messages : [...messages, { role: "user" as const, content: t }];
    setMessages(next);
    setPending(true);
    try {
      if (user) {
        const r = await chat({ data: { conversationId, message: t } });
        setConversationId(r.conversationId);
        setMessages([...next, { role: "assistant", content: r.reply }]);
        qc.invalidateQueries({ queryKey: ["ai-convs"] });
      } else {
        const r = await pub({ data: { messages: next.slice(-10) } });
        setMessages([...next, { role: "assistant", content: r!.reply }]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }
  return { user, messages, setMessages, conversationId, setConversationId, pending, error, send, retry: () => send(lastInput, true) };
}

function Composer({ onSend, disabled }: { onSend: (t: string) => void; disabled: boolean }) {
  const [v, setV] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSend(v); setV(""); }} className="flex items-end gap-2 rounded-2xl border bg-background p-2">
      <label className="sr-only" htmlFor="assistant-input">Ask Mehfooz Assistant</label>
      <textarea id="assistant-input" value={v} onChange={(e) => setV(e.target.value)} rows={1} maxLength={4000}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(v); setV(""); } }}
        placeholder="Ask about the platform, contracts or your rights…" className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none" />
      <button disabled={disabled || !v.trim()} className="rounded-xl bg-primary p-2.5 text-primary-foreground disabled:opacity-40" aria-label="Send"><Send size={16} /></button>
    </form>
  );
}

const disclaimer = "General information only — not legal advice. Messages are processed by an AI provider; don't share confidential documents or ID numbers.";

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const c = useChat();
  return (
    <>
      {open && (
        <div className="glass fixed bottom-24 right-4 z-50 flex h-[min(620px,75vh)] w-[min(400px,calc(100vw-2rem))] flex-col rounded-3xl border shadow-2xl" role="dialog" aria-label="Mehfooz Assistant">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div><p className="font-display font-semibold">Mehfooz Assistant</p><p className="text-xs text-muted-foreground">{c.user ? "Tailored to your role" : "Public guidance"}</p></div>
            <div className="flex gap-1">
              <button onClick={() => { c.setMessages([]); c.setConversationId(null); }} className="rounded-full p-2 hover:bg-muted" aria-label="New conversation"><Plus size={16} /></button>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-muted" aria-label="Close"><X size={16} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {c.messages.length === 0 ? (
              <div className="grid gap-2">
                <p className="text-sm text-muted-foreground">How can I help?</p>
                {suggestions.map((s) => <button key={s} onClick={() => c.send(s)} className="rounded-xl border px-3 py-2 text-left text-sm hover:bg-muted">{s}</button>)}
              </div>
            ) : <Thread messages={c.messages} pending={c.pending} error={c.error} onRetry={c.retry} />}
          </div>
          <div className="border-t p-3">
            <Composer onSend={c.send} disabled={c.pending} />
            <p className="mt-2 text-[11px] text-muted-foreground">{disclaimer}</p>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-4 z-50 flex items-center gap-2 rounded-full bg-charcoal px-5 py-3.5 text-sm font-semibold text-on-image shadow-xl hover:bg-primary" aria-label="Open Mehfooz Assistant" aria-expanded={open}>
        <MessageCircle size={18} /> Assistant
      </button>
    </>
  );
}

export function AssistantPage() {
  const c = useChat();
  const qc = useQueryClient();
  const convs = useQuery({
    enabled: !!c.user,
    queryKey: ["ai-convs"],
    queryFn: async () => (await supabase.from("ai_conversations").select("id, title, created_at").order("created_at", { ascending: false })).data ?? [],
  });
  async function open(id: string) {
    const { data } = await supabase.from("ai_messages").select("role, content").eq("conversation_id", id).order("created_at");
    c.setConversationId(id);
    c.setMessages((data ?? []) as Msg[]);
  }
  async function remove(id: string) {
    await supabase.from("ai_conversations").delete().eq("id", id);
    if (c.conversationId === id) { c.setMessages([]); c.setConversationId(null); }
    qc.invalidateQueries({ queryKey: ["ai-convs"] });
  }
  return (
    <div>
      <PageHead title="Mehfooz Assistant" intro="Guidance on the platform, profiles, recruitment, contracts and your rights. Your history is private to you and you can delete it at any time." />
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="flex flex-col gap-2">
          <button onClick={() => { c.setMessages([]); c.setConversationId(null); }} className={btnGhost}><Plus size={16} /> New conversation</button>
          {convs.data?.map((v) => (
            <div key={v.id} className={`group flex items-center gap-1 rounded-xl px-3 py-2 text-sm ${c.conversationId === v.id ? "bg-card" : "hover:bg-muted"}`}>
              <button onClick={() => open(v.id)} className="flex-1 truncate text-left">{v.title}</button>
              <button onClick={() => remove(v.id)} aria-label="Delete conversation" className="opacity-50 hover:opacity-100"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <div className="flex min-h-[60vh] flex-col rounded-3xl bg-card p-6">
          <div className="flex-1">
            {c.messages.length === 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {suggestions.map((s) => <button key={s} onClick={() => c.send(s)} className="rounded-2xl bg-background px-4 py-3 text-left text-sm hover:bg-muted">{s}</button>)}
              </div>
            ) : <Thread messages={c.messages} pending={c.pending} error={c.error} onRetry={c.retry} />}
          </div>
          <div className="mt-6"><Composer onSend={c.send} disabled={c.pending} /><p className="mt-2 text-xs text-muted-foreground">{disclaimer}</p></div>
        </div>
      </div>
    </div>
  );
}
