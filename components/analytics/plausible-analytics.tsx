import Script from "next/script";

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const plausibleScriptSrc =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC ??
  "https://plausible.io/js/script.js";

export function PlausibleAnalytics() {
  if (!plausibleDomain) {
    return null;
  }

  return (
    <>
      <Script
        id="plausible-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html:
            "window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}",
        }}
      />
      <Script
        data-domain={plausibleDomain}
        defer
        src={plausibleScriptSrc}
        strategy="afterInteractive"
      />
    </>
  );
}
