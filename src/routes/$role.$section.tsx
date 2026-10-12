import { createFileRoute, notFound } from "@tanstack/react-router";
import { PortalSection } from "@/components/app/PortalSection";

export const Route = createFileRoute("/$role/$section")({
  beforeLoad: ({ params }) => { if (!["athlete", "sports", "lawyer", "admin"].includes(params.role)) throw notFound(); },
  head: () => ({ meta: [{ title: "Dashboard | Mehfooz Maidan" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const p = Route.useParams();
    return <PortalSection role={p.role} section={p.section} />;
  },
});
