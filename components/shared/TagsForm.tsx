"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Save, Send } from "lucide-react";

export type TagFormData = {
  name: string;
};

type Props = {
  initialData?: Partial<TagFormData>;
  isEdit?: boolean;
  error?: string;
  onSubmit: (formData: FormData) => void;
};

const EMPTY: TagFormData = { name: "" };

export default function TagForm({ initialData = {}, isEdit = false, error, onSubmit }: Props) {
  const [form, setForm] = useState<TagFormData>({ ...EMPTY, ...initialData });
  const [errors, setErrors] = useState<Partial<Record<keyof TagFormData, string>>>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Nome obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const fd = new FormData();
    fd.set("name", form.name);
    onSubmit(fd);
  }

  const slugPreview = form.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return (
    <div className="space-y-7 max-w-lg">

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {decodeURIComponent(error)}
        </div>
      )}

      {/* nome */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
          Nome <span className="text-rose-500">*</span>
        </label>
        <Input
          placeholder="Ex: NestJS"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
          className={`bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-11 text-base font-semibold ${errors.name ? "border-rose-600" : ""}`}
        />
        {errors.name && <p className="text-xs text-rose-400 mt-1.5">{errors.name}</p>}
        {slugPreview && (
          <p className="text-[11px] text-zinc-600 mt-1.5">
            Slug gerado: <span className="text-zinc-400 font-mono">{slugPreview}</span>
          </p>
        )}
      </div>

      {/* preview */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
          Preview
        </label>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border bg-violet-500/20 text-violet-300 border-violet-500/30">
          <Tag className="size-3.5" />
          {form.name || "Nome da tag"}
        </span>
      </div>

      {/* ação */}
      <div className="pt-2 border-t border-zinc-800">
        <Button
          type="button"
          onClick={handleSubmit}
          className="gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold"
        >
          {isEdit ? <Save className="size-4" /> : <Send className="size-4" />}
          {isEdit ? "Salvar alterações" : "Criar tag"}
        </Button>
      </div>
    </div>
  );
}