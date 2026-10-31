import { createFileRoute } from "@tanstack/react-router";
import { handle } from "@/server/mm.server";
import { certificatePdf } from "@/server/certificate.server";

export const Route = createFileRoute("/api/certificate")({
  server: {
    handlers: {
      GET: ({ request }) => handle(() => certificatePdf(request)),
    },
  },
});
