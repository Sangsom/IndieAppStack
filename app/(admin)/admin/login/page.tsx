import { loginAdmin } from "./actions";

const messages: Record<string, { tone: "error" | "info"; text: string }> = {
  access_denied: {
    tone: "error",
    text: "That account cannot access the admin workspace.",
  },
  invalid_credentials: {
    tone: "error",
    text: "We could not sign you in with those details.",
  },
  missing_credentials: {
    tone: "error",
    text: "Enter an email and password to continue.",
  },
  signed_out: {
    tone: "info",
    text: "You have been signed out.",
  },
};

type AdminLoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(
  params: Record<string, string | string[] | undefined>,
  name: string,
) {
  const value = params[name];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = (await searchParams) ?? {};
  const error = getParam(params, "error");
  const status = getParam(params, "status");
  const next = getParam(params, "next") ?? "/admin";
  const message = error
    ? messages[error]
    : status
      ? messages[status]
      : undefined;

  return (
    <main className="flex flex-1 items-center justify-center py-12">
      <section className="w-full max-w-md rounded-card border border-rule bg-paper p-6 text-ink shadow-field">
        <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.18em] text-pine">
          Admin
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold">
          Sign in to IndieAppStack
        </h1>

        {message ? (
          <p
            className={`mt-5 rounded-button border px-3 py-2 text-sm ${
              message.tone === "error"
                ? "border-danger bg-surface text-danger"
                : "border-pine bg-accent-soft text-pine"
            }`}
          >
            {message.text}
          </p>
        ) : null}

        <form action={loginAdmin} className="mt-6 grid gap-4">
          <input name="next" type="hidden" value={next} />

          <label className="grid gap-2 text-sm font-semibold text-ink">
            Email
            <input
              autoComplete="email"
              className="h-11 rounded-button border border-rule bg-surface px-3 text-base text-ink outline-none transition-colors focus:border-pine"
              name="email"
              required
              type="email"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-ink">
            Password
            <input
              autoComplete="current-password"
              className="h-11 rounded-button border border-rule bg-surface px-3 text-base text-ink outline-none transition-colors focus:border-pine"
              name="password"
              required
              type="password"
            />
          </label>

          <button
            className="mt-2 inline-flex h-11 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
