"use server";

import { cookies } from "next/headers";

export async function uploadPostImage(formData: FormData): Promise<{ imageUrl: string, publicId: string }> {
  const token = (await cookies()).get("token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/upload-image`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Erro ao fazer upload.");
  }

  return res.json(); // { url: string }
}