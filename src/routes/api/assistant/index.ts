import { createFileRoute } from "@tanstack/react-router";
import { assistant, handle, jsonResponse, readBody } from "@/server/mm.server";

export const Route = createFileRoute("/api/assistant/")({
  server: {
    handlers: {
      POST: ({ request }) => handle(async () => jsonResponse(200, await assistant(request, await readBody(request), false))),
    },
  },
});
