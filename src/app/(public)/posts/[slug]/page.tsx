import { postService } from "@/src/services/posts.service";
import {
  Clock,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostActions } from "../_components/postActions";
import { formatDate } from "@/src/utils/formatDate";
import { PostContent } from "../_components/PostContent";
import { TableOfContents } from "../_components/TableOfContents";
import { getCurrentUser } from "@/src/utils/getCurrentUser";
import { CommentsSection } from "./_components/CommentSection";
import { DynamicIcon } from "@/src/utils/DynamicIcon";
import { LinksSection } from "./_components/LinksSections";

type props = {
  params: Promise<{ slug: string }>
}

// ─── Meta dados

export async function generateMetadata({ params }: props) {
  const { slug } = await params;
  const post = await postService.findBySlug(slug);

  if (!post) notFound();

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://byter-code.vercel.app/posts/${slug}`,
      images: [{ url: post.coverImage }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}


// ─── helpers ──────────────────────────────────────────────────────────────────

function TagBadge({ tag }: { tag: "novo" }) {
  const map = {
    novo: "bg-violet-500/20 text-violet-300 border-violet-500/30"
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${map[tag]}`}>
      {tag}
    </span>
  );
}

function isNewPost(createdAt: string | Date) {
  const now = new Date();
  const created = new Date(createdAt);

  const diffInMs = now.getTime() - created.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays <= 2;
}
// ─── page ─────────────────────────────────────────────────────────────────────

export default async function PostPage({ params }: props) {

  const { slug } = await params;

  const [post, related, comments, currentUser] = await Promise.all([
    postService.findBySlug(slug),
    postService.findRelated(slug, 3),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/post/${slug}`, {
      cache: "no-store",
    }).then((r) => r.json()).catch(() => []),
    getCurrentUser(),
  ]);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* layout principal */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_220px] gap-12">

          {/* ── conteúdo ── */}
          <article className="min-w-0">

            {/* cabeçalho do post */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Link
                  href={`/sections/${post.category.slug}`}
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <DynamicIcon name={post.category.icon} className="size-3.5 text-violet-700 mr-1" />
                  {post.category.name}
                </Link>
                <span className="text-zinc-700">·</span>
                {isNewPost(post.createdAt) && <TagBadge tag="novo" />}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
                {post.title}
              </h1>
              <p className="text-base text-zinc-400 leading-relaxed mb-6">{post.excerpt}</p>

              {/* autor + meta */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {
                    post.author.avatarUrl ?
                      (<img
                        src={post.author.avatarUrl}
                        alt={"Avatar de " + post.author.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-700/50"
                      />)
                      :
                      (<div className="bg-linear-to-tl from-violet-700 to-violet-800 w-10 h-10 ring-2 ring-violet-700/50 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-xl">{post.author.name[0].toUpperCase()}</span>
                      </div>)
                  }
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">{post.author.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>{formatDate(post.createdAt)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> {post.readTime} de leitura
                  </span>
                </div>
              </div>
            </header>

            {/* imagem capa */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950/60 to-transparent" />
            </div>

            <div className="prose-custom space-y-6 text-zinc-300 text-[15px] leading-7 overflow-hidden">
              <PostContent content={post.content} />
            </div>

            {/* ações do post */}
            <PostActions path={`/posts/${post.slug}`} title={post.title} />

            {/* posts relacionados */}
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap shrink-0">
                  Leia também
                </h2>
                <div className="h-px bg-zinc-800 flex-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.length === 0 && (
                  <p className="text-sm text-zinc-600 col-span-3">Nenhum post relacionado.</p>
                )}
                {related.map((r) => (
                  <Link key={r.id} href={`/posts/${r.slug}`} className="group flex flex-col gap-2 cursor-pointer">
                    <div className="w-full h-28 rounded-lg overflow-hidden bg-zinc-800">
                      {r.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.coverImage}
                          alt={r.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${r.category.color}15, ${r.category.color}05)` }}
                        />
                      )}
                    </div>
                    <div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest mb-1 block"
                        style={{ color: r.category.color }}
                      >
                        {r.category.name}
                      </span>
                      <p className="text-sm font-semibold text-zinc-200 group-hover:text-violet-300 transition-colors leading-snug line-clamp-2">
                        {r.title}
                      </p>
                      {r.readTime && (
                        <p className="text-[11px] text-zinc-600 mt-1 flex items-center gap-1">
                          <Clock className="size-2.5" /> {r.readTime}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <LinksSection links={post.links}/>

            {/* comentários */}
            <CommentsSection
              postId={post.id}
              initialComments={comments}
              currentUser={currentUser}
            />

          </article>

          {/* ── sidebar direita (TOC) — apenas desktop ── */}
          <aside className="hidden xl:block">
            <TableOfContents contentSelector=".prose-custom" />
          </aside>

        </div>
      </div>
    </div>
  );
}