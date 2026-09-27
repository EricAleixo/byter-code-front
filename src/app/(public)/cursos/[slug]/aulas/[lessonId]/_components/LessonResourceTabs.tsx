"use client";

import { useState } from "react";
import { CourseResource } from "@/src/types/course";
import { FileText, Newspaper, ExternalLink } from "lucide-react";
import { FaGithub, FaYoutube } from "react-icons/fa6";

type Tab = "lesson" | "course";

const RESOURCE_ICONS: Record<CourseResource["type"], React.ReactNode> = {
  REPO: <FaGithub size={15} />,
  DOC: <FileText size={15} />,
  VIDEO: <FaYoutube size={15} />,
  ARTICLE: <Newspaper size={15} />,
};

function ResourceRow({ resource }: { resource: CourseResource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 hover:border-violet-600 hover:text-violet-400 transition-all group"
    >
      <span className="text-zinc-500 group-hover:text-violet-500 transition-colors">
        {RESOURCE_ICONS[resource.type]}
      </span>
      <span className="flex-1">{resource.label}</span>
      <ExternalLink size={13} className="text-zinc-600 group-hover:text-violet-400" />
    </a>
  );
}

export function LessonResourceTabs({
  lessonResources,
  courseResources,
}: {
  lessonResources: CourseResource[];
  courseResources: CourseResource[];
}) {
  const [tab, setTab] = useState<Tab>("lesson");

  return (
    <div className="border-t border-zinc-800 pt-4">
      <div className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setTab("lesson")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            tab === "lesson" ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Recursos da aula
        </button>
        <button
          type="button"
          onClick={() => setTab("course")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            tab === "course" ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Recursos do curso
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {tab === "lesson" ? (
          lessonResources.length > 0 ? (
            lessonResources.map((r, i) => <ResourceRow key={r.id ?? i} resource={r} />)
          ) : (
            <p className="text-sm text-zinc-600 italic px-1">Nenhum recurso vinculado a esta aula ainda.</p>
          )
        ) : courseResources.length > 0 ? (
          courseResources.map((r, i) => <ResourceRow key={r.id ?? i} resource={r} />)
        ) : (
          <p className="text-sm text-zinc-600 italic px-1">Nenhum recurso vinculado a este curso ainda.</p>
        )}
      </div>
    </div>
  );
}