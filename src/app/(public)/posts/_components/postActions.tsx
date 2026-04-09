"use client";

import {
  FaXTwitter,
  FaWhatsapp,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa6";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  path: string;
  title: string;
};

export function PostActions({ path, title }: Props) {
  const url = window.location.origin + path
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const actions = [
    {
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      label: "Compartilhar no X",
      icon: FaXTwitter,
      hoverColor: "hover:text-white", // X geralmente branco/preto
    },
    {
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      label: "Compartilhar no WhatsApp",
      icon: FaWhatsapp,
      hoverColor: "hover:text-green-500",
    },
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: "Compartilhar no Facebook",
      icon: FaFacebook,
      hoverColor: "hover:text-blue-600",
    },
    {
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: "Compartilhar no LinkedIn",
      icon: FaLinkedin,
      hoverColor: "hover:text-blue-500",
    },
  ];

  return (
    <TooltipProvider>
      <div className="flex items-center mt-10 pt-8 border-t border-zinc-800">
        <div className="flex items-center gap-3">
          {actions.map((action, i) => {
            const Icon = action.icon;

            return (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <a
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 text-zinc-500 transition-all duration-200 hover:scale-110 ${action.hoverColor}`}
                  >
                    <Icon size={20} />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}