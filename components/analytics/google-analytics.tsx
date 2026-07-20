import Script from "next/script";

// Google Analytics 4 via gtag.js. Loads only when a Measurement ID is set, so
// the site stays GA-free locally and in any environment without the env var.
// Unlike Plausible, GA4 sets cookies — see docs/analytics.md for the consent
// note. Custom events are mirrored into GA4 from lib/analytics/client.ts.
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  if (!gaMeasurementId) {
    return null;
  }

  return (
    <>
      <Script
        id="ga-gtag-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga-gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaMeasurementId}');
`,
        }}
      />
    </>
  );
}
