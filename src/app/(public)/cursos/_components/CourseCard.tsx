import { Course, Level } from "../page";
import { BookOpen } from "lucide-react";

const levelConfig: Record<Level, { label: string; className: string }> = {
  Iniciante: {
    label: "Iniciante",
    className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  },
  Intermediário: {
    label: "Intermediário",
    className: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  },
  Avançado: {
    label: "Avançado",
    className: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  },
};

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const { label, className } = levelConfig[course.level];

  return (
    <div className="w-full max-w-sm bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden group transition-all duration-300 hover:border-violet-600 hover:shadow-lg hover:shadow-violet-900/20 cursor-pointer">
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-zinc-800">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Level badge over image */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${className}`}>
          {label}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-zinc-100 leading-snug line-clamp-2 group-hover:text-violet-400 transition-colors">
          {course.name}
        </h3>

        <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
          <BookOpen size={13} />
          <span>{course.posts} aulas</span>
        </div>
      </div>
    </div>
  );
};