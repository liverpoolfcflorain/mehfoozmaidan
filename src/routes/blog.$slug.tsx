import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, EmptyState, meta } from "@/components/site/SiteLayout";

function Post() {
  const { slug } = Route.useParams();
  const q = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("title,summary,body,updated_at").eq("section", "blog").eq("status", "published").eq("slug", slug).maybeSingle();
      return data;
    },
  });
  if (q.isLoading) return <PageShell eyebrow="Blog" title="Loading…"><span /></PageShell>;
  if (!q.data) return <PageShell eyebrow="Blog" title="Post not found"><EmptyState title="This post isn't available" body="It may have been removed." cta={{ to: "/blog", label: "All posts" }} /></PageShell>;
  const p = q.data;
  return (
    <PageShell eyebrow={new Date(p.updated_at).toLocaleDateString()} title={p.title} intro={p.summary ?? undefined}>
      <article className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted-foreground">
        {p.body.split(/\n{2,}/).map((t, i) => <p key={i} className="whitespace-pre-line">{t}</p>)}
      </article>
      <Link to="/blog" className="mt-12 inline-block font-semibold text-primary">← All posts</Link>
    </PageShell>
  );
}

export const Route = createFileRoute("/blog/$slug")({
  head: () => meta("Blog post", "Read this post on the Mehfooz Maidan blog."),
  component: Post,
});
