import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/utils/getCurrentUser";
import Link from "next/link";
import {
  Mail,
  Shield,
  UserCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  Tag,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/src/utils/isAdmin";
import { logout } from "@/src/utils/logout";

function RoleBadge({ role }: { role: string }) {
  return role === "admin" ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-violet-500/20 text-violet-300 border-violet-500/30">
      <Shield className="size-3" /> Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-zinc-700/40 text-zinc-400 border-zinc-700">
      <UserCircle className="size-3" /> Membro
    </span>
  );
}

export default async function ProfilePage() {

  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* banner */}
      <div className="relative h-42 sm:h-64 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 50%, #0f172a 100%)" }}
        />
        <div className="absolute -top-10 left-20 w-72 h-72 rounded-full blur-3xl opacity-30 bg-violet-600" />
        <div className="absolute -bottom-10 right-32 w-64 h-64 rounded-full blur-3xl opacity-20 bg-indigo-500" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* avatar + info row */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end gap-5 -mt-16 mb-8">

          {/* avatar */}
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover ring-4 ring-zinc-950 border-2 border-violet-700/40 shadow-2xl shrink-0"
            />
          ) : (
            <div
              className="w-32 h-32 rounded-full ring-4 ring-zinc-950 border-2 border-violet-700/50 shadow-2xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #5b21b6, #7c3aed)" }}
            >
              <span className="text-5xl font-black text-white select-none">
                {user.name[0].toUpperCase()}
              </span>
            </div>
          )}

          {/* nome e badge */}
          <div className="flex-1 min-w-0 pb-2">
            <div className="flex items-center gap-3 flex-wrap mb-1 sm:pt-20">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
              <RoleBadge role={user.role} />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-zinc-500">
              <Mail className="size-3.5 text-zinc-600" />
              {user.email}
            </div>
          </div>

          {/* ações */}
          <div className="flex items-center gap-2 pb-2 flex-wrap">
            {isAdmin(user) && (
              <Link href="/admin/posts">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-violet-500/10 border-violet-500/30 text-violet-300 hover:bg-violet-500/20 hover:text-violet-200"
                >
                  <LayoutDashboard className="size-3.5" />
                  Painel admin
                </Button>
              </Link>
            )}
            <Link href="/profile/edit">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              >
                <Settings className="size-3.5" />
                Editar perfil
              </Button>
            </Link>
          </div>
        </div>

        {/* grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-16">

          {/* coluna esquerda */}
          <div className="space-y-4">

            {/* informações */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Informações</p>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div>
                  <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-1">Nome</p>
                  <p className="text-sm font-medium text-zinc-200">{user.name}</p>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-1">E-mail</p>
                  <p className="text-sm font-medium text-zinc-200">{user.email}</p>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-1">Função</p>
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>

            {/* sessão */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Sessão</p>
              </div>
              <div className="px-5 py-4">
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex items-center gap-2.5 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="size-4" />
                    Encerrar sessão
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* coluna direita */}
          <div className="lg:col-span-2 space-y-4">

            {/* acesso rápido admin */}
            {isAdmin(user) && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Acesso rápido</p>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { href: "/admin/posts", icon: <FileText className="size-5" />, label: "Posts", desc: "Gerenciar artigos" },
                    { href: "/admin/categories", icon: <Tag className="size-5" />, label: "Categorias", desc: "Gerenciar categorias" },
                    { href: "/admin/tags", icon: <Tag className="size-5" />, label: "Tags", desc: "Gerenciar tags" },
                  ].map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 hover:border-violet-700/50 hover:bg-violet-500/5 transition-all group">
                        <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 group-hover:bg-violet-500/20 transition-colors shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-200 group-hover:text-violet-300 transition-colors">{item.
                          
                          
                          
                          label}</p>
                          <p className="text-[11px] text-zinc-600">{item.desc}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}