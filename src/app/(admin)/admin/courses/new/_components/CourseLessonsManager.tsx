"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, GripVertical, ArrowUp, ArrowDown, Trash2, Loader2, ChevronDown } from "lucide-react";
import { CoursePost } from "@/src/types/course";
import {
    addCoursePostAction,
    updateCoursePostPositionAction,
    removeCoursePostAction,
} from "../../../../../../actions/courses.actions";

type AvailablePost = { id: string; title: string; slug: string };

type Props = {
    courseId: string;
    lessons: CoursePost[]; // já vinculadas, ordenadas por position
    availablePosts: AvailablePost[]; // posts que podem ser adicionados (não vinculados ainda)
};

export function CourseLessonsManager({ courseId, lessons, availablePosts }: Props) {
    const [selectedPostId, setSelectedPostId] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const selectedPost = availablePosts.find((p) => p.id === selectedPostId);

    function handleAdd() {
        if (!selectedPostId) return;
        const nextPosition = lessons.length > 0 ? Math.max(...lessons.map((l) => l.position)) + 1 : 1;
        startTransition(async () => {
            await addCoursePostAction(courseId, selectedPostId, nextPosition);
            setSelectedPostId("");
            router.refresh();
        });
    }

    function handleMove(index: number, dir: -1 | 1) {
        const target = lessons[index + dir];
        const current = lessons[index];
        if (!target) return;
        startTransition(async () => {
            // troca as positions entre os dois vizinhos
            await Promise.all([
                updateCoursePostPositionAction(courseId, current.id, target.position),
                updateCoursePostPositionAction(courseId, target.id, current.position),
            ]);
            router.refresh();
        });
    }

    function handleRemove(postId: string) {
        startTransition(async () => {
            await removeCoursePostAction(courseId, postId);
            router.refresh();
        });
    }

    return (
        <div className="space-y-3">
            {lessons.length === 0 && (
                <p className="text-xs text-zinc-600 italic px-1">Nenhuma aula vinculada ainda.</p>
            )}

            {lessons.map((lesson, i) => (
                <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 bg-zinc-900/60">
                    <GripVertical className="size-4 text-zinc-700 shrink-0" />
                    <span className="flex items-center justify-center size-7 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-xs font-black shrink-0">
            {i + 1}
          </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-200 truncate">{lesson.title}</p>
                        {lesson.readTime && <p className="text-[11px] text-zinc-600">{lesson.readTime}</p>}
                    </div>
                    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded shrink-0 ${lesson.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-700/40 text-zinc-400"}`}>
            {lesson.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
          </span>
                    <div className="flex items-center gap-0.5 shrink-0">
                        <button type="button" disabled={i === 0 || isPending} onClick={() => handleMove(i, -1)}
                                className="p-1.5 rounded-md text-zinc-500 hover:text-violet-400 hover:bg-zinc-800 disabled:opacity-20 disabled:pointer-events-none transition-colors">
                            <ArrowUp className="size-3.5" />
                        </button>
                        <button type="button" disabled={i === lessons.length - 1 || isPending} onClick={() => handleMove(i, 1)}
                                className="p-1.5 rounded-md text-zinc-500 hover:text-violet-400 hover:bg-zinc-800 disabled:opacity-20 disabled:pointer-events-none transition-colors">
                            <ArrowDown className="size-3.5" />
                        </button>
                        <button type="button" disabled={isPending} onClick={() => handleRemove(lesson.id)}
                                className="p-1.5 rounded-md text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-40">
                            <Trash2 className="size-3.5" />
                        </button>
                    </div>
                </div>
            ))}

            {/* adicionar nova aula a partir de um post existente */}
            {availablePosts.length > 0 ? (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-zinc-700">
                    <div className="relative flex-1">
                        <button type="button" onClick={() => setDropdownOpen((o) => !o)}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-left">
              <span className={selectedPost ? "text-zinc-200" : "text-zinc-600"}>
                {selectedPost ? selectedPost.title : "Selecionar post..."}
              </span>
                            <ChevronDown className={`size-3.5 text-zinc-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute z-30 top-full mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden max-h-56 overflow-y-auto">
                                {availablePosts.map((p) => (
                                    <button key={p.id} type="button" onClick={() => { setSelectedPostId(p.id); setDropdownOpen(false); }}
                                            className="w-full flex items-center px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors text-left truncate">
                                        {p.title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button type="button" disabled={!selectedPostId || isPending} onClick={handleAdd}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold transition-colors shrink-0">
                        {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
                        Adicionar
                    </button>
                </div>
            ) : (
                <p className="text-[11px] text-zinc-700 italic px-1">Todos os posts já estão vinculados a este curso.</p>
            )}
        </div>
    );
}