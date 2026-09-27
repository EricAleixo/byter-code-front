import { getToken } from "@/src/utils/getToken";
import { Course } from "@/src/types/course";

export type EnrolledCourse = Course & {
  enrolledAt: string;
  progress: { completed: number; total: number; percent: number };
};

async function authFetch(path: string) {
  const token = await getToken();
  if (!token) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export const enrollmentsService = {
  async findMyCourses(): Promise<EnrolledCourse[]> {
    return (await authFetch("/me/courses")) ?? [];
  },

  async getEnrollmentStatus(courseId: string): Promise<{ enrolled: boolean }> {
    return (await authFetch(`/courses/${courseId}/enrollment`)) ?? { enrolled: false };
  },

  async getCourseProgress(courseId: string): Promise<{ completedLessonIds: string[] }> {
    return (await authFetch(`/courses/${courseId}/progress`)) ?? { completedLessonIds: [] };
  },
};
