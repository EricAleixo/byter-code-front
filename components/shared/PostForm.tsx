"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  BookOpen,
  Cpu,
  Globe,
  Terminal,
  Rss,
  ImagePlus,
  Eye,
  Save,
  Send,
  X,
  Flame,
  Tag,
  ChevronDown,
  AlignLeft,
  Heading2,
  Bold,
  Italic,
  Code,
  Link2,
  List,
  Quote,
} from "lucide-react";

// ─── tipos ────────────────────────────────────────────────────────────────────

export type PostFormData = {
  title: string;
  excerpt: string;
  category: string;
  tag: "" | "novo" | "trending" | "exclusivo";
  content: string;
  coverImage: string;
  readTime: string;
  status: "draft" | "published";
};

type Props = {
  initialData?: Partial<PostFormData>;
  isEdit?: boolean;
  onSubmit?: (data: PostFormData) => void;
};

// ─── constantes ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "frontend",     label: "Frontend",     icon: <Globe className="size-3.5" />,    color: "text-violet-400" },
  { value: "backend",      label: "Backend",      icon: <Terminal className="size-3.5" />, color: "text-emerald-400" },
  { value: "devops",       label: "DevOps",       icon: <Cpu className="size-3.5" />,      color: "text-sky-400" },
  { value: "ia-ml",        label: "IA & ML",      icon: <TrendingUp className="size-3.5" />, color: "text-rose-400" },
  { value: "tutoriais",    label: "Tutoriais",    icon: <BookOpen className="size-3.5" />, color: "text-amber-400" },
  { value: "open-source",  label: "Open Source",  icon: <Rss className="size-3.5" />,      color: "text-teal-400" },
];

const TAGS = [
  { value: "",          label: "Sem tag" },
  { value: "novo",      label: "Novo" },
  { value: "trending",  label: "Trending" },
  { value: "exclusivo", label: "Exclusivo" },
] as const;

