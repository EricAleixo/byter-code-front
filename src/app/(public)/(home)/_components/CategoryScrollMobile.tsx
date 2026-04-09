"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Globe, Terminal, Cpu, TrendingUp, BookOpen, Rss } from "lucide-react";
import { CategoryWithPosts } from "@/src/types/category";
import { DynamicIcon } from "@/src/utils/DynamicIcon";


export default function CategoryScrollMobile({ categoriesData }: {categoriesData: CategoryWithPosts[]}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [categories] = useState<CategoryWithPosts[]>(categoriesData);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    setActive(Math.min(idx, categories.length - 1));
  }, [categories.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  if (!categories.length) return null;

  const cat = categories[active];

  return (
    <div className="sm:hidden relative rounded-2xl overflow-hidden" style={{ height: 260 }}>

      {categories.map((c, i) => (
        c.posts[0]?.coverImage && (
          <img
            key={c.id}
            src={c.posts[0].coverImage}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: i === active ? 1 : 0 }}
          />
        )
      ))}

      <div
        className="absolute inset-0 transition-all duration-500"
        style={{ background: `${cat.color}b8` }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none gap-3 z-10">
        <div style={{ color: "#fff", filter: `drop-shadow(0 0 12px ${cat.color}88)` }}>
          {<DynamicIcon name={cat.icon} />}
        </div>
        <p
          className="text-2xl font-black tracking-tight"
          style={{ color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,.5)" }}
        >
          {cat.name}
        </p>
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#fff" }}
        >
          {cat.posts.length} artigo{cat.posts.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div
        ref={scrollRef}
        className="absolute inset-0 z-20 flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {categories.map((c) => (
          <div key={c.id} className="shrink-0 w-full h-full snap-center" style={{ opacity: 0 }} />
        ))}
      </div>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-30 pointer-events-none">
        {categories.map((_, i) => (
          <span
            key={i}
            className="block rounded-full transition-all duration-300"
            style={{
              width: i === active ? 20 : 6,
              height: 6,
              background: i === active ? "#fff" : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>

      <p className="absolute bottom-10 left-0 right-0 text-center text-[10px] text-white/50 z-30 pointer-events-none">
        deslize para explorar
      </p>
    </div>
  );
}