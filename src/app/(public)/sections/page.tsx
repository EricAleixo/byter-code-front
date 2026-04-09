import Link from "next/link";
import { Tag, FileText, ArrowRight } from "lucide-react";
import { postService } from "@/src/services/posts.service";
import { categoriesService } from "@/src/services/categories.service";
import { ApiCategory } from "@/src/types/category";
import { DynamicIcon } from "@/src/utils/DynamicIcon";

type ApiTag = { id: string; name: string; slug: string };

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  postTags: { tag: ApiTag }[];
};



function PostThumb({ post, color }: { post: Post; color: string }) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <div className="group relative rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all bg-zinc-900 aspect-video">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)` }}
          >
            <FileText className="size-8" style={{ color: `${color}60` }} />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-xs font-semibold text-white leading-snug line-clamp-2">
            {post.title}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default async function SectionsPage() {
  const categories = await categoriesService.getCategoriesWithPosts();

  const withPosts = categories.filter((c) => c.posts.length > 0);
  const empty = categories.filter((c) => c.posts.length === 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16">

        {/* título */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-white">Explorar por seção</h1>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Navegue pelas categorias e encontre os artigos que mais combinam com você.
          </p>
        </div>

        {/* categorias com posts */}
        {withPosts.map((cat) => (
          <section key={cat.id} className="space-y-5">

            {/* cabeçalho da seção */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-xl border backdrop-blur-sm"
                  style={{
                    borderColor: `${cat.color}40`,
                    backgroundColor: `${cat.color}15`,
                    boxShadow: `0 0 20px ${cat.color}10`,
                  }}
                >
                  <DynamicIcon name={cat.icon} color={cat.color} className="size-3" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">{cat.name}</h2>
                </div>
              </div>

              <Link
                href={`/sections/${cat.slug}`}
                className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                style={{ color: cat.color }}
              >
                Ver todos <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* divider colorido */}
            <div
              className="h-px w-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${cat.color}60, transparent)` }}
            />

            {/* grid de posts */}
            {cat.posts.length === 1 && (
              <div className="max-w-sm">
                <PostThumb post={cat.posts[0]} color={cat.color} />
                <p className="mt-2 text-sm font-semibold text-zinc-200 line-clamp-2">
                  {cat.posts[0].title}
                </p>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{cat.posts[0].excerpt}</p>
              </div>
            )}

            {cat.posts.length === 2 && (
              <div className="grid grid-cols-2 gap-4">
                {cat.posts.map((post) => (
                  <div key={post.id}>
                    <PostThumb post={post} color={cat.color} />
                    <p className="mt-2 text-sm font-semibold text-zinc-200 line-clamp-2">{post.title}</p>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{post.excerpt}</p>
                  </div>
                ))}
              </div>
            )}

            {cat.posts.length >= 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* post principal */}
                <div className="sm:col-span-2 lg:col-span-1 lg:row-span-1">
                  <Link href={`/posts/${cat.posts[0].slug}`}>
                    <div className="group relative rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all bg-zinc-900 h-56 sm:h-64">
                      {cat.posts[0].coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cat.posts[0].coverImage}
                          alt={cat.posts[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}05)` }}
                        >
                          <FileText className="size-10" style={{ color: `${cat.color}50` }} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border mb-2 backdrop-blur-sm"
                          style={{
                            color: cat.color,
                            borderColor: `${cat.color}50`,
                            backgroundColor: `${cat.color}20`,
                          }}
                        >
                          <DynamicIcon name={cat.icon} color={cat.color} className="size-2.5" /> {cat.name}
                        </span>
                        <p className="text-sm font-bold text-white leading-snug line-clamp-2">
                          {cat.posts[0].title}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                          {cat.posts[0].excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* demais posts */}
                <div className="sm:col-span-2 lg:col-span-2 grid grid-cols-2 gap-4">
                  {cat.posts.slice(1, 5).map((post) => (
                    <div key={post.id}>
                      <PostThumb post={post} color={cat.color} />
                      <p className="mt-2 text-xs font-semibold text-zinc-200 line-clamp-2">{post.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ))}

        {/* categorias sem posts */}
        {empty.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-600">
              Em breve
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {empty.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-2.5 p-3 rounded-xl border bg-zinc-900/50"
                  style={{ borderColor: `${cat.color}20` }}
                >
                  <div
                    className="p-1.5 rounded-lg border"
                    style={{
                      borderColor: `${cat.color}30`,
                      backgroundColor: `${cat.color}10`,
                    }}
                  >
                    <DynamicIcon name={cat.icon} color={cat.color} className="size-3" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-400">{cat.name}</p>
                    <p className="text-[11px] text-zinc-700">Nenhum post ainda</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}