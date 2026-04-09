import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  ChevronRight,
  Flame,
  BookOpen,
} from "lucide-react";
import CategoryScrollMobile from "./_components/CategoryScrollMobile";
import Link from "next/link";
import { categoriesService } from "@/src/services/categories.service";
import { CategoryWithPosts } from "@/src/types/category";
import { Post } from "@/src/types/post";
import { formatDate } from "@/src/utils/formatDate";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { DynamicIcon } from "@/src/utils/DynamicIcon";
import { LanguageMostUsed } from "./_components/LanguageMostUsed";

// ─── helpers ──────────────────────────────────────────────────────────────────

function TagBadge({ tag }: { tag?: string }) {
  if (!tag) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border bg-violet-500/20 text-violet-300 border-violet-500/30">
      {tag}
    </span>
  );
}

// ─── componentes ──────────────────────────────────────────────────────────────

function FeaturedArticle({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <article className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 hover:border-violet-700/50 transition-colors cursor-pointer">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-800">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-violet-900/40 to-zinc-900" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-xs border"
              style={{
                backgroundColor: `${post.category.color}20`,
                color: post.category.color,
                borderColor: `${post.category.color}50`,
              }}
            >
              {post.category.name}
            </Badge>
            {post.postTags[0] && <TagBadge tag={post.postTags[0].tag.name} />}
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug group-hover:text-violet-300 transition-colors mb-3">
            {post.title}
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">{post.excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <UserAvatar user={post.author} />
            <span>·</span>
            <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
            {post.readTime && (
              <>
                <span>·</span>
                <Clock className="size-3" />
                <span>{post.readTime} de leitura</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

function ArticleCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <article className="group flex gap-4 py-4 cursor-pointer">
        <div className="shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-zinc-800">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-violet-900/40 to-zinc-900" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: post.category.color }}
            >
              {post.category.name}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-zinc-100 leading-snug group-hover:text-violet-300 transition-colors line-clamp-2 mb-1.5">
            {post.title}
          </h3>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <span className="text-zinc-300">{post.author.name}</span>
            {post.readTime && (
              <>
                <span>·</span>
                <Clock className="size-2.5" />
                <span>{post.readTime}</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

function Sidebar({ posts, categories }: { posts: Post[]; categories: CategoryWithPosts[] }) {
  return (
    <aside className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Flame className="size-4 text-rose-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Mais lidos hoje</h3>
        </div>
        <ol className="space-y-3">
          {posts.slice(0, 4).map((post, i) => (
            <Link key={post.id} href={`/posts/${post.slug}`}>
              <li className="group flex items-start gap-3 cursor-pointer">
                <span
                  className="shrink-0 text-2xl font-black leading-none"
                  style={{ color: i === 0 ? "#7c3aed" : "#3f3f46" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-300 group-hover:text-violet-300 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">{formatDate(post.createdAt)}</p>
                </div>
              </li>
            </Link>
          ))}
        </ol>
      </div>

      <Separator className="bg-zinc-800" />

      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="size-4 text-zinc-500" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Explorar por área</h3>
        </div>
        <ul className="space-y-1">
          {[...categories]
            .sort(() => Math.random() - 0.5)
            .slice(0, 4)
            .map((cat, index) => (
              <Link
                key={cat.id}
                href={`/sections/${cat.slug}`}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-zinc-500 w-4 group-hover:text-violet-500">
                    {index + 1}.
                  </span>

                  <span className="text-sm text-zinc-300 transition-colors group-hover:text-violet-500">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
        </ul>
      </div>

      <Separator className="bg-zinc-800" />

      <LanguageMostUsed></LanguageMostUsed>
    </aside>
  );
}

// ─── seção por categoria ──────────────────────────────────────────────────────

function CategorySection({ category }: { category: CategoryWithPosts }) {
  const { color, name, slug, posts, icon } = category;

  if (posts.length === 0) return null;

  const [main, ...rest] = posts;
  const gridPosts = rest.slice(0, 3);

  return (
    <section className="relative">
      {/* faixa de cor lateral */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
        style={{ backgroundColor: color }}
      />

      <div className="pl-5">
        {/* cabeçalho da seção */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border"
              style={{
                backgroundColor: `${color}15`,
                color: color,
                borderColor: `${color}40`,
              }}
            >
              <DynamicIcon name={icon} color={color} className="size-3" />
              {name}
            </span>
          </div>
          <Link
            href={`/sections/${slug}`}
            className="flex items-center gap-1 text-xs font-medium transition-colors"
            style={{ color }}
          >
            Ver todos <ChevronRight className="size-3" />
          </Link>
        </div>

        {/* layout: post principal + grid de 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* post principal — esquerda, ocupa 3 colunas */}
          <Link href={`/posts/${main.slug}`}>
            <article className="group h-full rounded-xl overflow-hidden border bg-zinc-900 hover:border-opacity-80 transition-all cursor-pointer"
              style={{ borderColor: `${color}30` }}
            >
              <div className="relative h-52 w-full overflow-hidden bg-zinc-800">
                {main.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={main.coverImage}
                    alt={main.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(135deg, ${color}25, ${color}05)`,
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-zinc-900/80 to-transparent" />
              </div>
              <div className="p-5">
                {main.postTags[0] && (
                  <span className="inline-block mb-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: `${color}15`,
                      color: color,
                      borderColor: `${color}40`,
                    }}
                  >
                    {main.postTags[0].tag.name}
                  </span>
                )}
                <h3 className="text-lg font-bold text-white leading-snug group-hover:text-opacity-80 transition-colors mb-2 line-clamp-2"
                  style={{ ["--tw-text-opacity" as string]: 1 }}
                >
                  <span className="group-hover:text-zinc-300 transition-colors">{main.title}</span>
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-4">
                  {main.excerpt}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                  <span className="text-zinc-300 font-medium">{main.author.name}</span>
                  <span>·</span>
                  <span>{formatDate(main.publishedAt ?? main.createdAt)}</span>
                  {main.readTime && (
                    <>
                      <span>·</span>
                      <Clock className="size-2.5" />
                      <span>{main.readTime}</span>
                    </>
                  )}
                </div>
              </div>
            </article>
          </Link>

          {/* grid de 3 posts — direita, ocupa 2 colunas */}
          <div className="col-span-1 flex flex-col gap-9">
            {gridPosts.length > 0 ? gridPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.slug}`}>
                <article className="group flex gap-3 py-4 first:pt-0 cursor-pointer border-b pb-3 border-zinc-800">
                  <div className="shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-zinc-800">
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{
                          background: `linear-gradient(135deg, ${color}20, ${color}05)`,
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-zinc-100 leading-snug line-clamp-2 mb-1.5 group-hover:text-zinc-300 transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <span>{post.author.name}</span>
                      {post.readTime && (
                        <>
                          <span>·</span>
                          <Clock className="size-2.5" />
                          <span>{post.readTime}</span>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            )) : (
              <p className="text-sm text-zinc-600 py-4">Sem outros posts nesta categoria.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const categoriesWithPosts = await categoriesService.getCategoriesWithPosts();


  const publishedPosts = categoriesWithPosts.flatMap((cat) => cat.posts);
  const featured = publishedPosts[0];
  const mainArticles = publishedPosts.slice(1, 4);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">

        {/* ── ticker de destaque ── */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto">
          <span className="shrink-0 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
            Destaque
          </span>
          <Separator orientation="vertical" className="h-4 bg-zinc-700" />
          <p className="text-sm text-zinc-400 whitespace-nowrap">
            <span className="text-zinc-200 font-medium">{featured?.title ?? "Nenhum destaque no momento"}</span>
          </p>
        </div>

        {/* ── grid principal (featured + sidebar) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {featured ? (
              <FeaturedArticle post={featured} />
            ) : (
              <div className="h-64 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 text-sm">
                Nenhum post publicado ainda.
              </div>
            )}

            <div className="flex items-center justify-between gap-3 min-w-0 mt-9">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap shrink-0">
                  Artigos recentes
                </h2>
                <div className="h-px bg-zinc-800 flex-1 min-w-0" />
              </div>
              <a href="#" className="shrink-0 flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors whitespace-nowrap">
                Ver todos <ChevronRight className="size-3" />
              </a>
            </div>

            <div className="divide-y divide-zinc-800/60">
              {mainArticles.length > 0 ? (
                mainArticles.map((post) => <ArticleCard key={post.id} post={post} />)
              ) : (
                <p className="text-sm text-zinc-600 py-4">Nenhum artigo recente.</p>
              )}
            </div>

            {/* categorias mobile/desktop */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
                Explorar categorias
              </h2>
              <CategoryScrollMobile categoriesData={categoriesWithPosts} />
              <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categoriesWithPosts.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/sections/${cat.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-800/80 transition-all group"
                    style={{ borderColor: `${cat.color}30` }}
                  >
                    <span
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <DynamicIcon color={cat.color} name={cat.icon} className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{cat.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Sidebar posts={publishedPosts} categories={categoriesWithPosts} />
          </div>
        </div>

        {/* ── seções por categoria ── */}
        {categoriesWithPosts.filter((cat) => cat.posts.length > 0).length > 0 && (
          <div className="mt-16 space-y-14">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap shrink-0">
                Por categoria
              </h2>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>

            {categoriesWithPosts
              .filter((cat) => cat.posts.length > 0)
              .map((cat) => (
                <CategorySection key={cat.id} category={cat} />
              ))}
          </div>
        )}
      </main>
    </div>
  );
}