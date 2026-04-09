"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Save, Send, Search } from "lucide-react";
import type { LucideProps } from "lucide-react";
import * as LucideIcons from "lucide-react";

export type CategoryFormData = {
  name: string;
  color: string;
  icon: string;
};

type Props = {
  initialData?: Partial<CategoryFormData>;
  isEdit?: boolean;
  error?: string;
  onSubmit: (formData: FormData) => void;
};

const PRESET_COLORS = [
  "#7c3aed", "#3b82f6", "#10b981", "#f59e0b",
  "#ef4444", "#06b6d4", "#8b5cf6", "#f97316",
  "#ec4899", "#14b8a6", "#a3e635", "#6366f1",
];

const ICON_NAMES = [
  "Tag", "Folder", "Star", "Heart", "Bookmark", "Flag", "Zap", "Globe",
  "Code", "Terminal", "Cpu", "Database", "Server", "Cloud", "Shield",
  "Lock", "Key", "Bell", "Mail", "MessageCircle", "Users", "User",
  "Settings", "Wrench", "Hammer", "Paintbrush", "Pen", "FileText",
  "Image", "Video", "Music", "Headphones", "Camera", "Mic", "Radio",
  "Tv", "Monitor", "Smartphone", "Tablet", "Laptop", "Printer",
  "Package", "Box", "Archive", "Trash", "Download", "Upload",
  "Link", "ExternalLink", "Share", "Copy", "Clipboard", "Search",
  "Home", "Building", "Map", "Navigation", "Compass", "Car",
  "Plane", "Rocket", "Briefcase", "ShoppingCart", "Gift", "Trophy",
  "Award", "Medal", "Crown", "Smile", "Sun", "Moon", "Flame",
  "Leaf", "Tree", "Flower", "Bug", "Bot", "Wand",
];

const EMPTY: CategoryFormData = {
  name: "",
  color: "#7c3aed",
  icon: "Tag",
};

function DynamicIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>)[name];
  if (!Icon) return <Tag className={className} style={style} />;
  return <Icon className={className} style={style} />;
}

export default function CategoryForm({ initialData = {}, isEdit = false, error, onSubmit }: Props) {
  const [form, setForm] = useState<CategoryFormData>({ ...EMPTY, ...initialData });
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});
  const [iconSearch, setIconSearch] = useState("");

  const set = <K extends keyof CategoryFormData>(key: K, value: CategoryFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Nome obrigatório";
    if (!form.color) e.color = "Escolha uma cor";
    if (!form.icon) e.icon = "Escolha um ícone";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const fd = new FormData();
    fd.set("name", form.name);
    fd.set("color", form.color);
    fd.set("icon", form.icon);
    onSubmit(fd);
  }

  const slugPreview = form.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const filteredIcons = ICON_NAMES.filter((n) =>
    n.toLowerCase().includes(iconSearch.toLowerCase())
  );

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
          placeholder="Ex: Frontend"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className={`bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-11 text-base font-semibold ${errors.name ? "border-rose-600" : ""}`}
        />
        {errors.name && <p className="text-xs text-rose-400 mt-1.5">{errors.name}</p>}
        {slugPreview && (
          <p className="text-[11px] text-zinc-600 mt-1.5">
            Slug gerado: <span className="text-zinc-400 font-mono">{slugPreview}</span>
          </p>
        )}
      </div>

      {/* ícone */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
          Ícone <span className="text-rose-500">*</span>
        </label>

        {/* busca */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500 pointer-events-none" />
          <Input
            placeholder="Buscar ícone..."
            value={iconSearch}
            onChange={(e) => setIconSearch(e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-violet-600 h-9 pl-8 text-sm"
          />
        </div>

        {/* grid de ícones */}
        <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {filteredIcons.map((iconName) => (
            <button
              key={iconName}
              type="button"
              title={iconName}
              onClick={() => set("icon", iconName)}
              className={`flex items-center justify-center w-full aspect-square rounded-lg border transition-all hover:scale-110 ${
                form.icon === iconName
                  ? "border-white/30 scale-110"
                  : "border-transparent hover:border-zinc-600"
              }`}
              style={{
                backgroundColor: form.icon === iconName ? `${form.color}30` : "transparent",
                color: form.icon === iconName ? form.color : "#71717a",
                boxShadow: form.icon === iconName ? `0 0 0 1px ${form.color}60` : "none",
              }}
            >
              <DynamicIcon name={iconName} className="size-4" />
            </button>
          ))}
          {filteredIcons.length === 0 && (
            <p className="col-span-8 text-xs text-zinc-600 text-center py-4">
              Nenhum ícone encontrado
            </p>
          )}
        </div>

        {errors.icon && <p className="text-xs text-rose-400 mt-1.5">{errors.icon}</p>}

        {/* ícone selecionado */}
        {form.icon && (
          <p className="text-[11px] text-zinc-600 mt-2">
            Selecionado:{" "}
            <span className="text-zinc-400 font-mono">{form.icon}</span>
          </p>
        )}
      </div>

      {/* cor */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
          Cor <span className="text-rose-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => set("color", color)}
              className="w-8 h-8 rounded-lg border-2 transition-all hover:scale-110"
              style={{
                backgroundColor: color,
                borderColor: form.color === color ? "white" : "transparent",
                boxShadow: form.color === color ? `0 0 0 1px ${color}` : "none",
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg border border-zinc-700 shrink-0"
            style={{ backgroundColor: form.color }}
          />
          <Input
            type="text"
            placeholder="#7c3aed"
            value={form.color}
            onChange={(e) => set("color", e.target.value)}
            className={`bg-zinc-900 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-violet-600 font-mono h-10 ${errors.color ? "border-rose-600" : ""}`}
          />
          <input
            type="color"
            value={form.color}
            onChange={(e) => set("color", e.target.value)}
            className="w-10 h-10 rounded-lg border border-zinc-700 bg-zinc-900 cursor-pointer p-0.5"
          />
        </div>
        {errors.color && <p className="text-xs text-rose-400 mt-1.5">{errors.color}</p>}
      </div>

      {/* preview */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
          Preview
        </label>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border backdrop-blur-sm"
            style={{
              color: form.color,
              borderColor: `${form.color}60`,
              backgroundColor: `${form.color}25`,
              boxShadow: `0 2px 12px ${form.color}20`,
            }}
          >
            <DynamicIcon name={form.icon} className="size-3.5" />
            {form.name || "Nome da categoria"}
          </span>
        </div>
      </div>

      {/* ação */}
      <div className="pt-2 border-t border-zinc-800">
        <Button
          type="button"
          onClick={handleSubmit}
          className="gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold"
        >
          {isEdit ? <Save className="size-4" /> : <Send className="size-4" />}
          {isEdit ? "Salvar alterações" : "Criar categoria"}
        </Button>
      </div>
    </div>
  );
}