"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deletePostAction } from "../_actions/actions";
import { useTransition } from "react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type Props = {
  id: string;
};

export const ButtonDelete = ({ id }: Props) => {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="gap-1.5 text-red-500 hover:text-red-600 text-xs h-8 px-3"
        >
          <Trash className="size-3.5" /> Deletar
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-zinc-900 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja deletar?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. O post será removido permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-zinc-800 hover:bg-zinc-900 hover:text-white">Cancelar</AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              startTransition(() => deletePostAction(id))
            }
            className="bg-red-600 hover:bg-red-500"
            disabled={isPending}
          >
            {isPending ? "Deletando..." : "Sim, deletar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};