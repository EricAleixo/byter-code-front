import Link from "next/link";
import { FileText, ImageOff } from "lucide-react";
import { CoursePost } from "@/src/types/course";

export function RelatedPostsList({ posts }: { posts: CoursePost[] }) {
  if (posts.length === 0) return null;

  const sorted = [...posts].sort((a, b) => a.position - b.position);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800">
        <h2 className="text-sm font-bold text-white">Artigos sobre</h2>
      </div>

      <ul className="divide-y divide-zinc-800/60">
        {sorted.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.slug}`} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/60 transition-colors group">
              <div className="shrink-0 w-12 h-9 rounded-md overflow-hidden bg-zinc-800 flex items-center justify-center">
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageOff className="size-3.5 text-zinc-700" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-zinc-300 group-hover:text-violet-400 transition-colors line-clamp-2">
                  {post.title}
                </p>
              </div>
              <FileText size={13} className="text-zinc-700 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}