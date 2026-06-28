import type {
  ComparisonColumn,
  ComparisonRow,
} from "@/components/public/comparison-table";
import type { ArticleTocItem } from "@/components/public/article-toc";

type HeadingBlock = {
  id: string;
  level: 2 | 3;
  text: string;
  type: "heading";
};

type ParagraphBlock = {
  text: string;
  type: "paragraph";
};

type ListBlock = {
  items: string[];
  type: "list";
};

type CodeBlock = {
  code: string;
  language: string;
  type: "code";
};

type TableBlock = {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  title?: string;
  type: "table";
};

type CalloutBlock = {
  body: string;
  title: string;
  type: "callout";
};

export type ArticleMarkdownBlock =
  | CalloutBlock
  | CodeBlock
  | HeadingBlock
  | ListBlock
  | ParagraphBlock
  | TableBlock;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableSeparator(line: string) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function parseTable(lines: string[], title?: string): TableBlock {
  const headers = splitTableRow(lines[0]);
  const columns = headers.map((header) => ({
    key: slugify(header),
    label: header,
  }));
  const rows = lines.slice(2).map((line) => {
    const cells = splitTableRow(line);
    const [feature = "", ...values] = cells;

    return {
      cells: Object.fromEntries(
        columns
          .slice(1)
          .map((column, index) => [column.key, values[index] ?? ""]),
      ),
      feature,
    };
  });

  return {
    columns: columns.slice(1),
    rows,
    title,
    type: "table",
  };
}

export function parseArticleMarkdown(markdown: string) {
  const blocks: ArticleMarkdownBlock[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const seenHeadingIds = new Map<string, number>();
  let index = 0;

  function uniqueHeadingId(text: string) {
    const base = slugify(text) || "section";
    const count = seenHeadingIds.get(base) ?? 0;
    seenHeadingIds.set(base, count + 1);

    return count ? `${base}-${count + 1}` : base;
  }

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith(":::comparison")) {
      const title = line.replace(":::comparison", "").trim() || "Comparison";
      const comparisonLines: string[] = [];
      index += 1;

      while (index < lines.length && lines[index].trim() !== ":::") {
        if (lines[index].trim()) {
          comparisonLines.push(lines[index]);
        }
        index += 1;
      }

      if (comparisonLines.length >= 3) {
        blocks.push(parseTable(comparisonLines, title));
      }

      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.replace("```", "").trim();
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push({
        code: codeLines.join("\n"),
        language,
        type: "code",
      });
      index += 1;
      continue;
    }

    const headingMatch = /^(#{2,3})\s+(.+)$/.exec(line);

    if (headingMatch) {
      const text = headingMatch[2].trim();

      blocks.push({
        id: uniqueHeadingId(text),
        level: headingMatch[1].length as 2 | 3,
        text,
        type: "heading",
      });
      index += 1;
      continue;
    }

    if (line.trim().startsWith(">")) {
      const quoteLines: string[] = [];

      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }

      const firstLine = quoteLines[0] ?? "";
      const calloutMatch = /^\[!([A-Z]+)\]\s*(.*)$/.exec(firstLine);

      blocks.push({
        body: (calloutMatch ? quoteLines.slice(1) : quoteLines)
          .join(" ")
          .trim(),
        title: calloutMatch?.[2] || calloutMatch?.[1] || "Note",
        type: "callout",
      });
      continue;
    }

    if (line.trim().startsWith("- ")) {
      const items: string[] = [];

      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().replace(/^- /, ""));
        index += 1;
      }

      blocks.push({ items, type: "list" });
      continue;
    }

    if (
      line.includes("|") &&
      lines[index + 1] &&
      isTableSeparator(lines[index + 1])
    ) {
      const tableLines = [line, lines[index + 1]];
      index += 2;

      while (index < lines.length && lines[index].includes("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }

      blocks.push(parseTable(tableLines));
      continue;
    }

    const paragraphLines: string[] = [];

    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{2,3})\s+/.test(lines[index]) &&
      !lines[index].startsWith("```") &&
      !lines[index].startsWith(":::comparison") &&
      !lines[index].trim().startsWith(">") &&
      !lines[index].trim().startsWith("- ") &&
      !(
        lines[index].includes("|") &&
        lines[index + 1] &&
        isTableSeparator(lines[index + 1])
      )
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push({
      text: paragraphLines.join(" "),
      type: "paragraph",
    });
  }

  return blocks;
}

export function getTocItems(blocks: ArticleMarkdownBlock[]): ArticleTocItem[] {
  return blocks
    .filter((block): block is HeadingBlock => block.type === "heading")
    .map((heading) => ({
      href: `#${heading.id}`,
      label: heading.text,
    }));
}
