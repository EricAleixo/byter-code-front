import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Lock, Mail, Terminal } from "lucide-react";
import Link from "next/link";
import { loginAction } from "./_actions/loginAction";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {

  const { error } = await searchParams;

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
              <p className="text-xs text-zinc-500">Bem-vindo de volta</p>
            </div>

            <form action={loginAction} className="space-y-4">
              {/* email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-medium text-zinc-400">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500 pointer-events-none" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    className="pl-9 bg-zinc-800/80 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-600 focus-visible:border-violet-600 text-sm h-10"
                  />
                </div>
              </div>

              {/* senha */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-medium text-zinc-400">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500 pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-9 pr-10 bg-zinc-800/80 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-600 focus-visible:border-violet-600 text-sm h-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Eye className="size-3.5" />
                  </div>
                </div>
              </div>

              {/* erro */}
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-xs text-red-400">
                  {decodeURIComponent(error)}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm h-10"
              >
                Entrar
              </Button>
            </form>
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