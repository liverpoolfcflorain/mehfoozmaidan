import { createFileRoute } from "@tanstack/react-router";
import { adminLogin, handle, jsonResponse, readBody } from "@/server/mm.server";

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: ({ request }) => handle(async () => jsonResponse(200, await adminLogin(await readBody(request)))),
    },
  },
});
