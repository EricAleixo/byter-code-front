"use server";

import { cookies } from "next/headers";

export async function createCommentAction(data: {
  content: string;
  postId: string;
  parentId?: string;
  isAnonymous?: boolean;
  anonymousName?: string;
}) {
  const token = (await cookies()).get("token")?.value;
  if (!token) throw new Error("Não autenticado.");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Erro ao comentar.");
  }

  return res.json();
}