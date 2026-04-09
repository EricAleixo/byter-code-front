import { ApiCategory } from "./category";
import { TagType } from "./tag";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  coverImagePublicId?: string,
  readTime?: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt?: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  category: ApiCategory;
  postTags: { tag: TagType }[];
};

export type PaginatedPosts = {
  data: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
};