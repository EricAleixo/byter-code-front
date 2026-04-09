import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Tag,
  CalendarDays,
  Layers,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCategoryAction } from "./_actions/actions";
import { formatDate } from "@/src/utils/formatDate";
import { DynamicIcon } from "@/src/utils/DynamicIcon";
import { ApiCategory } from "@/src/types/category";

async function getCategories(): Promise<ApiCategory[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function CategoryBadge({ name, color, icon }: { name: string; color: string, icon: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm"
      style={{
        color,
        borderColor: `${color}60`,
        backgroundColor: `${color}25`,
        boxShadow: `0 2px 12px ${color}20`,
      }}
    >
      <DynamicIcon name={icon} className="size-3" />
      {name}
    </span>
  );
}

export default async function AdminCategoriesPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("token")) redirect("/login");

  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-8">

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Gerenciar categorias</h1>
            <p className="text-sm text-zinc-500">{categories.length} categorias cadastradas</p>
          </div>
          <Link href="/admin/categories/new">
            <Button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold gap-2">
              <Plus className="size-4" /> Nova categoria
            </Button>
          </Link>
        </div>

        {categories.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center py-20 gap-4 text-center">
            <Layers className="size-10 text-zinc-700" />
            <p className="text-zinc-500 text-sm">Nenhuma categoria encontrada.</p>
            <Link href="/admin/categories/new">
              <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white gap-2">
                <Plus className="size-3.5" /> Criar primeira categoria
              </Button>
            </Link>
          </div>
        )}

        {categories.length > 0 && (
          <>
            {/* ── mobile: cards ── */}
            <div className="flex flex-col gap-4 sm:hidden">
              {categories.map((cat) => (
                <div key={cat.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <CategoryBadge name={cat.name} color={cat.color} icon={cat.icon} />
                    <div
                      className="w-6 h-6 rounded-full border border-zinc-700 shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>

                  <div className="text-xs text-zinc-600 font-mono">{cat.slug}</div>

                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                    <CalendarDays className="size-3" />
                    {formatDate(cat.createdAt)}
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
                    <Link href={`/admin/categories/${cat.id}/edit`} className="flex-1">
                      <Button size="sm" variant="ghost" className="w-full gap-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 text-xs">
                        <Pencil className="size-3.5" /> Editar
                      </Button>
                    </Link>
                    <form action={deleteCategoryAction.bind(null, cat.id)} className="flex-1">
                      <Button size="sm" variant="ghost" type="submit" className="w-full gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs">
                        <Trash2 className="size-3.5" /> Excluir
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>

            {/* ── desktop: tabela ── */}
            <div className="hidden sm:block rounded-xl border border-zinc-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/80">
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Categoria</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Slug</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Cor</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Criada em</th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="bg-zinc-900 hover:bg-zinc-800/50 transition-colors group">

                      <td className="px-5 py-4">
                        <CategoryBadge name={cat.name} color={cat.color} icon={cat.icon} />
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs text-zinc-500 font-mono">{cat.slug}</span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-6 h-6 rounded-full border border-zinc-700"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="text-xs text-zinc-500 font-mono">{cat.color}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <CalendarDays className="size-3.5 text-zinc-600" />
                          {formatDate(cat.createdAt)}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/categories/${cat.id}/edit`}>
                            <Button size="sm" variant="ghost" className="gap-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 text-xs h-8 px-3">
                              <Pencil className="size-3.5" /> Editar
                            </Button>
                          </Link>
                          <form action={deleteCategoryAction.bind(null, cat.id)}>
                            <Button size="sm" variant="ghost" type="submit" className="gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs h-8 px-3">
                              <Trash2 className="size-3.5" /> Excluir
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-zinc-800 mt-16 py-6 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} byte-coder · Admin
      </footer>
    </div>
  );
}