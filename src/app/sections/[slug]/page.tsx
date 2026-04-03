import { Input } from "@/components/ui/input";
import {
    Clock,
    TrendingUp,
    BookOpen,
    Cpu,
    Globe,
    Terminal,
    Rss,
    Search,
    ChevronRight,
    Flame,
    ArrowLeft,
    SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// ─── tipos ────────────────────────────────────────────────────────────────────

type Article = {
    slug: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    tag?: "novo" | "trending" | "exclusivo";
    image: string;
};

type CategoryMeta = {
    label: string;
    description: string;
    icon: React.ReactNode;
    image: string;        // banner
    overlay: string;
    accent: string;
    accentBg: string;
    count: number;
};

// ─── mapa de categorias ───────────────────────────────────────────────────────

const CATEGORY_MAP: Record<string, CategoryMeta> = {
    frontend: {
        label: "Frontend",
        description: "React, Next.js, CSS, performance de UI e tudo que vive no browser.",
        icon: <Globe className="size-6" />,
        image: "https://picsum.photos/seed/frontend-cat/1400/500",
        overlay: "rgba(88,28,220,0.78)",
        accent: "#c4b5fd",
        accentBg: "rgba(109,40,217,0.15)",
        count: 87,
    },
    backend: {
        label: "Backend",
        description: "APIs, bancos de dados, microsserviços, Node, Go, Python e muito mais.",
        icon: <Terminal className="size-6" />,
        image: "https://picsum.photos/seed/backend-cat/1400/500",
        overlay: "rgba(4,120,87,0.78)",
        accent: "#6ee7b7",
        accentBg: "rgba(5,150,105,0.15)",
        count: 64,
    },
    devops: {
        label: "DevOps",
        description: "CI/CD, containers, Kubernetes, observabilidade e cultura de deploy.",
        icon: <Cpu className="size-6" />,
        image: "https://picsum.photos/seed/devops-cat/1400/500",
        overlay: "rgba(12,100,130,0.78)",
        accent: "#7dd3fc",
        accentBg: "rgba(14,116,144,0.15)",
        count: 43,
    },
    "ia-ml": {
        label: "IA & ML",
        description: "LLMs, visão computacional, MLOps e aplicações reais de inteligência artificial.",
        icon: <TrendingUp className="size-6" />,
        image: "https://picsum.photos/seed/iaml-cat/1400/500",
        overlay: "rgba(159,18,57,0.78)",
        accent: "#fda4af",
        accentBg: "rgba(190,18,60,0.15)",
        count: 52,
    },
    tutoriais: {
        label: "Tutoriais",
        description: "Passo a passo do básico ao avançado. Aprenda fazendo projetos reais.",
        icon: <BookOpen className="size-6" />,
        image: "https://picsum.photos/seed/tutoriais-cat/1400/500",
        overlay: "rgba(146,64,14,0.78)",
        accent: "#fcd34d",
        accentBg: "rgba(180,83,9,0.15)",
        count: 119,
    },
    "open-source": {
        label: "Open Source",
        description: "Projetos, contribuições, ferramentas e a cultura do código aberto.",
        icon: <Rss className="size-6" />,
        image: "https://picsum.photos/seed/opensource-cat/1400/500",
        overlay: "rgba(13,100,90,0.78)",
        accent: "#5eead4",
        accentBg: "rgba(15,118,110,0.15)",
        count: 31,
    },
};

// ─── artigos mock por categoria ───────────────────────────────────────────────

const MOCK_ARTICLES: Record<string, Article[]> = {
    frontend: [
        {
            slug: "react-19-novidades",
            title: "React 19: todas as novidades que você precisa conhecer agora",
            excerpt: "Actions, use(), melhorias no Server Components e o que o time da Meta está planejando para o futuro do framework.",
            author: "Ana Beatriz Souza",
            date: "31 mar 2025",
            readTime: "9 min",
            tag: "novo",
            image: "https://picsum.photos/seed/react19/600/400",
        },
        {
            slug: "tailwind-v4-o-que-mudou",
            title: "Tailwind v4: tudo que mudou e como migrar sem quebrar nada",
            excerpt: "A nova engine em Rust, a eliminação do tailwind.config.js e as novas primitivas de CSS que mudam tudo.",
            author: "João Vitor Lima",
            date: "29 mar 2025",
            readTime: "6 min",
            tag: "trending",
            image: "https://picsum.photos/seed/tailwindv4/600/400",
        },
        {
            slug: "css-container-queries",
            title: "Container Queries na prática: adeus media queries de breakpoint",
            excerpt: "Como usar @container para criar componentes verdadeiramente responsivos, independente de onde estão na página.",
            author: "Letícia Moura",
            date: "27 mar 2025",
            readTime: "7 min",
            image: "https://picsum.photos/seed/containerq/600/400",
        },
        {
            slug: "nextjs-app-router-patterns",
            title: "Padrões avançados com o App Router do Next.js 15",
            excerpt: "Layouts aninhados, Parallel Routes, Intercepting Routes e como organizar projetos grandes sem perder o juízo.",
            author: "Carlos Henrique",
            date: "25 mar 2025",
            readTime: "12 min",
            tag: "exclusivo",
            image: "https://picsum.photos/seed/nextjs15/600/400",
        },
        {
            slug: "view-transitions-api",
            title: "View Transitions API: animações de página nativas no browser",
            excerpt: "Sem libs, sem hacks. A nova API que traz transições de SPA para o HTML puro — e como usar já no Next.js.",
            author: "Fernanda Costa",
            date: "23 mar 2025",
            readTime: "8 min",
            image: "https://picsum.photos/seed/viewtrans/600/400",
        },
        {
            slug: "shadcn-ui-customizando",
            title: "shadcn/ui além do básico: customizando do jeito certo",
            excerpt: "Temas, variantes, composição de componentes e como não virar escravo de uma design system que não é sua.",
            author: "Rafael Mendonça",
            date: "21 mar 2025",
            readTime: "10 min",
            image: "https://picsum.photos/seed/shadcn/600/400",
        },
    ],
    backend: [
        {
            slug: "bun-vs-node-benchmark",
            title: "Bun 1.2 vs Node 22: benchmark real em APIs de alta carga",
            excerpt: "Testamos os dois runtimes com 50 mil req/s em uma API REST simples. Os resultados surpreenderam.",
            author: "Camila Torres",
            date: "30 mar 2025",
            readTime: "8 min",
            tag: "trending",
            image: "https://picsum.photos/seed/bunnode/600/400",
        },
        {
            slug: "postgres-vs-sqlite-edge",
            title: "SQLite no edge: quando faz sentido (e quando não faz)",
            excerpt: "Cloudflare D1, Turso e Litestream colocaram o SQLite na moda. Mas será que é bala de prata?",
            author: "Fernanda Costa",
            date: "28 mar 2025",
            readTime: "10 min",
            image: "https://picsum.photos/seed/sqliteedge/600/400",
        },
        {
            slug: "drizzle-orm-guia",
            title: "Drizzle ORM: o guia que o Prisma não quer que você leia",
            excerpt: "Por que cada vez mais devs estão migrando para o Drizzle e como fazer essa transição sem dor.",
            author: "Lucas Faria",
            date: "26 mar 2025",
            readTime: "11 min",
            tag: "novo",
            image: "https://picsum.photos/seed/drizzle/600/400",
        },
    ],
    devops: [
        {
            slug: "docker-sem-root",
            title: "Containers rootless com Podman: guia definitivo para produção",
            excerpt: "Segurança sem abrir mão de ergonomia. Veja como migrar do Docker sem reescrever seus Dockerfiles.",
            author: "Lucas Faria",
            date: "27 mar 2025",
            readTime: "9 min",
            image: "https://picsum.photos/seed/podman/600/400",
        },
        {
            slug: "github-actions-avancado",
            title: "GitHub Actions avançado: cache, matrix e self-hosted runners",
            excerpt: "Pipelines que levam 20 minutos podem cair para menos de 3 com as técnicas certas de otimização.",
            author: "Marco Aurélio",
            date: "24 mar 2025",
            readTime: "13 min",
            tag: "trending",
            image: "https://picsum.photos/seed/ghactions/600/400",
        },
    ],
    "ia-ml": [
        {
            slug: "llms-em-producao-2025",
            title: "Como grandes empresas estão colocando LLMs em produção — e o que está dando errado",
            excerpt: "Entrevistamos CTOs de 12 startups para entender os maiores gargalos: latência, custo, alucinações e governança.",
            author: "Rafael Mendonça",
            date: "31 mar 2025",
            readTime: "12 min",
            tag: "exclusivo",
            image: "https://picsum.photos/seed/llms/600/400",
        },
        {
            slug: "rag-na-pratica",
            title: "RAG na prática: construindo um chatbot com documentos reais",
            excerpt: "Do chunking à geração de embeddings, passando por reranking e avaliação de qualidade das respostas.",
            author: "Ana Beatriz Souza",
            date: "28 mar 2025",
            readTime: "15 min",
            tag: "novo",
            image: "https://picsum.photos/seed/ragpratica/600/400",
        },
    ],
    tutoriais: [
        {
            slug: "rust-para-devs-js",
            title: "Rust para quem só conhece JavaScript: o guia honesto",
            excerpt: "Sem hype, sem mentira. O que você vai amar, o que vai odiar e o que vai te fazer desistir.",
            author: "Marco Aurélio",
            date: "25 mar 2025",
            readTime: "11 min",
            image: "https://picsum.photos/seed/rustjs/600/400",
        },
        {
            slug: "react-server-components-deep",
            title: "React Server Components na prática: o que ninguém te conta",
            excerpt: "Depois de um ano com RSC em produção, esses são os padrões que funcionam e as armadilhas reais.",
            author: "Ana Beatriz Souza",
            date: "26 mar 2025",
            readTime: "14 min",
            tag: "trending",
            image: "https://picsum.photos/seed/rsc/600/400",
        },
        {
            slug: "typescript-avancado",
            title: "TypeScript avançado: tipos utilitários que você não usa mas devia",
            excerpt: "Infer, mapped types, template literal types e como escrever tipos que realmente documentam a intenção.",
            author: "Letícia Moura",
            date: "22 mar 2025",
            readTime: "10 min",
            tag: "novo",
            image: "https://picsum.photos/seed/tsavancado/600/400",
        },
    ],
    "open-source": [
        {
            slug: "contribuindo-primeiro-pr",
            title: "Como fazer seu primeiro PR em um projeto open source de verdade",
            excerpt: "Um guia honesto sobre como encontrar issues boas, se comunicar com maintainers e não desistir na primeira rejeição.",
            author: "Carlos Henrique",
            date: "28 mar 2025",
            readTime: "8 min",
            tag: "novo",
            image: "https://picsum.photos/seed/firstpr/600/400",
        },
        {
            slug: "ferramentas-dev-2025",
            title: "10 ferramentas open source que todo dev devia conhecer em 2025",
            excerpt: "Da CLI ao self-hosted, uma curadoria de projetos que saíram do GitHub e chegaram ao nosso workflow diário.",
            author: "Camila Torres",
            date: "25 mar 2025",
            readTime: "6 min",
            tag: "trending",
            image: "https://picsum.photos/seed/ostools/600/400",
        },
    ],
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function TagBadge({ tag }: { tag: Article["tag"] }) {
    if (!tag) return null;
    const map = {
        novo: "bg-violet-500/20 text-violet-300 border-violet-500/30",
        trending: "bg-rose-500/20 text-rose-300 border-rose-500/30",
        exclusivo: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${map[tag]}`}>
            {tag === "trending" && <Flame className="size-2.5" />}
            {tag}
        </span>
    );
}

// ─── subcomponentes ───────────────────────────────────────────────────────────

function CategoryBanner({ meta }: { meta: CategoryMeta }) {
    return (
        <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-2xl mb-8">
            {/* foto */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={meta.image}
                alt={meta.label}
                className="w-full h-full object-cover"
            />
            {/* overlay */}
            <div className="absolute inset-0" style={{ background: meta.overlay }} />

            {/* conteúdo */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-2" style={{ color: meta.accent }}>
                    {meta.icon}
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: meta.accent }}>
                        {meta.count} artigos
                    </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-1">
                    {meta.label}
                </h1>
                <p className="text-sm text-white/70 max-w-lg">{meta.description}</p>
            </div>
        </div>
    );
}

function FeaturedCard({ article, accent, accentBg }: { article: Article; accent: string; accentBg: string }) {
    return (
        <article className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors cursor-pointer">
            <div className="relative h-52 sm:h-64 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    <TagBadge tag={article.tag} />
                </div>
            </div>
            <div className="p-5">
                <h2 className="text-lg font-bold text-white leading-snug mb-2 group-hover:text-opacity-80 transition-colors line-clamp-2"
                    style={{ color: "white" }}
                >
                    {article.title}
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="text-zinc-300 font-medium">{article.author}</span>
                        <span>·</span>
                        <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: accent }}>
                        <Clock className="size-3" />
                        <span>{article.readTime}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}

function ArticleRow({ article, accent }: { article: Article; accent: string }) {
    return (
        <article className="group flex gap-4 py-4 cursor-pointer border-b border-zinc-800/60 last:border-0">
            <div className="flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                    <TagBadge tag={article.tag} />
                </div>
                <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-zinc-300 transition-colors leading-snug line-clamp-2 mb-1.5">
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
    );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const meta = CATEGORY_MAP[slug];
    if (!meta) notFound();

    const allArticles = MOCK_ARTICLES[slug] ?? [];
    const [featured, ...rest] = allArticles;

    const otherCategories = Object.entries(CATEGORY_MAP).filter(
        ([key]) => key !== slug
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* barra de topo */}
            <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${meta.accent}88, ${meta.accent}, ${meta.accent}88)` }} />

            {/* navbar simples */}
            <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-4 py-3">
                    <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
                        <ArrowLeft className="size-4" />
                        <span
                            className="text-xl font-black tracking-tight"
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                background: "linear-gradient(90deg, #5b21b6, #7c3aed 40%, #c4b5fd)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            byte-coder
                        </span>
                    </Link>

                    {/* breadcrumb */}
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500">
                        <Link href="/" className="hover:text-zinc-300 transition-colors">Início</Link>
                        <ChevronRight className="size-3" />
                        <span className="font-medium" style={{ color: meta.accent }}>{meta.label}</span>
                    </div>

                    {/* busca */}
                    <div className="relative hidden sm:flex items-center">
                        <Search className="absolute left-3 size-3.5 text-zinc-500 pointer-events-none" />
                        <Input
                            type="search"
                            placeholder={`Buscar em ${meta.label}...`}
                            className="pl-8 h-8 w-52 text-xs bg-zinc-900 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-1 rounded-lg"
                            style={{ "--tw-ring-color": meta.accent } as React.CSSProperties}
                        />
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">

                {/* banner */}
                <CategoryBanner meta={meta} />

                {/* filtros rápidos */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-none pb-1">
                    <button
                        className="flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
                        style={{ background: meta.accentBg, color: meta.accent, borderColor: `${meta.accent}44` }}
                    >
                        <SlidersHorizontal className="size-3" />
                        Filtrar
                    </button>
                    {["Mais recentes", "Mais lidos", "Tutoriais", "Artigos", "Vídeos"].map((f) => (
                        <button
                            key={f}
                            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-200 transition-colors"
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* coluna principal */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* destaque */}
                        {featured && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                                        Destaque
                                    </h2>
                                </div>
                                <FeaturedCard article={featured} accent={meta.accent} accentBg={meta.accentBg} />
                            </div>
                        )}

                        {/* demais artigos */}
                        {rest.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap flex-shrink-0">
                                            Todos os artigos
                                        </h2>
                                        <div className="h-px bg-zinc-800 flex-1 min-w-0" />
                                    </div>
                                    <span className="text-xs text-zinc-600 flex-shrink-0">{meta.count} no total</span>
                                </div>

                                <div>
                                    {rest.map((article) => (
                                        <ArticleRow key={article.slug} article={article} accent={meta.accent} />
                                    ))}
                                </div>

                                {/* paginação mock */}
                                <div className="flex items-center justify-center gap-1 mt-8">
                                    {[1, 2, 3, "...", 9].map((p, i) => (
                                        <button
                                            key={i}
                                            className="w-8 h-8 rounded-lg text-xs font-medium transition-colors"
                                            style={
                                                p === 1
                                                    ? { background: meta.accentBg, color: meta.accent, border: `1px solid ${meta.accent}44` }
                                                    : { color: "#71717a", border: "1px solid #27272a" }
                                            }
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* sidebar */}
                    <aside className="lg:col-span-1 space-y-8">

                        {/* sobre a categoria */}
                        <div
                            className="rounded-xl border p-4"
                            style={{ borderColor: `${meta.accent}33`, background: meta.accentBg }}
                        >
                            <div className="flex items-center gap-2 mb-3" style={{ color: meta.accent }}>
                                {meta.icon}
                                <span className="text-sm font-bold">{meta.label}</span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">{meta.description}</p>
                            <p className="text-xs mt-3 font-semibold" style={{ color: meta.accent }}>
                                {meta.count} artigos publicados
                            </p>
                        </div>

                        {/* outras categorias */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
                                Outras categorias
                            </h3>
                            <ul className="space-y-1">
                                {otherCategories.map(([key, cat]) => (
                                    <li key={key}>
                                        <Link
                                            href={`/categoria/${key}`}
                                            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors group"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span style={{ color: cat.accent }}>{cat.icon}</span>
                                                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                                                    {cat.label}
                                                </span>
                                            </div>
                                            <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">
                                                {cat.count}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </aside>
                </div>
            </main>

            <footer className="border-t border-zinc-800 mt-16 py-6 text-center text-xs text-zinc-600">
                © {new Date().getFullYear()} byte-coder · Feito com Next.js & Tailwind
            </footer>
        </div>
    );
}