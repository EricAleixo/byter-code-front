"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { completeLessonAction, uncompleteLessonAction } from "@/src/actions/courses.actions";

export function LessonCompleteToggle({
  courseId,
  lessonId,
  initialCompleted,
}: {
  courseId: string;
  lessonId: string;
  initialCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    setError(null);
    startTransition(async () => {
      try {
        if (completed) {
          await uncompleteLessonAction(courseId, lessonId);
          setCompleted(false);
        } else {
          await completeLessonAction(courseId, lessonId);
          setCompleted(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao atualizar aula.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={toggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors disabled:opacity-60 ${
          completed
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
            : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-violet-600/50 hover:text-violet-400"
        }`}
      >
        {isPending ? (
          <Loader2 size={15} className="animate-spin" />
        ) : completed ? (
          <CheckCircle2 size={15} />
        ) : (
          <Circle size={15} />
        )}
        {completed ? "Aula concluída" : "Marcar como concluída"}
      </button>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
