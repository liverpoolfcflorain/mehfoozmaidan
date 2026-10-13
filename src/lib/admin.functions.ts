import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const ADMIN_EMAIL = "admin@mehfoozmaidan.app";

// Verifies the hidden admin password server-side and provisions the admin account if missing.
export const adminPasswordLogin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { checkAdminPassword } = await import("./admin.server");
    if (!checkAdminPassword(data.password)) throw new Error("Incorrect password.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let userId: string | undefined;
    const { data: created } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL, password: data.password, email_confirm: true, user_metadata: { full_name: "Platform Administrator" },
    });
    userId = created?.user?.id;
    if (!userId) {
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      userId = list?.users.find((u) => u.email === ADMIN_EMAIL)?.id;
      if (userId) await supabaseAdmin.auth.admin.updateUserById(userId, { password: data.password, email_confirm: true });
    }
    if (!userId) throw new Error("Could not prepare the admin account.");
    await supabaseAdmin.from("user_roles").upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role", ignoreDuplicates: true });
    return { email: ADMIN_EMAIL };
  });
