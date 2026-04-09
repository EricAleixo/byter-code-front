"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import {
  ArrowLeft,
  Camera,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  User,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateProfileAction } from "../_actions/update-profile.actions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserData {
  name: string;
  email: string;
  avatarUrl?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getCroppedImg(imageSrc: string, croppedArea: Area): Promise<Blob> {
  const response = await fetch(imageSrc);
  const blob = await response.blob();
  const img = await createImageBitmap(blob);

  const canvas = document.createElement("canvas");
  canvas.width = croppedArea.width;
  canvas.height = croppedArea.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
    croppedArea.x, croppedArea.y,
    croppedArea.width, croppedArea.height,
    0, 0,
    croppedArea.width, croppedArea.height,
  );

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas vazio"))),
      "image/webp",
      0.9,
    ),
  );
}

// ─── Avatar Cropper ───────────────────────────────────────────────────────────

function AvatarCropper({
  initialUrl,
  name,
  onChange,
}: {
  initialUrl?: string;
  name: string;
  onChange: (blob: Blob | null) => void;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const confirmCrop = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
    const url = URL.createObjectURL(blob);
    setPreview(url);
    setImageSrc(null);
    onChange(blob);
  }, [imageSrc, croppedAreaPixels, onChange]);

  const cancelCrop = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {imageSrc ? (
        /* ── Cropper ── */
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="relative w-64 h-64 rounded-2xl overflow-hidden border border-zinc-700">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* zoom */}
          <div className="flex items-center gap-3 w-full max-w-xs">
            <span className="text-xs text-zinc-600">−</span>
            <input
              type="range" min={1} max={3} step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-violet-500 cursor-pointer"
            />
            <span className="text-xs text-zinc-600">+</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={cancelCrop}
              className="px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-600 transition-all"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmCrop}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all"
            >
              Confirmar recorte
            </button>
          </div>
        </div>
      ) : (
        /* ── Preview ── */
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-violet-500/40 shadow-2xl shadow-violet-900/40">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #5b21b6, #7c3aed)" }}
              >
                <span className="text-5xl font-black text-white select-none">
                  {name?.[0]?.toUpperCase() ?? "?"}
                </span>
              </div>
            )}
          </div>

          <label className="absolute bottom-0 right-0 p-2.5 rounded-full bg-violet-600 hover:bg-violet-500 border border-violet-400/30 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer">
            <Camera className="size-4 text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        </div>
      )}

      {!imageSrc && (
        <p className="text-[11px] text-zinc-600">Clique no ícone para trocar a foto</p>
      )}
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label, id, type = "text", value, onChange, placeholder, hint, readOnly,
}: {
  label: string; id: string; type?: string;
  value: string; onChange?: (v: string) => void;
  placeholder?: string; hint?: string; readOnly?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full border rounded-xl px-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none transition-all ${readOnly
              ? "bg-zinc-800/30 border-zinc-700/30 text-zinc-500 cursor-default select-none"
              : "bg-zinc-800/60 border-zinc-700/60 text-zinc-100 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
            } ${isPassword ? "pr-10" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {hint && <p className="text-[11px] text-zinc-600">{hint}</p>}
    </div>
  );
}

// ─── Password strength ────────────────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  if (!password.length) return null;
  const strength = Math.min(4, Math.floor(password.length / 3));
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];
  const labels = ["", "Senha fraca", "Senha razoável", "Senha boa", "Senha forte"];
  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength - 1] : "bg-zinc-700"
              }`}
          />
        ))}
      </div>
      <p className="text-[11px] text-zinc-600">{labels[strength]}</p>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2.5">
        <div className="text-violet-400">{icon}</div>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ type, message }: { type: "success" | "error"; message: string }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-4 duration-300 ${type === "success"
        ? "bg-emerald-950 border-emerald-700/50 text-emerald-300"
        : "bg-red-950 border-red-700/50 text-red-300"
      }`}>
      {type === "success"
        ? <CheckCircle2 className="size-4 shrink-0" />
        : <AlertCircle className="size-4 shrink-0" />}
      {message}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditProfilePage({ user }: { user: UserData }) {
  const [name, setName] = useState(user.name);
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    if (newPwd && newPwd !== confirmPwd) {
      showToast("error", "As senhas não coincidem.");
      return;
    }
    if (newPwd && newPwd.length < 8) {
      showToast("error", "A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (newPwd && !currentPwd) {
      showToast("error", "Informe a senha atual para alterá-la.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);

      if (avatarBlob) {
        formData.append("avatar", avatarBlob, "avatar.webp");
      }

      if (newPwd) {
        formData.append("currentPassword", currentPwd);
        formData.append("newPassword", newPwd);
      }

      await updateProfileAction(formData);

      showToast("success", "Perfil atualizado com sucesso!");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setAvatarBlob(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao salvar. Tente novamente.";
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  // loading state
  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <span className="size-8 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* banner */}
      <div className="relative h-36 sm:h-48 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 50%, #0f172a 100%)" }}
        />
        <div className="absolute -top-10 left-20 w-72 h-72 rounded-full blur-3xl opacity-25 bg-violet-600" />
        <div className="absolute -bottom-10 right-32 w-64 h-64 rounded-full blur-3xl opacity-15 bg-indigo-500" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 -mt-8 relative z-10 pb-20">

        {/* header row */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/profile">
            <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors group">
              <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
              Voltar ao perfil
            </button>
          </Link>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="gap-2 bg-violet-600 hover:bg-violet-500 text-white border-0 shadow-lg shadow-violet-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? (
              <>
                <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Salvando…
              </>
            ) : (
              <>
                <Save className="size-4" />
                Salvar alterações
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">

          {/* foto */}
          <Card icon={<Camera className="size-4" />} title="Foto de perfil">
            <AvatarCropper
              initialUrl={user.avatarUrl}
              name={name}
              onChange={setAvatarBlob}
            />
          </Card>

          {/* informações gerais */}
          <Card icon={<User className="size-4" />} title="Informações gerais">
            <div className="space-y-4">
              <Field
                label="Nome de exibição"
                id="name"
                value={name}
                onChange={setName}
                placeholder="Seu nome completo"
              />
              <Field
                label="E-mail"
                id="email"
                value={user.email}
                readOnly
                hint="O e-mail não pode ser alterado por aqui."
              />
            </div>
          </Card>

          {/* senha */}
          <Card icon={<Lock className="size-4" />} title="Alterar senha">
            <div className="space-y-4">
              <Field
                label="Senha atual"
                id="currentPwd"
                type="password"
                value={currentPwd}
                onChange={setCurrentPwd}
                placeholder="••••••••"
                hint="Necessária apenas se quiser redefinir a senha."
              />
              <div className="border-t border-zinc-800 pt-4 space-y-4">
                <Field
                  label="Nova senha"
                  id="newPwd"
                  type="password"
                  value={newPwd}
                  onChange={setNewPwd}
                  placeholder="Mínimo 8 caracteres"
                />
                <Field
                  label="Confirmar nova senha"
                  id="confirmPwd"
                  type="password"
                  value={confirmPwd}
                  onChange={setConfirmPwd}
                  placeholder="Repita a nova senha"
                />
                <PasswordStrength password={newPwd} />
              </div>
            </div>
          </Card>

        </div>
      </main>

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}