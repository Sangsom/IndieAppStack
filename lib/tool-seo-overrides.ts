export const TOOL_SEO_OVERRIDES: Record<
  string,
  { title: string; description: string; heading: string }
> = {
  appwrite: {
    title: "Appwrite Pricing 2026: Free Tier, Pro $25/mo",
    description:
      "Free: 75,000 MAU, 2 GB storage, and 5 GB bandwidth. Pro from $25/month. Self-hosting is cheaper when the machine costs less than $25. Checked Oct 20, 2026.",
    heading: "Appwrite pricing, free tier, and when it's worth paying",
  },
  bitrise: {
    title: "Bitrise Pricing 2026: Free Hobby Plan, Starter From $89/mo",
    description:
      "Bitrise Hobby is free: 1 app, 300 credits a month. Starter is $89/mo yearly or $99 monthly; Pro is $200. When it's worth paying. Checked Oct 25, 2026.",
    heading: "Bitrise pricing, plans, and when it's worth paying",
  },
  codemagic: {
    title: "Codemagic Pricing 2026: 500 Free Minutes, Then $0.095",
    description:
      "Codemagic gives 500 free Mac M2 minutes a month, then $0.095/min. See every plan, cost per build, and when Xcode Cloud or Bitrise is cheaper.",
    heading: "Codemagic pricing, free tier, and when it's worth paying",
  },
  "keywords-everywhere": {
    title: "Keywords Everywhere Review 2026: Pricing, Credits & Mobile",
    description:
      "Annual credits from $84. The API key is free. Google web volume, not App Store or Play Store demand. No Android, iPhone, or iPad app. Checked Oct 22, 2026.",
    heading: "Keywords Everywhere review, credit pricing, and no mobile app",
  },
};

/** Absolute document title for slugs in the override map. Other tools keep the site template. */
export function absoluteTitleForSlug(
  slug: string,
  title: string,
): { absolute: string } | undefined {
  if (!(slug in TOOL_SEO_OVERRIDES)) {
    return undefined;
  }

  return { absolute: title };
}
