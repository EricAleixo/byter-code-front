import { Course, CourseWithPosts } from "@/src/types/course";
import { getToken } from "@/src/utils/getToken";

export type CourseContentResult =
  | { status: "ok"; course: CourseWithPosts }
  | { status: "unauthenticated" }
  | { status: "not-enrolled"; message: string }
  | { status: "not-found" };

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type PaginatedCourses = {
  data: Course[];
  meta: PaginationMeta;
};

const LIMIT = 10;

function paginate(all: Course[], page: number): PaginatedCourses {
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * LIMIT;

  return {
    data: all.slice(start, start + LIMIT),
    meta: {
      page: safePage,
      limit: LIMIT,
      total,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1,
    },
  };
}

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => null);
  return body?.message ?? fallback;
}

export const courseService = {
  async findAll(page = 1): Promise<PaginatedCourses> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
      cache: "no-store",
    });
    if (!res.ok) {
      // falha silenciosa retorna lista vazia, igual o padrão de getCategories/getTags
      return paginate([], page);
    }
    const all: Course[] = await res.json();
    return paginate(all, page);
  },

  async findBySlug(slug: string): Promise<Course | null> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(await parseErrorMessage(res, "Erro ao buscar curso."));
    return res.json();
  },

  /** curso + aulas (posts vinculados via coursePosts), no shape de findWithPosts do backend */
  async findWithPosts(slug: string): Promise<CourseWithPosts | null> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}/posts`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(await parseErrorMessage(res, "Erro ao buscar aulas do curso."));
    return res.json();
  },

  /**
   * Curso completo (vídeos, materiais, recursos das aulas). O backend só libera
   * pra quem está inscrito — ou admin. As rotas públicas acima trazem apenas a ementa.
   */
  async findContent(slug: string): Promise<CourseContentResult> {
    const token = await getToken();
    if (!token) return { status: "unauthenticated" };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}/content`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.status === 401) return { status: "unauthenticated" };
    if (res.status === 403) {
      return {
        status: "not-enrolled",
        message: await parseErrorMessage(res, "Inscreva-se no curso para liberar as aulas."),
      };
    }
    if (res.status === 404) return { status: "not-found" };
    if (!res.ok) throw new Error(await parseErrorMessage(res, "Erro ao buscar conteúdo do curso."));
    return { status: "ok", course: await res.json() };
  },
};