"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, GripVertical, ArrowUp, ArrowDown, Trash2, Loader2, Search, X, Check,
  FileText, Newspaper, Clock,
} from "lucide-react";
import { CoursePost } from "@/src/types/course";
import { addCoursePostAction, reorderCoursePostsAction, removeCoursePostAction } from "@/src/actions/courses.actions";

export type AvailablePost = {
  id: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  readTime?: string;
  status: "DRAFT" | "PUBLISHED";
  category?: string;
};

type StatusFilter = "ALL" | "PUBLISHED" | "DRAFT";

type Props = {
  courseId: string;
  lessons: CoursePost[];
  availablePosts: AvailablePost[];
};

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "PUBLISHED", label: "Publicados" },
  { value: "DRAFT", label: "Rascunhos" },
];

// remove acentos para a busca não depender deles ("programacao" acha "programação")
function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function StatusBadge({ status }: { status: "DRAFT" | "PUBLISHED" }) {
  return (
    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded shrink-0 ${status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-700/40 text-zinc-400"}`}>
      {status === "PUBLISHED" ? "Publicado" : "Rascunho"}
    </span>
  );
}

function Cover({ src, className }: { src?: string; className: string }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900 ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <FileText className="size-4 text-zinc-700" />
        </div>
      )}
    </div>
  );
}

// ─── Modal de seleção ─────────────────────────────────────────────────────────

