import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clock,
  TrendingUp,
  BookOpen,
  Cpu,
  Globe,
  Terminal,
  ChevronRight,
  Flame,
  Rss,
  Search,
} from "lucide-react";
import CategoryScrollMobile from "./_components/CategoryScrollMobile";
import Link from "next/link";

// ─── tipos ────────────────────────────────────────────────────────────────────

type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  tag?: "novo" | "trending" | "exclusivo";
  image: string;
};

type Category = {
  label: string;
  icon: React.ReactNode;
  count: number;
  color: string;
};

// ─── dados mock ───────────────────────────────────────────────────────────────

const featured: Article = {
  slug: "llms-em-producao-2025",
  category: "IA & Machine Learning",
  title: "Como grandes empresas brasileiras estão colocando LLMs em produção — e o que está dando errado",
  excerpt:
    "Entrevistamos CTOs de 12 startups e empresas de médio porte para entender os maiores gargalos na adoção de modelos de linguagem: latência, custo, alucinações e governança de dados.",
  author: "Rafael Mendonça",
  date: "31 mar 2025",
  readTime: "12 min",
  tag: "exclusivo",
  image: "https://picsum.photos/seed/llms/1200/500",
};

const articles: Article[] = [
  {
    slug: "bun-vs-node-benchmark",
    category: "Backend",
    title: "Bun 1.2 vs Node 22: benchmark real em APIs de alta carga",
    excerpt: "Testamos os dois runtimes com 50 mil req/s em uma API REST simples. Os resultados surpreenderam.",
    author: "Camila Torres",
    date: "30 mar 2025",
    readTime: "8 min",
    tag: "trending",
    image: "https://picsum.photos/seed/bun/400/300",
  },
  {
    slug: "tailwind-v4-o-que-mudou",
    category: "Frontend",
    title: "Tailwind v4: tudo que mudou e como migrar sem quebrar nada",
    excerpt: "A nova engine em Rust, a eliminação do tailwind.config.js e as novas primitivas de CSS que mudam tudo.",
    author: "João Vitor Lima",
    date: "29 mar 2025",
    readTime: "6 min",
    tag: "novo",
    image: "https://picsum.photos/seed/tailwind/400/300",
  },
  {
    slug: "postgres-vs-sqlite-edge",
    category: "Banco de Dados",
    title: "SQLite no edge: quando faz sentido (e quando não faz)",
    excerpt: "Cloudflare D1, Turso e Litestream colocaram o SQLite na moda. Mas será que é bala de prata?",
    author: "Fernanda Costa",
    date: "28 mar 2025",
    readTime: "10 min",
    image: "https://picsum.photos/seed/sqlite/400/300",
  },
  {
    slug: "docker-sem-root",
    category: "DevOps",
    title: "Containers rootless com Podman: guia definitivo para produção",
    excerpt: "Segurança sem abrir mão de ergonomia. Veja como migrar do Docker sem reescrever seus Dockerfiles.",
    author: "Lucas Faria",
    date: "27 mar 2025",
    readTime: "9 min",
    image: "https://picsum.photos/seed/docker/400/300",
  },
  {
    slug: "react-server-components-deep",
    category: "Frontend",
    title: "React Server Components na prática: o que ninguém te conta",
    excerpt: "Depois de um ano com RSC em produção, esses são os padrões que funcionam e as armadilhas que você vai cair.",
    author: "Ana Beatriz Souza",
    date: "26 mar 2025",
    readTime: "14 min",
    tag: "trending",
    image: "https://picsum.photos/seed/rsc/400/300",
  },
  {
    slug: "rust-para-devs-js",
    category: "Linguagens",
    title: "Rust para quem só conhece JavaScript: o guia honesto",
    excerpt: "Sem hype, sem mentira. O que você vai amar, o que vai odiar e o que vai te fazer desistir na primeira semana.",
    author: "Marco Aurélio",
    date: "25 mar 2025",
    readTime: "11 min",
    image: "https://picsum.photos/seed/rust/400/300",
  },
];

