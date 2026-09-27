import { CourseLesson } from "@/src/types/course";

export function getYoutubeThumbnail(url: string): string | null {
  try {
    const u = new URL(url);
    const id = u.searchParams.get("v") ?? u.pathname.split("/").pop();
    return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
  } catch {
    return null;
  }
}

export function getLessonThumbnail(lesson: CourseLesson): string | null {
  if (lesson.thumbnailUrl) return lesson.thumbnailUrl;
  return lesson.videoProvider === "YOUTUBE" && lesson.videoUrl ? getYoutubeThumbnail(lesson.videoUrl) : null;
}

export function getEmbedUrl(lesson: CourseLesson): string | null {
  const { videoUrl, videoProvider } = lesson;

  if (videoProvider === "YOUTUBE") {
    try {
      const u = new URL(videoUrl);
      const id = u.searchParams.get("v") ?? u.pathname.split("/").pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    } catch {
      return null;
    }
  }

  if (videoProvider === "VIMEO") {
    try {
      const u = new URL(videoUrl);
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    } catch {
      return null;
    }
  }

  return null; // DIRECT usa <video> nativo
}

export function formatDuration(seconds?: number): string | null {
  if (!seconds) return null;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  if (minutes < 60) return `${minutes}:${String(remaining).padStart(2, "0")}`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return `${hours}h ${String(remMinutes).padStart(2, "0")}min`;
}

export function formatTotalDuration(totalSeconds: number): string | null {
  if (totalSeconds <= 0) return null;
  const totalMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${String(minutes).padStart(2, "0")}min` : `${minutes}min`;
}