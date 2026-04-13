export function OutcomeList({ outcomes }: { outcomes: string[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {outcomes.map((o, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 bg-violet-950/30 border border-violet-800/30 rounded-xl px-4 py-3 text-sm text-zinc-300"
        >
          <span className="text-violet-400 mt-0.5 shrink-0">✓</span>
          {o}
        </li>
      ))}
    </ul>
  );
}