const TAG_STYLES = {
  novo:      "bg-violet-500/20 text-violet-300 border-violet-500/30",
  trending:  "bg-rose-500/20 text-rose-300 border-rose-500/30",
  exclusivo: "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

const TOOLBAR = [
  { icon: <Heading2 className="size-3.5" />, label: "H2",     insert: "\n## " },
  { icon: <Bold className="size-3.5" />,     label: "Bold",   insert: "**texto**" },
  { icon: <Italic className="size-3.5" />,   label: "Itálico",insert: "*texto*" },
  { icon: <Code className="size-3.5" />,     label: "Code",   insert: "`código`" },
  { icon: <Link2 className="size-3.5" />,    label: "Link",   insert: "[texto](url)" },
  { icon: <List className="size-3.5" />,     label: "Lista",  insert: "\n- item" },
  { icon: <Quote className="size-3.5" />,    label: "Citação",insert: "\n> " },
  { icon: <AlignLeft className="size-3.5" />,label: "---",    insert: "\n---\n" },
];

const EMPTY: PostFormData = {
  title: "",
  excerpt: "",
  category: "",
  tag: "",
  content: "",
  coverImage: "",
  readTime: "",
  status: "draft",
};

// ─── componente ───────────────────────────────────────────────────────────────

export default function PostForm({ initialData = {}, isEdit = false, onSubmit }: Props) {
  const [form, setForm] = useState<PostFormData>({ ...EMPTY, ...initialData });
  const [preview, setPreview] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PostFormData, string>>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // helpers
  const set = <K extends keyof PostFormData>(key: K, value: PostFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const activeCat = CATEGORIES.find((c) => c.value === form.category);

  function insertMarkdown(snippet: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = form.content.slice(0, start);
    const after = form.content.slice(end);
    const next = before + snippet + after;
    set("content", next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + snippet.length;
    });
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.title.trim())    e.title    = "Título obrigatório";
    if (!form.excerpt.trim())  e.excerpt  = "Resumo obrigatório";
    if (!form.category)        e.category = "Escolha uma categoria";
    if (!form.content.trim())  e.content  = "Conteúdo não pode estar vazio";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(status: "draft" | "published") {
    if (!validate()) return;
    const payload = { ...form, status };
    onSubmit?.(payload);
    // feedback mock
    alert(`Post ${status === "draft" ? "salvo como rascunho" : "publicado"} com sucesso!`);
  }

  // ─── preview simples ─────────────────────────────────────────────────────

  if (preview) {
    return (
      <div className="min-w-0">
        {/* barra de preview */}
        <div className="flex items-center justify-between mb-6 p-3 rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Eye className="size-4 text-violet-400" />
            <span className="font-medium text-zinc-300">Pré-visualização</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setPreview(false)}
            className="text-zinc-500 hover:text-white gap-1.5"
          >
            <X className="size-3.5" /> Fechar
          </Button>
        </div>

        {/* cover */}
        {form.coverImage && (
          <div className="w-full h-52 sm:h-72 rounded-xl overflow-hidden mb-6 bg-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.coverImage} alt="cover" className="w-full h-full object-cover" />
          </div>
        )}

        {/* meta */}
        <div className="flex items-center gap-2 mb-3">
          {activeCat && (
            <span className={`text-xs font-bold uppercase tracking-widest ${activeCat.color}`}>
              {activeCat.label}
            </span>
          )}
          {form.tag && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${TAG_STYLES[form.tag]}`}>
              {form.tag === "trending" && <Flame className="size-2.5" />}
              {form.tag}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
          {form.title || <span className="text-zinc-700">Sem título</span>}
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          {form.excerpt || <span className="text-zinc-700">Sem resumo</span>}
        </p>

        <div className="prose-custom text-zinc-300 text-sm leading-7 whitespace-pre-wrap border-t border-zinc-800 pt-6">
          {form.content || <span className="text-zinc-700">Sem conteúdo ainda.</span>}
        </div>
      </div>
    );
  }

  // ─── form ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-w-0 space-y-7">

      {/* título */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
          Título <span className="text-rose-500">*</span>
        </label>
        <Input
          placeholder="Digite o título do post..."
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          className={`bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-600 text-lg font-bold h-12 ${
            errors.title ? "border-rose-600" : ""
          }`}
        />
        {errors.title && <p className="text-xs text-rose-400 mt-1.5">{errors.title}</p>}
      </div>

      {/* resumo */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
          Resumo / Excerpt <span className="text-rose-500">*</span>
        </label>
        <textarea
          placeholder="Uma frase que resume o post. Aparece nos cards e no topo do artigo."
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          rows={2}
          className={`w-full bg-zinc-900 border rounded-lg px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 resize-none transition-colors ${
            errors.excerpt ? "border-rose-600" : "border-zinc-700"
          }`}
        />
        {errors.excerpt && <p className="text-xs text-rose-400 mt-1.5">{errors.excerpt}</p>}
      </div>

      {/* categoria + tag + tempo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* categoria */}
        <div className="sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Categoria <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setCatOpen((o) => !o)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border bg-zinc-900 text-sm transition-colors ${
                errors.category ? "border-rose-600" : catOpen ? "border-violet-600" : "border-zinc-700 hover:border-zinc-600"
              }`}
            >
              {activeCat ? (
                <span className={`flex items-center gap-2 ${activeCat.color}`}>
                  {activeCat.icon}
                  <span className="text-zinc-200">{activeCat.label}</span>
                </span>
              ) : (
                <span className="text-zinc-600">Selecionar...</span>
              )}
              <ChevronDown className={`size-3.5 text-zinc-500 transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>

            {catOpen && (
              <div className="absolute z-30 top-full mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => { set("category", cat.value); setCatOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-zinc-800 transition-colors ${
                      form.category === cat.value ? "bg-zinc-800" : ""
                    }`}
                  >
                    <span className={cat.color}>{cat.icon}</span>
                    <span className="text-zinc-300">{cat.label}</span>
                    {form.category === cat.value && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.category && <p className="text-xs text-rose-400 mt-1.5">{errors.category}</p>}
        </div>

        {/* tag */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            <Tag className="size-3 inline mr-1" />Tag
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {TAGS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => set("tag", t.value)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  form.tag === t.value
                    ? t.value
                      ? `${TAG_STYLES[t.value as keyof typeof TAG_STYLES]}`
                      : "bg-zinc-700 text-zinc-300 border-zinc-600"
                    : "bg-zinc-900 text-zinc-600 border-zinc-800 hover:border-zinc-600 hover:text-zinc-400"
                }`}
              >
                {t.value === "trending" && form.tag === "trending" && <Flame className="size-2.5 inline mr-1" />}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* tempo de leitura */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Tempo de leitura
          </label>
          <Input
            placeholder="ex: 8 min"
            value={form.readTime}
            onChange={(e) => set("readTime", e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-9 text-sm"
          />
        </div>
      </div>

      {/* imagem de capa */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
          Imagem de capa
        </label>
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <Input
              placeholder="Cole a URL da imagem..."
              value={form.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-9 text-sm"
            />
          </div>
          {/* preview da imagem */}
          <div className="shrink-0 w-24 h-16 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 flex items-center justify-center">
            {form.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.coverImage} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <ImagePlus className="size-5 text-zinc-700" />
            )}
          </div>
        </div>
      </div>

      {/* editor de conteúdo */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Conteúdo <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] text-zinc-600">Markdown suportado</span>
        </div>

        {/* toolbar */}
        <div className="flex items-center gap-1 flex-wrap px-2 py-1.5 bg-zinc-900 border border-b-0 border-zinc-700 rounded-t-lg">
          {TOOLBAR.map((tool) => (
            <button
              key={tool.label}
              type="button"
              title={tool.label}
              onClick={() => insertMarkdown(tool.insert)}
              className="p-1.5 rounded text-zinc-500 hover:text-violet-400 hover:bg-zinc-800 transition-colors"
            >
              {tool.icon}
            </button>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          placeholder={`Escreva o conteúdo do post em Markdown...\n\n## Subtítulo\n\nParágrafo com **negrito**, *itálico* e \`código\`.`}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          rows={16}
          className={`w-full bg-zinc-900 border rounded-b-lg px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 resize-y transition-colors font-mono leading-7 ${
            errors.content ? "border-rose-600" : "border-zinc-700"
          }`}
        />
        {errors.content && <p className="text-xs text-rose-400 mt-1.5">{errors.content}</p>}

        <p className="text-[11px] text-zinc-700 mt-1.5">
          {form.content.length} caracteres · ~{Math.max(1, Math.ceil(form.content.split(" ").length / 200))} min de leitura
        </p>
      </div>

      {/* ações */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-800 flex-wrap">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setPreview(true)}
          className="gap-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <Eye className="size-4" />
          Pré-visualizar
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit("draft")}
            className="gap-2 text-sm bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <Save className="size-4" />
            {isEdit ? "Salvar rascunho" : "Salvar como rascunho"}
          </Button>

          <Button
            type="button"
            onClick={() => handleSubmit("published")}
            className="gap-2 text-sm bg-violet-600 hover:bg-violet-500 text-white font-semibold"
          >
            <Send className="size-4" />
            {isEdit ? "Atualizar post" : "Publicar agora"}
          </Button>
        </div>
      </div>
    </div>
  );
}