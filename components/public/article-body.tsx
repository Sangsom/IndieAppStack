import { ComparisonTable } from "@/components/public/comparison-table";
import { InlineMarkdown } from "@/components/public/inline-markdown";
import { Callout } from "@/components/ui/callout";
import type { ArticleMarkdownBlock } from "@/lib/article-markdown";

type ArticleBodyProps = {
  blocks: ArticleMarkdownBlock[];
};

export function ArticleBody({ blocks }: ArticleBodyProps) {
  return (
    <div className="grid gap-5">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Heading = block.level === 2 ? "h2" : "h3";

          return (
            <Heading
              className={
                block.level === 2
                  ? "scroll-mt-24 font-serif text-3xl font-semibold text-ink"
                  : "scroll-mt-24 font-serif text-2xl font-semibold text-ink"
              }
              id={block.id}
              key={block.id}
            >
              {block.text}
            </Heading>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p className="text-body-md leading-8 text-muted" key={index}>
              <InlineMarkdown text={block.text} />
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              className="grid gap-2 text-body-md leading-7 text-muted"
              key={index}
            >
              {block.items.map((item) => (
                <li className="flex gap-2" key={item}>
                  <span aria-hidden="true">-</span>
                  <span>
                    <InlineMarkdown text={item} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "code") {
          return (
            <pre
              className="max-w-full overflow-x-auto rounded-card border border-rule bg-ink p-4 text-sm leading-6 text-surface shadow-field"
              key={index}
            >
              <code data-language={block.language}>{block.code}</code>
            </pre>
          );
        }

        if (block.type === "callout") {
          return (
            <Callout key={index} title={block.title}>
              <InlineMarkdown text={block.body} />
            </Callout>
          );
        }

        return (
          <ComparisonTable
            caption={block.title ?? "Comparison"}
            columns={block.columns}
            key={index}
            rows={block.rows}
          />
        );
      })}
    </div>
  );
}
