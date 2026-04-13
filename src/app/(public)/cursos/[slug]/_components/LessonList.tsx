import { Lesson } from "@/src/utils/courses";
import { FileText } from "lucide-react";

export function LessonList({ lessons }: { lessons: Lesson[] }) {
  return (
    <ol className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden">
      {lessons.map((lesson) => (
        <li
          key={lesson.order}
          className="flex items-center gap-4 px-4 py-3 bg-zinc-900 hover:bg-zinc-800/60 transition-colors"
        >
          <span className="text-xs text-zinc-600 w-5 text-right shrink-0">
            {lesson.order}
          </span>
          <FileText size={13} className="text-violet-500 shrink-0" />
          <span className="flex-1 text-sm text-zinc-200">{lesson.title}</span>
          <span className="text-xs text-zinc-500 shrink-0">{lesson.duration}</span>
        </li>
      ))}
    </ol>
  );
}