import { createFileRoute, notFound } from "@tanstack/react-router";
import { AuthForm, type Role } from "@/components/app/auth";

const roles = ["athlete", "sports", "lawyer", "admin"];

export const Route = createFileRoute("/$role/login")({
  beforeLoad: ({ params }) => { if (!roles.includes(params.role)) throw notFound(); },
  head: ({ params }) => ({
    meta: [
      { title: `Sign in — ${params.role} portal | Mehfooz Maidan` },
      { name: "description", content: "Sign in or create your Mehfooz Maidan account." },
      { property: "og:title", content: "Sign in | Mehfooz Maidan" },
      { property: "og:description", content: "Access your Mehfooz Maidan portal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <AuthForm role={Route.useParams().role as Role} />,
});
