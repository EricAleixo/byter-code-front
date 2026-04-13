import { notFound } from "next/navigation";

import { Users, Clock, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { courses, getCourseBySlug } from "@/src/utils/courses";
import { EnrollButton } from "./_components/EnrollButton";
import { LessonList } from "./_components/LessonList";
import { LevelBadge } from "./_components/LevelBadge";
import { OutcomeList } from "./_components/OutcomeList";
import { ResourceList } from "./_components/ResourceList";

export async function generateStaticParams() {
    return courses.map((c) => ({ slug: c.slug }));
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const course = getCourseBySlug(slug);
    if (!course) notFound();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* Hero */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                <img
                    src={course.image}
                    alt={course.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20" />

                <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 max-w-7xl mx-auto">
                    <Link
                        href="/cursos"
                        className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 text-sm mb-4 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Voltar aos cursos
                    </Link>
                    <LevelBadge level={course.level} />
                    <h1 className="text-2xl sm:text-4xl font-black mt-2 leading-tight">{course.name}</h1>
                    <p className="text-zinc-400 text-sm mt-1">por {course.instructor}</p>
                </div>
            </div>

            {/* Body */}
            <main className="mx-auto max-w-7xl px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left — conteúdo principal */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Stats */}
                    <div className="flex flex-wrap gap-6 text-sm text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <BookOpen size={15} className="text-violet-400" />
                            {course.posts} aulas
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock size={15} className="text-violet-400" />
                            {course.duration} no total
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Users size={15} className="text-violet-400" />
                            {course.enrolled.toLocaleString("pt-BR")} inscritos
                        </span>
                    </div>

                    {/* Descrição */}
                    <section className="space-y-2">
                        <h2 className="text-lg font-bold">Sobre o curso</h2>
                        <p className="text-zinc-400 leading-relaxed">{course.description}</p>
                    </section>

                    {/* Outcomes */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold">Ao concluir este curso você saberá...</h2>
                        <OutcomeList outcomes={course.outcomes} />
                    </section>

                    {/* Aulas */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold">Conteúdo do curso</h2>
                        <LessonList lessons={course.lessons} />
                    </section>

                    {/* Recursos */}
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold">Materiais e links</h2>
                        <ResourceList resources={course.resources} />
                    </section>
                </div>

                {/* Right — sticky CTA */}
                <aside className="lg:col-span-1">
                    <div className="sticky top-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                        <img
                            src={course.image}
                            alt=""
                            className="w-full h-36 object-cover rounded-xl"
                        />
                        <div className="space-y-1">
                            <p className="text-2xl font-black text-white">Gratuito</p>
                            <p className="text-zinc-500 text-xs">Acesso vitalício após inscrição</p>
                        </div>
                        <EnrollButton courseName={course.name} />
                        <ul className="text-xs text-zinc-500 space-y-1.5">
                            <li>✓ {course.posts} aulas em vídeo</li>
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