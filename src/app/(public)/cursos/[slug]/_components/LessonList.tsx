"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, Play } from "lucide-react";
import { CourseLesson } from "@/src/types/course";
import { formatDuration } from "@/src/utils/video";

type Filter = "all" | "pending" | "completed";

export function LessonList({
  courseSlug,
  lessons,
  completedLessonIds,
  locked = false,
  lockedHref = "#inscricao",
}: {
  courseSlug: string;
  lessons: CourseLesson[];
  /** undefined = usuário não inscrito → lista sem status de progresso */
  completedLessonIds?: string[];
  /** usuário não inscrito: mostra só a ementa, sem links pras aulas */
  locked?: boolean;
  /** pra onde leva o clique numa aula bloqueada (login ou card de inscrição) */
  lockedHref?: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const hasProgress = completedLessonIds !== undefined;
  const completedSet = new Set(completedLessonIds ?? []);

  // mantém o número original da aula mesmo com filtro aplicado
  const numbered = lessons.map((lesson, i) => ({ lesson, number: i + 1, completed: completedSet.has(lesson.id) }));
  const completedCount = numbered.filter((l) => l.completed).length;
  const pendingCount = lessons.length - completedCount;

  const visible = numbered.filter(({ completed }) =>
    filter === "all" ? true : filter === "completed" ? completed : !completed,
  );

  const tabs: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "Todas", count: lessons.length },
    { value: "pending", label: "Pendentes", count: pendingCount },
    { value: "completed", label: "Concluídas", count: completedCount },
  ];

  return (
    <div className="space-y-3">
      {hasProgress && (
        <div className="flex gap-1 p-1 rounded-lg bg-zinc-900 border border-zinc-800 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                filter === tab.value ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.label} <span className="opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-sm text-zinc-500 border border-zinc-800 rounded-xl px-4 py-6 text-center bg-zinc-900">
          {filter === "completed" ? "Nenhuma aula concluída ainda." : "Todas as aulas foram concluídas."}
        </p>
      ) : (
        <ol className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden">
          {visible.map(({ lesson, number, completed }) => {
            const rowContent = (
              <>
                {locked ? (
                  <span className="flex items-center justify-center size-8 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-500 shrink-0 mt-0.5">
                    <Lock className="size-3.5" />
                  </span>
                ) : completed ? (
                  <span className="flex items-center justify-center size-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="size-4" />
                  </span>
                ) : (
                  <span className="flex items-center justify-center size-8 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-xs font-black shrink-0 mt-0.5">
                    {number}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium group-hover:text-violet-300 transition-colors ${
                      completed || locked ? "text-zinc-400" : "text-zinc-200"
                    }`}
                  >
                    <span className="text-zinc-600 mr-1.5">{number}.</span>
                    {lesson.title}
                  </p>
                  {lesson.description && (
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">{lesson.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0 mt-0.5">
                  {hasProgress && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        completed
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}
                    >
                      {completed ? "Concluída" : "Pendente"}
                    </span>
                  )}
                  {lesson.duration != null && (
                    <span className="text-xs text-zinc-600">{formatDuration(lesson.duration)}</span>
                  )}
                  {locked ? (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-zinc-800 text-zinc-500 border-zinc-700">
                      Bloqueada
                    </span>
                  ) : (
                    <Play className="size-3.5 text-zinc-700 group-hover:text-violet-400 transition-colors" />
                  )}
                </div>
              </>
            );

            return (
              <li key={lesson.id}>
                <Link
                  href={locked ? lockedHref : `/cursos/${courseSlug}/aulas/${lesson.id}`}
                  title={locked ? "Inscreva-se para liberar esta aula" : undefined}
                  className="flex items-start gap-4 px-4 py-4 bg-zinc-900 hover:bg-zinc-800/60 transition-colors group"
                >
                  {rowContent}
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
