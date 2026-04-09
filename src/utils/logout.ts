"use server";

export async function logout() {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.delete("token");
}