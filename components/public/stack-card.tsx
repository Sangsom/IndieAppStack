import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StackTool = {
  name: string;
  role: string;
};

type StackCardProps = {
  className?: string;
  costNote: string;
  description: string;
  href: string;
  name: string;
  tools: StackTool[];
};

export function StackCard({
  className,
  costNote,
  description,
  href,
  name,
  tools,
}: StackCardProps) {
  return (
    <article
      className={cn(
        "rounded-card border border-rule bg-surface p-5 shadow-field",
        className,
      )}
    >
      <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-gold">
        Stack recommendation
      </p>
      <h3 className="mt-2 font-serif text-2xl font-semibold text-ink">
        {name}
      </h3>
      <p className="mt-3 text-body-md text-muted">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tools.map((tool) => (
          <Badge key={`${tool.role}-${tool.name}`} variant="platform">
            {tool.role}: {tool.name}
          </Badge>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
        <p className="text-sm font-semibold text-muted">{costNote}</p>
        <a
          className="rounded-button text-sm font-semibold text-pine transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          href={href}
        >
          View stack
        </a>
      </div>
    </article>
  );
}
