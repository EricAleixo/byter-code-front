import { notFound, redirect } from "next/navigation";
import { getToken } from "@/src/utils/getToken";
import { courseService } from "@/src/services/courses.service";
import { enrollmentsService } from "@/src/services/enrollments.service";
import { WatchPlayer } from "./_components/WatchPlayer";
import { NextLessonsList } from "./_components/NextLessonsList";
import { RelatedPostsList } from "./_components/RelatedPostsList";
import { LockedCourseNotice } from "../../_components/LockedCourseNotice";

export default async function WatchLessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  if (!(await getToken())) redirect("/auth/login");

  const { slug, lessonId } = await params;
  const content = await courseService.findContent(slug);
  if (content.status === "unauthenticated") redirect("/auth/login");
  if (content.status === "not-found") notFound();
  if (content.status === "not-enrolled") {
    const publicCourse = await courseService.findWithPosts(slug);
    if (!publicCourse) notFound();
    return (
      <LockedCourseNotice
        courseId={publicCourse.id}
        courseSlug={publicCourse.slug}
        courseName={publicCourse.name}
        coverImage={publicCourse.coverImage}
      />
    );
  }
  const { course } = content;

  const lessons = [...(course.lessons ?? [])].sort((a, b) => a.order - b.order);
  const posts = course.posts ?? [];
  const currentLesson = lessons.find((l) => l.id === lessonId);
  if (!currentLesson) notFound();

  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const nextLesson = lessons[currentIndex + 1];

  const { completedLessonIds } = await enrollmentsService.getCourseProgress(course.id);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="min-w-0 space-y-5">
          <WatchPlayer
            courseId={course.id}
            courseSlug={slug}
            lesson={currentLesson}
            nextLessonId={nextLesson?.id}
            courseResources={course.resources ?? []}
            isCompleted={completedLessonIds.includes(currentLesson.id)}
          />
        </div>

        <aside className="space-y-6">
          <NextLessonsList
            courseSlug={slug}
            lessons={lessons}
            currentLessonId={currentLesson.id}
            completedLessonIds={completedLessonIds}
          />
          <RelatedPostsList posts={posts} />
        </aside>
      </main>
    </div>
  );
}