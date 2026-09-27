import Link from "next/link";
import { Play, Film, CheckCircle2, Lock } from "lucide-react";
import { CourseLesson } from "@/src/types/course";
import { getLessonThumbnail, formatDuration } from "@/src/utils/video";

export function LessonCarousel({
  courseSlug,
  lessons,
  completedLessonIds,
  locked = false,
  lockedHref = "#inscricao",
}: {
  courseSlug: string;
  lessons: CourseLesson[];
  completedLessonIds?: string[];
  /** usuário não inscrito: thumbnail escurecida com cadeado, link pro login/inscrição */
  locked?: boolean;
  lockedHref?: string;
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
      {lessons.map((lesson, i) => {
        const thumb = getLessonThumbnail(lesson);
        const completed = completedLessonIds?.includes(lesson.id) ?? false;
        return (
          <Link
            key={lesson.id}
            href={locked ? lockedHref : `/cursos/${courseSlug}/aulas/${lesson.id}`}
            title={locked ? "Inscreva-se para liberar esta aula" : undefined}
            className="group shrink-0 w-64 snap-start rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 hover:border-violet-600/60 transition-colors"
          >
            <div className="relative aspect-video bg-zinc-950">
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumb}
                  alt={lesson.title}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
                    locked ? "grayscale-[60%] brightness-50 group-hover:brightness-[.6]" : ""
                  }`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="size-6 text-zinc-700" />
                </div>
              )}
              <div className={`absolute inset-0 transition-colors ${locked ? "bg-black/30" : "bg-black/20 group-hover:bg-black/10"}`} />
              <div className="absolute inset-0 flex items-center justify-center">
                {locked ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center justify-center size-10 rounded-full bg-zinc-950/80 border border-zinc-600 text-zinc-200 shadow-lg backdrop-blur-sm group-hover:border-violet-500/60 group-hover:text-violet-300 transition-colors">
                      <Lock className="size-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-300 drop-shadow">Inscreva-se para assistir</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center size-10 rounded-full bg-violet-600/90 text-white shadow-lg group-hover:scale-105 transition-transform">
                    <Play className="size-4 fill-current ml-0.5" />
                  </div>
                )}
              </div>
              <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-semibold text-zinc-300">
                Aula {i + 1}
              </span>
              {completed && (
                <span className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-600/90 text-[10px] font-semibold text-white">
                  <CheckCircle2 className="size-3" /> Concluída
                </span>
              )}
              {lesson.duration != null && (
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-medium text-zinc-300">
                  {formatDuration(lesson.duration)}
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold text-zinc-200 line-clamp-2 group-hover:text-violet-300 transition-colors">
                {lesson.title}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}