"use client";

import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
    Eye, Save, X, ChevronDown, Plus, Trash2, Upload,
    Link as LinkIcon, Loader2, AlertCircle, ImageOff,
    BookOpen, FileText, ExternalLink, TagIcon,
} from "lucide-react";
import { FaGithub, FaYoutube } from "react-icons/fa6";
import { Newspaper } from "lucide-react";
import { uploadPostImage } from "@/src/actions/upload-image.actions";
import { CourseFormData, CourseResource, Level } from "@/src/types/course";

const EMPTY: CourseFormData = {
    name: "",
    slug: "",
    description: "",
    level: "BEGINNER",
    coverImage: "",
    coverImagePublicId: undefined,
    resources: [],
    outcomes: [],
};

const LEVELS: { value: Level; label: string; color: string }[] = [
    { value: "BEGINNER", label: "Iniciante", color: "text-emerald-400" },
    { value: "INTERMEDIATE", label: "Intermediário", color: "text-amber-400" },
    { value: "ADVANCED", label: "Avançado", color: "text-rose-400" },
];

const RESOURCE_TYPES: { value: CourseResource["type"]; label: string; icon: React.ReactNode }[] = [
    { value: "REPO", label: "Repositório", icon: <FaGithub className="size-3.5" /> },
    { value: "DOC", label: "Documentação", icon: <FileText className="size-3.5" /> },
    { value: "VIDEO", label: "Vídeo", icon: <FaYoutube className="size-3.5" /> },
    { value: "ARTICLE", label: "Artigo", icon: <Newspaper className="size-3.5" /> },
];

function slugify(text: string) {
    return text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

// ─── cover image ────────────────────────────────────────────────────────────

function CoverImageInput({
                             value,
                             onChange,
                         }: {
    value: string;
    onChange: (data: { url: string; publicId?: string }) => void;
}) {
    const [mode, setMode] = useState<"upload" | "url">("upload");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("Arquivo muito grande. Máximo permitido: 5MB.");
            return;
        }
        setUploading(true);
        setUploadError(null);
        try {
            const fd = new FormData();
            fd.append("image", file);
            const data = await uploadPostImage(fd);
            onChange({ url: data.imageUrl, publicId: data.publicId });
        } catch (err: any) {
            setUploadError(err.message ?? "Erro desconhecido.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-1 p-1 bg-zinc-800/60 rounded-lg w-fit border border-zinc-700/50">
                <button type="button" onClick={() => setMode("upload")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${mode === "upload" ? "bg-zinc-700 text-zinc-100 shadow" : "text-zinc-500 hover:text-zinc-300"}`}>
                    <Upload className="size-3" /> Upload
                </button>
                <button type="button" onClick={() => setMode("url")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${mode === "url" ? "bg-zinc-700 text-zinc-100 shadow" : "text-zinc-500 hover:text-zinc-300"}`}>
                    <LinkIcon className="size-3" /> URL direta
                </button>
            </div>

            {value ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={value} alt="Capa do curso" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => onChange({ url: "", publicId: undefined })}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors">
                            <Trash2 className="size-3.5" /> Remover imagem
                        </button>
                    </div>
                </div>
            ) : mode === "url" ? (
                <Input
                    placeholder="Cole a URL da imagem..."
                    value={value}
                    onChange={(e) => onChange({ url: e.target.value, publicId: undefined })}
                    className="bg-zinc-900 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-9 text-sm"
                />
            ) : (
                <>
                    <input type="file" accept="image/*" className="hidden" id="course-cover-upload" onChange={handleFileChange} />
                    <label htmlFor="course-cover-upload"
                           className={`w-full h-9 flex items-center justify-center gap-2 rounded-lg border text-sm font-medium cursor-pointer transition-all ${uploading ? "border-zinc-700 bg-zinc-900 text-zinc-500" : uploadError ? "border-rose-600/40 bg-rose-500/10 text-rose-400" : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-violet-600/60 hover:text-violet-400 hover:bg-violet-500/10"}`}>
                        {uploading ? <><Loader2 className="size-3.5 animate-spin" />Enviando...</> : <><Upload className="size-3.5" />Selecionar arquivo (máx. 5MB)</>}
                    </label>
                    {uploadError && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle className="size-3 shrink-0" />{uploadError}</p>}
                </>
            )}
        </div>
    );
}

// ─── outcomes ───────────────────────────────────────────────────────────────

function OutcomesInput({ outcomes, onChange }: { outcomes: string[]; onChange: (v: string[]) => void }) {
    return (
        <div className="space-y-2">
            {outcomes.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                    <Input
                        placeholder="Ex: Criar automações com Python"
                        value={o}
                        onChange={(e) => onChange(outcomes.map((x, idx) => (idx === i ? e.target.value : x)))}
                        className="bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-9 text-sm"
                    />
                    <button type="button" onClick={() => onChange(outcomes.filter((_, idx) => idx !== i))}
                            className="p-1.5 rounded-md text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0">
                        <Trash2 className="size-3.5" />
                    </button>
                </div>
            ))}
            <button type="button" onClick={() => onChange([...outcomes, ""])}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-zinc-700 text-xs font-medium text-zinc-500 hover:text-violet-400 hover:border-violet-600/60 hover:bg-violet-500/10 transition-all w-full justify-center">
                <Plus className="size-3.5" /> Adicionar item
            </button>
        </div>
    );
}

