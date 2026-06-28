type LandingSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
};

export function LandingSection({ body, eyebrow, title }: LandingSectionProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-5xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.18em] text-pine">
        {eyebrow}
      </p>
      <h1 className="mt-4 max-w-3xl font-serif text-display-lg font-semibold text-ink">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-body-lg text-muted">{body}</p>
    </section>
  );
}
