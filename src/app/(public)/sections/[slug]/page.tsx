import {
  Clock,
  Search,
  ChevronRight,
  ArrowLeft,
  SlidersHorizontal,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { postService } from "@/src/services/posts.service";
import { Post } from "@/src/types/post";
import { ApiCategory } from "@/src/types/category";

// ─── fetch ────────────────────────────────────────────────────────────────────

async function getCategory(slug: string): Promise<ApiCategory | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/slug/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getAllCategories(): Promise<ApiCategory[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CategoryBadgeGlass({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm"
      style={{
        color,
        borderColor: `${color}60`,
        backgroundColor: `${color}25`,
        boxShadow: `0 2px 12px ${color}20`,
      }}
    >
      <Tag className="size-3" />
      {name}
    </span>
  );
}

function CategoryBanner({ category, count, posts }: { category: ApiCategory; count: number; posts: Post[] }) {
  const coverPost = posts.find((p) => p.coverImage);
  return (
    <div
      className="relative w-full h-48 sm:h-64 overflow-hidden rounded-2xl mb-8 border"
      style={{ borderColor: `${category.color}30` }}
    >
      {coverPost?.coverImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverPost.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 backdrop-blur-sm bg-zinc-950/60" />
        </>
      )}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${category.color}40, ${category.color}10)` }} />
      <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ backgroundColor: category.color }} />
      <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl border backdrop-blur-sm" style={{ borderColor: `${category.color}50`, backgroundColor: `${category.color}30` }}>
            <Tag className="size-5" style={{ color: category.color }} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: category.color }}>
            {count} {count === 1 ? "artigo" : "artigos"}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-lg">
          {category.name}
        </h1>
      </div>
    </div>
  );
}

function FeaturedCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <article className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors">
        <div className="relative h-52 sm:h-64 overflow-hidden">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${post.category.color}20, ${post.category.color}05)` }} />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
          <div className="absolute top-3 left-3">
            <CategoryBadgeGlass name={post.category.name} color={post.category.color} />
          </div>
        </div>
        <div className="p-5">
          <h2 className="text-lg font-bold text-white leading-snug mb-2 line-clamp-2 group-hover:text-violet-300 transition-colors">{post.title}</h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="text-zinc-300 font-medium">{post.author.name}</span>
              <span>·</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
            {post.readTime && (
              <div className="flex items-center gap-1 text-xs" style={{ color: post.category.color }}>
                <Clock className="size-3" /><span>{post.readTime}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

function ArticleRow({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <article className="group flex gap-4 py-4 cursor-pointer border-b border-zinc-800/60 last:border-0">
        <div className="shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-zinc-800">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${post.category.color}20, ${post.category.color}05)` }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {post.postTags.slice(0, 2).map(({ tag }) => (
              <span key={tag.id} className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border bg-violet-500/10 text-violet-400 border-violet-500/20">
                {tag.name}
              </span>
            ))}
          </div>
          <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-violet-300 transition-colors leading-snug line-clamp-2 mb-1.5">{post.title}</h3>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <span>{post.author.name}</span>
            <span>·</span>
            <span>{formatDate(post.createdAt)}</span>
            {post.readTime && (<><span>·</span><Clock className="size-2.5" /><span>{post.readTime}</span></>)}
          </div>
        </div>
      </article>
    </Link>
  );
}

function Pagination({ meta, slug, color }: {
  meta: { page: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean };
  slug: string;
  color: string;
}) {
  if (meta.totalPages <= 1) return null;

  const pages = () => {
    const arr: (number | "...")[] = [];
    const { page, totalPages } = meta;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    arr.push(1);
    if (page > 3) arr.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      arr.push(i);
    }
    if (page < totalPages - 2) arr.push("...");
    arr.push(totalPages);

    return arr;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      {/* prev */}
      {meta.hasPrevPage ? (
        <Link
          href={`/sections/${slug}?page=${meta.page - 1}`}
          className="w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
        >
          ‹
        </Link>
      ) : (
        <span className="w-8 h-8 rounded-lg text-xs flex items-center justify-center border border-zinc-800 text-zinc-700">‹</span>
      )}

      {/* páginas */}
      {pages().map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-zinc-600">…</span>
        ) : (
          <Link
            key={p}
            href={`/sections/${slug}?page=${p}`}
            className="w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center border transition-colors"
            style={
              p === meta.page
                ? { backgroundColor: `${color}25`, color, borderColor: `${color}50` }
                : { color: "#71717a", borderColor: "#27272a" }
            }
          >
            {p}
          </Link>
        )
      )}

      {/* next */}
      {meta.hasNextPage ? (
        <Link
          href={`/sections/${slug}?page=${meta.page + 1}`}
          className="w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
        >
          ›
        </Link>
      ) : (
        <span className="w-8 h-8 rounded-lg text-xs flex items-center justify-center border border-zinc-800 text-zinc-700">›</span>
      )}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

const LIMIT = 9;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = pageParam ? parseInt(pageParam) : 1;

  const [category, allCategories, { data: posts, meta }] = await Promise.all([
    getCategory(slug),
    getAllCategories(),
    postService.findByCategory(slug, page, LIMIT),
  ]);

  if (!category) notFound();

  const [featured, ...rest] = page === 1 ? posts : [null, ...posts];
  const otherCategories = allCategories.filter((c) => c.slug !== slug);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${category.color}88, ${category.color}, ${category.color}88)` }} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <CategoryBanner category={category} count={meta?.total ?? posts.length} posts={posts} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {posts.length === 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center py-20 gap-3 text-center">
                <Tag className="size-10" style={{ color: `${category.color}40` }} />
                <p className="text-zinc-500 text-sm">Nenhum post publicado nesta categoria ainda.</p>
              </div>
            )}

            {/* destaque só na página 1 */}
            {featured && page === 1 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Destaque</h2>
                <FeaturedCard post={featured} />
              </div>
            )}

            {rest.filter(Boolean).length > 0 && (
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap shrink-0">
                      {page === 1 ? "Todos os artigos" : `Página ${page}`}
                    </h2>
                    <div className="h-px bg-zinc-800 flex-1 min-w-0" />
                  </div>
                  <span className="text-xs text-zinc-600 shrink-0">{meta?.total ?? posts.length} no total</span>
                </div>
                <div>
                  {(page === 1 ? rest : posts).filter(Boolean).map((post) => (
                    <ArticleRow key={post!.id} post={post!} />
                  ))}
                </div>

                {meta && <Pagination meta={meta} slug={slug} color={category.color} />}
              </div>
            )}
          </div>

          <aside className="lg:col-span-1 space-y-8">
            <div className="rounded-xl border p-4" style={{ borderColor: `${category.color}33`, background: `${category.color}10` }}>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="size-4" style={{ color: category.color }} />
                <span className="text-sm font-bold" style={{ color: category.color }}>{category.name}</span>
              </div>
              <p className="text-xs font-semibold mt-3" style={{ color: category.color }}>
                {meta?.total ?? posts.length} {(meta?.total ?? posts.length) === 1 ? "artigo publicado" : "artigos publicados"}
              </p>
              {meta && meta.totalPages > 1 && (
                <p className="text-[11px] text-zinc-600 mt-1">
                  Página {meta.page} de {meta.totalPages}
                </p>
              )}
            </div>

            {otherCategories.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Outras categorias</h3>
                <ul className="space-y-1">
                  {otherCategories.map((cat) => (
                    <li key={cat.id}>
                      <Link href={`/sections/${cat.slug}`} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors group">
                        <div className="flex items-center gap-2.5">
                          <Tag className="size-3.5" style={{ color: cat.color }} />
                          <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{cat.name}</span>
                        </div>
                        <ChevronRight className="size-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}