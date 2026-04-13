import Link from "next/link";
import { CourseCard } from "./_components/CourseCard";
import { courses } from "@/src/utils/courses";

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">
        <h1 className="text-3xl font-black">Explore por cursos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {courses.map((course) => (
            <Link key={course.slug} href={`/cursos/${course.slug}`} className="block">
              <CourseCard course={course} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}