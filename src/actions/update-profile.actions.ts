"use server";

import { cookies } from "next/headers";

export async function updateProfileAction(formData: FormData) {
  const cookieStore = cookies();

  const token = (await cookieStore).get("token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
    method: "PATCH",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Erro ao atualizar perfil");
  }

  return res.json();
}