function AddPostsModal({
  posts,
  onClose,
  onConfirm,
}: {
  posts: AvailablePost[];
  onClose: () => void;
  onConfirm: (ids: string[]) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  // mantém a ordem de clique — é a ordem em que os artigos entram no curso
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseRef.current();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return posts.filter((p) => {
      if (status !== "ALL" && p.status !== status) return false;
      if (!q) return true;
      return normalize(`${p.title} ${p.excerpt ?? ""} ${p.category ?? ""}`).includes(q);
    });
  }, [posts, query, status]);

  const counts = useMemo(() => ({
    ALL: posts.length,
    PUBLISHED: posts.filter((p) => p.status === "PUBLISHED").length,
    DRAFT: posts.filter((p) => p.status === "DRAFT").length,
  }), [posts]);

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  const allVisibleSelected = filtered.length > 0 && filtered.every((p) => selected.includes(p.id));

  function toggleAllVisible() {
    if (allVisibleSelected) {
      const visible = new Set(filtered.map((p) => p.id));
      setSelected((s) => s.filter((id) => !visible.has(id)));
    } else {
      setSelected((s) => [...s, ...filtered.map((p) => p.id).filter((id) => !s.includes(id))]);
    }
  }

  async function handleConfirm() {
    if (selected.length === 0) return;
    setSaving(true);
    setError("");
    try {
      await onConfirm(selected);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar artigos.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-16 sm:pt-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget && !saving) onClose(); }}
    >
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-8 rounded-lg bg-violet-500/15 border border-violet-500/25">
              <Newspaper className="size-4 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-100">Adicionar artigos</p>
              <p className="text-[11px] text-zinc-500">Busque posts do blog e vincule ao curso</p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={saving}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-40">
            <X className="size-4" />
          </button>
        </div>

        {/* busca + filtros */}
        <div className="px-5 pt-4 pb-3 space-y-3 border-b border-zinc-800/60">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, resumo ou categoria..."
              className="w-full h-10 pl-9 pr-9 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/30 transition-colors"
            />
            {query && (
              <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-zinc-500 hover:text-zinc-300">
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              {STATUS_FILTERS.map((f) => (
                <button key={f.value} type="button" onClick={() => setStatus(f.value)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${status === f.value
                    ? "bg-violet-500/15 border-violet-500/40 text-violet-300"
                    : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"}`}>
                  {f.label} <span className="opacity-60">{counts[f.value]}</span>
                </button>
              ))}
            </div>
            {filtered.length > 0 && (
              <button type="button" onClick={toggleAllVisible}
                className="text-[11px] font-semibold text-zinc-500 hover:text-violet-400 transition-colors">
                {allVisibleSelected ? "Desmarcar visíveis" : "Selecionar visíveis"}
              </button>
            )}
          </div>
        </div>

        {/* resultados */}
        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-14 px-4">
              <Search className="size-6 text-zinc-700 mb-3" />
              <p className="text-sm text-zinc-400">Nenhum artigo encontrado</p>
              <p className="text-xs text-zinc-600 mt-1">Tente outro termo ou altere o filtro de status.</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {filtered.map((p) => {
                const order = selected.indexOf(p.id);
                const isSelected = order !== -1;
                return (
                  <li key={p.id}>
                    <button type="button" onClick={() => toggle(p.id)} aria-pressed={isSelected}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-colors ${isSelected
                        ? "border-violet-500/40 bg-violet-500/10"
                        : "border-transparent hover:bg-zinc-900 hover:border-zinc-800"}`}>
                      <span className={`flex items-center justify-center size-5 rounded-md border shrink-0 text-[10px] font-black transition-colors ${isSelected
                        ? "bg-violet-600 border-violet-500 text-white"
                        : "border-zinc-700 text-transparent"}`}>
                        {isSelected ? order + 1 : <Check className="size-3" />}
                      </span>
                      <Cover src={p.coverImage} className="w-16 h-10" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-200 truncate">{p.title}</p>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-600 mt-0.5 min-w-0">
                          {p.category && <span className="text-zinc-500 shrink-0">{p.category}</span>}
                          {p.readTime && (
                            <span className="flex items-center gap-1 shrink-0"><Clock className="size-3" />{p.readTime}</span>
                          )}
                          {p.excerpt && <span className="truncate hidden sm:inline">{p.excerpt}</span>}
                        </div>
                      </div>
                      <StatusBadge status={p.status} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-zinc-800 bg-zinc-950">
          <div className="min-w-0">
            {error ? (
              <p className="text-xs text-rose-400 truncate">{error}</p>
            ) : (
              <p className="text-xs text-zinc-500">
                {selected.length === 0
                  ? "Nenhum artigo selecionado"
                  : `${selected.length} selecionado${selected.length > 1 ? "s" : ""} · entram no fim da lista`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={onClose} disabled={saving}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors disabled:opacity-40">
              Cancelar
            </button>
            <button type="button" onClick={handleConfirm} disabled={selected.length === 0 || saving}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold transition-colors">
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
              Adicionar{selected.length > 0 ? ` (${selected.length})` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Lista de artigos do curso ────────────────────────────────────────────────

export function CourseLessonsManager({ courseId, lessons, availablePosts }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const sorted = [...lessons].sort((a, b) => a.position - b.position);

  async function handleAdd(postIds: string[]) {
    let nextPosition = sorted.length > 0 ? Math.max(...sorted.map((l) => l.position)) + 1 : 1;
    // sequencial para preservar a ordem de seleção nas positions
    try {
      for (const postId of postIds) {
        await addCoursePostAction(courseId, postId, nextPosition++);
      }
    } finally {
      // atualiza mesmo em falha parcial, para refletir os que já entraram
      router.refresh();
    }
  }

  function handleMove(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= sorted.length) return;

    const newOrder = [...sorted];
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];

    startTransition(async () => {
      await reorderCoursePostsAction(courseId, newOrder.map((l) => l.id));
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
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
      {/* toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-zinc-800">
        <p className="text-xs text-zinc-500">
          {sorted.length === 0
            ? "Monte a trilha de leitura do curso"
            : `${sorted.length} artigo${sorted.length > 1 ? "s" : ""} na trilha`}
          {isPending && <Loader2 className="inline size-3 ml-2 animate-spin text-violet-400" />}
        </p>
        <button type="button" onClick={() => setModalOpen(true)} disabled={availablePosts.length === 0}
          title={availablePosts.length === 0 ? "Todos os posts já estão vinculados a este curso" : undefined}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold transition-colors shrink-0">
          <Plus className="size-3.5" /> Adicionar artigos
        </button>
      </div>

      {sorted.length === 0 ? (
        <button type="button" onClick={() => setModalOpen(true)} disabled={availablePosts.length === 0}
          className="w-full flex flex-col items-center justify-center text-center py-12 px-4 group disabled:pointer-events-none">
          <div className="flex items-center justify-center size-11 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-3 group-hover:bg-violet-500/20 transition-colors">
            <Newspaper className="size-5 text-violet-400" />
          </div>
          <p className="text-sm text-zinc-300 font-semibold">Nenhum artigo vinculado</p>
          <p className="text-xs text-zinc-600 mt-1">
            {availablePosts.length > 0
              ? "Clique para buscar posts do blog e adicionar ao curso."
              : "Não há posts disponíveis para vincular."}
          </p>
        </button>
      ) : (
        <ol className="divide-y divide-zinc-800/70">
          {sorted.map((lesson, i) => (
            <li key={lesson.id} className="group flex items-center gap-3 px-4 py-3 hover:bg-zinc-900/80 transition-colors">
              <GripVertical className="size-4 text-zinc-700 shrink-0" />
              <span className="flex items-center justify-center size-7 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-xs font-black shrink-0">
                {i + 1}
              </span>
              <Cover src={lesson.coverImage} className="w-16 h-10 hidden sm:block" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200 truncate">{lesson.title}</p>
                <div className="flex items-center gap-2 text-[11px] text-zinc-600 mt-0.5 min-w-0">
                  {lesson.readTime && (
                    <span className="flex items-center gap-1 shrink-0"><Clock className="size-3" />{lesson.readTime}</span>
                  )}
                  {lesson.excerpt && <span className="truncate hidden md:inline">{lesson.excerpt}</span>}
                </div>
              </div>
              <StatusBadge status={lesson.status} />
              <div className="flex items-center gap-0.5 shrink-0">
                <button type="button" disabled={i === 0 || isPending} onClick={() => handleMove(i, -1)} aria-label="Mover para cima"
                  className="p-1.5 rounded-md text-zinc-500 hover:text-violet-400 hover:bg-zinc-800 disabled:opacity-20 disabled:pointer-events-none transition-colors">
                  <ArrowUp className="size-3.5" />
                </button>
                <button type="button" disabled={i === sorted.length - 1 || isPending} onClick={() => handleMove(i, 1)} aria-label="Mover para baixo"
                  className="p-1.5 rounded-md text-zinc-500 hover:text-violet-400 hover:bg-zinc-800 disabled:opacity-20 disabled:pointer-events-none transition-colors">
                  <ArrowDown className="size-3.5" />
                </button>
                <button type="button" disabled={isPending} onClick={() => handleRemove(lesson.id)} aria-label="Remover do curso"
                  className="p-1.5 rounded-md text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-40">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      {modalOpen && (
        <AddPostsModal
          posts={availablePosts}
          onClose={() => setModalOpen(false)}
          onConfirm={handleAdd}
        />
      )}
    </div>
  );
}
