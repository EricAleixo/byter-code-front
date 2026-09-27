"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { enrollCourseAction } from "@/src/actions/courses.actions";

export function EnrollButton({
  courseId,
  initialEnrolled = false,
}: {
  courseId: string;
  initialEnrolled?: boolean;
}) {
  const [enrolled, setEnrolled] = useState(initialEnrolled);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        await enrollCourseAction(courseId);
        setEnrolled(true);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao se inscrever.");
      }
    });
  };

  if (enrolled) {
    return (
      <div className="flex items-center justify-center gap-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-xl py-3 text-sm font-semibold">
        <CheckCircle size={16} />
        Você está inscrito
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-70 text-white font-bold py-3 rounded-xl transition-colors text-sm"
      >
        {isPending ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Inscrevendo...
          </>
        ) : (
          "Inscrever-se gratuitamente"
        )}
      </button>
      {error && <p className="text-xs text-rose-400 text-center">{error}</p>}
    </div>
  );
}
