import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import PostForm from "@/components/shared/PostForm";
import { createPostAction } from "../_actions/actions";

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function getTags() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  if (!cookieStore.get("token")) redirect("/login");

  const [categories, tags] = await Promise.all([getCategories(), getTags()]);
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1">Criar novo post</h1>
          <p className="text-sm text-zinc-500">
            Campos com <span className="text-rose-400">*</span> são obrigatórios.
          </p>
        </div>

        <PostForm
          categories={categories}
          tags={tags}
          isEdit={false}
          error={error}
          onSubmit={createPostAction}
        />
      </main>

      <footer className="border-t border-zinc-800 mt-16 py-6 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} byte-coder · Admin
      </footer>
    </div>
  );
}