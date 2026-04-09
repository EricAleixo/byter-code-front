"use client";

import { BookOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type TocItem = {
  id: string;
  label: string;
  level: 1 | 2 | 3;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function TableOfContents({ contentSelector = ".prose-custom" }: { contentSelector?: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // pequeno delay para garantir que o TipTap terminou de renderizar
    const timer = setTimeout(() => {
      const container = document.querySelector(contentSelector);
      if (!container) return;

      const headings = container.querySelectorAll<HTMLElement>("h1, h2, h3");
      const tocItems: TocItem[] = [];

      headings.forEach((heading) => {
        const text = heading.textContent ?? "";
        const id = slugify(text) || `heading-${tocItems.length}`;
        heading.id = id;
        tocItems.push({ id, label: text, level: parseInt(heading.tagName[1]) as 1 | 2 | 3 });
      });

      setItems(tocItems);
      if (tocItems.length) setActiveId(tocItems[0].id);

      // IntersectionObserver para destacar a seção visível
      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
              break;
            }
          }
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );

      headings.forEach((h) => observerRef.current!.observe(h));
    }, 100);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [contentSelector]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  }

  if (!items.length) return null;

  return (
    <nav className="sticky top-24 space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 flex items-center gap-1.5">
        <BookOpen className="size-3" />
        Neste artigo
      </p>
      {items.map((item) => {
        const isActive = activeId === item.id;
        const indent = item.level === 1 ? "" : item.level === 2 ? "pl-3" : "pl-6";
        const border = item.level > 1
          ? isActive ? "border-l border-violet-600" : "border-l border-zinc-800"
          : "";
        const color = isActive ? "text-violet-400" : item.level === 1 ? "text-zinc-400" : "text-zinc-600";

        return (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`block w-full text-left text-xs leading-snug py-0.5 transition-colors hover:text-violet-400 ${indent} ${border} ${color}`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}