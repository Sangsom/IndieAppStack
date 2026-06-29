import Link from "next/link";
import { Fragment, type ReactNode } from "react";

type InlineMarkdownProps = {
  text: string;
};

const inlineLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderLink(label: string, href: string, key: string) {
  const className =
    "font-semibold text-pine underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

  if (href.startsWith("/")) {
    return (
      <Link className={className} href={href} key={key}>
        {label}
      </Link>
    );
  }

  return (
    <a
      className={className}
      href={href}
      key={key}
      rel="noreferrer"
      target="_blank"
    >
      {label}
    </a>
  );
}

export function InlineMarkdown({ text }: InlineMarkdownProps) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(inlineLinkPattern)) {
    const [raw, label, href] = match;
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push(
        <Fragment key={`text-${lastIndex}`}>
          {text.slice(lastIndex, index)}
        </Fragment>,
      );
    }

    parts.push(renderLink(label, href, `link-${index}-${href}`));
    lastIndex = index + raw.length;
  }

  if (lastIndex < text.length) {
    parts.push(
      <Fragment key={`text-${lastIndex}`}>{text.slice(lastIndex)}</Fragment>,
    );
  }

  return <>{parts}</>;
}
