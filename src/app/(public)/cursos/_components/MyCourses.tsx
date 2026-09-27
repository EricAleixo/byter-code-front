import Link from "next/link";
import { CalendarDays, CheckCircle2, ImageOff, PlayCircle } from "lucide-react";
import { EnrolledCourse } from "@/src/services/enrollments.service";
import { LevelBadge } from "../[slug]/_components/LevelBadge";

function getStatus(percent: number) {
  if (percent >= 100) return { label: "Concluído", cta: "Revisar curso", className: "text-emerald-400" };
  if (percent > 0) return { label: "Em andamento", cta: "Continuar", className: "text-violet-400" };
  return { label: "Não iniciado", cta: "Começar", className: "text-zinc-400" };
}

function MyCourseCard({ course }: { course: EnrolledCourse }) {
  const { completed, total, percent } = course.progress;
  const status = getStatus(percent);
  const enrolledAt = new Date(course.enrolledAt).toLocaleDateString("pt-BR");

  return (
    <Link
      href={`/cursos/${course.slug}`}
      className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900 group transition-all hover:border-violet-600/60 hover:shadow-lg hover:shadow-violet-900/20"
    >
      <div className="relative w-full sm:w-40 h-32 sm:h-auto sm:min-h-24 rounded-lg overflow-hidden bg-zinc-800 shrink-0 flex items-center justify-center">
        {course.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.coverImage} alt={course.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <ImageOff className="size-6 text-zinc-700" />
        )}
      </div>

      <div className="min-w-0 flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <LevelBadge level={course.level} />
          <span className={`text-xs font-semibold ${status.className}`}>{status.label}</span>
        </div>

        <h3 className="text-sm font-semibold text-zinc-100 leading-snug line-clamp-1 group-hover:text-violet-400 transition-colors">
          {course.name}
        </h3>

        <div className="flex items-center gap-4 text-xs text-zinc-500 flex-wrap">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            {completed} de {total} aulas
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} />
            Inscrito em {enrolledAt}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-3">
          <div
            className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full rounded-full transition-all ${percent >= 100 ? "bg-emerald-500" : "bg-violet-500"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="shrink-0 text-xs font-bold text-zinc-300 w-9 text-right">{percent}%</span>
        </div>
      </div>

      <span className="hidden sm:flex self-center shrink-0 items-center gap-1.5 text-xs font-semibold text-violet-400">
        <PlayCircle size={15} />
        {status.cta}
      </span>
    </Link>
  );
}

export function MyCourses({ courses }: { courses: EnrolledCourse[] }) {
  const completedCount = courses.filter((c) => c.progress.percent >= 100).length;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-black">Meus cursos</h2>
          <p className="text-sm text-zinc-500">
            {courses.length} curso{courses.length !== 1 ? "s" : ""} inscrito{courses.length !== 1 ? "s" : ""}
            {completedCount > 0 && ` · ${completedCount} concluído${completedCount !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {courses.map((course) => (
          <MyCourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
