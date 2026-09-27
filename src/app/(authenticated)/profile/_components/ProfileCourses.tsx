import Link from "next/link";
import { BookOpen, CheckCircle2, GraduationCap, ImageOff, PlayCircle, TrendingUp } from "lucide-react";
import { EnrolledCourse } from "@/src/services/enrollments.service";

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-950/40">
      <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-lg font-black text-white leading-none">{value}</p>
        <p className="text-[11px] text-zinc-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

export function ProfileCourses({ courses }: { courses: EnrolledCourse[] }) {
  const completedCourses = courses.filter((c) => c.progress.total > 0 && c.progress.percent >= 100).length;
  const completedLessons = courses.reduce((acc, c) => acc + c.progress.completed, 0);
  const averagePercent =
    courses.length > 0 ? Math.round(courses.reduce((acc, c) => acc + c.progress.percent, 0) / courses.length) : 0;

  // em andamento primeiro, depois não iniciados, concluídos por último
  const sorted = [...courses].sort((a, b) => {
    const rank = (c: EnrolledCourse) => (c.progress.percent >= 100 ? 2 : c.progress.percent > 0 ? 0 : 1);
    return rank(a) - rank(b) || b.progress.percent - a.progress.percent;
  });

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Meus cursos</p>
        <Link href="/cursos" className="text-xs font-semibold text-violet-400 hover:text-violet-300">
          Explorar cursos
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-5">
          <BookOpen className="size-8 text-zinc-700" />
          <p className="text-sm text-zinc-500">Você ainda não se inscreveu em nenhum curso.</p>
          <Link href="/cursos" className="text-sm font-semibold text-violet-400 hover:text-violet-300">
            Encontrar um curso
          </Link>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatTile icon={<BookOpen className="size-4" />} label="Inscritos" value={courses.length} />
            <StatTile icon={<GraduationCap className="size-4" />} label="Concluídos" value={completedCourses} />
            <StatTile icon={<CheckCircle2 className="size-4" />} label="Aulas assistidas" value={completedLessons} />
            <StatTile icon={<TrendingUp className="size-4" />} label="Progresso médio" value={`${averagePercent}%`} />
          </div>

          <ul className="space-y-2">
            {sorted.map((course) => {
              const { completed, total, percent } = course.progress;
              const done = total > 0 && percent >= 100;
              return (
                <li key={course.id}>
                  <Link
                    href={`/cursos/${course.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 hover:border-violet-700/50 hover:bg-violet-500/5 transition-all group"
                  >
                    <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-zinc-800 shrink-0 flex items-center justify-center">
                      {course.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={course.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <ImageOff className="size-4 text-zinc-700" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-zinc-200 truncate group-hover:text-violet-300 transition-colors">
                          {course.name}
                        </p>
                        <span className={`shrink-0 text-xs font-bold ${done ? "text-emerald-400" : "text-violet-400"}`}>
                          {percent}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${done ? "bg-emerald-500" : "bg-violet-500"}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-zinc-600 mt-1 flex items-center gap-1">
                        {done ? (
                          <>
                            <GraduationCap className="size-3 text-emerald-500" /> Concluído · {total} aulas
                          </>
                        ) : (
                          <>
                            <PlayCircle className="size-3" /> {completed} de {total} aulas · inscrito em{" "}
                            {new Date(course.enrolledAt).toLocaleDateString("pt-BR")}
                          </>
                        )}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
