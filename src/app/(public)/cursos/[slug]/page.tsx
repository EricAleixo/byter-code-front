import { notFound } from "next/navigation";
import { Users, Clock, BookOpen, ArrowLeft, PlayCircle, Lock } from "lucide-react";
import Link from "next/link";
import { courseService } from "@/src/services/courses.service";
import { enrollmentsService } from "@/src/services/enrollments.service";
import { EnrollButton } from "./_components/EnrollButton";
import { LessonList } from "./_components/LessonList";
import { CoursePostList } from "./_components/CoursePostList";
import { LevelBadge } from "./_components/LevelBadge";
import { OutcomeList } from "./_components/OutcomeList";
import { ResourceList } from "./_components/ResourceList";
import { LessonCarousel } from "./_components/LessonCarousel";
import { formatTotalDuration } from "@/src/utils/video";

export async function generateStaticParams() {
    const { data: courses } = await courseService.findAll();
    return courses.map((c) => ({ slug: c.slug }));
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // conteúdo completo (vídeos, materiais) só vem pra inscritos/admin; o resto vê só a ementa
    const content = await courseService.findContent(slug);
    if (content.status === "not-found") notFound();
    const locked = content.status !== "ok";
    const loggedIn = content.status !== "unauthenticated";
    // aula bloqueada leva pro login ou pro card de inscrição
    const lockedHref = loggedIn ? "#inscricao" : "/auth/login";
    const course = content.status === "ok" ? content.course : await courseService.findWithPosts(slug);
    if (!course) notFound();

    const { enrolled } = await enrollmentsService.getEnrollmentStatus(course.id);
    // progresso só faz sentido pra quem está inscrito; undefined esconde os status na UI
    const completedLessonIds = enrolled
        ? (await enrollmentsService.getCourseProgress(course.id)).completedLessonIds
        : undefined;

    const lessons = [...(course.lessons ?? [])].sort((a, b) => a.order - b.order);
    const posts = course.posts ?? [];
    const totalItems = lessons.length + posts.length;

    const completedCount = completedLessonIds
        ? lessons.filter((l) => completedLessonIds.includes(l.id)).length
        : 0;
    const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
    const nextPendingLesson = completedLessonIds
        ? lessons.find((l) => !completedLessonIds.includes(l.id))
        : undefined;

    const totalDurationSeconds = lessons.reduce((acc, l) => acc + (l.duration ?? 0), 0);
    const computedDuration = course.duration ?? formatTotalDuration(totalDurationSeconds);

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* Hero */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                {course.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.coverImage} alt={course.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-zinc-900" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20" />

                <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 max-w-7xl mx-auto">
                    <Link href="/cursos" className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 text-sm mb-4 transition-colors">
                        <ArrowLeft size={14} /> Voltar aos cursos
                    </Link>
                    <LevelBadge level={course.level} />
                    <h1 className="text-2xl sm:text-4xl font-black mt-2 leading-tight">{course.name}</h1>
                </div>
            </div>

            {/* Body */}
            <main className="mx-auto max-w-7xl px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Stats */}
                    <div className="flex flex-wrap gap-6 text-sm text-zinc-400">
                        <span className="flex items-center gap-1.5"><BookOpen size={15} className="text-violet-400" />{totalItems} aulas</span>
                        {computedDuration && <span className="flex items-center gap-1.5"><Clock size={15} className="text-violet-400" />{computedDuration} no total</span>}
                        <span className="flex items-center gap-1.5"><Users size={15} className="text-violet-400" />{course.enrolledCount.toLocaleString("pt-BR")} inscritos</span>
                    </div>

                    <section className="space-y-2">
                        <h2 className="text-lg font-bold">Sobre o curso</h2>
                        <p className="text-zinc-400 leading-relaxed">{course.description}</p>
                    </section>

                    {course.outcomes && course.outcomes.length > 0 && (
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold">Ao concluir este curso você saberá...</h2>
                            <OutcomeList outcomes={course.outcomes} />
                        </section>
                    )}

                    {/* Aulas em vídeo — carrossel + lista, sem player embutido */}
                    {lessons.length > 0 && (
                        <section className="space-y-4">
                            <h2 className="text-lg font-bold">Aulas em vídeo</h2>

                            {locked && (
                                <div className="flex items-start gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4">
                                    <Lock size={16} className="text-violet-300 shrink-0 mt-0.5" />
                                    <div className="flex-1 space-y-2">
                                        <p className="text-sm text-zinc-300 leading-relaxed">
                                            <span className="font-semibold text-white">As aulas são liberadas após a inscrição.</span>{" "}
                                            {loggedIn
                                                ? "Inscreva-se gratuitamente para assistir, baixar os materiais e acompanhar seu progresso."
                                                : "Entre na sua conta e inscreva-se gratuitamente para assistir, baixar os materiais e acompanhar seu progresso."}
                                        </p>
                                        <Link
                                            href={lockedHref}
                                            className="inline-flex text-xs font-semibold text-violet-300 hover:text-violet-200"
                                        >
                                            {loggedIn ? "Inscrever-se agora" : "Entrar na conta"}
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {completedLessonIds && (
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
                                    <div className="flex items-center justify-between gap-4 flex-wrap text-sm">
                                        <span className="text-zinc-300">
                                            <span className="font-bold text-emerald-400">{completedCount} concluída{completedCount !== 1 ? "s" : ""}</span>
                                            {" · "}
                                            <span className="font-bold text-zinc-400">{lessons.length - completedCount} pendente{lessons.length - completedCount !== 1 ? "s" : ""}</span>
                                        </span>
                                        <span className="text-xs font-bold text-violet-400">{progressPercent}%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${progressPercent >= 100 ? "bg-emerald-500" : "bg-violet-500"}`}
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                    {nextPendingLesson && (
                                        <Link
                                            href={`/cursos/${course.slug}/aulas/${nextPendingLesson.id}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300"
                                        >
                                            <PlayCircle size={14} />
                                            {completedCount > 0 ? "Continuar de onde parou" : "Começar"}: {nextPendingLesson.title}
                                        </Link>
                                    )}
                                </div>
                            )}

                            <LessonCarousel
                                courseSlug={course.slug}
                                lessons={lessons}
                                completedLessonIds={completedLessonIds}
                                locked={locked}
                                lockedHref={lockedHref}
                            />
                            <LessonList
                                courseSlug={course.slug}
                                lessons={lessons}
                                completedLessonIds={completedLessonIds}
                                locked={locked}
                                lockedHref={lockedHref}
                            />
                        </section>
                    )}

                    {posts.length > 0 && (
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold">Leituras e artigos</h2>
                            <CoursePostList posts={posts} />
                        </section>
                    )}

                    {course.resources && course.resources.length > 0 && (
                        <section className="space-y-3">
                            <h2 className="text-lg font-bold">Materiais e links</h2>
                            <ResourceList resources={course.resources} />
                        </section>
                    )}
                </div>

                <aside className="lg:col-span-1">
                    <div id="inscricao" className="scroll-mt-6 sticky top-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                        {course.coverImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={course.coverImage} alt="" className="w-full h-36 object-cover rounded-xl" />
                        )}
                        <div className="space-y-1">
                            <p className="text-2xl font-black text-white">Gratuito</p>
                            <p className="text-zinc-500 text-xs">Acesso vitalício após inscrição</p>
                        </div>
                        <EnrollButton courseId={course.id} initialEnrolled={enrolled} />
                        <ul className="text-xs text-zinc-500 space-y-1.5">
                            <li>✓ {totalItems} aulas e leituras</li>
                            <li>✓ Certificado de conclusão</li>
                            <li>✓ Repositórios e materiais inclusos</li>
                            <li>✓ Suporte via comunidade</li>
                        </ul>
                    </div>
                </aside>
            </main>
        </div>
    );
}