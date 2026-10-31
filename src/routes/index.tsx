import { createFileRoute } from "@tanstack/react-router";
import { LegacyApp } from "@/components/LegacyApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mehfooz Maidan — Protected ground for Pakistani sport" },
      { name: "description", content: "Mehfooz Maidan connects athletes, sports organisations, coaches and lawyers across Pakistan." },
      { property: "og:title", content: "Mehfooz Maidan — Protected ground for Pakistani sport" },
      { property: "og:description", content: "Opportunity, professional connection and legal access for Pakistani sport." },
    ],
  }),
  component: LegacyApp,
});
