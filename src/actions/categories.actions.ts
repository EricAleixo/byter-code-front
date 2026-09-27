"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

export async function createCategoryAction(formData: FormData) {
  const token = await getToken();
  if (!token) redirect("/auth/login");

  const body = {
    name: formData.get("name") as string,
    color: formData.get("color") as string,
    icon: formData.get("icon") as string,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    const message = encodeURIComponent(error.message ?? "Erro ao criar categoria.");
    redirect(`/admin/categories/new?error=${message}`);
  }

  redirect("/admin/categories");
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const token = await getToken();
  if (!token) redirect("/auth/login");

  const body = {
    name: formData.get("name") as string,
    color: formData.get("color") as string,
    icon: formData.get("icon") as string,   // ← novo
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    const message = encodeURIComponent(error.message ?? "Erro ao atualizar categoria.");
    redirect(`/admin/categories/${id}/edit?error=${message}`);
  }

  redirect("/admin/categories");
}

export async function deleteCategoryAction(id: string) {
  const token = await getToken();
  if (!token) redirect("/auth/login");

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  redirect("/admin/categories");
}