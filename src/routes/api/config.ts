import { createFileRoute } from "@tanstack/react-router";
import { jsonResponse } from "@/server/mm.server";

export const Route = createFileRoute("/api/config")({
  server: {
    handlers: {
      GET: () =>
        jsonResponse(200, {
          supabaseUrl: (process.env["SUPABASE_URL"] || "").replace(/\/+$/, ""),
          publishableKey: process.env["SUPABASE_PUBLISHABLE_KEY"] || "",
        }),
    },
  },
});
