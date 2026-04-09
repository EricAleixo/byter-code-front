import { postService } from "@/src/services/posts.service";
import { FileText } from "lucide-react";
import { InfinitePostsGrid } from "./_components/InfinitePostsGrid";

export default async function PostsPage() {
  const { data: initialPosts, meta } = await postService.findAllPublished(1, 12);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">

        {/* título */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Todos os artigos</h1>
            <p className="text-sm text-zinc-500">
              {meta?.total ?? initialPosts.length} artigos publicados
            </p>
          </div>
          <div
            className="p-3 rounded-2xl border border-zinc-800"
            style={{ background: "linear-gradient(135deg, #5b21b620, #7c3aed10)" }}
          >
            <FileText className="size-6 text-violet-400" />
          </div>
        </div>

        {/* divider */}
        <div className="h-px bg-zinc-800" />

        {initialPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <FileText className="size-12 text-zinc-700" />
            <p className="text-zinc-500">Nenhum post publicado ainda.</p>
          </div>
        ) : (
          <InfinitePostsGrid
            initialPosts={initialPosts}
            initialHasNext={meta?.hasNextPage ?? false}
          />
        )}
      </main>
    </div>
  );
}