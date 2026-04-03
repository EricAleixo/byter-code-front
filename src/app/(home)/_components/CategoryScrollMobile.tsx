"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  BookOpen,
  Cpu,
  Globe,
  Terminal,
  Rss,
} from "lucide-react";

type CategoryItem = {
  label: string;
  icon: React.ReactNode;
  count: number;
  image: string;
  overlay: string; // cor do overlay rgba
  accent: string;  // cor do texto/borda
};

const CATEGORIES: CategoryItem[] = [
  {
    label: "Frontend",
    icon: <Globe className="size-7" />,
    count: 87,
    image: "https://picsum.photos/seed/frontend-cat/800/600",
    overlay: "rgba(109,40,217,0.72)",
    accent: "#c4b5fd",
  },
  {
    label: "Backend",
    icon: <Terminal className="size-7" />,
    count: 64,
    image: "https://picsum.photos/seed/backend-cat/800/600",
    overlay: "rgba(5,150,105,0.72)",
    accent: "#6ee7b7",
  },
  {
    label: "DevOps",
    icon: <Cpu className="size-7" />,
    count: 43,
    image: "https://picsum.photos/seed/devops-cat/800/600",
    overlay: "rgba(14,116,144,0.72)",
    accent: "#7dd3fc",
  },
  {
    label: "IA & ML",
    icon: <TrendingUp className="size-7" />,
    count: 52,
    image: "https://picsum.photos/seed/iaml-cat/800/600",
    overlay: "rgba(190,18,60,0.72)",
    accent: "#fda4af",
  },
  {
    label: "Tutoriais",
    icon: <BookOpen className="size-7" />,
    count: 119,
    image: "https://picsum.photos/seed/tutoriais-cat/800/600",
    overlay: "rgba(180,83,9,0.72)",
    accent: "#fcd34d",
  },
  {
    label: "Open Source",
    icon: <Rss className="size-7" />,
    count: 31,
    image: "https://picsum.photos/seed/opensource-cat/800/600",
    overlay: "rgba(15,118,110,0.72)",
    accent: "#5eead4",
  },
];

export default function CategoryScrollMobile() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const itemW = el.offsetWidth;
    const idx = Math.round(el.scrollLeft / itemW);
    setActive(Math.min(idx, CATEGORIES.length - 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const cat = CATEGORIES[active];

  return (
    <div className="sm:hidden relative rounded-2xl overflow-hidden" style={{ height: 260 }}>

      {/* fundo: imagens empilhadas, só a ativa é visível */}
      {CATEGORIES.map((c, i) => (
        <img
          key={c.label}
          src={c.image}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: i === active ? 1 : 0 }}
        />
      ))}

      {/* overlay colorido da categoria ativa */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{ background: cat.overlay }}
      />

      {/* conteúdo central fixo (ícone + nome + count) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none gap-3 z-10">
        <div
          className="transition-all duration-300"
          style={{ color: cat.accent, filter: `drop-shadow(0 0 12px ${cat.accent}88)` }}
        >
          {cat.icon}
        </div>
        <p
          className="text-2xl font-black tracking-tight transition-all duration-300"
          style={{ color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,.5)" }}
        >
          {cat.label}
        </p>
        <p
          className="text-xs font-semibold uppercase tracking-widest transition-all duration-300"
          style={{ color: cat.accent }}
        >
          {cat.count} artigos
        </p>
      </div>

      {/* scroll snap horizontal — itens invisíveis usados só para capturar scroll */}
      <div
        ref={scrollRef}
        className="absolute inset-0 z-20 flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {CATEGORIES.map((c) => (
          <div
            key={c.label}
            className="flex-shrink-0 w-full h-full snap-center"
            style={{ opacity: 0 }} // invisível — só para dar largura ao scroll
          />
        ))}
      </div>

      {/* dots indicadores */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-30 pointer-events-none">
        {CATEGORIES.map((_, i) => (
          <span
            key={i}
            className="block rounded-full transition-all duration-300"
            style={{
              width: i === active ? 20 : 6,
              height: 6,
              background: i === active ? cat.accent : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>

      {/* label "deslize" na primeira vez */}
      <p
        className="absolute bottom-10 left-0 right-0 text-center text-[10px] text-white/50 z-30 pointer-events-none"
      >
        deslize para explorar
      </p>
    </div>
  );
}