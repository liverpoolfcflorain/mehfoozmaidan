import { createFileRoute } from "@tanstack/react-router";
import { LegacyApp } from "@/components/LegacyApp";

// All other pages (portals, mission, opportunities...) are handled by the app itself.
export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Mehfooz Maidan" },
      { name: "description", content: "Opportunity, professional connection and legal access for Pakistani sport." },
      { property: "og:title", content: "Mehfooz Maidan" },
      { property: "og:description", content: "Opportunity, professional connection and legal access for Pakistani sport." },
    ],
  }),
  component: LegacyApp,
});
