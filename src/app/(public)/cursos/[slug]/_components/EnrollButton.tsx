"use client";
import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

export function EnrollButton({ courseName }: { courseName: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const handleClick = () => {
    setState("loading");
    setTimeout(() => setState("done"), 1400);
  };

  if (state === "done") {
    return (
      <div className="flex items-center justify-center gap-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-xl py-3 text-sm font-semibold">
        <CheckCircle size={16} />
        Inscrito com sucesso!
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-70 text-white font-bold py-3 rounded-xl transition-colors text-sm"
    >
      {state === "loading" ? (
        <>
          <Loader2 size={15} className="animate-spin" />
          Inscrevendo...
        </>
      ) : (
        "Inscrever-se gratuitamente"
      )}
    </button>
  );
}