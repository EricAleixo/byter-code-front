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
    content,
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
          "prose-hr:border-zinc-800 " +
          "prose-li:text-zinc-300",
      },
    },
  });

  return <EditorContent editor={editor} />;
}