const categories: Category[] = [
  { label: "Frontend", icon: <Globe className="size-4" />, count: 87, color: "text-violet-400" },
  { label: "Backend", icon: <Terminal className="size-4" />, count: 64, color: "text-emerald-400" },
  { label: "DevOps", icon: <Cpu className="size-4" />, count: 43, color: "text-sky-400" },
  { label: "IA & ML", icon: <TrendingUp className="size-4" />, count: 52, color: "text-rose-400" },
  { label: "Tutoriais", icon: <BookOpen className="size-4" />, count: 119, color: "text-amber-400" },
  { label: "Open Source", icon: <Rss className="size-4" />, count: 31, color: "text-teal-400" },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function TagBadge({ tag }: { tag: Article["tag"] }) {
  if (!tag) return null;
  const map = {
    novo: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    trending: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    exclusivo: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${map[tag]}`}
    >
      {tag === "trending" && <Flame className="size-2.5" />}
      {tag}
    </span>
  );
}

// ─── componentes ──────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
      {/* topo vermelho estilo jornal */}
      <div className="h-0.5 w-full bg-linear-to-r from-violet-600 via-violet-500 to-violet-700" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* linha principal */}
        <div className="flex items-center justify-between gap-4 py-3">
          {/* logo */}
          <a href="/" className="shrink-0">
            <span
              className="text-2xl font-black tracking-tight"
              style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                background: "linear-gradient(90deg, #5b21b6, #7c3aed 40%, #c4b5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              byte-coder
            </span>
          </a>

          {/* nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {["Início", "Tutoriais", "Notícias", "Projetos", "Sobre"].map((item) => (
              <a
                key={item}
                href="#"
                className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* barra de pesquisa */}
          <div className="relative hidden sm:flex items-center">
            <Search className="absolute left-3 size-3.5 text-zinc-500 pointer-events-none" />
            <Input
              type="search"
              placeholder="Buscar artigos..."
              className="pl-8 pr-4 h-8 w-48 lg:w-64 text-xs bg-zinc-900 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-violet-600 focus-visible:border-violet-600 rounded-lg"
            />
          </div>

          {/* ícone de busca mobile */}
          <button className="sm:hidden p-1.5 text-zinc-400 hover:text-white transition-colors">
            <Search className="size-4" />
          </button>
        </div>

        {/* linha de categorias rápidas */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none text-xs text-zinc-500">
          <span className="shrink-0 font-semibold text-zinc-600 uppercase tracking-widest text-[10px]">
            Seções
          </span>
          {categories.map((c) => (
            <Link
              key={c.label}
              href={`/sections/${c.label}`}
              className="shrink-0 hover:text-zinc-200 transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

function FeaturedArticle({ article }: { article: Article }) {
  return (
    <Link href={`/posts/${article.slug}`}>
      <article className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 hover:border-violet-700/50 transition-colors cursor-pointer">
        {/* imagem de capa */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <TagBadge tag={article.tag} />
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 text-xs border-zinc-700">
              {article.category}
            </Badge>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug group-hover:text-violet-300 transition-colors mb-3">
            {article.title}
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">{article.excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="text-zinc-300 font-medium">{article.author}</span>
            <span>·</span>
            <span>{article.date}</span>
            <span>·</span>
            <Clock className="size-3" />
            <span>{article.readTime} de leitura</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/posts/${article.slug}`}>
      <article className="group flex gap-4 py-4 cursor-pointer">
        {/* thumb */}
        <div className="shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
              {article.category}
            </span>
            <TagBadge tag={article.tag} />
          </div>
          <h3 className="text-sm font-semibold text-zinc-100 leading-snug group-hover:text-violet-300 transition-colors line-clamp-2 mb-1.5">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <span>{article.author}</span>
            <span>·</span>
            <Clock className="size-2.5" />
            <span>{article.readTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function Sidebar({ articles: sideArticles }: { articles: Article[] }) {
  return (
    <aside className="space-y-8">
      {/* mais lidos */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Flame className="size-4 text-rose-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Mais lidos hoje
          </h3>
        </div>
        <ol className="space-y-3">
          {sideArticles.slice(0, 4).map((a, i) => (
            <Link key={a.slug} href={`/posts/${a.slug}`}>
              <li className="group flex items-start gap-3 cursor-pointer">
                <span
                  className="shrink-0 text-2xl font-black leading-none"
                  style={{ color: i === 0 ? "#7c3aed" : "#3f3f46" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-300 group-hover:text-violet-300 transition-colors leading-snug line-clamp-2">
                    {a.title}
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">{a.date}</p>
                </div>
              </li>
            </Link>
          ))}
        </ol>
      </div>

      <Separator className="bg-zinc-800" />

      {/* categorias */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="size-4 text-zinc-500" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Explorar por área
          </h3>
        </div>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <Link key={cat.label} href={`/sections/${cat.label}`} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors group">
              <div className="flex items-center gap-2.5">
                <span className={cat.color}>{cat.icon}</span>
                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                  {cat.label}
                </span>
              </div>
              <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">
                {cat.count}
              </span>
            </Link>
          ))}
        </ul>
      </div>

      <Separator className="bg-zinc-800" />

      {/* mini newsletter */}
      <div className="rounded-xl border border-violet-800/40 bg-violet-950/30 p-4">
        <h3 className="text-sm font-bold text-white mb-1">📬 Newsletter semanal</h3>
        <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
          Os melhores artigos, tutoriais e notícias de tech direto no seu e-mail, toda segunda.
        </p>
        <Button size="sm" className="w-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold">
          Quero me inscrever
        </Button>
      </div>
    </aside>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const mainArticles = articles.slice(0, 3);
  const sidebarArticles = articles.slice(3);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">

        {/* ── breaking / destaque topo ── */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto">
          <span className="shrink-0 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
            Destaque
          </span>
          <Separator orientation="vertical" className="h-4 bg-zinc-700" />
          <p className="text-sm text-zinc-400 whitespace-nowrap">
            <span className="text-zinc-200 font-medium">Bun 1.2 lançado</span> — Runtime JS com compatibilidade total com Node e 3× mais rápido nos benchmarks
          </p>
        </div>

        {/* ── grid principal ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* coluna principal (2/3) */}
          <div className="lg:col-span-2 space-y-8">

            {/* manchete */}
            <FeaturedArticle article={featured} />

            {/* linha divisória com label */}
            <div className="flex items-center justify-between gap-3 min-w-0 mt-9">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap shrink-0">
                  Artigos recentes
                </h2>
                <div className="h-px bg-zinc-800 flex-1 min-w-0" />
              </div>
              <a href="#" className="shrink-0 flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors whitespace-nowrap">
                Ver todos <ChevronRight className="size-3" />
              </a>
            </div>

            {/* lista de artigos */}
            <div className="divide-y divide-zinc-800/60">
              {mainArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>

            {/* categorias em cards */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
                Explorar categorias
              </h2>

              {/* mobile: scroll com fundo dinâmico */}
              <CategoryScrollMobile />

              {/* desktop: grid de cards (sm+) */}
              <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.label}
                    href={`/sections/${cat.label}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 hover:border-violet-700/50 bg-zinc-900 hover:bg-zinc-800/80 transition-all group"
                  >
                    <span className={`${cat.color} group-hover:scale-110 transition-transform`}>
                      {cat.icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{cat.label}</p>
                      <p className="text-[11px] text-zinc-600">{cat.count} artigos</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* sidebar (1/3) */}
          <div className="lg:col-span-1">
            <Sidebar articles={sidebarArticles} />
          </div>
        </div>
      </main>

      {/* rodapé mínimo */}
      <footer className="border-t border-zinc-800 mt-12 py-6 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} byte-coder · Feito com Next.js & Tailwind
      </footer>
    </div>
  );
}