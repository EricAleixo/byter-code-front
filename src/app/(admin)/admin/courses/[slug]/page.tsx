import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Pencil, Eye, ArrowLeft, BookOpen, ExternalLink, Video } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { courseService } from "@/src/services/courses.service";
import { postService } from "@/src/services/posts.service";
import { LevelBadge } from "@/src/app/(public)/cursos/[slug]/_components/LevelBadge";
import { CourseLessonsManager, type AvailablePost } from "./_components/CourseLessonsManager";
import { CourseResourcesManager } from "./_components/CourseResourceManager";
import { CourseVideosManager } from "./_components/CourseVidesoManager";


export default async function ManageCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const cookieStore = await cookies();
  if (!cookieStore.get("token")) redirect("/auth/login");

  const { slug } = await params;
  // rota completa: a pública não traz URL dos vídeos, materiais nem recursos das aulas
  const content = await courseService.findContent(slug);
  if (content.status === "unauthenticated") redirect("/auth/login");
  if (content.status !== "ok") notFound();
  const { course } = content;

  // posts do blog ainda não vinculados a este curso
  // limite alto: a busca do modal é feita no client sobre essa lista (inclui rascunhos)
  const { data: allPosts } = await postService.findAll(1, 500);
  const linkedIds = new Set(course.posts.map((p) => p.id));
  const availablePosts: AvailablePost[] = allPosts
    .filter((p) => !linkedIds.has(p.id))
    .map((p) => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      readTime: p.readTime,
      status: p.status,
      category: p.category?.name,
    }));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
        >
          <ArrowLeft size={14} /> Voltar aos cursos
        </Link>

        {/* header do curso */}
        <div className="flex items-start justify-between gap-4 flex-wrap p-5 rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="space-y-2 min-w-0">
            <LevelBadge level={course.level} />
            <h1 className="text-2xl font-black text-white leading-tight">{course.name}</h1>
            <p className="text-sm text-zinc-500 line-clamp-2 max-w-xl">{course.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={`/cursos/${course.slug}`}>
              <Button size="sm" className="gap-1.5 text-zinc-400 hover:text-white hover:bg-violet-400">
                <Eye className="size-3.5" /> Ver página
              </Button>
            </Link>
            <Link href={`/admin/courses/${course.slug}/edit`}>
              <Button size="sm" className="gap-1.5 bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                <Pencil className="size-3.5" /> Editar informações
              </Button>
            </Link>
          </div>
        </div>

        {/* aulas vinculadas */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-violet-400" />
            <h2 className="text-lg font-bold">Artigos</h2>
            <span className="text-xs text-zinc-600">({course.posts.length})</span>
          </div>
          <CourseLessonsManager
            courseId={course.id}
            lessons={course.posts}
            availablePosts={availablePosts}
          />
        </section>

        {/* aulas vinculadas */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Video className="size-5 text-violet-400" />
            <h2 className="text-lg font-bold">Vídeos</h2>
            <span className="text-xs text-zinc-600">({course.lessons?.length ?? 0})</span>
          </div>
          <CourseVideosManager
            courseId={course.id}
            videos={course.lessons ?? []}
          />
        </section>

        {/* materiais e links */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <ExternalLink className="size-4 text-violet-400" />
            <h2 className="text-lg font-bold">Materiais e links</h2>
            <span className="text-xs text-zinc-600">({course.resources?.length ?? 0})</span>
          </div>
          <CourseResourcesManager
            courseId={course.id}
            slug={course.slug}
            initialResources={course.resources ?? []}
          />
        </section>
      </main>
    </div>
  );
}