import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Eye,
  Tag,
  Clock,
  CalendarDays,
  FileText,
  CheckCircle2,
  Circle,
  ImageOff,
  ChevronLeft,
  ChevronRight,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Post, PaginatedPosts } from "@/src/types/post";
import { postService } from "@/src/services/posts.service";
import { ButtonDelete } from "./_components/ButtonDelete";
import { DynamicIcon } from "@/src/utils/DynamicIcon";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: Post["status"] }) {
  return status === "PUBLISHED" ? (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <CheckCircle2 className="size-3" /> Publicado
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold bg-zinc-700/40 text-zinc-400 border border-zinc-700">
      <Circle className="size-3" /> Rascunho
    </span>
  );
}

function CoverImage({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="shrink-0 w-full h-36 sm:w-20 sm:h-14 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 flex items-center justify-center">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <ImageOff className="size-4 text-zinc-700" />
      )}
    </div>
  );
}

function Pagination({ meta }: { meta: NonNullable<PaginatedPosts["meta"]> }) {
  const { page, totalPages, total, limit, hasNextPage, hasPrevPage } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      <p className="text-xs text-zinc-500">
        Exibindo <span className="text-zinc-300">{from}–{to}</span> de{" "}
        <span className="text-zinc-300">{total}</span> posts
      </p>

      <div className="flex items-center gap-1">
        {hasPrevPage ? (
          <Link href={`?page=${page - 1}`}>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800">
              <ChevronLeft className="size-4" />
            </Button>
          </Link>
        ) : (
          <Button size="sm" variant="ghost" disabled className="h-8 w-8 p-0 text-zinc-700 hover:bg-zinc-800">
            <ChevronLeft className="size-4" />
          </Button>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link key={p} href={`?page=${p}`}>
            <Button
              size="sm"
              variant="ghost"
              className={`h-8 w-8 p-0 text-xs font-semibold ${p === page
                ? "bg-violet-600 text-white hover:bg-violet-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
            >
              {p}
            </Button>
          </Link>
        ))}

        {hasNextPage ? (
          <Link href={`?page=${page + 1}`}>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800">
              <ChevronRight className="size-4" />
            </Button>
          </Link>
        ) : (
          <Button size="sm" variant="ghost" disabled className="h-8 w-8 p-0 text-zinc-700">
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const cookieStore = await cookies();
  if (!cookieStore.get("token")) redirect("/login");

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { data: posts, meta } = await postService.findAll(page);

  const published = posts.filter((p) => p.status === "PUBLISHED").length;
  const drafts = posts.filter((p) => p.status === "DRAFT").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Gerenciar posts</h1>
            <p className="text-sm text-zinc-500">
              {meta?.total ?? 0} posts no total ·{" "}
              <span className="text-emerald-400">{published} publicados</span> ·{" "}
              <span className="text-zinc-400">{drafts} rascunhos</span>
            </p>
          </div>
          <Link href="/admin/posts/new">
            <Button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold gap-2">
              <Plus className="size-4" /> Novo post
            </Button>
          </Link>
        </div>

        {posts.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center py-20 gap-4 text-center">
            <FileText className="size-10 text-zinc-700" />
            <p className="text-zinc-500 text-sm">Nenhum post encontrado.</p>
            <Link href="/admin/posts/new">
              <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white gap-2">
                <Plus className="size-3.5" /> Criar primeiro post
              </Button>
            </Link>
          </div>
        )}

        {posts.length > 0 && (
          <>
            {/* ── mobile: cards ── */}
            <div className="flex flex-col gap-4 sm:hidden">
              {posts.map((post) => (
                <div key={post.id} className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                  <div className="w-full h-40 bg-zinc-800 relative">
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff className="size-6 text-zinc-700" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <StatusBadge status={post.status} />
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 mb-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-zinc-500 line-clamp-2">{post.excerpt}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm"
                        style={{
                          color: post.category.color,
                          borderColor: `${post.category.color}60`,
                          backgroundColor: `${post.category.color}25`,
                          boxShadow: `0 2px 12px ${post.category.color}20`,
                        }}
                      >
                        <DynamicIcon name={post.category.icon} color={post.category.color} className="size-3" />
                        {post.category.name}
                      </span>
                      {post.postTags.slice(0, 2).map(({ tag }) => (
                        <Badge key={tag.id} variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-400 border-zinc-700">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-600 flex-wrap">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3" />
                        {formatDate(post.createdAt)}
                      </span>
                      {post.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {post.readTime}
                        </span>
                      )}
                      <span>por {post.author.name}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
                      <Link href={`/posts/${post.slug}`} className="flex-1">
                        <Button size="sm" variant="ghost" className="w-full gap-1.5 text-zinc-400 hover:text-white text-xs">
                          <Eye className="size-3.5" /> Visualizar
                        </Button>
                      </Link>
                      <Link href={`/admin/posts/${post.slug}/edit`} className="flex-1">
                        <Button size="sm" variant="ghost" className="w-full gap-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 text-xs">
                          <Pencil className="size-3.5" /> Editar
                        </Button>
                      </Link>
                      <ButtonDelete id={post.id}></ButtonDelete>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── desktop: tabela ── */}
            <div className="hidden sm:block rounded-xl border border-zinc-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/80">
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Capa</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Post</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Categoria</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Tags</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Status</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Data</th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {posts.map((post) => (
                    <tr key={post.id} className="bg-zinc-900 hover:bg-zinc-800/50 transition-colors group">
                      <td className="px-5 py-4">
                        <CoverImage src={post.coverImage} alt={post.title} />
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p className="font-semibold text-zinc-100 leading-snug line-clamp-1 group-hover:text-violet-300 transition-colors">
                          {post.title}
                        </p>
                        <p className="text-xs text-zinc-600 mt-0.5 line-clamp-1">{post.excerpt}</p>
                        <p className="text-[11px] text-zinc-700 mt-1">por {post.author.name}</p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm"
                          style={{
                            color: post.category.color,
                            borderColor: `${post.category.color}60`,
                            backgroundColor: `${post.category.color}25`,
                            boxShadow: `0 2px 12px ${post.category.color}20`,
                          }}
                        >
                          <DynamicIcon name={post.category.icon} color={post.category.color} className="size-3" />
                          {post.category.name}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {post.postTags.length === 0 && (
                            <span className="text-xs text-zinc-700">—</span>
                          )}
                          {post.postTags.slice(0, 3).map(({ tag }) => (
                            <Badge key={tag.id} variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-400 border-zinc-700">
                              {tag.name}
                            </Badge>
                          ))}
                          {post.postTags.length > 3 && (
                            <span className="text-[10px] text-zinc-600">+{post.postTags.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <CalendarDays className="size-3.5 text-zinc-600" />
                          {formatDate(post.createdAt)}
                        </span>
                        {post.readTime && (
                          <span className="flex items-center gap-1.5 text-[11px] text-zinc-700 mt-0.5">
                            <Clock className="size-3" />
                            {post.readTime}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/posts/${post.slug}`}>
                            <Button size="sm" variant="ghost" className="gap-1.5 text-zinc-500 hover:text-white text-xs h-8 px-3 hover:bg-zinc-800">
                              <Eye className="size-3.5" /> Ver
                            </Button>
                          </Link>
                          <Link href={`/admin/posts/${post.slug}/edit`}>
                            <Button size="sm" variant="ghost" className="gap-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 text-xs h-8 px-3">
                              <Pencil className="size-3.5" /> Editar
                            </Button>
                          </Link>
                          <ButtonDelete id={post.id}></ButtonDelete>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta && <Pagination meta={meta} />}
          </>
        )}
      </main>
    </div>
  );
}