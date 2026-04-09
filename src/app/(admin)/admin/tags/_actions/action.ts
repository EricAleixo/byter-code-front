"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

export async function createTagAction(formData: FormData) {
  const token = await getToken();
  if (!token) redirect("/auth/login");

  const body = { name: formData.get("name") as string };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    const message = encodeURIComponent(error.message ?? "Erro ao criar tag.");
    redirect(`/admin/tags/new?error=${message}`);
  }

  redirect("/admin/tags");
}

export async function updateTagAction(id: string, formData: FormData) {
  const token = await getToken();
  if (!token) redirect("/auth/login");

  const body = { name: formData.get("name") as string };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    const message = encodeURIComponent(error.message ?? "Erro ao atualizar tag.");
    redirect(`/admin/tags/${id}/edit?error=${message}`);
  }

  redirect("/admin/tags");
}

export async function deleteTagAction(id: string) {
  const token = await getToken();
  if (!token) redirect("/auth/login");

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  redirect("/admin/tags");
}