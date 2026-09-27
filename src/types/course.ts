export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type CourseResource = {
    id?: string; // ausente para itens ainda não salvos no backend
    label: string;
    url: string;
    type: "REPO" | "DOC" | "VIDEO" | "ARTICLE";
};

/** recurso vinculado a uma aula específica — sempre vem salvo do backend, então tem id */
export type LessonResource = CourseResource & { id: string };

export type CourseOutcome = {
    order: number;
    text: string;
};

export type CourseLesson = {
    id: string;
    courseId: string;
    title: string;
    description: string;
    order: number;
    videoUrl: string;
    videoProvider: "YOUTUBE" | "VIMEO" | "DIRECT";
    duration: number;
    /** só vem na versão pública (sem inscrição), já que ali não há videoUrl */
    thumbnailUrl?: string | null;
    resources?: LessonResource[];
    createAt: string;
    updatedAt: string;
};

export type CourseFormData = {
    name: string;
    slug: string;
    description: string;
    level: Level;
    coverImage: string;
    coverImagePublicId?: string;
    resources: CourseResource[];
    outcomes: string[]; // no form fica só texto; order é calculado no submit
};

export type Course = {
    id: string;
    slug: string;
    name: string;
    description: string;
    level: Level;
    coverImage?: string;
    coverImagePublicId?: string;
    duration?: string;
    enrolledCount: number;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    resources?: CourseResource[];
    outcomes?: CourseOutcome[];
    lessons?: CourseLesson[];
};

// post vinculado ao curso (retorno de findWithPosts)
export type CoursePost = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    readTime?: string;
    coverImage?: string;
    status: "DRAFT" | "PUBLISHED";
    position: number;
};

export type CourseWithPosts = Course & { posts: CoursePost[] };