import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import PostForm from "@/components/shared/PostForm";
import { updatePostAction } from "../../_actions/actions";
import { categoriesService } from "@/src/services/categories.service";
import { postService } from "@/src/services/posts.service";

async function getTags() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
}

type props = {
    searchParams: Promise<{ error?: string }>,
    params: Promise<{ slug: string }>
}


export default async function Page({
    searchParams,
    params
}: props) {
    const cookieStore = await cookies();
    if (!cookieStore.get("token")) redirect("/login");


    const { slug } = await params;
    const [categories, tags, post] = await Promise.all([categoriesService.findAll(), getTags(), postService.findBySlug(slug)]);
    const { error } = await searchParams;

    const tagsIds = post?.postTags.map(item => item.tag.id);

    const updateAction = updatePostAction.bind(null, post!.id);

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
                    isEdit={true}
                    error={error}
                    initialData={{
                        title: post?.title,
                        content: post?.content,
                        excerpt: post?.excerpt,
                        coverImage: post?.coverImage,
                        categoryId: post?.category.id,
                        coverImagePublicId: post?.coverImagePublicId,
                        status: post?.status,
                        tagIds: tagsIds
                    }}
                    onSubmit={updateAction}
                />
            </main>
        </div>
    );
}