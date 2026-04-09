import { PaginatedPosts, Post } from "../types/post";

class PostService {

  async findAll(page = 1, limit = 10): Promise<PaginatedPosts> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts?page=${page}&limit=${limit}`,
        { cache: "no-store" }
      );
      if (!response.ok) return { data: [], meta: null };

      return response.json() as Promise<PaginatedPosts>;
    } catch {
      return { data: [], meta: null };
    }
  }

  async findBySlug(slug: string): Promise<Post | null> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/slug/${slug}`, {
        cache: "no-cache",
      });
      if (!response.ok) return null;
      return response.json();
    } catch {
      console.error("Erro ao buscar o post");
      return null;
    }
  }

  async findRelated(slug: string, limit = 3): Promise<Post[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/slug/${slug}/related?limit=${limit}`,
        { cache: "no-store" }
      );
      if (!response.ok) return [];
      return response.json();
    } catch {
      return [];
    }
  }

  async findByCategory(categorySlug: string, page = 1, limit = 10): Promise<PaginatedPosts> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/category/${categorySlug}?page=${page}&limit=${limit}`,
        { cache: "no-store" }
      );
      if (!response.ok) return { data: [], meta: null };
      return response.json();
    } catch {
      return { data: [], meta: null };
    }
  }

  async findAllPublished(page = 1, limit = 12): Promise<PaginatedPosts> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/published?page=${page}&limit=${limit}`,
        { cache: "no-store" }
      );
      if (!response.ok) return { data: [], meta: null };
      return response.json();
    } catch {
      return { data: [], meta: null };
    }
  }
}

export const postService = new PostService();