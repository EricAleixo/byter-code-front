import { User } from "../types/user";

export const isAdmin = (user: User | null) => user?.role === "ADMIN";