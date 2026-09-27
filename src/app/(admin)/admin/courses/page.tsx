import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Plus, Pencil, Eye, BookOpen, Users, Clock, ImageOff,
    ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Course } from "@/src/types/course";
import { courseService } from "@/src/services/courses.service";
import { ButtonDelete } from "./_components/ButtonDelete";

const LEVEL_LABEL: Record<Course["level"], string> = {
    BEGINNER: "Iniciante",
    INTERMEDIATE: "Intermediário",
    ADVANCED: "Avançado",
};

const LEVEL_STYLE: Record<Course["level"], string> = {
    BEGINNER: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    INTERMEDIATE: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    ADVANCED: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

function LevelBadge({ level }: { level: Course["level"] }) {
    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold border ${LEVEL_STYLE[level]}`}>
            {LEVEL_LABEL[level]}
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

export default async function AdminCoursesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const cookieStore = await cookies();
    if (!cookieStore.get("token")) redirect("/auth/login");

    const { page: pageParam } = await searchParams;
    const page = Math.max(1, Number(pageParam) || 1);
    const { data: courses, meta } = await courseService.findAll(page);

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-black text-white mb-1">Gerenciar cursos</h1>
                        <p className="text-sm text-zinc-500">{meta?.total ?? 0} cursos no total</p>
                    </div>
                    <Link href="/admin/courses/new">
                        <Button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold gap-2">
                            <Plus className="size-4" /> Novo curso
                        </Button>
                    </Link>
                </div>

                {courses.length === 0 && (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center py-20 gap-4 text-center">
                        <BookOpen className="size-10 text-zinc-700" />
                        <p className="text-zinc-500 text-sm">Nenhum curso cadastrado.</p>
                        <Link href="/admin/courses/new">
                            <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white gap-2">
                                <Plus className="size-3.5" /> Criar primeiro curso
                            </Button>
                        </Link>
                    </div>
                )}

                {courses.length > 0 && (
                    <>
                        {/* ── mobile: cards ── */}
                        <div className="flex flex-col gap-4 sm:hidden">
                            {courses.map((course) => (
                                <div key={course.id} className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                                    <div className="w-full h-40 bg-zinc-800 relative">
                                        {course.coverImage ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={course.coverImage} alt={course.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageOff className="size-6 text-zinc-700" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2">
                                            <LevelBadge level={course.level} />
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 mb-1">{course.name}</h3>
                                            <p className="text-xs text-zinc-500 line-clamp-2">{course.description}</p>
                                        </div>

                                        <div className="flex items-center gap-3 text-[11px] text-zinc-600 flex-wrap">
                                            {course.duration && (
                                                <span className="flex items-center gap-1"><Clock className="size-3" />{course.duration}</span>
                                            )}
                                            <span className="flex items-center gap-1"><Users className="size-3" />{course.enrolledCount.toLocaleString("pt-BR")}</span>
                                        </div>

                                        <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
                                            <Link href={`/cursos/${course.slug}`} className="flex-1">
                                                <Button size="sm" variant="ghost" className="w-full gap-1.5 text-zinc-400 hover:text-white text-xs">
                                                    <Eye className="size-3.5" /> Visualizar
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/courses/${course.slug}/edit`} className="flex-1">
                                                <Button size="sm" variant="ghost" className="w-full gap-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 text-xs">
                                                    <Pencil className="size-3.5" /> Editar
                                                </Button>
                                            </Link>
                                            <ButtonDelete id={course.id} />
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
                                        <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Curso</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Nível</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Duração</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Inscritos</th>
                                        <th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/60">
                                    {courses.map((course) => (
                                        <tr key={course.id} className="bg-zinc-900 hover:bg-zinc-800/50 transition-colors group">
                                            <td className="px-5 py-4"><CoverImage src={course.coverImage} alt={course.name} /></td>
                                            <td className="px-5 py-4 max-w-xs">
                                                <p className="font-semibold text-zinc-100 leading-snug line-clamp-1 group-hover:text-violet-300 transition-colors">
                                                    {course.name}
                                                </p>
                                                <p className="text-[11px] text-zinc-700 mt-1 line-clamp-1">{course.description}</p>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap"><LevelBadge level={course.level} /></td>
                                            <td className="px-5 py-4 whitespace-nowrap text-zinc-400">{course.duration ?? "—"}</td>
                                            <td className="px-5 py-4 whitespace-nowrap text-zinc-400">{course.enrolledCount.toLocaleString("pt-BR")}</td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/courses/${course.slug}`}>
                                                        <Button size="sm" variant="ghost" className="gap-1.5 text-zinc-500 hover:text-white text-xs h-8 px-3 hover:bg-zinc-800">
                                                            <Eye className="size-3.5" /> Ver
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/courses/${course.slug}/edit`}>
                                                        <Button size="sm" variant="ghost" className="gap-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 text-xs h-8 px-3">
                                                            <Pencil className="size-3.5" /> Editar
                                                        </Button>
                                                    </Link>
                                                    <ButtonDelete id={course.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {meta && meta.totalPages > 1 && (
                            <div className="flex items-center justify-between gap-4 pt-2">
                                <p className="text-xs text-zinc-500">
                                    Exibindo <span className="text-zinc-300">{(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)}</span> de{" "}
                                    <span className="text-zinc-300">{meta.total}</span> cursos
                                </p>
                                <div className="flex items-center gap-1">
                                    {meta.hasPrevPage ? (
                                        <Link href={`?page=${meta.page - 1}`}>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800"><ChevronLeft className="size-4" /></Button>
                                        </Link>
                                    ) : <Button size="sm" variant="ghost" disabled className="h-8 w-8 p-0 text-zinc-700"><ChevronLeft className="size-4" /></Button>}
                                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                                        <Link key={p} href={`?page=${p}`}>
                                            <Button size="sm" variant="ghost" className={`h-8 w-8 p-0 text-xs font-semibold ${p === meta.page ? "bg-violet-600 text-white hover:bg-violet-500" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}>{p}</Button>
                                        </Link>
                                    ))}
                                    {meta.hasNextPage ? (
                                        <Link href={`?page=${meta.page + 1}`}>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800"><ChevronRight className="size-4" /></Button>
                                        </Link>
                                    ) : <Button size="sm" variant="ghost" disabled className="h-8 w-8 p-0 text-zinc-700"><ChevronRight className="size-4" /></Button>}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}