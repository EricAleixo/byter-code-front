import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="flex flex-col items-center text-center max-w-md">

        {/* 404 */}
        <span
          className="text-[120px] font-black leading-none tracking-tighter select-none"
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            background: "linear-gradient(90deg, #5b21b6, #7c3aed 40%, #c4b5fd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </span>

        {/* divisor */}
        <div className="h-0.5 w-24 bg-linear-to-r from-violet-600 via-violet-500 to-violet-700 rounded-full mb-6" />

        {/* texto */}
        <h1 className="text-xl font-bold text-zinc-100 mb-2">
          Página não encontrada
        </h1>
        <p className="text-sm text-zinc-500 leading-relaxed mb-8">
          A página que você está procurando não existe ou foi movida para outro endereço.
        </p>

        {/* ações */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors"
          >
            <Home className="size-4" />
            Início
          </Link>
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-800"
          >
            <Search className="size-4" />
            Ver artigos
          </Link>
        </div>

        {/* voltar */}
        <Link
          href={"/"}
          className="mt-6 inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Voltar à página inicial
        </Link>

      </div>
    </main>
  );
}