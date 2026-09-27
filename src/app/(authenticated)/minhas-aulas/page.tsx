import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getToken } from "@/src/utils/getToken";
import { enrollmentsService } from "@/src/services/enrollments.service";

export default async function MyCoursesPage() {
  if (!(await getToken())) redirect("/auth/login");

  const courses = await enrollmentsService.findMyCourses();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Meus cursos</h1>
          <p className="text-sm text-zinc-500">
            {courses.length} curso{courses.length !== 1 ? "s" : ""} em andamento
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center py-20 gap-4 text-center">
            <BookOpen className="size-10 text-zinc-700" />
            <p className="text-zinc-500 text-sm">Você ainda não se inscreveu em nenhum curso.</p>
            <Link href="/cursos" className="text-violet-400 hover:text-violet-300 text-sm font-semibold">
              Explorar cursos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/cursos/${course.slug}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-violet-600/50 transition-colors"
              >
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                  {course.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.coverImage} alt={course.name} className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white truncate">{course.name}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {course.progress.completed} de {course.progress.total} aulas concluídas
                  </p>
                  <div className="mt-2 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full transition-all"
                      style={{ width: `${course.progress.percent}%` }}
                    />
                  </div>
                </div>

                <span className="shrink-0 text-xs font-bold text-violet-400">{course.progress.percent}%</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
