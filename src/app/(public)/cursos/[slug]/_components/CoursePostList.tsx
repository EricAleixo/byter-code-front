import Link from "next/link";
import { CoursePost } from "@/src/types/course";
import { FileText, Clock, ImageOff } from "lucide-react";

export function CoursePostList({ posts }: { posts: CoursePost[] }) {
  const sorted = [...posts].sort((a, b) => a.position - b.position);

  return (
    <ul className="space-y-2">
      {sorted.map((post) => (
        <li key={post.id}>
          <Link
            href={`/posts/${post.slug}`}
            className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-violet-600 transition-all group"
          >
            <div className="shrink-0 w-14 h-10 rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center">
              {post.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <ImageOff className="size-4 text-zinc-700" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-200 group-hover:text-violet-400 transition-colors truncate">
                {post.title}
              </p>
              {post.excerpt && (
                <p className="text-xs text-zinc-600 line-clamp-1">{post.excerpt}</p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0 text-[11px] text-zinc-600">
              {post.readTime && (
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {post.readTime}
                </span>
              )}
              <FileText size={13} className="text-zinc-700 group-hover:text-violet-500 transition-colors" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}