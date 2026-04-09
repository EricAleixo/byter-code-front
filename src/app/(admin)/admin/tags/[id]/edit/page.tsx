import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import TagForm from "@/components/shared/TagsForm";
import { updateTagAction } from "../../_actions/action";

async function getTag(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function EditTagPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  if (!cookieStore.get("token")) redirect("/auth/login");

  const { id } = await params;
  const { error } = await searchParams;

  const tag = await getTag(id);
  if (!tag) notFound();

  const boundAction = updateTagAction.bind(null, id);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1">Editar tag</h1>
          <p className="text-sm text-zinc-500">
            Campos com <span className="text-rose-400">*</span> são obrigatórios.
          </p>
        </div>
        <TagForm
          initialData={{ name: tag.name }}
          isEdit
          error={error}
          onSubmit={boundAction}
        />
      </main>

      <footer className="border-t border-zinc-800 mt-16 py-6 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} byte-coder · Admin
      </footer>
    </div>
  );
}