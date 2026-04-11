import { SiGithub } from "react-icons/si";
import { FileText, BookOpen, Link as LinkIcon, ExternalLink } from "lucide-react";
import { FaYoutube } from "react-icons/fa6";

// ─── types ────────────────────────────────────────────────────────────────────

type LinkType = "github" | "docs" | "video" | "book" | "other";

export type PostLinkItem = {
  label: string;
  url: string;
  type?: LinkType;
};

// ─── config por tipo ──────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  LinkType,
  {
    icon: React.ReactNode;
    badge: string;
    accent: string;          // cor do badge / ícone
    border: string;          // borda do card
    bg: string;              // fundo do card
    iconBg: string;          // fundo do bloco de ícone
  }
> = {
  github: {
    icon: <SiGithub className="size-4" />,
    badge: "GitHub",
    accent: "text-zinc-200",
    border: "border-zinc-700 hover:border-zinc-500",
    bg: "bg-zinc-900 hover:bg-zinc-800/80",
    iconBg: "bg-zinc-800 text-zinc-300",
  },
  docs: {
    icon: <FileText className="size-4" />,
    badge: "Docs",
    accent: "text-sky-400",
    border: "border-sky-900/40 hover:border-sky-700/60",
    bg: "bg-sky-950/30 hover:bg-sky-900/30",
    iconBg: "bg-sky-900/50 text-sky-400",
  },
  video: {
    icon: <FaYoutube className="size-4" />,
    badge: "Vídeo",
    accent: "text-rose-400",
    border: "border-rose-900/40 hover:border-rose-700/60",
    bg: "bg-rose-950/20 hover:bg-rose-900/20",
    iconBg: "bg-rose-900/40 text-rose-400",
  },
  book: {
    icon: <BookOpen className="size-4" />,
    badge: "Livro",
    accent: "text-amber-400",
    border: "border-amber-900/40 hover:border-amber-700/60",
    bg: "bg-amber-950/20 hover:bg-amber-900/20",
    iconBg: "bg-amber-900/40 text-amber-400",
  },
  other: {
    icon: <LinkIcon className="size-4" />,
    badge: "Link",
    accent: "text-violet-400",
    border: "border-violet-900/40 hover:border-violet-700/60",
    bg: "bg-violet-950/20 hover:bg-violet-900/20",
    iconBg: "bg-violet-900/40 text-violet-400",
  },
};

// ─── card individual ──────────────────────────────────────────────────────────

function LinkCard({ link }: { link: PostLinkItem }) {
  const type = link.type ?? "other";
  const cfg = TYPE_CONFIG[type];

  // extrai domínio legível para exibir como hint
  let domain = "";
  try {
    domain = new URL(link.url).hostname.replace(/^www\./, "");
  } catch {
    domain = link.url;
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${cfg.border} ${cfg.bg}`}
    >
      {/* ícone */}
      <span className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg ${cfg.iconBg} transition-transform duration-200 group-hover:scale-110`}>
        {cfg.icon}
      </span>

      {/* texto */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors leading-tight truncate">
          {link.label}
        </p>
        <p className="text-[11px] text-zinc-600 truncate mt-0.5">{domain}</p>
      </div>

      {/* badge tipo + seta */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`hidden sm:inline text-[10px] font-bold uppercase tracking-widest ${cfg.accent}`}>
          {cfg.badge}
        </span>
        <ExternalLink className="size-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
      </div>
    </a>
  );
}

// ─── seção principal ──────────────────────────────────────────────────────────

type Props = {
  links: PostLinkItem[];
};

export function LinksSection({ links }: Props) {
  if (!links || links.length === 0) return null;

  return (
    <section className="mt-10 mb-2">
      {/* cabeçalho */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap shrink-0">
          Links & Recursos
        </h2>
        <div className="h-px bg-zinc-800 flex-1" />
      </div>

      {/* grid responsivo: 1 col no mobile, 2 no sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {links.map((link, i) => (
          <LinkCard key={i} link={link} />
        ))}
      </div>
    </section>
  );
}