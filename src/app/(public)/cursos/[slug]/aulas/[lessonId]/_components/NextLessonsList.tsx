import Link from "next/link";
import { Play, CheckCircle2, Circle } from "lucide-react";
import { CourseLesson } from "@/src/types/course";
import { formatDuration } from "@/src/utils/video";

export function NextLessonsList({
  courseSlug,
  lessons,
  currentLessonId,
  completedLessonIds,
}: {
  courseSlug: string;
  lessons: CourseLesson[];
  currentLessonId: string;
  completedLessonIds: string[];
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800">
        <h2 className="text-sm font-bold text-white">Próximos vídeos</h2>
      </div>

      <ul className="divide-y divide-zinc-800/60">
        {lessons.map((lesson) => {
          const isCurrent = lesson.id === currentLessonId;
          const isCompleted = completedLessonIds.includes(lesson.id);

          const content = (
            <div
              className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                isCurrent ? "bg-violet-500/10" : "hover:bg-zinc-800/60"
              }`}
            >
              <span className="shrink-0 mt-0.5">
                {isCurrent ? (
                  <Play size={15} className="text-violet-400 fill-current" />
                ) : isCompleted ? (
                  <CheckCircle2 size={15} className="text-emerald-500" />
                ) : (
                  <Circle size={15} className="text-zinc-700" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-medium leading-snug line-clamp-2 ${isCurrent ? "text-violet-300" : "text-zinc-300"}`}>
                  {lesson.title}
                </p>
                {lesson.duration != null && (
                  <p className="text-[11px] text-zinc-600 mt-0.5">{formatDuration(lesson.duration)}</p>
                )}
              </div>
            </div>
          );

          return (
            <li key={lesson.id}>
              {isCurrent ? content : <Link href={`/cursos/${courseSlug}/aulas/${lesson.id}`}>{content}</Link>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}