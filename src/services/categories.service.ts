import { ApiCategory, CategoryWithPosts } from "../types/category";

class CategoriesService {

    async findAll(): Promise<ApiCategory[]> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
                cache: "no-store"
            });
            if (!response.ok) return [];

            return response.json();
        } catch {
            return [];
        }
    }

    async getCategoriesWithPosts(): Promise<CategoryWithPosts[]> {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/with-posts?limit=5`, {
                cache: "no-store",
            });
            if (!res.ok) return [];
            return res.json();
        } catch {
            return [];
        }
    }

}

export const categoriesService = new CategoriesService();