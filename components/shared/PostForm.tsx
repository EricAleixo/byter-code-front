"use client";

import { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import ResizeImage from "tiptap-extension-resize-image"; import { createLowlight } from "lowlight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye, Save, Send, X, Flame, Tag as TagIcon, ChevronDown,
  Heading2, Heading3, Bold, Italic, Code, Link2, List,
  ListOrdered, Quote, Minus, Code2, Undo, Redo, Heading1,
  Upload, Link as LinkIcon, Loader2, Trash2, AlertCircle, ImageIcon,
} from "lucide-react";
import { uploadPostImage } from "@/src/app/(admin)/admin/posts/_actions/upload-image.actions";

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
};

type Props = {
  categories: ApiCategory[];
  tags: ApiTag[];
  initialData?: Partial<PostFormData>;
  isEdit?: boolean;
  error?: string;
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
};

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
          if (file) onImageUpload(file).finally(() => {
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
          <Upload className="size-3" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => { setMode("url"); setUploadError(null); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${mode === "url" ? "bg-zinc-700 text-zinc-100 shadow" : "text-zinc-500 hover:text-zinc-300"
            }`}
        >
          <LinkIcon className="size-3" />
          URL direta
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
              <Trash2 className="size-3.5" />
              Remover imagem
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

// ─── componente principal ─────────────────────────────────────────────────────

export default function PostForm({
  categories,
  tags,
  initialData = {},
  isEdit = false,
  error,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<PostFormData>({ ...EMPTY, ...initialData });
  const [preview, setPreview] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PostFormData, string>>>({});

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
      .setImage({
        src: data.imageUrl,
        "data-public-id": data.publicId,
      })
      .run();
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

        <div
          className="prose prose-invert prose-sm max-w-none border-t border-zinc-800 pt-6"
          dangerouslySetInnerHTML={{ __html: form.content || "<p class='text-zinc-700'>Sem conteúdo ainda.</p>" }}
        />
      </div>
    );
  }

  // ─── form ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-w-0 space-y-7">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {decodeURIComponent(error)}
        </div>
      )}

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
          className={`w-full bg-zinc-900 border rounded-lg px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 resize-none transition-colors ${errors.excerpt ? "border-rose-600" : "border-zinc-700"}`}
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
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border bg-zinc-900 text-sm transition-colors ${errors.categoryId ? "border-rose-600" : catOpen ? "border-violet-600" : "border-zinc-700 hover:border-zinc-600"
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
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-zinc-800 transition-colors ${form.categoryId === cat.id ? "bg-zinc-800" : ""}`}
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
  );
}