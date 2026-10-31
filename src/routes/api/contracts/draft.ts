import { createFileRoute } from "@tanstack/react-router";
import { draftContract, handle, jsonResponse, readBody } from "@/server/mm.server";

export const Route = createFileRoute("/api/contracts/draft")({
  server: {
    handlers: {
      POST: ({ request }) => handle(async () => jsonResponse(200, await draftContract(request, await readBody(request)))),
    },
  },
});
