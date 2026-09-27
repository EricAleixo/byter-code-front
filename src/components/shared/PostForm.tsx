"use client";

import { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import ResizeImage from "tiptap-extension-resize-image";
import { createLowlight } from "lowlight";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Eye, Save, Send, X, Flame, Tag as TagIcon, ChevronDown,
  Heading2, Heading3, Bold, Italic, Code, Link2, List,
  ListOrdered, Quote, Minus, Code2, Undo, Redo, Heading1,
  Upload, Link as LinkIcon, Loader2, Trash2, AlertCircle, ImageIcon,
  Plus, ExternalLink, BookOpen, FileText, Sparkles, Globe, CheckCircle2,
} from "lucide-react";
import { uploadPostImage } from "@/src/actions/upload-image.actions";
import { SiGithub } from "react-icons/si";
import { FaYoutube } from "react-icons/fa6";
import { PostLink } from "@/src/types/post";

// ─── types ────────────────────────────────────────────────────────────────────

export type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  color: string;
};

export type ApiTag = {
  id: string;
  name: string;
  slug: string;
};

export type PostFormData = {
  title: string;
  excerpt: string;
  categoryId: string;
  tagIds: string[];
  content: string;
  coverImage: string;
  coverImagePublicId?: string;
  status: "DRAFT" | "PUBLISHED";
  links: PostLink[];
};

type Props = {
  categories: ApiCategory[];
  tags: ApiTag[];
  initialData?: Partial<PostFormData>;
  isEdit?: boolean;
  error?: string;
  apiUrl: string; // base URL da API, ex: "https://api.example.com"
  onSubmit: (formData: FormData, status: "DRAFT" | "PUBLISHED") => void;
};

// ─── constantes ───────────────────────────────────────────────────────────────

const EMPTY: PostFormData = {
  title: "",
  excerpt: "",
  categoryId: "",
  tagIds: [],
  content: "",
  coverImage: "",
  coverImagePublicId: undefined,
  status: "DRAFT",
  links: [],
};

type LinkTypeMeta = {
  value: NonNullable<PostLink["type"]>;
  label: string;
  icon: React.ReactNode;
};

const LINK_TYPES: LinkTypeMeta[] = [
  { value: "github", label: "GitHub", icon: <SiGithub className="size-3.5" /> },
  { value: "docs", label: "Docs", icon: <FileText className="size-3.5" /> },
  { value: "video", label: "Vídeo", icon: <FaYoutube className="size-3.5" /> },
  { value: "book", label: "Livro", icon: <BookOpen className="size-3.5" /> },
  { value: "other", label: "Outro", icon: <LinkIcon className="size-3.5" /> },
];

// ─── image extension ──────────────────────────────────────────────────────────

const ImageWithId = ResizeImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      "data-public-id": {
        default: null,
        parseHTML: (el) => el.getAttribute("data-public-id"),
        renderHTML: (attrs) => {
          if (!attrs["data-public-id"]) return {};
          return { "data-public-id": attrs["data-public-id"] };
        },
      },
    };
  },
});

// ─── toolbar ──────────────────────────────────────────────────────────────────

type ToolbarProps = {
  editor: ReturnType<typeof useEditor> | null;
  onImageUpload: (file: File) => Promise<void>;
};

