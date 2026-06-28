type NewsletterSignupProps = {
  action?: string;
  description: string;
  title: string;
};

export function NewsletterSignup({
  action = "#",
  description,
  title,
}: NewsletterSignupProps) {
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
        >
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            className="h-11 min-w-0 rounded-button border border-rule bg-surface px-3 text-base text-ink shadow-field outline-none transition-colors focus:border-pine focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-accent-soft sm:w-72"
            id="newsletter-email"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
          <button
            className="inline-flex h-11 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-accent-soft"
            type="submit"
          >
            Join
          </button>
        </form>
      </div>
    </section>
  );
}
