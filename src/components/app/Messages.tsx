// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./auth";
import { Empty, PageHead, btn, btnGhost, inputCls } from "./Portal";

export function MessagesPage({ initial }: { initial?: string }) {
  const { user } = useSession();
  const qc = useQueryClient();
  const [active, setActive] = useState<string | null>(initial ?? null);
  const [search, setSearch] = useState("");
  const convs = useQuery({
    enabled: !!user,
    queryKey: ["convs", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("conversations")
        .select("id, kind, last_message_at, conversation_participants(user_id, accepted, last_read_at, profiles(full_name, primary_role))")
        .order("last_message_at", { ascending: false });
      return data ?? [];
    },
  });
  const msgs = useQuery({
    enabled: !!active,
    queryKey: ["msgs", active],
    queryFn: async () => (await supabase.from("messages").select("*").eq("conversation_id", active!).order("created_at")).data ?? [],
  });

  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel(`msgs-${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
        qc.invalidateQueries({ queryKey: ["msgs"] });
        qc.invalidateQueries({ queryKey: ["convs"] });
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, qc]);

  useEffect(() => {
    if (active && user) supabase.from("conversation_participants").update({ last_read_at: new Date().toISOString() }).eq("conversation_id", active).eq("user_id", user.id).then(() => {});
  }, [active, user, msgs.data?.length]);

  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView(); }, [msgs.data]);

  const list = (convs.data ?? []).map((c: any) => {
    const others = c.conversation_participants.filter((p: any) => p.user_id !== user?.id);
    const me = c.conversation_participants.find((p: any) => p.user_id === user?.id);
    return { ...c, title: others.map((o: any) => o.profiles?.full_name || "Member").join(", "), me, othersAccepted: others.every((o: any) => o.accepted) };
  }).filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
  const current = list.find((c) => c.id === active);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("body") as HTMLTextAreaElement;
    const body = input.value.trim();
    if (!body) return;
    const { error } = await supabase.from("messages").insert({ conversation_id: active!, sender_id: user!.id, body: body.slice(0, 5000) });
    if (error) return toast.error("Message could not be sent. The recipient may not have accepted your request yet.");
    input.value = "";
    qc.invalidateQueries({ queryKey: ["msgs", active] });
  }
  async function acceptRequest() {
    await supabase.from("conversation_participants").update({ accepted: true }).eq("conversation_id", active!).eq("user_id", user!.id);
    qc.invalidateQueries({ queryKey: ["convs"] });
  }
  async function declineRequest() {
    await supabase.from("conversation_participants").update({ accepted: false, last_read_at: new Date().toISOString() }).eq("conversation_id", active!).eq("user_id", user!.id);
    setActive(null);
    toast.success("Request declined.");
  }

  return (
    <div>
      <PageHead title="Messages" intro="Private conversations, protected in transit and at rest and visible only to participants. Legal case conversations are kept separate. Messages are not end-to-end encrypted." />
      <div className="grid min-h-[60vh] gap-4 lg:grid-cols-[300px_1fr]">
        <div className="rounded-3xl bg-card p-3">
          <input className={inputCls} placeholder="Search conversations" value={search} onChange={(e) => setSearch(e.target.value)} />
          <ul className="mt-3 grid gap-1">
            {list.length === 0 && <li className="p-4 text-sm text-muted-foreground">No conversations yet. Start one from a profile.</li>}
            {list.map((c) => {
              const unread = c.me && new Date(c.last_message_at) > new Date(c.me.last_read_at ?? 0);
              return (
                <li key={c.id}>
                  <button onClick={() => setActive(c.id)} className={`w-full rounded-2xl px-4 py-3 text-left ${active === c.id ? "bg-background" : "hover:bg-background/60"}`}>
                    <div className="flex items-center gap-2"><span className="flex-1 truncate font-medium">{c.title}</span>{unread && <span className="h-2 w-2 rounded-full bg-gold" aria-label="Unread" />}</div>
                    <p className="text-xs text-muted-foreground">{c.kind === "legal" ? "Legal case workspace" : c.me?.accepted ? "Conversation" : "Message request"}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex flex-col rounded-3xl bg-card p-6">
          {!current ? <Empty title="Select a conversation" body="Choose a conversation on the left." /> : (
            <>
              <div className="border-b pb-4"><p className="font-semibold">{current.title}</p>{current.kind === "legal" && <p className="text-xs text-muted-foreground">Confidential legal workspace — only the client and assigned lawyer can read this.</p>}</div>
              {!current.me?.accepted && (
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-secondary p-4 text-sm">
                  <span className="flex-1">This person isn't connected with you. Accept to reply.</span>
                  <button className={btn} onClick={acceptRequest}>Accept</button><button className={btnGhost} onClick={declineRequest}>Decline</button>
                </div>
              )}
              <div className="flex-1 space-y-3 overflow-y-auto py-4">
                {msgs.data?.map((m) => (
                  <div key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.sender_id === user?.id ? "ml-auto bg-primary text-primary-foreground" : "bg-background"}`}>
                    <p className="whitespace-pre-wrap">{m.body}</p>
                    <p className="mt-1 text-[10px] opacity-60">{new Date(m.created_at).toLocaleString()}</p>
                  </div>
                ))}
                <div ref={end} />
              </div>
              {current.me?.accepted && (
                <form onSubmit={send} className="flex gap-2 border-t pt-4">
                  <textarea name="body" rows={2} maxLength={5000} className={inputCls} placeholder={current.othersAccepted ? "Write a message" : "Waiting for them to accept — your first message will be shown with the request"} />
                  <button className={btn}>Send</button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
