"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  adminPath?: boolean;
};

export function NavDropdown({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 px-2.5 py-1.5 text-sm rounded transition-colors ${
          open
            ? "text-white bg-zinc-800"
            : "text-zinc-400 hover:text-white hover:bg-zinc-800"
        }`}
      >
        <MoreHorizontal className="size-4" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-44 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden z-50">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center px-3 py-2.5 text-sm transition-colors hover:bg-zinc-800 ${
                item.adminPath
                  ? "text-violet-400 hover:text-violet-300"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}