import { cn } from "@/lib/utils";

type FitListTone = "best" | "not-good";

type FitListProps = {
  className?: string;
  items: string[];
  title: string;
  tone: FitListTone;
};

const toneStyles: Record<FitListTone, string> = {
  best: "border-pine bg-accent-soft text-pine",
  "not-good": "border-danger bg-surface text-danger",
};

export function FitList({ className, items, title, tone }: FitListProps) {
  return (
    <section
      className={cn(
        "rounded-card border p-4 shadow-field",
        toneStyles[tone],
        className,
      )}
    >
      <h3 className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em]">
        {title}
      </h3>
      <ul className="mt-3 grid gap-2 text-sm leading-6">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <span aria-hidden="true">-</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