function EditorToolbar({ editor, onImageUpload }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  function setLink() {
    const url = window.prompt("URL do link:");
    if (!url) return;
    editor?.chain().focus().setLink({ href: url }).run();
  }

  const btn = (
    active: boolean,
    onClick: () => void,
    icon: React.ReactNode,
    title: string,
  ) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${active
          ? "bg-violet-500/20 text-violet-400"
          : "text-zinc-500 hover:text-violet-400 hover:bg-zinc-800"
        }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex items-center gap-0.5 flex-wrap px-2 py-1.5 bg-zinc-900 border-b border-zinc-700 rounded-t-lg">
      {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <Bold className="size-3.5" />, "Negrito")}
      {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <Italic className="size-3.5" />, "Itálico")}
      {btn(editor.isActive("code"), () => editor.chain().focus().toggleCode().run(), <Code className="size-3.5" />, "Código inline")}
      <div className="w-px h-4 bg-zinc-700 mx-1" />
      {btn(editor.isActive("heading", { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 className="size-3.5" />, "Título H1")}
      {btn(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="size-3.5" />, "Título H2")}
      {btn(editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 className="size-3.5" />, "Título H3")}
      <div className="w-px h-4 bg-zinc-700 mx-1" />
      {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), <List className="size-3.5" />, "Lista")}
      {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="size-3.5" />, "Lista numerada")}
      {btn(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), <Quote className="size-3.5" />, "Citação")}
      {btn(editor.isActive("codeBlock"), () => editor.chain().focus().toggleCodeBlock().run(), <Code2 className="size-3.5" />, "Bloco de código")}
      {btn(false, () => editor.chain().focus().setHorizontalRule().run(), <Minus className="size-3.5" />, "Divisor")}
      {btn(editor.isActive("link"), setLink, <Link2 className="size-3.5" />, "Link")}
      <div className="w-px h-4 bg-zinc-700 mx-1" />
      {btn(false, () => editor.chain().focus().undo().run(), <Undo className="size-3.5" />, "Desfazer")}
      {btn(false, () => editor.chain().focus().redo().run(), <Redo className="size-3.5" />, "Refazer")}
      <div className="w-px h-4 bg-zinc-700 mx-1" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file)
            onImageUpload(file).finally(() => {
              if (fileInputRef.current) fileInputRef.current.value = "";
            });
        }}
      />
      {btn(false, () => fileInputRef.current?.click(), <ImageIcon className="size-3.5" />, "Inserir imagem")}
    </div>
  );
}

// ─── cover image ──────────────────────────────────────────────────────────────

type CoverImageMode = "upload" | "url";

type CoverImageProps = {
  value: string;
  onChange: (data: { url: string; publicId?: string }) => void;
};

