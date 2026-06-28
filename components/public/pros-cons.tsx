import { cn } from "@/lib/utils";

type ProsConsProps = {
  className?: string;
  cons: string[];
  pros: string[];
};

function ListColumn({
  items,
  title,
  tone,
}: {
  items: string[];
  title: string;
  tone: "pros" | "cons";
}) {
  return (
    <section className="rounded-card border border-rule bg-surface p-4 shadow-field">
      <h3
        className={cn(
          "font-mono text-label-sm font-semibold uppercase tracking-[0.14em]",
          tone === "pros" ? "text-pine" : "text-danger",
        )}
      >
        {title}
      </h3>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <span aria-hidden="true">{tone === "pros" ? "+" : "-"}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProsCons({ className, cons, pros }: ProsConsProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      <ListColumn items={pros} title="Pros" tone="pros" />
      <ListColumn items={cons} title="Cons" tone="cons" />
    </div>
  );
}
