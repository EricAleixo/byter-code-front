"use client";

import { useState, useTransition } from "react";
import {
  Plus, Trash2, Loader2, Play, ExternalLink, X, ChevronDown, Film,
  FileText, Newspaper,
} from "lucide-react";
import { FaGithub, FaYoutube } from "react-icons/fa6";
import { Input } from "@/src/components/ui/input";
import {
  addCourseLessonAction,
  removeCourseLessonAction,
  addLessonResourceAction,
  removeLessonResourceAction,
} from "@/src/actions/courses.actions";

type VideoProvider = "YOUTUBE" | "VIMEO" | "DIRECT";
type ResourceType = "REPO" | "DOC" | "VIDEO" | "ARTICLE";

type LessonResource = {
  id: string;
  label: string;
  url: string;
  type: ResourceType;
};

type CourseVideo = {
  id: string;
  order: number;
  title: string;
  description?: string;
  videoUrl: string;
  videoProvider: VideoProvider;
  duration?: number;
  resources?: LessonResource[];
};

type Props = {
  courseId: string;
  videos: CourseVideo[];
};

const PROVIDERS: { value: VideoProvider; label: string }[] = [
  { value: "YOUTUBE", label: "YouTube" },
  { value: "VIMEO", label: "Vimeo" },
  { value: "DIRECT", label: "Link direto (mp4)" },
];

const RESOURCE_TYPES: { value: ResourceType; label: string; icon: React.ReactNode }[] = [
  { value: "REPO", label: "Repositório", icon: <FaGithub className="size-3.5" /> },
  { value: "DOC", label: "Documentação", icon: <FileText className="size-3.5" /> },
  { value: "VIDEO", label: "Vídeo", icon: <FaYoutube className="size-3.5" /> },
  { value: "ARTICLE", label: "Artigo", icon: <Newspaper className="size-3.5" /> },
];

const RESOURCE_ICONS: Record<ResourceType, React.ReactNode> = {
  REPO: <FaGithub className="size-3" />,
  DOC: <FileText className="size-3" />,
  VIDEO: <FaYoutube className="size-3" />,
  ARTICLE: <Newspaper className="size-3" />,
};

function getYoutubeThumbnail(url: string): string | null {
  try {
    const u = new URL(url);
    const videoId = u.searchParams.get("v") ?? u.pathname.split("/").pop();
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  } catch {
    return null;
  }
}

function detectProvider(url: string): VideoProvider | null {
  if (/youtube\.com|youtu\.be/.test(url)) return "YOUTUBE";
  if (/vimeo\.com/.test(url)) return "VIMEO";
  if (/\.(mp4|webm|ogg)$/i.test(url)) return "DIRECT";
  return null;
}