// ─── resources ──────────────────────────────────────────────────────────────

function ResourceTypeDropdown({ value, onChange }: { value: CourseResource["type"]; onChange: (v: CourseResource["type"]) => void }) {
    const [open, setOpen] = useState(false);
    const active = RESOURCE_TYPES.find((t) => t.value === value) ?? RESOURCE_TYPES[1];
    return (
        <div className="relative shrink-0">
            <button type="button" onClick={() => setOpen((o) => !o)}
                    className={`h-8 flex items-center gap-1.5 px-2.5 rounded-md border text-xs font-medium transition-colors whitespace-nowrap ${open ? "border-violet-600 bg-zinc-800 text-zinc-200" : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"}`}>
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

function ResourcesInput({ resources, onChange }: { resources: CourseResource[]; onChange: (v: CourseResource[]) => void }) {
    function update(i: number, patch: Partial<CourseResource>) {
        onChange(resources.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
    }
    return (
        <div className="space-y-2">
            {resources.map((r, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center p-3 rounded-lg border border-zinc-700 bg-zinc-900/60">
                    <Input placeholder="Rótulo (ex: Repositório do curso)" value={r.label}
                           onChange={(e) => update(i, { label: e.target.value })}
                           className="bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-8 text-xs" />
                    <Input placeholder="https://..." value={r.url}
                           onChange={(e) => update(i, { url: e.target.value })}
                           className="bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-8 text-xs" />
                    <ResourceTypeDropdown value={r.type} onChange={(v) => update(i, { type: v })} />
                    <button type="button" onClick={() => onChange(resources.filter((_, idx) => idx !== i))}
                            className="p-1.5 rounded-md text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                        <Trash2 className="size-3.5" />
                    </button>
                </div>
            ))}
            <button type="button" onClick={() => onChange([...resources, { label: "", url: "", type: "DOC" }])}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-zinc-700 text-xs font-medium text-zinc-500 hover:text-violet-400 hover:border-violet-600/60 hover:bg-violet-500/10 transition-all w-full justify-center">
                <Plus className="size-3.5" /> Adicionar recurso
            </button>
        </div>
    );
}

// ─── componente principal ────────────────────────────────────────────────────

type Props = {
    initialData?: Partial<CourseFormData>;
    isEdit?: boolean;
    error?: string;
    onSubmit: (formData: FormData) => void;
    /** slot livre pra encaixar o CourseLessonsManager na tela de edição, sem acoplar os componentes */
    lessonsSlot?: React.ReactNode;
};

export default function CourseForm({ initialData = {}, isEdit = false, error, onSubmit, lessonsSlot }: Props) {
    const [form, setForm] = useState<CourseFormData>({ ...EMPTY, ...initialData });
    const [slugTouched, setSlugTouched] = useState(isEdit);
    const [preview, setPreview] = useState(false);
    const [levelOpen, setLevelOpen] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});

    const set = <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => ({ ...e, [key]: undefined }));
    };

    function handleNameChange(name: string) {
        set("name", name);
        if (!slugTouched) set("slug", slugify(name));
    }

    const activeLevel = LEVELS.find((l) => l.value === form.level)!;

    function validate(): boolean {
        const e: typeof errors = {};
        if (!form.name.trim()) e.name = "Nome obrigatório";
        if (!form.slug.trim()) e.slug = "Slug obrigatório";
        if (!form.description.trim()) e.description = "Descrição obrigatória";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleSubmit() {
        if (!validate()) return;
        const fd = new FormData();
        fd.set("name", form.name);
        fd.set("slug", form.slug);
        fd.set("description", form.description);
        fd.set("level", form.level);
        fd.set("coverImage", form.coverImage);
        if (form.coverImagePublicId) fd.set("coverImagePublicId", form.coverImagePublicId);
        fd.set("resources", JSON.stringify(form.resources.filter((r) => r.label && r.url)));
        fd.set("outcomes", JSON.stringify(form.outcomes.filter(Boolean)));
        onSubmit(fd);
    }

    // ─── preview ─────────────────────────────────────────────────────────────

    if (preview) {
        return (
            <div className="min-w-0">
                <div className="flex items-center justify-between mb-6 p-3 rounded-xl border border-zinc-800 bg-zinc-900">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Eye className="size-4 text-violet-400" />
                        <span className="font-medium text-zinc-300">Pré-visualização</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setPreview(false)} className="text-zinc-500 hover:text-white gap-1.5">
                        <X className="size-3.5" /> Fechar
                    </Button>
                </div>

                <div className="w-full h-52 sm:h-72 rounded-xl overflow-hidden mb-6 bg-zinc-800 flex items-center justify-center">
                    {form.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={form.coverImage} alt={form.name} className="w-full h-full object-cover" />
                    ) : (
                        <ImageOff className="size-8 text-zinc-700" />
                    )}
                </div>

                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block bg-violet-500/15 border border-violet-500/30 ${activeLevel.color}`}>
          {activeLevel.label}
        </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 mb-3">
                    {form.name || <span className="text-zinc-700">Sem nome</span>}
                </h1>
                <p className="text-zinc-400 leading-relaxed mb-6">
                    {form.description || <span className="text-zinc-700">Sem descrição</span>}
                </p>

                {form.outcomes.filter(Boolean).length > 0 && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {form.outcomes.filter(Boolean).map((o, i) => (
                            <li key={i} className="flex items-start gap-2.5 bg-violet-950/30 border border-violet-800/30 rounded-xl px-4 py-3 text-sm text-zinc-300">
                                <span className="text-violet-400 mt-0.5 shrink-0">✓</span>{o}
                            </li>
                        ))}
                    </ul>
                )}

                {form.resources.filter((r) => r.label && r.url).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {form.resources.filter((r) => r.label && r.url).map((r, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-medium text-zinc-300">
                <ExternalLink className="size-3" />{r.label}
              </span>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // ─── form ────────────────────────────────────────────────────────────────

    return (
        <div className="min-w-0 space-y-7">
            {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                    {decodeURIComponent(error)}
                </div>
            )}

            {/* nome + slug */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                    Nome do curso <span className="text-rose-500">*</span>
                </label>
                <Input
                    placeholder="Ex: Python: Aplicações reais"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={`bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-600 text-lg font-bold h-12 ${errors.name ? "border-rose-600" : ""}`}
                />
                {errors.name && <p className="text-xs text-rose-400 mt-1.5">{errors.name}</p>}

                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-zinc-600 shrink-0">/cursos/</span>
                    <Input
                        value={form.slug}
                        onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }}
                        className={`bg-zinc-900 border-zinc-700 text-zinc-400 h-8 text-xs font-mono focus-visible:ring-violet-600 ${errors.slug ? "border-rose-600" : ""}`}
                    />
                </div>
            </div>

            {/* nível */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Nível</label>
                <div className="relative w-fit">
                    <button type="button" onClick={() => setLevelOpen((o) => !o)}
                            className={`flex items-center gap-2 justify-between px-3 py-2 rounded-lg border bg-zinc-900 text-sm min-w-48 transition-colors ${levelOpen ? "border-violet-600" : "border-zinc-700 hover:border-zinc-600"}`}>
                        <span className={activeLevel.color}>{activeLevel.label}</span>
                        <ChevronDown className={`size-3.5 text-zinc-500 transition-transform ${levelOpen ? "rotate-180" : ""}`} />
                    </button>
                    {levelOpen && (
                        <div className="absolute z-30 top-full mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                            {LEVELS.map((l) => (
                                <button key={l.value} type="button" onClick={() => { set("level", l.value); setLevelOpen(false); }}
                                        className={`w-full flex items-center px-3 py-2.5 text-sm hover:bg-zinc-800 transition-colors ${l.color} ${form.level === l.value ? "bg-zinc-800" : ""}`}>
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* descrição */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                    Descrição <span className="text-rose-500">*</span>
                </label>
                <textarea
                    placeholder="Sobre o que é o curso..."
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={4}
                    className={`w-full bg-zinc-900 border rounded-lg px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 resize-none transition-colors ${errors.description ? "border-rose-600" : "border-zinc-700"}`}
                />
                {errors.description && <p className="text-xs text-rose-400 mt-1.5">{errors.description}</p>}
            </div>

            {/* capa */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Imagem de capa</label>
                <CoverImageInput value={form.coverImage} onChange={({ url, publicId }) => { set("coverImage", url); set("coverImagePublicId", publicId); }} />
            </div>

            {/* outcomes */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                    Ao concluir você saberá...
                </label>
                <OutcomesInput outcomes={form.outcomes} onChange={(v) => set("outcomes", v)} />
            </div>

            {/* recursos */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                    <ExternalLink className="size-3 inline mr-1" />Materiais e links
                </label>
                <ResourcesInput resources={form.resources} onChange={(v) => set("resources", v)} />
            </div>

            {/* aulas — só existe na edição, pois depende do curso já ter um id */}
            {isEdit && lessonsSlot && (
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                        <BookOpen className="size-3 inline mr-1" />Aulas do curso
                    </label>
                    {lessonsSlot}
                </div>
            )}

            {!isEdit && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg border border-violet-500/20 bg-violet-500/5 text-xs text-zinc-400">
                    <BookOpen className="size-3.5 text-violet-400 shrink-0 mt-0.5" />
                    Aulas são vinculadas depois de criar o curso, na tela de edição.
                </div>
            )}

            {/* ações */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-800 flex-wrap">
                <Button type="button" variant="ghost" onClick={() => setPreview(true)} className="gap-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Eye className="size-4" /> Pré-visualizar
                </Button>
                <Button type="button" onClick={handleSubmit} className="gap-2 text-sm bg-violet-600 hover:bg-violet-500 text-white font-semibold">
                    <Save className="size-4" />
                    {isEdit ? "Atualizar curso" : "Criar curso"}
                </Button>
            </div>
        </div>
    );
}