import { CourseOutcome } from "@/src/types/course";

export function OutcomeList({ outcomes }: { outcomes: CourseOutcome[] }) {
  const sorted = [...outcomes].sort((a, b) => a.order - b.order);

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {sorted.map((o) => (
        <li
          key={o.order}
          className="flex items-start gap-2.5 bg-violet-950/30 border border-violet-800/30 rounded-xl px-4 py-3 text-sm text-zinc-300"
        >
          <span className="text-violet-400 mt-0.5 shrink-0">✓</span>
          {o.text}
        </li>
      ))}
    </ul>
  );
}