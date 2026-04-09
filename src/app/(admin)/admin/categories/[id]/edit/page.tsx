import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { updateCategoryAction } from "../../_actions/actions";
import CategoryForm from "@/components/shared/CategoriesForm";

async function getCategory(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  if (!cookieStore.get("token")) redirect("/login");

  const { id } = await params;
  const { error } = await searchParams;

  const category = await getCategory(id);
  if (!category) notFound();

  const boundAction = updateCategoryAction.bind(null, id);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1">Editar categoria</h1>
          <p className="text-sm text-zinc-500">
            Campos com <span className="text-rose-400">*</span> são obrigatórios.
          </p>
        </div>
        <CategoryForm
          initialData={{ name: category.name, color: category.color }}
          isEdit
          error={error}
          onSubmit={boundAction}
        />
      </main>
    </div>
  );
}