function formatDuration(seconds?: number) {
  if (!seconds) return null;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${String(remainingMinutes).padStart(2, "0")}min`;
}

// ─── modal de vídeo (sem mudanças de comportamento) ────────────────────────

type AddVideoModalProps = {
  onClose: () => void;
  onSave: (data: {
    title: string;
    description?: string;
    videoUrl: string;
    videoProvider: VideoProvider;
    duration: number;
  }) => Promise<void>;
};

function AddVideoModal({ onClose, onSave }: AddVideoModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [provider, setProvider] = useState<VideoProvider>("YOUTUBE");
  const [providerTouched, setProviderTouched] = useState(false);
  const [providerOpen, setProviderOpen] = useState(false);
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const activeProvider = PROVIDERS.find((p) => p.value === provider)!;
  const previewThumb = provider === "YOUTUBE" ? getYoutubeThumbnail(videoUrl) : null;

  function handleUrlChange(url: string) {
    setVideoUrl(url);
    setErrors((e) => ({ ...e, videoUrl: "" }));
    if (!providerTouched) {
      const detected = detectProvider(url);
      if (detected) setProvider(detected);
    }
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Título obrigatório";
    if (!videoUrl.trim()) e.videoUrl = "URL do vídeo obrigatória";
    else {
      try { new URL(videoUrl); } catch { e.videoUrl = "URL inválida"; }
    }
    const totalSeconds = (Number(minutes) || 0) * 60 + (Number(seconds) || 0);
    if (totalSeconds <= 0) e.duration = "Informe a duração do vídeo";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    const totalSeconds = (Number(minutes) || 0) * 60 + (Number(seconds) || 0);
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        videoUrl: videoUrl.trim(),
        videoProvider: provider,
        duration: totalSeconds,
      });
      onClose();
    } catch (err: any) {
      setErrors((e) => ({ ...e, submit: err.message ?? "Erro ao salvar vídeo." }));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-8 rounded-lg bg-violet-500/15 border border-violet-500/25">
              <Film className="size-4 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-100">Adicionar vídeo</p>
              <p className="text-[11px] text-zinc-500">Cadastre uma nova aula em vídeo</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {previewThumb && (
            <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewThumb} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="flex items-center justify-center size-10 rounded-full bg-violet-600/90 text-white">
                  <Play className="size-4 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              URL do vídeo <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              className={`bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-9 text-sm ${errors.videoUrl ? "border-rose-600" : ""}`}
            />
            {errors.videoUrl && <p className="text-xs text-rose-400 mt-1.5">{errors.videoUrl}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Provedor</label>
            <div className="relative w-fit">
              <button
                type="button"
                onClick={() => setProviderOpen((o) => !o)}
                className="flex items-center gap-2 justify-between px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm min-w-44 hover:border-zinc-600 transition-colors"
              >
                <span className="text-zinc-200">{activeProvider.label}</span>
                <ChevronDown className={`size-3.5 text-zinc-500 transition-transform ${providerOpen ? "rotate-180" : ""}`} />
              </button>
              {providerOpen && (
                <div className="absolute z-30 top-full mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                  {PROVIDERS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => { setProvider(p.value); setProviderTouched(true); setProviderOpen(false); }}
                      className={`w-full flex items-center px-3 py-2.5 text-sm hover:bg-zinc-800 transition-colors ${provider === p.value ? "bg-zinc-800 text-violet-400" : "text-zinc-300"}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Título <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="Ex: Introdução à Programação Orientada a Objetos"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors((er) => ({ ...er, title: "" })); }}
              className={`bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-9 text-sm ${errors.title ? "border-rose-600" : ""}`}
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1.5">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Descrição</label>
            <textarea
              placeholder="Sobre o que é essa aula (opcional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Duração <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={minutes}
                  onChange={(e) => { setMinutes(e.target.value); setErrors((er) => ({ ...er, duration: "" })); }}
                  className="bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-9 text-sm w-20"
                />
                <span className="text-xs text-zinc-600">min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min={0}
                  max={59}
                  placeholder="0"
                  value={seconds}
                  onChange={(e) => { setSeconds(e.target.value); setErrors((er) => ({ ...er, duration: "" })); }}
                  className="bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-9 text-sm w-20"
                />
                <span className="text-xs text-zinc-600">seg</span>
              </div>
            </div>
            {errors.duration && <p className="text-xs text-rose-400 mt-1.5">{errors.duration}</p>}
          </div>

          {errors.submit && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">
              {errors.submit}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-zinc-800">
          <button type="button" onClick={onClose} className="px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors">
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
          >
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
            Adicionar vídeo
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── modal de recurso da aula (novo) ────────────────────────────────────────

type AddResourceModalProps = {
  lessonTitle: string;
  onClose: () => void;
  onSave: (data: { label: string; url: string; type: ResourceType }) => Promise<void>;
};

function AddResourceModal({ lessonTitle, onClose, onSave }: AddResourceModalProps) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<ResourceType>("DOC");
  const [typeOpen, setTypeOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const activeType = RESOURCE_TYPES.find((t) => t.value === type)!;

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!label.trim()) e.label = "Rótulo obrigatório";
    if (!url.trim()) e.url = "URL obrigatória";
    else {
      try { new URL(url); } catch { e.url = "URL inválida"; }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({ label: label.trim(), url: url.trim(), type });
      onClose();
    } catch (err: any) {
      setErrors((e) => ({ ...e, submit: err.message ?? "Erro ao salvar recurso." }));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="min-w-0">
            <p className="text-sm font-bold text-zinc-100">Adicionar recurso</p>
            <p className="text-[11px] text-zinc-500 truncate">Para a aula: {lessonTitle}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors shrink-0">
            <X className="size-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Rótulo <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="Ex: Slides da aula"
              value={label}
              onChange={(e) => { setLabel(e.target.value); setErrors((er) => ({ ...er, label: "" })); }}
              className={`bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-9 text-sm ${errors.label ? "border-rose-600" : ""}`}
            />
            {errors.label && <p className="text-xs text-rose-400 mt-1.5">{errors.label}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              URL <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="https://..."
              value={url}
              onChange={(e) => { setUrl(e.target.value); setErrors((er) => ({ ...er, url: "" })); }}
              className={`bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-9 text-sm ${errors.url ? "border-rose-600" : ""}`}
            />
            {errors.url && <p className="text-xs text-rose-400 mt-1.5">{errors.url}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Tipo</label>
            <div className="relative w-fit">
              <button
                type="button"
                onClick={() => setTypeOpen((o) => !o)}
                className="flex items-center gap-2 justify-between px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm min-w-40 hover:border-zinc-600 transition-colors"
              >
                <span className="flex items-center gap-1.5 text-zinc-200">{activeType.icon}{activeType.label}</span>
                <ChevronDown className={`size-3.5 text-zinc-500 transition-transform ${typeOpen ? "rotate-180" : ""}`} />
              </button>
              {typeOpen && (
                <div className="absolute z-30 top-full mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                  {RESOURCE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => { setType(t.value); setTypeOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-zinc-800 transition-colors ${type === t.value ? "bg-zinc-800 text-violet-400" : "text-zinc-300"}`}
                    >
                      {t.icon}{t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">
              {errors.submit}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-zinc-800">
          <button type="button" onClick={onClose} className="px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors">
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
          >
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
            Adicionar recurso
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── componente principal ────────────────────────────────────────────────────

export function CourseVideosManager({ courseId, videos: initialVideos }: Props) {
  const [videos, setVideos] = useState<CourseVideo[]>(initialVideos);
  const [modalOpen, setModalOpen] = useState(false);
  const [resourceModalLessonId, setResourceModalLessonId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const resourceModalLesson = videos.find((v) => v.id === resourceModalLessonId);

  async function handleAdd(data: {
    title: string;
    description?: string;
    videoUrl: string;
    videoProvider: VideoProvider;
    duration: number;
  }) {
    const nextOrder = videos.length > 0 ? Math.max(...videos.map((v) => v.order)) + 1 : 1;
    const created = await addCourseLessonAction(courseId, { ...data, order: nextOrder });
    setVideos((current) => [...current, { ...created, resources: [] }]);
  }

  function handleRemove(videoId: string) {
    startTransition(async () => {
      await removeCourseLessonAction(courseId, videoId);
      setVideos((current) => current.filter((video) => video.id !== videoId));
    });
  }

  async function handleAddResource(data: { label: string; url: string; type: ResourceType }) {
    if (!resourceModalLessonId) return;
    const created = await addLessonResourceAction(courseId, resourceModalLessonId, data);
    setVideos((current) =>
      current.map((v) =>
        v.id === resourceModalLessonId
          ? { ...v, resources: [...(v.resources ?? []), created] }
          : v,
      ),
    );
  }

  function handleRemoveResource(lessonId: string, resourceId: string) {
    startTransition(async () => {
      await removeLessonResourceAction(courseId, lessonId, resourceId);
      setVideos((current) =>
        current.map((v) =>
          v.id === lessonId
            ? { ...v, resources: (v.resources ?? []).filter((r) => r.id !== resourceId) }
            : v,
        ),
      );
    });
  }

  return (
    <div className="space-y-4">
      {modalOpen && <AddVideoModal onClose={() => setModalOpen(false)} onSave={handleAdd} />}

      {resourceModalLesson && (
        <AddResourceModal
          lessonTitle={resourceModalLesson.title}
          onClose={() => setResourceModalLessonId(null)}
          onSave={handleAddResource}
        />
      )}

      {videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40">
          <Play className="size-8 text-zinc-700 mb-3" />
          <p className="text-sm text-zinc-500">Nenhum vídeo adicionado ainda.</p>
          <p className="text-xs text-zinc-700 mt-1">Adicione vídeos para compor as aulas deste curso.</p>
        </div>
      )}

      {videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => {
            const thumb = video.videoProvider === "YOUTUBE" ? getYoutubeThumbnail(video.videoUrl) : null;
            const resources = video.resources ?? [];
            return (
              <div key={video.id} className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-colors">
                <div className="relative aspect-video bg-zinc-950 overflow-hidden">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt={video.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="size-8 text-zinc-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center justify-center size-12 rounded-full bg-violet-600/90 text-white shadow-lg group-hover:bg-violet-500 group-hover:scale-105 transition-all">
                      <Play className="size-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  {video.duration != null && (
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-medium text-zinc-300">
                      {formatDuration(video.duration)}
                    </span>
                  )}
                </div>

                <div className="p-3.5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-zinc-200 truncate">{video.title}</h3>
                      <p className="text-[11px] text-zinc-600 mt-1 truncate">{video.videoUrl}</p>
                    </div>
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-1.5 rounded-md text-zinc-600 hover:text-violet-400 hover:bg-zinc-800 transition-colors"
                      title="Abrir vídeo"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>

                  {/* recursos da aula */}
                  {resources.length > 0 && (
                    <ul className="space-y-1.5">
                      {resources.map((r) => (
                        <li key={r.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-zinc-800/60 text-xs text-zinc-400 group/res">
                          <span className="text-zinc-500 shrink-0">{RESOURCE_ICONS[r.type]}</span>
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate hover:text-violet-400 transition-colors">
                            {r.label}
                          </a>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleRemoveResource(video.id, r.id)}
                            className="shrink-0 p-1 rounded text-zinc-600 hover:text-rose-400 opacity-0 group-hover/res:opacity-100 transition-opacity disabled:opacity-40"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    type="button"
                    onClick={() => setResourceModalLessonId(video.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md border border-dashed border-zinc-700 text-[11px] font-semibold text-zinc-500 hover:text-violet-400 hover:border-violet-500/40 hover:bg-violet-500/5 transition-colors"
                  >
                    <Plus className="size-3" /> Recurso
                  </button>

                  <div className="flex items-center justify-end pt-1 border-t border-zinc-800">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleRemove(video.id)}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-40"
                    >
                      {isPending ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
                      Remover vídeo
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-zinc-700 text-xs font-semibold text-zinc-500 hover:text-violet-400 hover:border-violet-500/40 hover:bg-violet-500/5 transition-colors"
      >
        <Plus className="size-3.5" />
        Adicionar vídeo
      </button>
    </div>
  );
}