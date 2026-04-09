import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import CategoryForm from "@/components/shared/CategoriesForm";
import { createCategoryAction } from "../_actions/actions";

export default async function NewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  if (!cookieStore.get("token")) redirect("/login");

  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <div className="w-fit mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-white mb-1">Criar categoria</h1>
            <p className="text-sm text-zinc-500">
              Campos com <span className="text-rose-400">*</span> são obrigatórios.
            </p>
          </div>
          <CategoryForm error={error} onSubmit={createCategoryAction} />
        </div>
      </main>

    </div>
  );
}