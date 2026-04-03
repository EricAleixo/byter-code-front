import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import PostForm, { PostFormData } from "@/components/shared/PostForm";

// ─── mock de posts existentes ─────────────────────────────────────────────────
// Substituir por fetch real ao banco/CMS

const MOCK_POSTS: Record<string, PostFormData> = {
  "tailwind-v4-o-que-mudou": {
    title: "Tailwind v4: tudo que mudou e como migrar sem quebrar nada",
    excerpt: "A nova engine em Rust, a eliminação do tailwind.config.js e as novas primitivas de CSS que mudam tudo na forma como você estiliza suas aplicações.",
    category: "frontend",
    tag: "novo",
    content: `## Introdução

O Tailwind CSS v4 representa a maior reescrita da ferramenta desde sua criação. Após meses de alpha e beta, a versão estável chegou trazendo uma nova filosofia de configuração, uma engine escrita em Rust e primitivas CSS nativas que antes exigiam plugins externos.

## Nova engine em Rust

A principal mudança interna do v4 é a substituição da engine de varredura de classes por uma implementada em Rust, chamada internamente de **Oxide**.

### Ganhos de performance

Em projetos com mais de 500 componentes, o build completo caiu de ~4s para menos de 400ms.

## Adeus tailwind.config.js

Uma das mudanças mais controversas: o arquivo de configuração JavaScript deixou de ser necessário.

\`\`\`css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-brand: #7c3aed;
}
\`\`\`

## Como migrar

\`\`\`bash
npx @tailwindcss/upgrade@next
\`\`\`

## Conclusão

O Tailwind v4 é uma evolução madura. A performance da nova engine justifica a migração por si só.`,
    coverImage: "https://picsum.photos/seed/tailwindv4/1200/500",
    readTime: "6 min",
    status: "published",
  },
  "bun-vs-node-benchmark": {
    title: "Bun 1.2 vs Node 22: benchmark real em APIs de alta carga",
    excerpt: "Testamos os dois runtimes com 50 mil req/s em uma API REST simples. Os resultados surpreenderam.",
    category: "backend",
    tag: "trending",
    content: `## Contexto

Bun vem ganhando espaço como alternativa ao Node.js. Com a versão 1.2, a promessa é compatibilidade total e performance superior.

## Setup do benchmark

Utilizamos um servidor REST simples com 3 rotas, rodando em uma VPS de 4 vCPUs e 8GB de RAM.

## Resultados

| Runtime | req/s  | Latência p99 |
|---------|--------|--------------|
| Node 22 | 42.300 | 24ms         |
| Bun 1.2 | 81.700 | 11ms         |

## Conclusão

O Bun entregou quase o dobro de throughput no cenário testado.`,
    coverImage: "https://picsum.photos/seed/bun/1200/500",
    readTime: "8 min",
    status: "published",
  },
};

// ─── page ─────────────────────────────────────────────────────────────────────

export default function EditPostPage({ params }: { params: { slug: string } }) {
  const post = MOCK_POSTS[params.slug];
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="h-0.5 w-full bg-linear-to-r from-violet-700 via-violet-500 to-violet-700" />

      {/* header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex items-center justify-between gap-4 py-3">
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
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Pencil className="size-4" />
            <span>Editando post</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        {/* page title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-zinc-600 mb-2">
            <span>admin</span>
            <span>/</span>
            <span>posts</span>
            <span>/</span>
            <span className="text-violet-400">{params.slug}</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-1">Editar post</h1>
          <p className="text-sm text-zinc-500">
            Última edição salva como{" "}
            <span className={post.status === "published" ? "text-emerald-400" : "text-amber-400"}>
              {post.status === "published" ? "publicado" : "rascunho"}
            </span>
            . Campos com <span className="text-rose-400">*</span> são obrigatórios.
          </p>
        </div>

        <PostForm isEdit initialData={post} />
      </main>

      <footer className="border-t border-zinc-800 mt-16 py-6 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} byte-coder · Admin
      </footer>
    </div>
  );
}