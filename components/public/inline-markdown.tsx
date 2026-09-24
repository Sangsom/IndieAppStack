import Link from "next/link";
import { Fragment, type ReactNode } from "react";

type InlineMarkdownProps = {
  text: string;
};

const inlineTokenPattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

function renderLink(label: string, href: string, key: string) {
  const className =
    "font-semibold text-pine underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper";
  const children = renderInline(label, `${key}-label`);

  if (href.startsWith("/")) {
    return (
      <Link className={className} href={href} key={key}>
        {children}
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
      {children}
    </a>
  );
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(inlineTokenPattern)) {
    const [raw, bold, label, href] = match;
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push(
        <Fragment key={`${keyPrefix}-text-${lastIndex}`}>
          {text.slice(lastIndex, index)}
        </Fragment>,
      );
    }

    if (bold !== undefined) {
      parts.push(
        <strong
          className="font-semibold text-ink"
          key={`${keyPrefix}-bold-${index}`}
        >
          {renderInline(bold, `${keyPrefix}-bold-${index}`)}
        </strong>,
      );
    } else {
      parts.push(renderLink(label, href, `${keyPrefix}-link-${index}-${href}`));
    }

    lastIndex = index + raw.length;
  }

  if (lastIndex < text.length) {
    parts.push(
      <Fragment key={`${keyPrefix}-text-${lastIndex}`}>
        {text.slice(lastIndex)}
      </Fragment>,
    );
  }

  return parts;
}

export function InlineMarkdown({ text }: InlineMarkdownProps) {
  return <>{renderInline(text, "inline")}</>;
}
