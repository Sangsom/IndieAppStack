import type { ArticleMarkdownBlock } from "@/lib/article-markdown";

export type FaqItem = {
  answer: string;
  question: string;
};

// Answers are stored as the site's Markdown dialect; FAQPage schema wants plain
// text. Reduce inline links to their label and drop emphasis/code marks so the
// extractable answer reads cleanly when an AI engine or rich result lifts it.
function stripInlineMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Extract question/answer pairs from an FAQ section: an H2 whose text starts
// with "FAQ", "Common questions", or "Frequently asked", followed by H3
// questions, each answered by the paragraphs and lists until the next heading.
export function extractFaqItems(blocks: ArticleMarkdownBlock[]): FaqItem[] {
  const faqHeadingIndex = blocks.findIndex(
    (block) =>
      block.type === "heading" &&
      block.level === 2 &&
      /^(faq|common questions|frequently asked)/i.test(block.text),
  );

  if (faqHeadingIndex === -1) {
    return [];
  }

  const items: FaqItem[] = [];
  let current: { answerParts: string[]; question: string } | null = null;

  const flush = () => {
    if (current && current.answerParts.length) {
      items.push({
        answer: stripInlineMarkdown(current.answerParts.join(" ")),
        question: stripInlineMarkdown(current.question),
      });
    }
  };

  for (let index = faqHeadingIndex + 1; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (block.type === "heading" && block.level === 2) {
      break;
    }

    if (block.type === "heading" && block.level === 3) {
      flush();
      current = { answerParts: [], question: block.text };
      continue;
    }

    if (!current) {
      continue;
    }

    if (block.type === "paragraph") {
      current.answerParts.push(block.text);
    } else if (block.type === "list") {
      current.answerParts.push(block.items.join(" "));
    }
  }

  flush();

  return items;
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
      name: item.question,
    })),
  };
}
