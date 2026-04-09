import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Tag, CalendarDays, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteTagAction } from "./_actions/action";

type Tag = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

async function getTags(): Promise<Tag[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminTagsPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("token")) redirect("/auth/login");

  const tags = await getTags();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-8">

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Gerenciar tags</h1>
            <p className="text-sm text-zinc-500">{tags.length} tags cadastradas</p>
          </div>
          <Link href="/admin/tags/new">
            <Button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold gap-2">
              <Plus className="size-4" /> Nova tag
            </Button>
          </Link>
        </div>

        {tags.length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center py-20 gap-4 text-center">
            <Tag className="size-10 text-zinc-700" />
            <p className="text-zinc-500 text-sm">Nenhuma tag encontrada.</p>
            <Link href="/admin/tags/new">
              <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white gap-2">
                <Plus className="size-3.5" /> Criar primeira tag
              </Button>
            </Link>
          </div>
        )}

        {tags.length > 0 && (
          <>
            {/* ── mobile: cards ── */}
            <div className="flex flex-col gap-4 sm:hidden">
              {tags.map((tag) => (
                <div key={tag.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold border bg-violet-500/20 text-violet-300 border-violet-500/30">
                      <Tag className="size-3.5" />
                      {tag.name}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-600 font-mono">{tag.slug}</div>

                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                    <CalendarDays className="size-3" />
                    {formatDate(tag.createdAt)}
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
                    <Link href={`/admin/tags/${tag.id}/edit`} className="flex-1">
                      <Button size="sm" variant="ghost" className="w-full gap-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 text-xs">
                        <Pencil className="size-3.5" /> Editar
                      </Button>
                    </Link>
                    <form action={deleteTagAction.bind(null, tag.id)} className="flex-1">
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
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Tag</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Slug</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Criada em</th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-500">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {tags.map((tag) => (
                    <tr key={tag.id} className="bg-zinc-900 hover:bg-zinc-800/50 transition-colors">

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-violet-500/20 text-violet-300 border-violet-500/30">
                          <Tag className="size-3" />
                          {tag.name}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs text-zinc-500 font-mono">{tag.slug}</span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <CalendarDays className="size-3.5 text-zinc-600" />
                          {formatDate(tag.createdAt)}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/tags/${tag.id}/edit`}>
                            <Button size="sm" variant="ghost" className="gap-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 text-xs h-8 px-3">
                              <Pencil className="size-3.5" /> Editar
                            </Button>
                          </Link>
                          <form action={deleteTagAction.bind(null, tag.id)}>
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