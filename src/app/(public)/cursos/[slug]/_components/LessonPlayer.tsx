import { CourseLesson } from "@/src/types/course";

function getEmbedUrl(lesson: CourseLesson): string | null {
  const { videoUrl, videoProvider } = lesson;

  if (videoProvider === "YOUTUBE") {
    try {
      const u = new URL(videoUrl);
      const id = u.searchParams.get("v") ?? u.pathname.split("/").pop();
      if (!id) return null;
      return `https://www.youtube.com/embed/${id}`;
    } catch {
      return null;
    }
  }

  if (videoProvider === "VIMEO") {
    try {
      const u = new URL(videoUrl);
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (!id) return null;
      return `https://player.vimeo.com/video/${id}`;
    } catch {
      return null;
    }
  }

  return null; // DIRECT usa <video> nativo, não iframe
}

export function LessonPlayer({ lesson }: { lesson: CourseLesson }) {
  const embedUrl = getEmbedUrl(lesson);

  return (
    <div className="space-y-2">
      <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-black">
        {lesson.videoProvider === "DIRECT" ? (
          <video
            key={lesson.id}
            src={lesson.videoUrl}
            controls
            className="w-full h-full"
          />
        ) : embedUrl ? (
          <iframe
            key={lesson.id}
            src={embedUrl}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm">
            Não foi possível carregar o vídeo.
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-zinc-100">{lesson.title}</h3>
        {lesson.description && (
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{lesson.description}</p>
        )}
      </div>
    </div>
  );
}