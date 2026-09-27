"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, CheckCircle2, Circle, FileText, Clock, Hash, ImageOff } from "lucide-react";
import { CourseLesson, CoursePost } from "@/src/types/course";
import { formatDuration } from "@/src/utils/video";

type Tab = "course" | "lesson";

export function CourseContentTabs({
  courseSlug,
  currentLesson,
  lessons,
  posts,
}: {
  courseSlug: string;
  currentLesson: CourseLesson;
  lessons: CourseLesson[];
  posts: CoursePost[];
}) {
  const [tab, setTab] = useState<Tab>("course");
  const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
  const sortedPosts = [...posts].sort((a, b) => a.position - b.position);

  return (
    <div className="border-t border-zinc-800 pt-4">
      <div className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setTab("course")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            tab === "course" ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Conteúdo do curso
        </button>
        <button
          type="button"
          onClick={() => setTab("lesson")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            tab === "lesson" ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Conteúdo da aula
        </button>
      </div>

      <div className="mt-4">
        {tab === "course" ? (
          <div className="space-y-2">
            {lessons.map((lesson, i) => {
              const isCurrent = lesson.id === currentLesson.id;
              const isWatched = i < currentIndex;

              const row = (
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                    isCurrent
                      ? "bg-violet-500/10 border-violet-600/40"
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <span className="shrink-0">
                    {isCurrent ? (
                      <Play size={15} className="text-violet-400 fill-current" />
                    ) : isWatched ? (
                      <CheckCircle2 size={15} className="text-emerald-500" />
                    ) : (
                      <Circle size={15} className="text-zinc-700" />
                    )}
                  </span>
                  <span className="text-xs text-zinc-600 w-5 shrink-0">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm truncate ${isCurrent ? "text-violet-300 font-medium" : "text-zinc-300"}`}>
                      {lesson.title}
                    </p>
                  </div>
                  {lesson.duration != null && (
                    <span className="text-xs text-zinc-600 shrink-0">{formatDuration(lesson.duration)}</span>
                  )}
                </div>
              );

              return (
                <div key={lesson.id}>
                  {isCurrent ? row : <Link href={`/cursos/${courseSlug}/aulas/${lesson.id}`}>{row}</Link>}
                </div>
              );
            })}

            {sortedPosts.length > 0 && (
              <>
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600 pt-3 pb-1 px-1">
                  Leituras e artigos
                </p>
                {sortedPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors"
                  >
                    <div className="shrink-0 w-10 h-8 rounded-md overflow-hidden bg-zinc-800 flex items-center justify-center">
                      {post.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageOff className="size-3.5 text-zinc-700" />
                      )}
                    </div>
                    <p className="text-sm text-zinc-300 truncate flex-1">{post.title}</p>
                    <FileText size={13} className="text-zinc-700 shrink-0" />
                  </Link>
                ))}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Hash size={12} className="text-violet-400" />
                Aula {currentIndex + 1} de {lessons.length}
              </span>
              {currentLesson.duration != null && (
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-violet-400" />
                  {formatDuration(currentLesson.duration)}
                </span>
              )}
            </div>

            {currentLesson.description ? (
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {currentLesson.description}
              </p>
            ) : (
              <p className="text-sm text-zinc-600 italic">Nenhuma descrição adicional para esta aula.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}