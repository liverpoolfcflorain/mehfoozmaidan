import { createFileRoute } from "@tanstack/react-router";
import { assistant, handle, jsonResponse, readBody } from "@/server/mm.server";

// Public visitor assistant: no sign-in, no stored history.
export const Route = createFileRoute("/api/assistant/public")({
  server: {
    handlers: {
      POST: ({ request }) => handle(async () => jsonResponse(200, await assistant(request, await readBody(request), true))),
    },
  },
});
