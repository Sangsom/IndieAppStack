export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Nouns that look plural (end in "s") but are singular or uncountable, so they
// must stay unchanged when used attributively before a head noun like "tool"
// (e.g. "Analytics tools", never "Analytic tools"). Compared lowercased.
const UNCOUNTABLE_NOUNS = new Set([
  "analytics",
  "diagnostics",
  "logistics",
  "metrics",
  "news",
  "series",
  "species",
  "statistics",
]);

// Converts a noun phrase to its singular form for attributive use before a head
// noun such as "tool" or "tools". Category display names are often plural
// ("Paywalls", "Landing Pages"), but English uses the singular attributively:
// "paywall tools", "a landing page tool". Only the final word is singularized
// and its casing is preserved, so `singularizeNoun("Landing Pages")` returns
// "Landing Page". Uncountable or clearly non-plural words are left untouched.
export function singularizeNoun(phrase: string): string {
  const words = phrase.trim().split(/\s+/);
  const lastIndex = words.length - 1;
  const head = words[lastIndex] ?? "";
  const lower = head.toLowerCase();

  // Leave alone if it isn't a plural, is uncountable, or ends in an "s" cluster
  // that a naive trim would mangle (e.g. "-ss", "-us", "-is", "-ics").
  if (
    !lower.endsWith("s") ||
    UNCOUNTABLE_NOUNS.has(lower) ||
    /(?:ss|us|is|ics)$/.test(lower)
  ) {
    return phrase;
  }

  words[lastIndex] = lower.endsWith("ies")
    ? `${head.slice(0, -3)}y`
    : head.slice(0, -1);

  return words.join(" ");
}
