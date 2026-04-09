"use server";

import { getToken } from "@/src/utils/getToken";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPostAction(formData: FormData) {
  const token = await getToken();
  if (!token) redirect("/login");

  const tagIds = formData.getAll("tagIds") as string[];

  const body = {
    title: formData.get("title") as string,
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    categoryId: formData.get("categoryId") as string,
    coverImage: formData.get("coverImage") as string || undefined,
    coverImagePublicId: formData.get("coverImagePublicId") || undefined,
    readTime: formData.get("readTime") as string || undefined,
    status: formData.get("status") as string,
    tagIds: tagIds.length ? tagIds : [],
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    const message = encodeURIComponent(error.message ?? "Erro ao criar post.");
    redirect(`/admin/posts/new?error=${message}`);
  }

  const post = await res.json();
  redirect(`/posts/${post.slug}`);
}

export async function updatePostAction(id: string, formData: FormData) {
  const token = await getToken();
  if (!token) redirect("/login");

  const tagIds = formData.getAll("tagIds") as string[];

  const body = {
    title: formData.get("title") as string,
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    categoryId: formData.get("categoryId") as string,
    coverImage: formData.get("coverImage") as string || undefined,
    coverImagePublicId: formData.get("coverImagePublicId") || undefined,
    readTime: formData.get("readTime") as string || undefined,
    status: formData.get("status") as string,
    tagIds: tagIds.length ? tagIds : [],
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    const message = encodeURIComponent(error.message ?? "Erro ao atualizar post.");
    redirect(`/admin/posts/${id}/edit?error=${message}`);
  }

  const post = await res.json();
  redirect(`/posts/${post.slug}`);
}



export async function deletePostAction(id: string) {
  const token = await getToken();
  if (!token) redirect("/login");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    const message = encodeURIComponent(error.message ?? "Erro ao deletar post.");
    redirect(`/admin/posts/${id}/edit?error=${message}`);
  }

  revalidatePath("/admin/posts");
}