"use client";

import { useState, useRef, useTransition } from "react";
import { ThumbsUp, MessageSquare, Send, Loader2, CornerDownRight, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/src/utils/formatDate";
import { User } from "@/src/types/user";
import { createCommentAction } from "../_actions/createComment.actions";

// ─── tipos ────────────────────────────────────────────────────────────────────

type CommentAuthor = {
    id: string;
    name: string;
    avatarUrl?: string | null;
};

export type ApiComment = {
    id: string;
    content: string;
    likes: number;
    createdAt: string;
    isAnonymous: boolean;
    displayName: string;
    author: CommentAuthor | null;
    replies: ApiComment[];
};

type Props = {
    postId: string;
    initialComments: ApiComment[];
    currentUser: User | null;
};

// ─── avatar ───────────────────────────────────────────────────────────────────

function Avatar({
    author,
    displayName,
    isAnonymous,
    size = "sm",
}: {
    author: CommentAuthor | null;
    displayName: string;
    isAnonymous: boolean;
    size?: "sm" | "md";
}) {
    const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";

    if (isAnonymous || !author) {
        return (
            <div className={`shrink-0 ${dim} rounded-full bg-zinc-800 ring-1 ring-zinc-700 flex items-center justify-center text-zinc-500`}>
                <UserX className="size-3.5" />
            </div>
        );
    }

    if (author.avatarUrl) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={author.avatarUrl}
                alt={displayName}
                className={`shrink-0 ${dim} rounded-full object-cover ring-1 ring-zinc-700`}
            />
        );
    }

    return (
        <div className={`shrink-0 ${dim} rounded-full bg-linear-to-tl from-violet-700 to-violet-900 ring-1 ring-violet-700/50 flex items-center justify-center text-white font-bold`}>
            {displayName[0].toUpperCase()}
        </div>
    );
}

// ─── current user avatar (formulário) ─────────────────────────────────────────

function CurrentUserAvatar({ user, size = "sm" }: { user: User | null; size?: "sm" | "md" }) {
    const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";

    if (!user) {
        return (
            <div className={`shrink-0 ${dim} rounded-full bg-zinc-800 ring-1 ring-zinc-700 flex items-center justify-center text-zinc-500 font-bold`}>
                ?
            </div>
        );
    }

    if (user.avatarUrl) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={user.avatarUrl}
                alt={user.name}
                className={`shrink-0 ${dim} rounded-full object-cover ring-1 ring-zinc-700`}
            />
        );
    }

    return (
        <div className={`shrink-0 ${dim} rounded-full bg-linear-to-tl from-violet-700 to-violet-900 ring-1 ring-violet-700/50 flex items-center justify-center text-white font-bold`}>
            {user.name[0].toUpperCase()}
        </div>
    );
}

// ─── anonymous toggle + name field ────────────────────────────────────────────

