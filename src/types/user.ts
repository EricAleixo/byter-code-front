export type User = {
    id: string,
    email: string,
    name: string,
    avatarUrl?: string,
    role: "ADMIN" | "BASIC"
}