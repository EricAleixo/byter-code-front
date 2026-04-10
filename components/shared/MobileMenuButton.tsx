"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Menu,
  X,
  LogOut,
  Tag,
  Shield,
  UserCircle,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";
import { ApiCategory } from "@/src/types/category";
import { logoutAction } from "@/src/actions/logout";
import { isAdmin } from "@/src/utils/isAdmin";
import { User } from "@/src/types/user";
import { SearchInput } from "./SearchInput";

type NavItem = {
  label: string;
  href: string;
  adminPath?: boolean;
};

type Props = {
  user: User | null;
  categories: ApiCategory[];
  navItems: NavItem[];
};

export function MobileMenuButton({ user, categories, navItems }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const filteredNavItems = navItems.filter(
    (item) => !item.adminPath || isAdmin(user)
  );

  const drawer = (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-100 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-zinc-900 border-l border-zinc-800 z-101 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800 shrink-0">
          <span
            className="text-lg font-black tracking-tight"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              background:
                "linear-gradient(90deg, #5b21b6, #7c3aed 40%, #c4b5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            byter-code
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto min-h-0">

          {/* busca — fecha o drawer ao abrir o modal */}
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
            <SearchInput
              variant="mobile"
              onOpenSearch={() => setOpen(false)}
            />
            <span className="text-sm text-zinc-500">Buscar artigos</span>
          </div>

          {/* user logado */}
          {user && (
            <div className="px-4 py-4 border-b border-zinc-800">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 group"
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-700/50 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-linear-to-tl from-violet-700 to-violet-500 ring-2 ring-violet-700/50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-white">
                      {user.name[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-200 truncate group-hover:text-violet-300 transition-colors">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate">
                    {user.email}
                  </p>
                </div>
                <ChevronRight className="size-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </Link>

              <div className="mt-2.5">
                {isAdmin(user) ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-violet-500/20 text-violet-300 border-violet-500/30">
                    <Shield className="size-3" /> Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-zinc-700/40 text-zinc-400 border-zinc-700">
                    <UserCircle className="size-3" /> Membro
                  </span>
                )}
              </div>
            </div>
          )}

          {/* nav */}
          <div className="px-2 py-3 border-b border-zinc-800">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-2 mb-2">
              Navegação
            </p>
            {filteredNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  item.adminPath
                    ? "text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {item.adminPath && <LayoutDashboard className="size-4" />}
                {item.label}
              </Link>
            ))}
          </div>

          {/* categorias */}
          <div className="px-2 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-2 mb-2">
              Seções
            </p>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/sections/${cat.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors group"
              >
                <Tag className="size-4 shrink-0" style={{ color: cat.color }} />
                <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* footer */}
        <div className="border-t border-zinc-800 px-4 py-4 shrink-0">
          {user ? (
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="size-4" />
                Encerrar sessão
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-colors"
              >
                Cadastrar-se
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="size-5" />
      </button>

      {mounted && createPortal(drawer, document.body)}
    </>
  );
}