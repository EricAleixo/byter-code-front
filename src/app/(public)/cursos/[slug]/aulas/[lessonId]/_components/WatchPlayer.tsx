import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { CourseLesson, CourseResource } from "@/src/types/course";
import { getEmbedUrl } from "@/src/utils/video";
import { LessonResourceTabs } from "./LessonResourceTabs";
import { LessonCompleteToggle } from "./LessonCompleteToggle";

export function WatchPlayer({
  courseId,
  courseSlug,
  lesson,
  nextLessonId,
  courseResources,
  isCompleted,
}: {
  courseId: string;
  courseSlug: string;
  lesson: CourseLesson;
  nextLessonId?: string;
  courseResources: CourseResource[];
  isCompleted: boolean;
}) {
  const embedUrl = getEmbedUrl(lesson);

  return (
    <div className="space-y-4">
      <Link
        href={`/cursos/${courseSlug}`}
        className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
      >
        <ArrowLeft size={14} /> Voltar ao curso
      </Link>

      <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-black">
        {lesson.videoProvider === "DIRECT" ? (
          <video key={lesson.id} src={lesson.videoUrl} controls className="w-full h-full" />
        ) : embedUrl ? (
          <iframe
            key={lesson.id}
            src={embedUrl}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm">
            Não foi possível carregar o vídeo.
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-white leading-snug">{lesson.title}</h1>
        </div>

        <div className="flex items-start gap-2 shrink-0">
          <LessonCompleteToggle courseId={courseId} lessonId={lesson.id} initialCompleted={isCompleted} />
          {nextLessonId && (
            <Link
              href={`/cursos/${courseSlug}/aulas/${nextLessonId}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-violet-600/50 text-violet-400 hover:bg-violet-500/10 text-sm font-semibold transition-colors"
            >
              Próxima aula <ChevronRight size={15} />
            </Link>
          )}
        </div>
      </div>

      {lesson.description && (
        <p className="text-sm text-zinc-400 leading-relaxed border-t border-zinc-800 pt-4">
          {lesson.description}
        </p>
      )}

      <LessonResourceTabs lessonResources={lesson.resources ?? []} courseResources={courseResources} />
    </div>
  );
}