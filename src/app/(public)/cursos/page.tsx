import Link from "next/link";
import { CourseCard } from "./_components/CourseCard";
import { MyCourses } from "./_components/MyCourses";
import { courseService } from "@/src/services/courses.service";
import { enrollmentsService } from "@/src/services/enrollments.service";

export default async function Page() {
  // findMyCourses devolve [] sem token, então a seção só aparece pra quem está logado e inscrito
  const [{ data: courses }, myCourses] = await Promise.all([
    courseService.findAll(),
    enrollmentsService.findMyCourses(),
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-12">
        {myCourses.length > 0 && <MyCourses courses={myCourses} />}

        <section className="space-y-8">
          <h1 className="text-3xl font-black">Explore por cursos</h1>

          {courses.length === 0 ? (
            <p className="text-sm text-zinc-500">Nenhum curso disponível no momento.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {courses.map((course) => (
                <Link key={course.slug} href={`/cursos/${course.slug}`} className="block">
                  <CourseCard course={course} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
