import Link from "next/link";
import { categoriesService } from "@/src/services/categories.service";
import { FaGithub, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa6";

export async function Footer() {
  const categories = await categoriesService.findAll();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-auto">
      <div className="h-0.5 w-full bg-linear-to-r from-violet-600 via-violet-500 to-violet-700" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* marca */}
          <div className="space-y-3">
            <Link href="/">
              <span
                className="text-2xl font-black tracking-tight"
                style={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  background:
                    "linear-gradient(90deg, #5b21b6, #7c3aed 40%, #c4b5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                byter-code
              </span>
            </Link>

            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Artigos, tutoriais e referências sobre desenvolvimento de software.
            </p>

            {/* dev */}
            <p className="text-xs text-zinc-600">
              Desenvolvido por{" "}
              <span className="text-zinc-400 font-medium">
                Eric Aleixo
              </span>
            </p>

            {/* redes */}
            <div className="flex items-center gap-3 pt-1">
              <Link
                href="https://github.com/EricAleixo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-zinc-600 hover:text-violet-400 transition-colors"
                title="GitHub"
              >
                <FaGithub className="size-4" />
              </Link>

              <Link
                href="https://wa.me/83998671283"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-zinc-600 hover:text-green-400 transition-colors"
                title="WhatsApp"
              >
                <FaWhatsapp className="size-4" />
              </Link>

              <Link
                href="https://www.instagram.com/eric.aleixo/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-zinc-600 hover:text-pink-400 transition-colors"
                title="Instagram"
              >
                <FaInstagram className="size-4" />
              </Link>
            </div>
          </div>

          {/* navegação */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              Navegação
            </p>
            <ul className="space-y-2">
              {[
                { label: "Início", href: "/" },
                { label: "Artigos", href: "/posts" },
                { label: "Seções", href: "/sections" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* seções/categorias */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              Seções
            </p>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/sections/${c.slug}`}
                    className="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-(--hover-color) group"
                    style={{ "--hover-color": c.color } as React.CSSProperties & { "--hover-color": string }}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* rodapé inferior */}
        <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} byter-code. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}