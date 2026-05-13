// login/page.tsx
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function LoginPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <div className="h-0.5 w-full bg-linear-to-r from-violet-600 via-violet-500 to-violet-700" />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-8">
          {/* logo */}
          <div className="text-center space-y-2">
            <Link href="/">
              <span
                className="text-3xl font-black tracking-tight"
                style={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  background: "linear-gradient(90deg, #5b21b6, #7c3aed 40%, #c4b5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                byter-code
              </span>
            </Link>
            <p className="text-zinc-500 text-sm">Acesse o painel com sua conta</p>
          </div>

          {/* card */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm p-8 space-y-6">
            <div className="flex justify-center">
              <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <Terminal className="size-6 text-violet-400" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <h1 className="text-lg font-bold text-white">Entrar</h1>
              <p className="text-xs text-zinc-500">Escolha como deseja continuar</p>
            </div>

            <div className="space-y-3">
              {/* Google — redireciona direto para o backend */}
              <Button
                variant="outline"
                className="w-full h-11 bg-zinc-800/80 border-zinc-700 hover:bg-zinc-700/80 hover:border-zinc-600 hover:text-white text-zinc-100 font-medium text-sm gap-3 transition-all"
                asChild
              >
                <Link href={`${API}/auth/google`}>
                  <FcGoogle className="size-4 shrink-0" />
                  Continuar com Google
                </Link>
              </Button>

              {/* GitHub */}
              <Button
                variant="outline"
                className="w-full h-11 bg-zinc-800/80 border-zinc-700 hover:bg-zinc-700/80 hover:border-zinc-600 hover:text-white text-zinc-100 font-medium text-sm gap-3 transition-all"
                asChild
              >
                <Link href={`${API}/auth/github`}>
                  <FaGithub className="size-4 shrink-0 text-zinc-100" />
                  Continuar com GitHub
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-zinc-900 px-3 text-xs text-zinc-600">
                  acesso seguro via OAuth
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-600">
            <Link href="/" className="hover:text-zinc-400 transition-colors">
              Voltar para o início
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}