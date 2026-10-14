import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, EmptyState, meta } from "@/components/site/SiteLayout";

function BlogList() {
  const q = useQuery({
    queryKey: ["blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("slug,title,summary,updated_at").eq("section", "blog").eq("status", "published").order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  return (
    <PageShell eyebrow="Blog" title="Notes from the maidan." intro="News, guides and perspectives from the Mehfooz Maidan team.">
      {q.isLoading ? <p className="text-muted-foreground">Loading…</p> : !q.data?.length ? (
        <EmptyState title="No posts yet" body="Our team will publish blog posts here soon." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {q.data.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="rounded-3xl bg-card p-8 transition hover:bg-muted">
              <p className="eyebrow text-primary">{new Date(p.updated_at).toLocaleDateString()}</p>
              <h2 className="mt-3 text-2xl font-semibold">{p.title}</h2>
              {p.summary && <p className="mt-3 text-muted-foreground">{p.summary}</p>}
              <span className="mt-6 inline-block text-sm font-semibold">Read →</span>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}

export const Route = createFileRoute("/blog/")({
  head: () => meta("Blog", "News, guides and perspectives on athlete safety and sport in Pakistan."),
  component: BlogList,
});
