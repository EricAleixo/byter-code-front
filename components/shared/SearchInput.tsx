"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Post } from "@/src/types/post";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

type SearchResult = Post;

type Props = {
  variant?: "desktop" | "mobile";
  onOpenSearch?: () => void;
};

async function searchPosts(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/search?q=${encodeURIComponent(query)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// ─── Modal mobile ─────────────────────────────────────────────────────────────
// Componente isolado montado condicionalmente — sem transição de opacity/transform
// condicional que bloqueava pointer-events no problema anterior.

function MobileSearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // foca e trava scroll ao montar
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 60);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // debounce da busca
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const data = await searchPosts(query);
      setResults(data);
      setLoading(false);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
    if (e.key === "Escape") onClose();
  }

  return createPortal(
    <div className="fixed inset-0 z-999 flex items-start justify-center pt-16 px-4">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* card do modal */}
      <div
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          {loading ? (
            <Loader2 className="size-4 text-violet-400 shrink-0 animate-spin" />
          ) : (
            <Search className="size-4 text-zinc-500 shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar artigos..."
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
          />
          <button
            onClick={query ? () => setQuery("") : onClose}
            className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors rounded"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* corpo */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* estado inicial */}
          {!query.trim() && (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Search className="size-7 text-zinc-700" />
              <p className="text-sm text-zinc-500">Digite para buscar artigos</p>
            </div>
          )}

          {/* carregando */}
          {loading && query.trim() && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-5 text-violet-400 animate-spin" />
            </div>
          )}

          {/* sem resultados */}
          {!loading && query.trim() && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
              <Search className="size-7 text-zinc-700" />
              <p className="text-sm text-zinc-500">
                Nenhum resultado para{" "}
                <span className="text-zinc-400">"{query}"</span>
              </p>
            </div>
          )}

          {/* resultados */}
          {!loading && results.length > 0 && (
            <>
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/60">
                <span className="text-[11px] text-zinc-600">
                  {results.length} resultado{results.length !== 1 ? "s" : ""} para "{query}"
                </span>
              </div>

              <ul className="divide-y divide-zinc-800/60">
                {results.slice(0, 8).map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/posts/${post.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/60 transition-colors group"
                    >
                      <div className="shrink-0 w-12 h-10 rounded-lg overflow-hidden bg-zinc-800">
                        {post.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{
                              background: `linear-gradient(135deg, ${post.category.color}20, ${post.category.color}05)`,
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[11px] font-bold uppercase tracking-widest mb-0.5"
                          style={{ color: post.category.color }}
                        >
                          {post.category.name}
                        </p>
                        <p className="text-sm font-medium text-zinc-200 group-hover:text-violet-300 transition-colors line-clamp-1">
                          {post.title}
                        </p>
                      </div>
                      <ArrowRight className="size-4 text-zinc-700 group-hover:text-violet-400 transition-colors shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SearchInput({ variant = "desktop", onOpenSearch }: Props) {
  const isMobile = variant === "mobile";
  const [modalOpen, setModalOpen] = useState(false);

  // ── mobile: botão + modal montado condicionalmente ──
  if (isMobile) {
    function handleOpen() {
      onOpenSearch?.();   // fecha o drawer antes de abrir o modal
      setModalOpen(true);
    }

    return (
      <>
        <button
          type="button"
          onClick={handleOpen}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          aria-label="Buscar"
        >
          <Search className="size-5" />
        </button>

        {/* monta/desmonta o modal — sem opacity trick que bloqueava clicks */}
        {modalOpen && <MobileSearchModal onClose={() => setModalOpen(false)} />}
      </>
    );
  }

  // ── desktop: dropdown inline ──
  return <DesktopSearchInput />;
}

// ─── Desktop (extraído para manter hooks no nível correto) ────────────────────

function DesktopSearchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const data = await searchPosts(query);
      setResults(data);
      setOpen(true);
      setLoading(false);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function handleClear() {
    setQuery("");
    setResults([]);
    setOpen(false);
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setOpen(false);
    }
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <div className="relative">
      <div className="relative hidden sm:flex items-center">
        {loading ? (
          <Loader2 className="absolute left-3 size-3.5 text-violet-400 pointer-events-none animate-spin" />
        ) : (
          <Search className="absolute left-3 size-3.5 text-zinc-500 pointer-events-none" />
        )}
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Buscar artigos..."
          className="pl-8 pr-8 h-8 w-48 lg:w-64 text-xs bg-zinc-900 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-violet-600 focus-visible:border-violet-600 rounded-lg transition-all focus:w-72"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2.5 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-80 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl z-50 overflow-hidden">
            <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] text-zinc-600">
                {loading
                  ? "Buscando..."
                  : `${results.length} resultado${results.length !== 1 ? "s" : ""} para "${query}"`}
              </span>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-5 text-violet-400 animate-spin" />
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                <Search className="size-6 text-zinc-700" />
                <p className="text-xs text-zinc-500">Nenhum resultado encontrado.</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <ul className="max-h-80 overflow-y-auto divide-y divide-zinc-800/60">
                {results.slice(0, 6).map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/posts/${post.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 hover:bg-zinc-800 transition-colors group"
                    >
                      <div className="shrink-0 w-12 h-10 rounded-lg overflow-hidden bg-zinc-800">
                        {post.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{
                              background: `linear-gradient(135deg, ${post.category.color}20, ${post.category.color}05)`,
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-bold uppercase tracking-widest mb-0.5"
                          style={{ color: post.category.color }}
                        >
                          {post.category.name}
                        </p>
                        <p className="text-sm font-medium text-zinc-200 group-hover:text-violet-300 transition-colors line-clamp-1">
                          {post.title}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}