export function getAffiliateRedirectPath(slug: string, source?: string) {
  const path = `/go/${slug}`;

  if (!source) {
    return path;
  }

  return `${path}?source=${encodeURIComponent(source)}`;
}
