"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { analytics } from "@/lib/analytics/client";

type NewsletterSignupProps = {
  action?: string;
  ctaLabel?: string;
  description: string;
  source: string;
  title: string;
};

const statusMessages: Record<string, string> = {
  already_subscribed: "You are already on the list. Nice, future-you.",
  invalid_email: "Enter a valid email address.",
  rate_limited: "Too many attempts. Please try again in a minute.",
  subscribed:
    "You are on the list. Check your inbox if confirmation is enabled.",
  unavailable: "Newsletter signup is temporarily unavailable.",
};

function NewsletterSignupForm({
  action = "/newsletter",
  ctaLabel = "Join",
  description,
  message,
  source,
  title,
}: NewsletterSignupProps & { message?: string }) {
  const inputId = `newsletter-email-${source.replace(/[^a-z0-9_-]+/gi, "-")}`;

  return (
    <section className="rounded-card border border-pine bg-accent-soft p-5 shadow-field">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
            Newsletter
          </p>
          <h3 className="mt-2 font-serif text-2xl font-semibold text-ink">
            {title}
          </h3>
          <p className="mt-2 max-w-2xl text-body-md text-muted">
            {description}
          </p>
        </div>
        <form
          action={action}
          className="flex w-full flex-col gap-2 sm:flex-row"
          method="post"
        >
          <input name="source" type="hidden" value={source} />
          <label className="sr-only" htmlFor={inputId}>
            Email address
          </label>
          <input
            aria-describedby={message ? `${inputId}-status` : undefined}
            className="h-11 min-w-0 rounded-button border border-rule bg-surface px-3 text-base text-ink shadow-field outline-none transition-colors focus:border-pine focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-accent-soft sm:w-72"
            id={inputId}
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
          <button
            className="inline-flex h-11 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-accent-soft"
            type="submit"
          >
            {ctaLabel}
          </button>
        </form>
      </div>
      {message ? (
        <p
          className="mt-4 text-sm font-semibold text-pine"
          id={`${inputId}-status`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}

function NewsletterSignupWithStatus(props: NewsletterSignupProps) {
  const searchParams = useSearchParams();
  const status = searchParams.get("newsletter");
  const statusSource = searchParams.get("newsletter_source");
  const message =
    status && statusSource === props.source
      ? statusMessages[status]
      : undefined;

  useEffect(() => {
    if (status === "subscribed" && statusSource === props.source) {
      analytics.track("newsletter_signup", {
        source: props.source,
      });
    }
  }, [props.source, status, statusSource]);

  return <NewsletterSignupForm {...props} message={message} />;
}

export function NewsletterSignup(props: NewsletterSignupProps) {
  return (
    <Suspense fallback={<NewsletterSignupForm {...props} />}>
      <NewsletterSignupWithStatus {...props} />
    </Suspense>
  );
}
