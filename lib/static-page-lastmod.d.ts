export const STATIC_PAGE_LASTMOD_FALLBACK: Record<string, string>;

export const STATIC_PAGE_SOURCES: Record<string, string>;

export function parseGitCommitDate(stdout: string): string | null;

export function resolveStaticPageLastmod(
  pagePath: string,
  gitDate: string | null,
  fallback?: Record<string, string>,
): string | undefined;

export function readGitCommitDate(
  filePath: string,
  repoRoot?: string,
): string | null;

export function staticPageLastmodMap(input?: {
  fallback?: Record<string, string>;
  generated?: object;
  readCommitDate?: (filePath: string) => string | null;
}): Record<string, string>;
