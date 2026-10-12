// @ts-nocheck
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password | Mehfooz Maidan" }, { name: "robots", content: "noindex" }] }),
  component: Reset,
});

function Reset() {
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) return toast.error("Use at least 8 characters");
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/join" });
  }
  return (
    <form onSubmit={submit} className="mx-auto mt-32 grid max-w-sm gap-4 px-6">
      <h1 className="text-3xl font-semibold">Set a new password</h1>
      <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="rounded-xl border bg-background px-4 py-3" placeholder="New password" />
      <button className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Update password</button>
    </form>
  );
}
