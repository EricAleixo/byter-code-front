"use client";

import { motion } from "framer-motion";
import { CourseLesson } from "@/src/types/course";
import { Play } from "lucide-react";

const NODE_SIZE = 72;
const V_GAP = 170;
const AMPLITUDE = 38;

function formatDuration(seconds?: number) {
  if (!seconds) return null;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  if (minutes < 60) return `${minutes}:${String(remaining).padStart(2, "0")}`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return `${hours}h ${String(remMinutes).padStart(2, "0")}min`;
}

type Props = {
  lessons: CourseLesson[];
  activeLessonId?: string;
  onSelect?: (lesson: CourseLesson) => void;
};

export function LessonTree({ lessons, activeLessonId, onSelect }: Props) {
  const sorted = [...lessons].sort((a, b) => a.order - b.order);
  const height = (sorted.length - 1) * V_GAP + NODE_SIZE + 40;

  const points = sorted.map((_, i) => ({
    x: 50 + AMPLITUDE * Math.sin(i * 1.1),
    y: i * V_GAP + NODE_SIZE / 2 + 20,
  }));

  return (
    <div className="relative mx-auto max-w-lg" style={{ height }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
      >
        {points.slice(1).map((p, idx) => {
          const prev = points[idx];
          return (
            <motion.line
              key={idx}
              x1={prev.x}
              y1={prev.y}
              x2={p.x}
              y2={p.y}
              stroke="currentColor"
              className="text-zinc-800"
              strokeWidth={3}
              strokeDasharray="1 7"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                delay: 0.18 * idx + 0.1,
                duration: 0.5,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>

      {sorted.map((lesson, i) => {
        const { x, y } = points[i];
        const isActive = activeLessonId === lesson.id;
        return (
          <motion.div
            key={lesson.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 w-44"
            style={{ left: `${x}%`, top: y }}
            initial={{ opacity: 0, scale: 0.4, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: 0.18 * i,
              duration: 0.45,
              type: "spring",
              stiffness: 260,
              damping: 18,
            }}
          >
            <motion.button
              type="button"
              onClick={() => onSelect?.(lesson)}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex items-center justify-center w-[72px] h-[72px] rounded-full font-black text-lg cursor-pointer transition-colors ${
                isActive
                  ? "bg-violet-600 border-2 border-violet-400 text-white shadow-[0_0_0_6px_rgba(139,92,246,0.18)]"
                  : "bg-zinc-900 border-2 border-violet-600 text-violet-300 shadow-[0_0_0_6px_rgba(139,92,246,0.08)] hover:border-violet-400"
              }`}
            >
              {isActive ? <Play size={20} className="fill-current" /> : i + 1}
            </motion.button>
            <div className="text-center">
              <p className="text-xs font-semibold text-zinc-200 leading-snug line-clamp-2">
                {lesson.title}
              </p>
              {lesson.duration != null && (
                <p className="text-[10px] text-zinc-500">{formatDuration(lesson.duration)}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}