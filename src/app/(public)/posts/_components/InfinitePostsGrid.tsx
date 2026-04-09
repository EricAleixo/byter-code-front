"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Post } from "@/src/types/post";
import { Clock, Tag, Loader2 } from "lucide-react";
import { formatDate } from "@/src/utils/formatDate";
import { DynamicIcon } from "@/src/utils/DynamicIcon";

async function fetchPage(page: number): Promise<{ data: Post[]; meta: { hasNextPage: boolean; total: number } | null }> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/published?page=${page}&limit=12`,
      { cache: "no-store" }
    );
    if (!res.ok) return { data: [], meta: null };
    return res.json();
  } catch {
    return { data: [], meta: null };
  }
}

function PostCardLarge({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <article className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-zinc-950/50 h-full">
        <div className="relative h-64 overflow-hidden bg-zinc-800 shrink-0">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: `linear-gradient(135deg, ${post.category.color}20, ${post.category.color}05)` }}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-900/70 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-full border backdrop-blur-sm"
              style={{
                color: post.category.color,
                borderColor: `${post.category.color}50`,
                backgroundColor: `${post.category.color}20`,
              }}
            >
              <DynamicIcon name={post.category.icon} className="size-3" />
              {post.category.name} 
            </span>
          </div>
        </div>
        <div className="flex flex-col flex-1 p-5 gap-3">
          <h3 className="text-base font-bold text-zinc-100 leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-[11px] text-zinc-600 pt-2 border-t border-zinc-800">
            <div className="flex items-center gap-2">
              {post.author.avatarUrl ? (
                <img src={post.author.avatarUrl} alt={post.author.name} className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, #5b21b6, #7c3aed)" }}
                >
                  {post.author.name[0].toUpperCase()}
                </div>
              )}
              <span className="truncate max-w-24">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {post.readTime && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {post.readTime}
                </span>
              )}
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function PostCardSmall({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <article className="group flex gap-3 rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-zinc-950/50 p-3">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: `linear-gradient(135deg, ${post.category.color}20, ${post.category.color}05)` }}
            />
          )}
        </div>
        <div className="flex flex-col flex-1 gap-1.5 min-w-0">
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold w-fit"
            style={{ color: post.category.color }}
          >
            <DynamicIcon name={post.category.icon} color={post.category.color} className="size-3" />
            {post.category.name}
          </span>
          <h3 className="text-xs font-bold text-zinc-100 leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors">
            {post.title}
          </h3>
          <div className="flex items-center gap-2 text-[10px] text-zinc-600 mt-auto">
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="size-2.5" />
                {post.readTime}
              </span>
            )}
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function FeedBlock({ posts }: { posts: Post[] }) {
  // Bloco de 3: 1 grande à esquerda + 2 pequenos à direita
  const [main, ...rest] = posts;
  if (!main) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <PostCardLarge post={main} />
      </div>
      <div className="flex flex-col gap-4">
        {rest.map((post, i) => (
          <PostCardSmall key={i} post={post} />
        ))}
      </div>
    </div>
  );
}

function FeedBlockReversed({ posts }: { posts: Post[] }) {
  // Bloco de 3: 2 pequenos à esquerda + 1 grande à direita
  const [main, ...rest] = posts;
  if (!main) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col gap-4">
        {rest.map((post, i) => (
          <PostCardSmall key={i} post={post} />
        ))}
      </div>
      <div className="md:col-span-2">
        <PostCardLarge post={main} />
      </div>
    </div>
  );
}

function FeedRow({ posts, reversed }: { posts: Post[]; reversed: boolean }) {
  if (reversed) return <FeedBlockReversed posts={posts} />;
  return <FeedBlock posts={posts} />;
}

export function InfinitePostsGrid({ initialPosts, initialHasNext }: {
  initialPosts: Post[];
  initialHasNext: boolean;
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(initialHasNext);
  const [page, setPage] = useState(2);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasNext) return;

    loadingRef.current = true;
    setLoading(true);

    const { data, meta } = await fetchPage(page);

    if (data.length > 0) {
      setPosts((prev) => [...prev, ...data]);
      setPage((p) => p + 1);
    }

    setHasNext(meta?.hasNextPage ?? false);
    loadingRef.current = false;
    setLoading(false);
  }, [hasNext, page]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "300px" } // começa a carregar 300px antes de chegar
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // Agrupa em blocos de 3
  const chunks: Post[][] = [];
  for (let i = 0; i < posts.length; i += 3) {
    chunks.push(posts.slice(i, i + 3));
  }

  return (
    <div className="flex flex-col gap-6">
      {chunks.map((chunk, i) => (
        <FeedRow key={i} posts={chunk} reversed={i % 2 !== 0} />
      ))}

      {/* Sentinel — gatilho do scroll infinito */}
      <div ref={sentinelRef} className="flex items-center justify-center py-8">
        {loading && (
          <Loader2 className="size-5 animate-spin text-violet-400" />
        )}
        {!hasNext && posts.length > 0 && (
          <p className="text-xs text-zinc-700">Fim dos posts</p>
        )}
      </div>
    </div>
  );
}