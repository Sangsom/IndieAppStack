import Image from "next/image";

import { AffiliateCta } from "@/components/public/affiliate-cta";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ToolCardProps = {
  affiliateHref?: string;
  bestFor: string[];
  category: string;
  className?: string;
  detailsHref: string;
  lastChecked: string;
  logoAlt?: string;
  logoUrl?: string;
  name: string;
  officialHref: string;
  platforms: string[];
  pricing: string;
  tagline: string;
};

export function ToolCard({
  affiliateHref,
  bestFor,
  category,
  className,
  detailsHref,
  lastChecked,
  logoAlt,
  logoUrl,
  name,
  officialHref,
  platforms,
  pricing,
  tagline,
}: ToolCardProps) {
  return (
    <article
      className={cn(
        "rounded-card border border-rule bg-surface p-5 shadow-field",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-card border border-rule bg-paper text-lg font-semibold text-pine">
          {logoUrl ? (
            <Image
              alt={logoAlt ?? `${name} logo`}
              className="size-10 rounded-button object-contain"
              height={40}
              src={logoUrl}
              unoptimized
              width={40}
            />
          ) : (
            <span aria-hidden="true">{name.slice(0, 2).toUpperCase()}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
            {category}
          </p>
          <h3 className="mt-1 font-serif text-2xl font-semibold text-ink">
            {name}
          </h3>
          <p className="mt-2 text-body-md text-muted">{tagline}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <Badge key={platform} variant="platform">
            {platform}
          </Badge>
        ))}
        <Badge variant="pricing">{pricing}</Badge>
      </div>

      <section className="mt-5">
        <h4 className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
          Best for
        </h4>
        <ul className="mt-2 grid gap-1 text-sm leading-6 text-muted">
          {bestFor.map((item) => (
            <li className="flex gap-2" key={item}>
              <span aria-hidden="true">-</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-5 flex flex-wrap gap-3">
        {affiliateHref ? (
          <AffiliateCta
            href={affiliateHref}
            kind="affiliate"
            label="Try partner offer"
          />
        ) : null}
        <AffiliateCta
          href={officialHref}
          kind="official"
          label="Official site"
        />
        <a
          className="inline-flex h-10 items-center justify-center rounded-button border border-rule px-4 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          href={detailsHref}
        >
          Details
        </a>
      </div>

      <p className="mt-4 text-sm text-muted">Pricing checked {lastChecked}</p>
    </article>
  );
}
