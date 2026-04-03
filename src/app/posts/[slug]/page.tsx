import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  ArrowLeft,
  Flame,
  BookOpen,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageSquare,
  ChevronRight,
  Globe,
} from "lucide-react";
import Link from "next/link";

// ─── tipos ────────────────────────────────────────────────────────────────────

type Comment = {
  id: string;
  author: string;
  avatar: string;
  date: string;
  body: string;
  likes: number;
  replies?: Comment[];
};

type TocItem = {
  id: string;
  label: string;
  level: 1 | 2;
};

// ─── mock ─────────────────────────────────────────────────────────────────────

const POST = {
  slug: "tailwind-v4-o-que-mudou",
  category: "Frontend",
  categorySlug: "frontend",
  title: "Tailwind v4: tudo que mudou e como migrar sem quebrar nada",
  excerpt:
    "A nova engine em Rust, a eliminação do tailwind.config.js e as novas primitivas de CSS que mudam tudo na forma como você estiliza suas aplicações.",
  author: {
    name: "João Vitor Lima",
    role: "Dev Frontend Sênior",
    avatar: "https://picsum.photos/seed/autor-joao/80/80",
  },
  date: "29 mar 2025",
  readTime: "6 min",
  tag: "novo" as const,
  image: "https://picsum.photos/seed/tailwindv4/1200/500",
  likes: 341,
  comments: 28,
};

const TOC: TocItem[] = [
  { id: "introducao", label: "Introdução", level: 1 },
  { id: "nova-engine", label: "Nova engine em Rust", level: 1 },
  { id: "performance", label: "Ganhos de performance", level: 2 },
  { id: "sem-config", label: "Adeus tailwind.config.js", level: 1 },
  { id: "css-first", label: "Configuração CSS-first", level: 2 },
  { id: "temas", label: "Temas com @theme", level: 2 },
  { id: "novas-primitivas", label: "Novas primitivas CSS", level: 1 },
  { id: "container-queries", label: "Container queries nativas", level: 2 },
  { id: "3d", label: "Transformações 3D", level: 2 },
  { id: "migracao", label: "Como migrar", level: 1 },
  { id: "codemod", label: "Usando o codemod oficial", level: 2 },
  { id: "conclusao", label: "Conclusão", level: 1 },
];

const COMMENTS: Comment[] = [
  {
    id: "c1",
    author: "Mariana Fonseca",
    avatar: "https://picsum.photos/seed/mariana/48/48",
    date: "29 mar 2025",
    body: "Finalmente um artigo que explica a migração de forma prática! Já estava postergando atualizar meu projeto por medo de quebrar tudo. Vou tentar esse fim de semana.",
    likes: 42,
    replies: [
      {
        id: "c1r1",
        author: "João Vitor Lima",
        avatar: "https://picsum.photos/seed/autor-joao/48/48",
        date: "29 mar 2025",
        body: "Boa sorte! Se tiver dúvidas, deixa mais um comentário aqui. O codemod resolve uns 90% dos casos, o restante é ajuste manual mesmo.",
        likes: 18,
      },
    ],
  },
  {
    id: "c2",
    author: "Felipe Andrade",
    avatar: "https://picsum.photos/seed/felipe/48/48",
    date: "30 mar 2025",
    body: "A parte da engine em Rust faz sentido, mas o que me preocupa é a compatibilidade com plugins de terceiros. Alguém sabe como fica o tailwindcss-animate, por exemplo?",
    likes: 29,
    replies: [
      {
        id: "c2r1",
        author: "Letícia Moura",
        avatar: "https://picsum.photos/seed/leticia/48/48",
        date: "30 mar 2025",
        body: "Testei o tailwindcss-animate na semana passada e funcionou depois de atualizar para a versão compatível com v4. Tem um PR aberto no repo deles.",
        likes: 15,
      },
      {
        id: "c2r2",
        author: "Carlos Henrique",
        avatar: "https://picsum.photos/seed/carlos/48/48",
        date: "31 mar 2025",
        body: "Confirmo. A maioria dos plugins populares já tem suporte ou está em processo. A documentação oficial lista os compatíveis.",
        likes: 9,
      },
    ],
  },
  {
    id: "c3",
    author: "Camila Torres",
    avatar: "https://picsum.photos/seed/camila2/48/48",
    date: "31 mar 2025",
    body: "Excelente conteúdo! Uma coisa que faltou mencionar: a remoção do JIT mode, que agora é padrão absoluto. Em projetos legados que tinham o modo antigo pode causar diferença visual sutil.",
    likes: 37,
  },
  {
    id: "c4",
    author: "Rafael Mendonça",
    avatar: "https://picsum.photos/seed/rafael/48/48",
    date: "31 mar 2025",
    body: "Migrei um projeto de médio porte ontem e deu certo em menos de 2 horas com o codemod. O único problema foi customização de cores com HSL que precisei ajustar à mão no @theme.",
    likes: 21,
  },
];

