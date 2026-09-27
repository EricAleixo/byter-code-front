import { Course } from "@/src/types/course";

const LEVEL_LABEL: Record<Course["level"], string> = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermediário",
  ADVANCED: "Avançado",
};

const LEVEL_STYLE: Record<Course["level"], string> = {
  BEGINNER: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  INTERMEDIATE: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  ADVANCED: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
};

export function LevelBadge({ level }: { level: Course["level"] }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block ${LEVEL_STYLE[level]}`}>
      {LEVEL_LABEL[level]}
    </span>
  );
}