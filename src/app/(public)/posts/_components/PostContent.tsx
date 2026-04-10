"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import ResizeImage from "tiptap-extension-resize-image";

type Props = {
  content: string;
};

function processBlockquotes(html: string): string {
  return html.replace(
    /<blockquote>([\s\S]*?)<\/blockquote>/g,
    (_, inner) => {
      const processed = inner.replace(
        /(<p[^>]*>)([\s\S]*?)\s*[-–—]\s*([^<]+?)(<\/p>)/g,
        (_: string, open: string, text: string, author: string, close: string) =>
          `${open}<em>${text.trim()}</em><br/><span class="quote-author">— ${author.trim()}</span>${close}`
      );
      return `<blockquote>${processed}</blockquote>`;
    }
  );
}

export function PostContent({ content }: Props) {
  const lowlight = createLowlight();
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Link.configure({ openOnClick: true }),
      CodeBlockLowlight.configure({ lowlight }),
      ResizeImage.configure(),
    ],
    content: processBlockquotes(content),
    editorProps: {
      attributes: {
        class:
          "min-h-[380px] px-4 py-3 text-sm text-zinc-300 leading-7 focus:outline-none " +
          "prose prose-invert prose-sm max-w-none " +
          "prose-headings:font-black prose-headings:text-white " +
          "prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg " +
          "prose-p:text-zinc-300 prose-p:leading-7 " +
          "prose-a:text-violet-400 prose-a:no-underline hover:prose-a:text-violet-300 " +
          "prose-strong:text-zinc-100 " +
          "prose-code:text-violet-300 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none " +
          "prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700 prose-pre:rounded-xl " +
          "prose-blockquote:border-l-violet-600 prose-blockquote:text-zinc-400 prose-blockquote:not-italic " +
          "[&_blockquote_p]:italic " +
          "[&_.quote-author]:not-italic [&_.quote-author]:text-violet-400 [&_.quote-author]:text-xs [&_.quote-author]:block [&_.quote-author]:mt-2 [&_.quote-author]:not-italic " +
          "prose-hr:border-zinc-800 " +
          "prose-li:text-zinc-300" +
          "prose-li:text-zinc-300 " +
          "[&_img]:!max-w-full [&_img]:!h-auto",
      },
    },
  });

  return <EditorContent editor={editor} />;
}