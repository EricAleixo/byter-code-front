"use server";

import { getToken } from "@/src/utils/getToken";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Level, CourseResource } from "@/src/types/course";

function buildCourseBody(formData: FormData) {
    const resourcesRaw = formData.get("resources") as string | null;
    const outcomesRaw = formData.get("outcomes") as string | null;

    return {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        description: formData.get("description") as string,
        level: formData.get("level") as Level,
        coverImage: (formData.get("coverImage") as string) || undefined,
        coverImagePublicId: (formData.get("coverImagePublicId") as string) || undefined,
        resources: resourcesRaw ? (JSON.parse(resourcesRaw) as CourseResource[]) : [],
        outcomes: outcomesRaw
            ? (JSON.parse(outcomesRaw) as string[]).map((text, i) => ({ order: i + 1, text }))
            : [],
    };
}

// ── Curso ──────────────────────────────────────────────────────────────────

export async function createCourseAction(formData: FormData) {
    const token = await getToken();
    if (!token) redirect("/auth/login");

    const body = buildCourseBody(formData);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        const message = encodeURIComponent(error.message ?? "Erro ao criar curso.");
        redirect(`/admin/courses/new?error=${message}`);
    }

    const course = await res.json();
    // vai direto pra edição, onde as aulas (posts) são vinculadas
    redirect(`/admin/courses/${course.slug}/edit`);
}

export async function updateCourseAction(id: string, formData: FormData) {
    const token = await getToken();
    if (!token) redirect("/auth/login");

    const body = buildCourseBody(formData);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        const message = encodeURIComponent(error.message ?? "Erro ao atualizar curso.");
        redirect(`/admin/courses/${id}/edit?error=${message}`);
    }

    const course = await res.json();
    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${course.slug}/edit`);
    redirect(`/cursos/${course.slug}`);
}

export async function deleteCourseAction(id: string) {
    const token = await getToken();
    if (!token) redirect("/auth/login");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? "Erro ao deletar curso.");
    }

    revalidatePath("/admin/courses");
}

export async function updateCourseResourcesAction(
    courseId: string,
    slug: string,
    resources: CourseResource[],
) {
    const token = await getToken();

    if (!token) redirect('/auth/login');

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/resources`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ resources }),
        },
    );

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));

        throw new Error(
            error.message ?? 'Erro ao atualizar materiais.',
        );
    }

    revalidatePath(`/admin/courses/${slug}`);

    return res.json();
}

// ── Aulas (posts vinculados ao curso) ───────────────────────────────────────

export async function addCoursePostAction(courseId: string, postId: string, position: number) {
    const token = await getToken();
    if (!token) redirect("/auth/login");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, position }),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? "Erro ao adicionar aula ao curso.");
    }

    revalidatePath(`/admin/courses`);
    return res.json();
}

export async function updateCoursePostPositionAction(
    courseId: string,
    postId: string,
    position: number,
) {
    const token = await getToken();
    if (!token) redirect("/auth/login");

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/posts/${postId}/position`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ position }),
        },
    );

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? "Erro ao reordenar aula.");
    }

    return res.json();
}

export async function removeCoursePostAction(courseId: string, postId: string) {
    const token = await getToken();
    if (!token) redirect("/auth/login");

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/posts/${postId}`,
        {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        },
    );

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? "Erro ao remover aula do curso.");
    }
}

export async function reorderCoursePostsAction(courseId: string, postIds: string[]) {
    const token = await getToken();
    if (!token) redirect("/auth/login");

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/posts/reorder`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ postIds }),
        },
    );

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? "Erro ao reordenar aulas.");
    }

    return res.json();
}

export async function addCourseLessonAction(courseId: string, data: {
    order: number;
    title: string;
    description?: string;
    duration: number;
    videoUrl: string;
    videoProvider: "YOUTUBE" | "VIMEO" | "DIRECT";
}) {
    const token = await getToken();
    if (!token) redirect("/auth/login");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? "Erro ao adicionar vídeo.");
    }

    return res.json();
}

export async function removeCourseLessonAction(courseId: string, lessonId: string) {
    const token = await getToken();
    if (!token) redirect("/auth/login");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons/${lessonId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message ?? "Erro ao remover vídeo.");
    }
}

export async function addLessonResourceAction(
  courseId: string,
  lessonId: string,
  data: { label: string; url: string; type: "REPO" | "DOC" | "VIDEO" | "ARTICLE" },
) {
  const token = await getToken();
  if (!token) redirect("/auth/login");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons/${lessonId}/resources`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Erro ao adicionar recurso.");
  }

  revalidatePath("/admin/courses/[slug]", "page");
  revalidatePath("/cursos/[slug]", "page");

  return res.json();
}

export async function removeLessonResourceAction(
  courseId: string,
  lessonId: string,
  resourceId: string,
) {
  const token = await getToken();
  if (!token) redirect("/auth/login");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons/${lessonId}/resources/${resourceId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Erro ao remover recurso.");
  }

  revalidatePath("/admin/courses/[slug]", "page");
  revalidatePath("/cursos/[slug]", "page");
}
// ── Inscrição e progresso ───────────────────────────────────────────────────

function revalidateEnrollmentPages() {
  revalidatePath("/minhas-aulas");
  revalidatePath("/cursos");
  revalidatePath("/cursos/[slug]", "page");
}

export async function enrollCourseAction(courseId: string) {
  const token = await getToken();
  if (!token) redirect("/auth/login");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/enroll`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Erro ao se inscrever no curso.");
  }

  revalidateEnrollmentPages();
  return res.json();
}

export async function completeLessonAction(courseId: string, lessonId: string) {
  const token = await getToken();
  if (!token) redirect("/auth/login");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons/${lessonId}/complete`,
    { method: "POST", headers: { Authorization: `Bearer ${token}` } },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Erro ao marcar aula como concluída.");
  }

  revalidateEnrollmentPages();
  // markComplete retorna null em conflito (aula já concluída) → body vazio
  return res.json().catch(() => null);
}

export async function uncompleteLessonAction(courseId: string, lessonId: string) {
  const token = await getToken();
  if (!token) redirect("/auth/login");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons/${lessonId}/complete`,
    { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Erro ao desmarcar aula.");
  }

  revalidateEnrollmentPages();
}
