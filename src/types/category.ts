import { Post } from "./post";

export type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
};


export type CategoryWithPosts = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  posts: Post[];
};