const RELATED = [
  {
    slug: "react-19-novidades",
    title: "React 19: todas as novidades que você precisa conhecer",
    readTime: "9 min",
    image: "https://picsum.photos/seed/react19/200/120",
    tag: "novo" as const,
  },
  {
    slug: "shadcn-ui-customizando",
    title: "shadcn/ui além do básico: customizando do jeito certo",
    readTime: "10 min",
    image: "https://picsum.photos/seed/shadcn/200/120",
  },
  {
    slug: "css-container-queries",
    title: "Container Queries na prática: adeus media queries de breakpoint",
    readTime: "7 min",
    image: "https://picsum.photos/seed/containerq/200/120",
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function TagBadge({ tag }: { tag: "novo" | "trending" | "exclusivo" }) {
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

function CommentCard({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  return (
    <div className={`flex gap-3 ${isReply ? "ml-10 mt-4" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={comment.avatar}
        alt={comment.author}
        className="flex-shrink-0 w-9 h-9 rounded-full object-cover ring-1 ring-zinc-700"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-semibold text-zinc-200">{comment.author}</span>
          <span className="text-[11px] text-zinc-600">{comment.date}</span>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">{comment.body}</p>
        <div className="flex items-center gap-4 mt-2.5">
          <button className="flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-violet-400 transition-colors">
            <ThumbsUp className="size-3" />
            <span>{comment.likes}</span>
          </button>
          <button className="text-[11px] text-zinc-600 hover:text-violet-400 transition-colors">
            Responder
          </button>
        </div>
        {comment.replies?.map((reply) => (
          <CommentCard key={reply.id} comment={reply} isReply />
        ))}
      </div>
    </div>
  );
}

// ─── TOC Desktop (server) ─────────────────────────────────────────────────────

function TableOfContents() {
  return (
    <nav className="sticky top-24 space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 flex items-center gap-1.5">
        <BookOpen className="size-3" />
        Neste artigo
      </p>
      {TOC.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`block text-xs leading-snug py-0.5 transition-colors hover:text-violet-400 ${
            item.level === 2
              ? "pl-3 text-zinc-600 border-l border-zinc-800 hover:border-violet-700"
              : "text-zinc-400"
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function PostPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* barra topo violeta */}
      <div className="h-0.5 w-full bg-gradient-to-r from-violet-700 via-violet-500 to-violet-700" />

      {/* navbar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="size-4 text-zinc-500" />
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
            <Link href={`/categoria/${POST.categorySlug}`} className="hover:text-zinc-300 transition-colors text-violet-400">
              {POST.category}
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-zinc-600 truncate max-w-40">{POST.title}</span>
          </div>

          {/* ações */}
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-zinc-500 hover:text-white transition-colors">
              <Bookmark className="size-4" />
            </button>
            <button className="p-1.5 text-zinc-500 hover:text-white transition-colors">
              <Share2 className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* layout principal */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_220px] gap-12">

          {/* ── conteúdo ── */}
          <article className="min-w-0">

            {/* cabeçalho do post */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Link
                  href={`/categoria/${POST.categorySlug}`}
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <Globe className="size-3" />
                  {POST.category}
                </Link>
                <span className="text-zinc-700">·</span>
                <TagBadge tag={POST.tag} />
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
                {POST.title}
              </h1>
              <p className="text-base text-zinc-400 leading-relaxed mb-6">{POST.excerpt}</p>

              {/* autor + meta */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={POST.author.avatar}
                    alt={POST.author.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-700/50"
                  />
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">{POST.author.name}</p>
                    <p className="text-[11px] text-zinc-500">{POST.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>{POST.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> {POST.readTime} de leitura
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="size-3" /> {POST.likes}
                  </span>
                </div>
              </div>
            </header>

            {/* imagem capa */}
            <div className="relative w-full h-56 sm:h-80 rounded-2xl overflow-hidden mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={POST.image} alt={POST.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
            </div>

            {/* ── corpo do post (mock) ── */}
            <div className="prose-custom space-y-6 text-zinc-300 text-[15px] leading-7">

              <section id="introducao">
                <h2 className="text-xl font-bold text-white mb-3">Introdução</h2>
                <p>
                  O Tailwind CSS v4 representa a maior reescrita da ferramenta desde sua criação. Após meses de alpha e beta,
                  a versão estável chegou trazendo uma nova filosofia de configuração, uma engine escrita em Rust e primitivas
                  CSS nativas que antes exigiam plugins externos.
                </p>
                <p>
                  Se você já usa o Tailwind há algum tempo, provavelmente tem um <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-300 text-sm">tailwind.config.js</code> cheio de customizações.
                  A boa notícia: existe um codemod oficial. A não tão boa: alguns ajustes manuais serão inevitáveis.
                </p>
              </section>

              <Separator className="bg-zinc-800" />

              <section id="nova-engine">
                <h2 className="text-xl font-bold text-white mb-3">Nova engine em Rust</h2>
                <p>
                  A principal mudança interna do v4 é a substituição da engine de varredura de classes por uma implementada em Rust,
                  chamada internamente de <strong className="text-zinc-200">Oxide</strong>. O impacto em builds grandes é significativo.
                </p>

                <div id="performance" className="mt-5">
                  <h3 className="text-base font-bold text-zinc-200 mb-2">Ganhos de performance</h3>
                  <p>
                    Em projetos com mais de 500 componentes, o build completo caiu de ~4s para menos de 400ms.
                    O modo watch agora atualiza em tempo real sem debounce visível — uma melhoria
                    perceptível no dia a dia de desenvolvimento.
                  </p>

                  {/* bloco de código mock */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-sm mt-4 overflow-x-auto">
                    <p className="text-zinc-600 mb-2"># Antes (v3)</p>
                    <p className="text-emerald-400">Tailwind CSS done in <span className="text-white">3.89s</span></p>
                    <p className="text-zinc-600 mt-3 mb-2"># Depois (v4)</p>
                    <p className="text-emerald-400">Tailwind CSS done in <span className="text-white">312ms</span></p>
                  </div>
                </div>
              </section>

              <Separator className="bg-zinc-800" />

              <section id="sem-config">
                <h2 className="text-xl font-bold text-white mb-3">Adeus tailwind.config.js</h2>
                <p>
                  Uma das mudanças mais controversas: o arquivo de configuração JavaScript deixou de ser necessário.
                  No lugar dele, toda a customização migrou para o próprio CSS.
                </p>

                <div id="css-first" className="mt-5">
                  <h3 className="text-base font-bold text-zinc-200 mb-2">Configuração CSS-first</h3>
                  <p>
                    Ao invés de exportar um objeto JavaScript, você agora importa o Tailwind como uma diretiva CSS e
                    define suas customizações diretamente no arquivo de estilos global.
                  </p>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-sm mt-4 overflow-x-auto">
                    <p className="text-zinc-500">/* globals.css */</p>
                    <p className="text-violet-400">@import <span className="text-amber-300">"tailwindcss"</span>;</p>
                    <p className="mt-3 text-violet-400">@theme <span className="text-zinc-300">{"{"}</span></p>
                    <p className="text-zinc-300 ml-4">--color-brand: <span className="text-emerald-400">#7c3aed</span>;</p>
                    <p className="text-zinc-300 ml-4">--font-display: <span className="text-emerald-400">"Syne"</span>, sans-serif;</p>
                    <p className="text-zinc-300">{"}"}</p>
                  </div>
                </div>

                <div id="temas" className="mt-5">
                  <h3 className="text-base font-bold text-zinc-200 mb-2">Temas com @theme</h3>
                  <p>
                    O bloco <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-300 text-sm">@theme</code> substitui
                    a chave <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-300 text-sm">theme.extend</code> do config antigo.
                    As variáveis definidas ali ficam disponíveis tanto como classes utilitárias quanto como custom properties CSS nativas.
                  </p>
                </div>
              </section>

              <Separator className="bg-zinc-800" />

              <section id="novas-primitivas">
                <h2 className="text-xl font-bold text-white mb-3">Novas primitivas CSS</h2>
                <p>
                  O v4 aproveita recursos que antes eram experimentais nos browsers e que agora têm suporte amplo.
                </p>

                <div id="container-queries" className="mt-5">
                  <h3 className="text-base font-bold text-zinc-200 mb-2">Container queries nativas</h3>
                  <p>
                    Sem plugin externo. Agora você usa <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-300 text-sm">@container</code> e
                    as variantes <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-300 text-sm">@sm:</code>,
                    <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-300 text-sm"> @lg:</code> etc. diretamente nas classes.
                  </p>
                </div>

                <div id="3d" className="mt-5">
                  <h3 className="text-base font-bold text-zinc-200 mb-2">Transformações 3D</h3>
                  <p>
                    Classes para <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-300 text-sm">rotate-x-*</code>,
                    <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-300 text-sm"> rotate-y-*</code> e
                    <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-300 text-sm"> perspective-*</code> chegam nativamente,
                    eliminando a necessidade do plugin <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-300 text-sm">tailwindcss-3d</code>.
                  </p>
                </div>
              </section>

              <Separator className="bg-zinc-800" />

              <section id="migracao">
                <h2 className="text-xl font-bold text-white mb-3">Como migrar</h2>
                <p>
                  A equipe do Tailwind disponibilizou um codemod que cobre a maioria dos cenários de migração automática.
                  O processo em projetos típicos leva menos de 15 minutos.
                </p>

                <div id="codemod" className="mt-5">
                  <h3 className="text-base font-bold text-zinc-200 mb-2">Usando o codemod oficial</h3>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-sm mt-4 overflow-x-auto">
                    <p className="text-zinc-500"># instale o v4 e rode o codemod</p>
                    <p className="text-emerald-400">npx <span className="text-white">@tailwindcss/upgrade@next</span></p>
                  </div>

                  <p className="mt-4">
                    Após o codemod, revise manualmente customizações de cores no formato HSL, plugins de terceiros
                    e qualquer uso de <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-300 text-sm">theme()</code> em arquivos CSS externos.
                  </p>
                </div>
              </section>

              <Separator className="bg-zinc-800" />

              <section id="conclusao">
                <h2 className="text-xl font-bold text-white mb-3">Conclusão</h2>
                <p>
                  O Tailwind v4 é uma evolução madura. A performance da nova engine justifica a migração por si só,
                  e a abordagem CSS-first é mais coerente com a direção que o ecossistema está tomando.
                  O custo de migração existe, mas o codemod oficial torna o processo administrável.
                </p>
                <p>
                  Se você tem um projeto greenfield, comece com v4 agora. Se tem um projeto legado, planeje uma sprint
                  curta para a migração — vale o investimento.
                </p>
              </section>

            </div>

            {/* ações do post */}
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-zinc-800">
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-zinc-900 gap-2 text-xs border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  <ThumbsUp className="size-3.5" />
                  {POST.likes} curtidas
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-zinc-900 gap-2 text-xs border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  <MessageSquare className="size-3.5" />
                  {POST.comments} comentários
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <Bookmark className="size-4" />
                </button>
                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <Share2 className="size-4" />
                </button>
              </div>
            </div>

            {/* autor card */}
            <div className="mt-8 p-5 rounded-xl border border-zinc-800 bg-zinc-900 flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={POST.author.avatar}
                alt={POST.author.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-violet-700/40 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-zinc-100">{POST.author.name}</p>
                <p className="text-xs text-violet-400 mb-2">{POST.author.role}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Desenvolvedor frontend com foco em React e performance. Escreve sobre ecossistema JavaScript, design systems e boas práticas de UI.
                </p>
              </div>
            </div>

            {/* posts relacionados */}
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap flex-shrink-0">
                  Leia também
                </h2>
                <div className="h-px bg-zinc-800 flex-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {RELATED.map((r) => (
                  <Link key={r.slug} href={`/post/${r.slug}`} className="group flex flex-col gap-2 cursor-pointer">
                    <div className="w-full h-28 rounded-lg overflow-hidden bg-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div>
                      {r.tag && <div className="mb-1"><TagBadge tag={r.tag} /></div>}
                      <p className="text-sm font-semibold text-zinc-200 group-hover:text-violet-300 transition-colors leading-snug line-clamp-2">
                        {r.title}
                      </p>
                      <p className="text-[11px] text-zinc-600 mt-1 flex items-center gap-1">
                        <Clock className="size-2.5" /> {r.readTime}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* comentários */}
            <div className="mt-12" id="comentarios">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap flex-shrink-0">
                  {POST.comments} Comentários
                </h2>
                <div className="h-px bg-zinc-800 flex-1" />
              </div>

              {/* caixa de novo comentário */}
              <div className="flex gap-3 mb-8">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-zinc-800 ring-1 ring-zinc-700 flex items-center justify-center text-zinc-500 text-xs font-bold">
                  ?
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Escreva um comentário..."
                    rows={3}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 resize-none transition-colors"
                  />
                  <div className="flex justify-end mt-2">
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold">
                      Comentar
                    </Button>
                  </div>
                </div>
              </div>

              {/* lista de comentários */}
              <div className="space-y-7">
                {COMMENTS.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))}
              </div>
            </div>

          </article>

          {/* ── sidebar direita (TOC) — apenas desktop ── */}
          <aside className="hidden xl:block">
            <TableOfContents />
          </aside>

        </div>
      </div>

      <footer className="border-t border-zinc-800 mt-16 py-6 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} byte-coder · Feito com Next.js & Tailwind
      </footer>
    </div>
  );
}