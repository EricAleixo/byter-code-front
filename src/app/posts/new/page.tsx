import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import PostForm from "@/components/shared/PostForm";

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="h-0.5 w-full bg-linear-to-r from-violet-700 via-violet-500 to-violet-700" />

      {/* header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="size-4 text-zinc-500" />
            <span
              className="text-xl font-black tracking-tight"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                background: "linear-gradient(90deg, #5b21b6, #7c3aed 40%, #c4b5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              byte-coder
            </span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <FileText className="size-4" />
            <span>Novo post</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        {/* page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1">Criar novo post</h1>
          <p className="text-sm text-zinc-500">Preencha os campos abaixo. Campos com <span className="text-rose-400">*</span> são obrigatórios.</p>
        </div>

        <PostForm isEdit={false} />
      </main>

      <footer className="border-t border-zinc-800 mt-16 py-6 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} byte-coder · Admin
      </footer>
    </div>
  );
}