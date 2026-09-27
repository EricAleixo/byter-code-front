import Link from "next/link";
import { getCurrentUser } from "@/src/utils/getCurrentUser";
import { categoriesService } from "@/src/services/categories.service";
import { MobileMenuButton } from "./MobileMenuButton";

export async function HeaderMobile() {
  const [user, categories] = await Promise.all([
    getCurrentUser(),
    categoriesService.findAll(),
  ]);

  const navItems: { label: string; href: string; adminPath?: boolean }[] = [
    { label: "Início", href: "/" },
    { label: "Seções", href: "/sections" },
    { label: "Artigos", href: "/posts" },
    { label: "Posts", href: "/admin/posts", adminPath: true },
    { label: "Categorias", href: "/admin/categories", adminPath: true },
    { label: "Tags", href: "/admin/tags", adminPath: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm lg:hidden">
        <div className="h-0.5 w-full bg-linear-to-r from-violet-600 via-violet-500 to-violet-700" />
        <div className="flex items-center justify-between px-4 py-3">

          {/* logo */}
          <Link href="/" className="shrink-0">
            <span
              className="text-xl font-black tracking-tight"
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

          <div className="flex items-center gap-2">
            {/* avatar mobile */}
            {user && (
              <Link href="/profile">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-700/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-linear-to-tl from-violet-700 to-violet-500 ring-2 ring-violet-700/50 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user.name[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </Link>
            )}

            {/* botão hamburguer — client */}
            <MobileMenuButton
              user={user}
              categories={categories}
              navItems={navItems}
            />
          </div>
        </div>
      </header>
    </>
  );
}