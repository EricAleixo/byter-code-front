import Link from "next/link";
import { LogOut } from "lucide-react";
import { getCurrentUser } from "@/src/utils/getCurrentUser";
import { categoriesService } from "@/src/services/categories.service";
import { SearchInput } from "@/components/shared/SearchInput";
import { logoutAction } from "@/src/actions/logout";
import { NavDropdown } from "./NavDropDown";
import { isAdmin } from "@/src/utils/isAdmin";

const FIXED_COUNT = 4;

export async function Header() {
  const [user, categories] = await Promise.all([
    getCurrentUser(),
    categoriesService.findAll(),
  ]);

  const navItems: { label: string; href: string; adminPath?: boolean }[] = [
    { label: "Início", href: "/" },
    { label: "Seções", href: "/sections" },
    { label: "Artigos", href: "/posts" },
    { label: "Cursos", href: "/cursos" },
    { label: "Posts", href: "/admin/posts", adminPath: true },
    { label: "Categorias", href: "/admin/categories", adminPath: true },
    { label: "Tags", href: "/admin/tags", adminPath: true },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.adminPath || isAdmin(user)
  );

  const visibleItems = filteredNavItems.slice(0, FIXED_COUNT);
  const overflowItems = filteredNavItems.slice(FIXED_COUNT);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm hidden lg:block">
      <div className="h-0.5 w-full bg-linear-to-r from-violet-600 via-violet-500 to-violet-700" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3">

          {/* logo */}
          <Link href="/" className="shrink-0">
            <span
              className="text-2xl font-black tracking-tight"
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

          {/* nav */}
          <nav className="flex items-center gap-1 shrink-0">
            {visibleItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {overflowItems.length > 0 && <NavDropdown items={overflowItems} />}
          </nav>

          {/* search */}
          <SearchInput />

          {/* auth */}
          {user ? (
            <div className="flex items-center gap-2.5 shrink-0">
              <Link href="/profile" className="flex items-center gap-2.5 group">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-700/50 shrink-0 group-hover:ring-violet-500 transition-all"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-linear-to-tl from-violet-700 to-violet-500 ring-2 ring-violet-700/50 group-hover:ring-violet-400 transition-all flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white">
                      {user.name[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="hidden xl:block min-w-0">
                  <p className="text-xs font-semibold text-zinc-200 truncate max-w-32 group-hover:text-violet-300 transition-colors">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate max-w-32">{user.email}</p>
                </div>
              </Link>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
                  title="Sair"
                >
                  <LogOut className="size-3.5" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/auth/login"
                className="px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/auth/login"
                className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors bg-violet-600 hover:bg-violet-500"
              >
                Cadastrar-se
              </Link>
            </div>
          )}
        </div>

        {/* seções */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none text-xs text-zinc-500">
          <span className="shrink-0 font-semibold text-zinc-600 uppercase tracking-widest text-[10px]">
            Seções
          </span>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/sections/${c.slug}`}
              className="shrink-0 transition-colors hover:text-(--hover-color)"
              style={{ "--hover-color": c.color } as React.CSSProperties & { "--hover-color": string }}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}