function CoverImageInput({ value, onChange }: CoverImageProps) {
  const [mode, setMode] = useState<CoverImageMode>("upload");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleRemove() {
    onChange({ url: "", publicId: undefined });
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 p-1 bg-zinc-800/60 rounded-lg w-fit border border-zinc-700/50">
        <button
          type="button"
          onClick={() => { setMode("upload"); setUploadError(null); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${mode === "upload" ? "bg-zinc-700 text-zinc-100 shadow" : "text-zinc-500 hover:text-zinc-300"
            }`}
        >
          <Upload className="size-3" /> Upload
        </button>
        <button
          type="button"
          onClick={() => { setMode("url"); setUploadError(null); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${mode === "url" ? "bg-zinc-700 text-zinc-100 shadow" : "text-zinc-500 hover:text-zinc-300"
            }`}
        >
          <LinkIcon className="size-3" /> URL direta
        </button>
      </div>

      {value ? (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Capa do post" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              title="Remover imagem"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
            >
              <Trash2 className="size-3.5" /> Remover imagem
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          {mode === "url" ? (
            <Input
              placeholder="Cole a URL da imagem..."
              value={value}
              onChange={(e) => onChange({ url: e.target.value, publicId: undefined })}
              className="bg-zinc-900 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-9 text-sm"
            />
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-9 flex items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-all ${uploading
                    ? "border-zinc-700 bg-zinc-900 text-zinc-500 cursor-not-allowed"
                    : uploadError
                      ? "border-rose-600/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-violet-600/60 hover:text-violet-400 hover:bg-violet-500/10"
                  }`}
              >
                {uploading ? (
                  <><Loader2 className="size-3.5 animate-spin" />Enviando... (máx. 5MB)</>
                ) : uploadError ? (
                  <><AlertCircle className="size-3.5" />Erro — clique para tentar novamente</>
                ) : (
                  <><Upload className="size-3.5" />Selecionar arquivo (máx. 5MB)</>
                )}
              </button>
              {uploadError && (
                <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="size-3 shrink-0" />
                  {uploadError}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── post links ───────────────────────────────────────────────────────────────

type PostLinksProps = {
  links: PostLink[];
  onChange: (links: PostLink[]) => void;
};

function LinkTypeDropdown({
  value,
  onChange,
}: {
  value: NonNullable<PostLink["type"]>;
  onChange: (v: NonNullable<PostLink["type"]>) => void;
}) {
  const [open, setOpen] = useState(false);
  const active = LINK_TYPES.find((t) => t.value === value) ?? LINK_TYPES[4];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`h-8 flex items-center gap-1.5 px-2.5 rounded-md border text-xs font-medium transition-colors whitespace-nowrap ${open
            ? "border-violet-600 bg-zinc-800 text-zinc-200"
            : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
          }`}
      >
        {active.icon}
        <span>{active.label}</span>
        <ChevronDown className={`size-3 text-zinc-500 transition-transform ml-0.5 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-40 top-full mt-1 right-0 min-w-30 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
          {LINK_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => { onChange(t.value); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-zinc-800 transition-colors ${value === t.value ? "text-violet-400 bg-zinc-800/60" : "text-zinc-400"
                }`}
            >
              {t.icon}
              {t.label}
              {value === t.value && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PostLinksInput({ links, onChange }: PostLinksProps) {
  function addLink() {
    onChange([...links, { label: "", url: "", type: "other" }]);
  }

  function removeLink(index: number) {
    onChange(links.filter((_, i) => i !== index));
  }

  function updateLink(index: number, patch: Partial<PostLink>) {
    onChange(links.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  }

  return (
    <div className="space-y-3">
      {links.length > 0 && (
        <div className="space-y-2">
          {links.map((link, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center p-3 rounded-lg border border-zinc-700 bg-zinc-900/60"
            >
              <Input
                placeholder="Rótulo (ex: Repositório)"
                value={link.label}
                onChange={(e) => updateLink(i, { label: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-8 text-xs"
              />
              <Input
                placeholder="https://..."
                value={link.url}
                onChange={(e) => updateLink(i, { url: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-8 text-xs"
              />
              <LinkTypeDropdown
                value={link.type ?? "other"}
                onChange={(v) => updateLink(i, { type: v })}
              />
              <button
                type="button"
                onClick={() => removeLink(i)}
                title="Remover link"
                className="p-1.5 rounded-md text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addLink}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-zinc-700 text-xs font-medium text-zinc-500 hover:text-violet-400 hover:border-violet-600/60 hover:bg-violet-500/10 transition-all w-full justify-center"
      >
        <Plus className="size-3.5" />
        Adicionar link
      </button>
    </div>
  );
}

// ─── AI draft modal ───────────────────────────────────────────────────────────

type AiDraftState = "idle" | "loading" | "success" | "error";

type AiDraftModalProps = {
  apiUrl: string;
  categories: ApiCategory[];
  onApply: (data: Pick<PostFormData, "title" | "excerpt" | "content" | "categoryId">) => void;
  onClose: () => void;
};

function AiDraftModal({ apiUrl, categories, onApply, onClose }: AiDraftModalProps) {
  const [rawInput, setRawInput] = useState("");
  const [state, setState] = useState<AiDraftState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    titulo: string;
    resumo: string;
    conteudo: string;
    categoria: string;
  } | null>(null);

  /** Extrai URLs válidas de um texto livre (uma por linha ou separadas por espaço) */
  function parseUrls(input: string): string[] {
    return input
      .split(/[\n\s,]+/)
      .map((s) => s.trim())
      .filter((s) => {
        try { new URL(s); return true; }
        catch { return false; }
      });
  }

  /** Tenta encontrar a categoria pelo nome retornado pela API */
  function matchCategory(name: string): string {
    if (!name) return "";
    const lower = name.toLowerCase();
    return (
      categories.find((c) => c.name.toLowerCase() === lower)?.id ??
      categories.find((c) => lower.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(lower))?.id ??
      ""
    );
  }

  async function handleGenerate() {
    const urls = parseUrls(rawInput);
    if (urls.length === 0) {
      setErrorMsg("Cole pelo menos uma URL válida.");
      return;
    }

    setState("loading");
    setErrorMsg(null);
    setPreview(null);

    try {
      const res = await fetch(`${apiUrl}/reescrever`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Erro ${res.status}`);
      }

      const data = await res.json();
      // Normaliza campos aceitos da API
      setPreview({
        titulo: data.titulo ?? data.title ?? "",
        resumo: data.resumo ?? data.excerpt ?? data.summary ?? "",
        conteudo: data.conteudo ?? data.content ?? "",
        categoria: data.categoria ?? data.category ?? "",
      });
      setState("success");
    } catch (err: any) {
      setErrorMsg(err.message ?? "Erro desconhecido ao contatar a API.");
      setState("error");
    }
  }

  function handleApply() {
    if (!preview) return;
    onApply({
      title: preview.titulo,
      excerpt: preview.resumo,
      content: preview.conteudo,
      categoryId: matchCategory(preview.categoria),
    });
    onClose();
  }

  const urls = parseUrls(rawInput);
  const urlCount = urls.length;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-8 rounded-lg bg-violet-500/15 border border-violet-500/25">
              <Sparkles className="size-4 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-100">Synapse IA</p>
              <p className="text-[11px] text-zinc-500">Gera rascunho a partir de URLs</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* URL input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              URLs de referência
            </label>
            <textarea
              placeholder={"Cole as URLs aqui, uma por linha:\nhttps://exemplo.com/artigo-1\nhttps://exemplo.com/artigo-2"}
              value={rawInput}
              onChange={(e) => { setRawInput(e.target.value); setErrorMsg(null); }}
              rows={5}
              disabled={state === "loading"}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 resize-none transition-colors font-mono disabled:opacity-50"
            />
            <div className="flex items-center justify-between mt-1.5">
              {errorMsg ? (
                <p className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="size-3 shrink-0" />{errorMsg}
                </p>
              ) : (
                <p className="text-[11px] text-zinc-600">
                  {urlCount > 0 ? `${urlCount} URL${urlCount > 1 ? "s" : ""} detectada${urlCount > 1 ? "s" : ""}` : "Nenhuma URL detectada ainda"}
                </p>
              )}
            </div>
          </div>

          {/* Preview do resultado */}
          {preview && state === "success" && (
            <div className="rounded-xl border border-emerald-600/30 bg-emerald-500/5 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                <CheckCircle2 className="size-3.5" /> Conteúdo gerado
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">Título</p>
                  <p className="text-sm font-semibold text-zinc-200 leading-snug">{preview.titulo || <span className="text-zinc-600 italic">—</span>}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">Resumo</p>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{preview.resumo || <span className="text-zinc-600 italic">—</span>}</p>
                </div>
                {preview.categoria && (
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">Categoria sugerida</p>
                    <p className="text-xs text-zinc-400">
                      {preview.categoria}
                      {matchCategory(preview.categoria)
                        ? <span className="ml-1.5 text-emerald-400">(encontrada)</span>
                        : <span className="ml-1.5 text-amber-400">(não mapeada — campo ficará em branco)</span>
                      }
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">Conteúdo</p>
                  <p className="text-xs text-zinc-500 italic">
                    {preview.conteudo
                      ? `${preview.conteudo.replace(/<[^>]+>/g, "").slice(0, 120)}…`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {state === "loading" && (
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/60 p-4 space-y-3 animate-pulse">
              <div className="h-3 w-1/3 bg-zinc-700 rounded" />
              <div className="h-4 w-3/4 bg-zinc-800 rounded" />
              <div className="h-3 w-full bg-zinc-800 rounded" />
              <div className="h-3 w-5/6 bg-zinc-800 rounded" />
              <p className="text-xs text-zinc-500 flex items-center gap-1.5 pt-1">
                <Loader2 className="size-3.5 animate-spin" /> A IA está processando as URLs…
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-2">
            {state === "success" && (
              <Button
                type="button"
                onClick={handleGenerate}
                variant="outline"
                className="gap-1.5 text-xs h-8 border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <Sparkles className="size-3" /> Regenerar
              </Button>
            )}

            {state !== "success" ? (
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={state === "loading" || urlCount === 0}
                className="gap-1.5 text-xs h-8 bg-violet-600 hover:bg-violet-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state === "loading" ? (
                  <><Loader2 className="size-3 animate-spin" /> Gerando…</>
                ) : (
                  <><Globe className="size-3" /> Gerar rascunho</>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleApply}
                className="gap-1.5 text-xs h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
              >
                <CheckCircle2 className="size-3" /> Aplicar ao formulário
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── componente principal ─────────────────────────────────────────────────────

export default function PostForm({
  categories,
  tags,
  initialData = {},
  isEdit = false,
  error,
  apiUrl,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<PostFormData>({ ...EMPTY, ...initialData });
  const [preview, setPreview] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PostFormData, string>>>({});
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const lowlight = createLowlight();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder: "Escreva o conteúdo do post aqui..." }),
      Link.configure({ openOnClick: false }),
      CodeBlockLowlight.configure({ lowlight }),
      ImageWithId,
    ],
    content: form.content || "",
    editorProps: {
      attributes: {
        class: "min-h-[380px] px-4 py-3 text-sm text-zinc-300 leading-7 focus:outline-none prose prose-invert prose-sm max-w-none",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setForm((f) => ({ ...f, content: html }));
      setErrors((e) => ({ ...e, content: undefined }));
    },
  });

  const set = <K extends keyof PostFormData>(key: K, value: PostFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const activeCat = categories.find((c) => c.id === form.categoryId);

  function toggleTag(id: string) {
    set(
      "tagIds",
      form.tagIds.includes(id)
        ? form.tagIds.filter((t) => t !== id)
        : [...form.tagIds, id],
    );
  }

  async function handleContentImageUpload(file: File) {
    const fd = new FormData();
    fd.append("image", file);
    const data = await uploadPostImage(fd);
    (editor?.chain().focus() as any)
      .setImage({ src: data.imageUrl, "data-public-id": data.publicId })
      .run();
  }

  /** Aplica dados gerados pela IA ao formulário e ao editor */
  function handleAiApply(data: Pick<PostFormData, "title" | "excerpt" | "content" | "categoryId">) {
    setForm((f) => ({
      ...f,
      title: data.title || f.title,
      excerpt: data.excerpt || f.excerpt,
      content: data.content || f.content,
      categoryId: data.categoryId || f.categoryId,
    }));
    setErrors({});
    // Atualiza o editor TipTap com o conteúdo HTML gerado
    if (data.content && editor) {
      editor.commands.setContent(data.content);
    }
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Título obrigatório";
    if (!form.excerpt.trim()) e.excerpt = "Resumo obrigatório";
    if (!form.categoryId) e.categoryId = "Escolha uma categoria";
    const textContent = editor?.getText().trim() ?? "";
    if (!textContent) e.content = "Conteúdo não pode estar vazio";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const wordCount = editor?.getText().trim().split(/\s+/).filter(Boolean).length ?? 0;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

  function handleSubmit(status: "DRAFT" | "PUBLISHED") {
    if (!validate()) return;
    const fd = new FormData();
    fd.set("title", form.title);
    fd.set("excerpt", form.excerpt);
    fd.set("content", form.content);
    fd.set("categoryId", form.categoryId);
    fd.set("coverImage", form.coverImage);
    if (form.coverImagePublicId) fd.set("coverImagePublicId", form.coverImagePublicId);
    fd.set("readTime", readTime);
    fd.set("status", status);
    form.tagIds.forEach((id) => fd.append("tagIds", id));
    if (form.links.length > 0) {
      fd.set("links", JSON.stringify(form.links));
    }
    onSubmit(fd, status);
  }

  // ─── preview ───────────────────────────────────────────────────────────────

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

        {form.coverImage && (
          <div className="w-full h-52 sm:h-72 rounded-xl overflow-hidden mb-6 bg-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.coverImage} alt="cover" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {activeCat && (
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: activeCat.color }}>
              {activeCat.name}
            </span>
          )}
          {form.tagIds.map((id) => {
            const tag = tags.find((t) => t.id === id);
            return tag ? (
              <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border bg-violet-500/20 text-violet-300 border-violet-500/30">
                {tag.name}
              </span>
            ) : null;
          })}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
          {form.title || <span className="text-zinc-700">Sem título</span>}
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          {form.excerpt || <span className="text-zinc-700">Sem resumo</span>}
        </p>

        {form.links.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {form.links.map((link, i) =>
              link.label && link.url ? (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-medium text-zinc-300 hover:text-violet-400 hover:border-violet-600/50 transition-colors"
                >
                  <ExternalLink className="size-3" />
                  {link.label}
                  {link.type && link.type !== "other" && (
                    <span className="text-[10px] text-zinc-600 uppercase">{link.type}</span>
                  )}
                </a>
              ) : null,
            )}
          </div>
        )}

        <div
          className="prose prose-invert prose-sm max-w-none border-t border-zinc-800 pt-6"
          dangerouslySetInnerHTML={{ __html: form.content || "<p class='text-zinc-700'>Sem conteúdo ainda.</p>" }}
        />
      </div>
    );
  }

  // ─── form ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Modal Synapse IA */}
      {aiModalOpen && (
        <AiDraftModal
          apiUrl={apiUrl}
          categories={categories}
          onApply={handleAiApply}
          onClose={() => setAiModalOpen(false)}
        />
      )}

      <div className="min-w-0 space-y-7">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {decodeURIComponent(error)}
          </div>
        )}

        {/* Banner Synapse IA */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-violet-500/20 bg-violet-500/5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-7 rounded-md bg-violet-500/15 border border-violet-500/25 shrink-0">
              <Sparkles className="size-3.5 text-violet-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-violet-300">Synapse IA</p>
              <p className="text-[11px] text-zinc-500">Cole URLs de referência e gere um rascunho automaticamente</p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="shrink-0 gap-1.5 text-xs h-8 bg-violet-600 hover:bg-violet-500 text-white font-semibold"
          >
            <Sparkles className="size-3" /> Gerar com IA
          </Button>
        </div>

        {/* título */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Título <span className="text-rose-500">*</span>
          </label>
          <Input
            placeholder="Digite o título do post..."
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className={`bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-600 text-lg font-bold h-12 ${errors.title ? "border-rose-600" : ""}`}
          />
          {errors.title && <p className="text-xs text-rose-400 mt-1.5">{errors.title}</p>}
        </div>

        {/* resumo */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Resumo / Excerpt <span className="text-rose-500">*</span>
          </label>
          <textarea
            placeholder="Uma frase que resume o post."
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={2}
            className={`w-full bg-zinc-900 border rounded-lg px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 resize-none transition-colors ${errors.excerpt ? "border-rose-600" : "border-zinc-700"
              }`}
          />
          {errors.excerpt && <p className="text-xs text-rose-400 mt-1.5">{errors.excerpt}</p>}
        </div>

        {/* categoria + tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Categoria <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setCatOpen((o) => !o)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border bg-zinc-900 text-sm transition-colors ${errors.categoryId
                    ? "border-rose-600"
                    : catOpen
                      ? "border-violet-600"
                      : "border-zinc-700 hover:border-zinc-600"
                  }`}
              >
                {activeCat ? (
                  <span className="flex items-center gap-2">
                    <TagIcon className="size-3.5" style={{ color: activeCat.color }} />
                    <span className="text-zinc-200">{activeCat.name}</span>
                  </span>
                ) : (
                  <span className="text-zinc-600">Selecionar...</span>
                )}
                <ChevronDown className={`size-3.5 text-zinc-500 transition-transform ${catOpen ? "rotate-180" : ""}`} />
              </button>

              {catOpen && (
                <div className="absolute z-30 top-full mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => { set("categoryId", cat.id); setCatOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-zinc-800 transition-colors ${form.categoryId === cat.id ? "bg-zinc-800" : ""
                        }`}
                    >
                      <TagIcon className="size-3.5" style={{ color: cat.color }} />
                      <span className="text-zinc-300">{cat.name}</span>
                      {form.categoryId === cat.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.categoryId && <p className="text-xs text-rose-400 mt-1.5">{errors.categoryId}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              <TagIcon className="size-3 inline mr-1" />Tags
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {tags.map((tag) => {
                const active = form.tagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${active
                        ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                        : "bg-zinc-900 text-zinc-600 border-zinc-800 hover:border-zinc-600 hover:text-zinc-400"
                      }`}
                  >
                    {active && <Flame className="size-2.5 inline mr-1" />}
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* imagem de capa */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Imagem de capa
          </label>
          <CoverImageInput
            value={form.coverImage}
            onChange={({ url, publicId }) => {
              set("coverImage", url);
              set("coverImagePublicId", publicId);
            }}
          />
        </div>

        {/* links */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            <ExternalLink className="size-3 inline mr-1" />Links relacionados
          </label>
          <PostLinksInput links={form.links} onChange={(links) => set("links", links)} />
        </div>

        {/* editor tiptap */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Conteúdo <span className="text-rose-500">*</span>
            </label>
          </div>

          <div className={`rounded-lg border ${errors.content ? "border-rose-600" : "border-zinc-700"}`}>
            <EditorToolbar editor={editor} onImageUpload={handleContentImageUpload} />
            <div className="bg-zinc-900 rounded-b-lg overflow-y-auto max-h-150">
              <EditorContent editor={editor} />
            </div>
          </div>

          {errors.content && <p className="text-xs text-rose-400 mt-1.5">{errors.content}</p>}
          <p className="text-[11px] text-zinc-700 mt-1.5">
            {wordCount} palavras · ~{readTime} de leitura
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
            <Eye className="size-4" /> Pré-visualizar
          </Button>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmit("DRAFT")}
              className="gap-2 text-sm bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Save className="size-4" />
              {isEdit ? "Salvar rascunho" : "Salvar como rascunho"}
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit("PUBLISHED")}
              className="gap-2 text-sm bg-violet-600 hover:bg-violet-500 text-white font-semibold"
            >
              <Send className="size-4" />
              {isEdit ? "Atualizar post" : "Publicar agora"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}