function AnonymousFields({
    isAnonymous,
    anonymousName,
    onToggle,
    onNameChange,
}: {
    isAnonymous: boolean;
    anonymousName: string;
    onToggle: () => void;
    onNameChange: (v: string) => void;
}) {
    return (
        <div className="mt-2 space-y-2">
            <button
                type="button"
                onClick={onToggle}
                className={`flex items-center gap-2 text-xs font-medium transition-colors ${isAnonymous ? "text-violet-400" : "text-zinc-500 hover:text-zinc-300"}`}
            >
                <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${isAnonymous ? "bg-violet-600 border-violet-600" : "border-zinc-600"}`}>
                    {isAnonymous && <span className="text-[9px] text-white font-black">✓</span>}
                </div>
                <UserX className="size-3" />
                Comentar anonimamente
            </button>

            {isAnonymous && (
                <input
                    type="text"
                    placeholder="Como quer ser chamado? (ex: Dev Curioso)"
                    value={anonymousName}
                    onChange={(e) => onNameChange(e.target.value)}
                    maxLength={100}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 transition-colors"
                />
            )}
        </div>
    );
}

// ─── reply form ───────────────────────────────────────────────────────────────

function ReplyForm({
    postId,
    parentId,
    currentUser,
    onSuccess,
    onCancel,
}: {
    postId: string;
    parentId: string;
    currentUser: User;
    onSuccess: (reply: ApiComment) => void;
    onCancel: () => void;
}) {
    const [content, setContent] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [anonymousName, setAnonymousName] = useState("");
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit() {
        if (!content.trim()) return;
        if (isAnonymous && !anonymousName.trim()) {
            setError("Digite um nome anônimo.");
            return;
        }

        startTransition(async () => {
            try {
                const reply = await createCommentAction({
                    content,
                    postId,
                    parentId,
                    isAnonymous,
                    anonymousName: isAnonymous ? anonymousName : undefined,
                });

                onSuccess({
                    ...reply,
                    author: isAnonymous ? null : {
                        id: currentUser.id,
                        name: currentUser.name,
                        avatarUrl: currentUser.avatarUrl ?? null,
                    },
                    displayName: isAnonymous ? anonymousName : currentUser.name,
                    isAnonymous,
                    replies: [],
                });

                setContent("");
                setIsAnonymous(false);
                setAnonymousName("");
            } catch {
                setError("Não foi possível enviar. Tente novamente.");
            }
        });
    }

    return (
        <div className="flex gap-2 mt-3 ml-10">
            {isAnonymous ? (
                <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-800 ring-1 ring-zinc-700 flex items-center justify-center text-zinc-500">
                    <UserX className="size-3.5" />
                </div>
            ) : (
                <CurrentUserAvatar user={currentUser} size="sm" />
            )}
            <div className="flex-1">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Escreva sua resposta..."
                    rows={2}
                    autoFocus
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 resize-none transition-colors"
                />
                <AnonymousFields
                    isAnonymous={isAnonymous}
                    anonymousName={anonymousName}
                    onToggle={() => { setIsAnonymous((v) => !v); setError(null); }}
                    onNameChange={setAnonymousName}
                />
                {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
                <div className="flex gap-2 mt-2 justify-end">
                    <button
                        onClick={onCancel}
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1"
                    >
                        Cancelar
                    </button>
                    <Button
                        size="sm"
                        disabled={isPending || !content.trim()}
                        onClick={handleSubmit}
                        className="gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs h-7"
                    >
                        {isPending ? <Loader2 className="size-3 animate-spin" /> : <Send className="size-3" />}
                        Responder
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ─── comment card ─────────────────────────────────────────────────────────────

function CommentCard({
    comment,
    postId,
    currentUser,
    isReply = false,
}: {
    comment: ApiComment;
    postId: string;
    currentUser: User | null;
    isReply?: boolean;
}) {
    const [replies, setReplies] = useState<ApiComment[]>(comment.replies ?? []);
    const [showReply, setShowReply] = useState(false);

    return (
        <div className={isReply ? "mt-4 ml-10" : ""}>
            <div className="flex gap-3">
                <Avatar
                    author={comment.author}
                    displayName={comment.displayName}
                    isAnonymous={comment.isAnonymous}
                    size="sm"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-zinc-200">
                            {comment.displayName}
                        </span>
                        {comment.isAnonymous && (
                            <span className="text-[10px] text-zinc-600 border border-zinc-700 rounded px-1 py-0.5">
                                anônimo
                            </span>
                        )}
                        <span className="text-[11px] text-zinc-600">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2.5">
                        <span className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                            <ThumbsUp className="size-3" />
                            {comment.likes}
                        </span>
                        {currentUser && !isReply && (
                            <button
                                onClick={() => setShowReply((v) => !v)}
                                className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-violet-400 transition-colors"
                            >
                                <CornerDownRight className="size-3" />
                                Responder
                            </button>
                        )}
                    </div>

                    {replies.map((reply) => (
                        <CommentCard
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            currentUser={currentUser}
                            isReply
                        />
                    ))}

                    {showReply && currentUser && (
                        <ReplyForm
                            postId={postId}
                            parentId={comment.id}
                            currentUser={currentUser}
                            onSuccess={(reply) => {
                                setReplies((prev) => [...prev, reply]);
                                setShowReply(false);
                            }}
                            onCancel={() => setShowReply(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── componente principal ─────────────────────────────────────────────────────

export function CommentsSection({ postId, initialComments, currentUser }: Props) {
    const [comments, setComments] = useState<ApiComment[]>(initialComments);
    const [content, setContent] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [anonymousName, setAnonymousName] = useState("");
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    async function handleSubmit() {
        if (!content.trim() || !currentUser) return;
        if (isAnonymous && !anonymousName.trim()) {
            setError("Digite um nome anônimo.");
            return;
        }

        startTransition(async () => {
            try {
                const created = await createCommentAction({
                    content,
                    postId,
                    isAnonymous,
                    anonymousName: isAnonymous ? anonymousName : undefined,
                });

                setComments((prev) => [
                    {
                        ...created,
                        author: isAnonymous ? null : {
                            id: currentUser.id,
                            name: currentUser.name,
                            avatarUrl: currentUser.avatarUrl ?? null,
                        },
                        displayName: isAnonymous ? anonymousName : currentUser.name,
                        isAnonymous,
                        replies: [],
                    },
                    ...prev,
                ]);

                setContent("");
                setIsAnonymous(false);
                setAnonymousName("");
                setError(null);
            } catch {
                setError("Não foi possível comentar. Tente novamente.");
            }
        });
    }

    return (
        <div className="mt-12" id="comentarios">
            {/* cabeçalho */}
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap shrink-0 flex items-center gap-1.5">
                    <MessageSquare className="size-3.5" />
                    {comments.length} {comments.length === 1 ? "Comentário" : "Comentários"}
                </h2>
                <div className="h-px bg-zinc-800 flex-1" />
            </div>

            {/* novo comentário */}
            <div className="flex gap-3 mb-8">
                {isAnonymous ? (
                    <div className="shrink-0 w-10 h-10 rounded-full bg-zinc-800 ring-1 ring-zinc-700 flex items-center justify-center text-zinc-500">
                        <UserX className="size-4" />
                    </div>
                ) : (
                    <CurrentUserAvatar user={currentUser} size="md" />
                )}
                <div className="flex-1">
                    {currentUser ? (
                        <>
                            <textarea
                                ref={textareaRef}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Escreva um comentário..."
                                rows={3}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 resize-none transition-colors"
                            />
                            <AnonymousFields
                                isAnonymous={isAnonymous}
                                anonymousName={anonymousName}
                                onToggle={() => { setIsAnonymous((v) => !v); setError(null); }}
                                onNameChange={setAnonymousName}
                            />
                            {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
                            <div className="flex justify-end mt-2">
                                <Button
                                    size="sm"
                                    disabled={isPending || !content.trim()}
                                    onClick={handleSubmit}
                                    className="gap-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
                                >
                                    {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                                    Comentar
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-500">
                            <a href="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                                Faça login
                            </a>
                            para comentar.
                        </div>
                    )}
                </div>
            </div>

            {/* lista */}
            <div className="space-y-7">
                {comments.length === 0 && (
                    <p className="text-sm text-zinc-600">Nenhum comentário ainda. Seja o primeiro!</p>
                )}
                {comments.map((comment) => (
                    <CommentCard
                        key={comment.id}
                        comment={comment}
                        postId={postId}
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </div>
    );
}