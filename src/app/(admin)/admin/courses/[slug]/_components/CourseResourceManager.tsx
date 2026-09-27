"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Save, Loader2, ChevronDown } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { FaGithub, FaYoutube } from "react-icons/fa6";
import { FileText, Newspaper } from "lucide-react";
import { CourseResource } from "@/src/types/course";
import { updateCourseResourcesAction } from "../../../../../../actions/courses.actions";

const RESOURCE_TYPES: { value: CourseResource["type"]; label: string; icon: React.ReactNode }[] = [
  { value: "REPO", label: "Repositório", icon: <FaGithub className="size-3.5" /> },
  { value: "DOC", label: "Documentação", icon: <FileText className="size-3.5" /> },
  { value: "VIDEO", label: "Vídeo", icon: <FaYoutube className="size-3.5" /> },
  { value: "ARTICLE", label: "Artigo", icon: <Newspaper className="size-3.5" /> },
];

function TypeDropdown({ value, onChange }: { value: CourseResource["type"]; onChange: (v: CourseResource["type"]) => void }) {
  const [open, setOpen] = useState(false);
  const active = RESOURCE_TYPES.find((t) => t.value === value) ?? RESOURCE_TYPES[1];
  return (
    <div className="relative shrink-0">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className={`h-8 flex items-center gap-1.5 px-2.5 rounded-md border text-xs font-medium transition-colors whitespace-nowrap ${open ? "border-violet-600 bg-zinc-800 text-zinc-200" : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"}`}>
        {active.icon}<span>{active.label}</span>
        <ChevronDown className={`size-3 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-40 top-full mt-1 right-0 min-w-36 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
          {RESOURCE_TYPES.map((t) => (
            <button key={t.value} type="button" onClick={() => { onChange(t.value); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-zinc-800 transition-colors ${value === t.value ? "text-violet-400 bg-zinc-800/60" : "text-zinc-400"}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CourseResourcesManager({
  courseId,
  slug,
  initialResources,
}: {
  courseId: string;
  slug: string;
  initialResources: CourseResource[];
}) {
  const [resources, setResources] = useState<(CourseResource & { _key: string })[]>(
    initialResources.map((r) => ({ ...r, _key: r.id ?? crypto.randomUUID() })),
  );
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function update(key: string, patch: Partial<CourseResource>) {
    setResources((r) => r.map((res) => (res._key === key ? { ...res, ...patch } : res)));
    setDirty(true);
  }

  function remove(key: string) {
    setResources((r) => r.filter((res) => res._key !== key));
    setDirty(true);
  }

  function add() {
    setResources((r) => [...r, { label: "", url: "", type: "DOC", _key: crypto.randomUUID() }]);
    setDirty(true);
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        const toSave = resources
          .filter((r) => r.label && r.url)
          .map(({ _key, ...r }) => r);

        // o backend faz delete+reinsert e retorna os recursos já com id novo —
        // sincroniza o estado local com o que realmente ficou salvo, em vez de
        // confiar apenas no array otimista que estava em tela
        const saved = await updateCourseResourcesAction(courseId, slug, toSave);
        setResources(
          (saved ?? toSave).map((r: CourseResource) => ({ ...r, _key: r.id ?? crypto.randomUUID() })),
        );
        setDirty(false);
      } catch (err: any) {
        setError(err.message ?? "Erro ao salvar materiais.");
      }
    });
  }

  return (
    <div className="space-y-3">
      {resources.length === 0 && (
        <p className="text-xs text-zinc-600 italic px-1">Nenhum material adicionado ainda.</p>
      )}

      {resources.map((r) => (
        <div key={r._key} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center p-3 rounded-lg border border-zinc-700 bg-zinc-900/60">
          <Input placeholder="Rótulo (ex: Repositório do curso)" value={r.label}
            onChange={(e) => update(r._key, { label: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-8 text-xs" />
          <Input placeholder="https://..." value={r.url}
            onChange={(e) => update(r._key, { url: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-8 text-xs" />
          <TypeDropdown value={r.type} onChange={(v) => update(r._key, { type: v })} />
          <button type="button" onClick={() => remove(r._key)}
            className="p-1.5 rounded-md text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={add}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-zinc-700 text-xs font-medium text-zinc-500 hover:text-violet-400 hover:border-violet-600/60 hover:bg-violet-500/10 transition-all flex-1 justify-center">
          <Plus className="size-3.5" /> Adicionar material
        </button>

        {dirty && (
          <button type="button" disabled={isPending} onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors shrink-0">
            {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            Salvar materiais
          </button>
        )}
      </div>
    </div>
  );
}