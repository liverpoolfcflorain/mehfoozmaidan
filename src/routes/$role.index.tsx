import { createFileRoute, notFound } from "@tanstack/react-router";
import { PortalSection } from "@/components/app/PortalSection";

export const Route = createFileRoute("/$role/")({
  beforeLoad: ({ params }) => { if (!["athlete", "sports", "lawyer", "admin"].includes(params.role)) throw notFound(); },
  head: () => ({ meta: [{ title: "Dashboard | Mehfooz Maidan" }, { name: "robots", content: "noindex" }] }),
  component: () => <PortalSection role={Route.useParams().role} section="" />,
});
