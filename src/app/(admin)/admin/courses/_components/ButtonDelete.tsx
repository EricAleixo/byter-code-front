"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash, Loader2, Check, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";

type Props = {
    id: string;
    onDelete?: (id: string) => Promise<void>; // opcional: injeta a server action real depois
};

export function ButtonDelete({ id, onDelete }: Props) {
    const [confirming, setConfirming] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    function handleConfirm() {
        startTransition(async () => {
            if (onDelete) {
                await onDelete(id);
            } else {
                // ── mock: sem action real ainda, só loga e simula sucesso ──
                await new Promise((r) => setTimeout(r, 400));
            }
            setConfirming(false);
            router.refresh();
        });
    }

    if (confirming) {
        return (
            <div className="flex items-center gap-1">
                <Button
                    size="sm"
                    variant="ghost"
                    disabled={isPending}
                    onClick={handleConfirm}
                    className="h-8 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    title="Confirmar exclusão"
                >
                    {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => setConfirming(false)}
                    className="h-8 px-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                    title="Cancelar"
                >
                    <X className="size-3.5" />
                </Button>
            </div>
        );
    }

    return (
        <Button
            size="sm"
            variant="ghost"
            onClick={() => setConfirming(true)}
            className="gap-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs h-8 px-3"
            title="Excluir curso"
        >
            <Trash className="size-3.5" />
        </Button>
    );
}