import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { EnrollButton } from "./EnrollButton";

/** Tela exibida quando o usuário tenta acessar uma aula de um curso em que não está inscrito. */
export function LockedCourseNotice({
  courseId,
  courseSlug,
  courseName,
  coverImage,
}: {
  courseId: string;
  courseSlug: string;
  courseName: string;
  coverImage?: string;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="relative h-32 bg-zinc-800">
          {coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-900 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center justify-center size-14 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-300">
              <Lock className="size-6" />
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5 text-center">
          <div className="space-y-2">
            <h1 className="text-lg font-black text-white">Conteúdo exclusivo para alunos</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Inscreva-se gratuitamente em <span className="font-semibold text-zinc-200">{courseName}</span> para
              assistir às aulas, acessar os materiais e acompanhar o seu progresso.
            </p>
          </div>

          <EnrollButton courseId={courseId} />

          <Link
            href={`/cursos/${courseSlug}`}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft size={13} /> Ver detalhes do curso
          </Link>
        </div>
      </div>
    </div>
  );
}
