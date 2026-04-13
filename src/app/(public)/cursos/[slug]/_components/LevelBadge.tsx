import { Level } from "@/src/utils/courses";

const config: Record<Level, string> = {
  Iniciante: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Intermediário: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  Avançado: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
};

export function LevelBadge({ level }: { level: Level }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block ${config[level]}`}>
      {level}
    </span>
  );
}