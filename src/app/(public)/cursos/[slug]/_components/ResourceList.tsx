import { Resource } from "@/src/utils/courses";
import { FileText, Newspaper, ExternalLink } from "lucide-react";
import { FaGithub, FaYoutube } from "react-icons/fa6";

const icons: Record<Resource["type"], React.ReactNode> = {
  repo: <FaGithub size={15} />,
  doc: <FileText size={15} />,
  video: <FaYoutube size={15} />,
  article: <Newspaper size={15} />,
};

export function ResourceList({ resources }: { resources: Resource[] }) {
  return (
    <ul className="space-y-2">
      {resources.map((r) => (
        <li key={r.url}>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 hover:border-violet-600 hover:text-violet-400 transition-all group"
          >
            <span className="text-zinc-500 group-hover:text-violet-500 transition-colors">
              {icons[r.type]}
            </span>
            <span className="flex-1">{r.label}</span>
            <ExternalLink size={13} className="text-zinc-600 group-hover:text-violet-400" />
          </a>
        </li>
      ))}
    </ul>
  );
}