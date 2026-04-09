import { cookies } from "next/headers";

export async function getToken() {
  const cookieStore = cookies();
  return (await cookieStore).get("token")?.value;
}