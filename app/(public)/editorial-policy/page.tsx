import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/public/json-ld";
import { ownerContactEmail } from "@/lib/compliance";
import { absoluteUrl, createSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const pageDescription =
  "How IndieAppStack checks a price: two tool pages a week, the vendor's pricing page as the source, and a public log when a figure was wrong.";

const reportHref = `mailto:${ownerContactEmail}?subject=${encodeURIComponent("Price change report")}`;

const checkSteps = [
  {
    body: "Use the vendor pricing page, or the billing docs it points to.",
    label: "Source",
    note: "A blog post is not the source.",
    title: "Open the pricing page",
  },
  {
    body: "The figure, the page URL, and the date of the check.",
    label: "Record",
    note: "No date, no published price.",
    title: "Write three things",
  },
  {
    body: "Same figure: move the date. Vendor changed it: replace the figure and the date.",
    label: "Compare",
    note: "That is a re-check.",
    title: "Match the live page",
  },
  {
    body: "Replace it on the page, then add a dated row to the log.",
    label: "Correct",
    note: "A vendor change is not a row.",
    title: "If the old figure was wrong",
  },
] as const;

export const metadata: Metadata = createSeoMetadata({
  description: pageDescription,
  path: "/editorial-policy",
  title: "How we check prices",
});

function webPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    dateModified: "2026-10-09",
    description: pageDescription,
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    name: "How we check prices",
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    url: absoluteUrl("/editorial-policy"),
  };
}

const linkClassName =
  "font-semibold text-pine underline-offset-2 hover:text-ink hover:underline focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <JsonLd data={webPageJsonLd()} />
      <article className="max-w-3xl">
        <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
          The price ledger
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl">
          How we check prices
        </h1>
        <p className="mt-5 text-lg leading-8 text-ink">
          IndieAppStack checks a price on the vendor&apos;s own pricing page,
          records the figure with that URL and the date, and puts both on the
          tool page. The rule is two tool pages a week. Twenty-six indexable
          pages, the count on August 3, 2026, take 13 weeks at that pace. When a
          published figure did not match its source, the correction is dated on
          this page.
        </p>
        <p className="mt-4 font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-muted">
          Last updated: October 9, 2026
        </p>

        <figure className="mt-10 rounded-card border border-rule bg-surface p-5">
          <p className="font-serif text-2xl font-semibold text-ink">
            How a price check works
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Two tool pages a week. The source is the vendor pricing page.
          </p>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
            {checkSteps.map((step, index) => (
              <li
                className="rounded-card border border-rule bg-paper p-4"
                key={step.label}
              >
                <p className="font-mono text-label-sm font-semibold uppercase tracking-[0.14em] text-pine">
                  {index + 1}. {step.label}
                </p>
                <p className="mt-3 font-serif text-xl font-semibold text-ink">
                  {step.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
                <p className="mt-3 text-sm leading-6 text-ink">{step.note}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm leading-6 text-muted">
            26 indexable tool pages, the count on August 3, 2026, is a 13-week
            pass at two pages a week. The last-checked date on the tool page is
            the record of the last pass.
          </p>
          <figcaption className="mt-3 text-sm leading-6 text-muted">
            A price check reads the pricing page. It is not a test of the
            product.
          </figcaption>
        </figure>

        <section className="mt-12" id="check-cycle">
          <h2 className="font-serif text-3xl font-semibold text-ink">
            The check cycle
          </h2>
          <div className="mt-4 grid gap-4 text-body-md leading-8 text-muted">
            <p>
              The rule is two{" "}
              <Link className={linkClassName} href="/tools">
                tool pages
              </Link>{" "}
              a week. The check opens the vendor pricing page, or the billing
              docs when the pricing page points there for the meter. The tool
              page then carries the figure, a link to that source, and a
              last-checked date.
            </p>
            <p>
              Twenty-six indexable tool pages was the catalog on August 3, 2026.
              Two pages a week is a 13-week pass of that catalog. A page added
              later joins the same queue.{" "}
              <Link className={linkClassName} href="/tools/keywords-everywhere">
                Keywords Everywhere
              </Link>{" "}
              carries a price check dated September 21, 2026, after that count.
              Guides and comparisons are re-checked when that page is refreshed,
              not on this weekly pair.
            </p>
            <p>
              The date on the page is the record. A date of July 19, 2026 means
              that page has not been through a later pass. The{" "}
              <Link className={linkClassName} href="/tools/onesignal">
                OneSignal
              </Link>{" "}
              page still shows that date. This page does not claim a check the
              date does not show.
            </p>
            <p>A pass has three outcomes.</p>
            <ul className="grid list-disc gap-3 pl-5">
              <li>
                The figure still matches. The last-checked date moves. The
                number stays.
              </li>
              <li>
                The vendor changed the price. The tool page takes the new
                figure, the source link, and the new date. That is a re-check,
                not a correction.
              </li>
              <li>
                The figure already published did not match the source. The page
                is corrected, and a row is added to the log below.
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-12" id="sources">
          <h2 className="font-serif text-3xl font-semibold text-ink">
            What counts as a source
          </h2>
          <div className="mt-4 grid gap-4 text-body-md leading-8 text-muted">
            <p>
              A price comes from the vendor&apos;s pricing page, or from
              official billing docs. Apple&apos;s rates come from Apple&apos;s
              own pages. The{" "}
              <Link
                className={linkClassName}
                href="/guides/app-store-business-terms-2026-cost"
              >
                September 2026 App Store terms guide
              </Link>{" "}
              copies those rates from Apple and dates the check on the page.
            </p>
            <p>
              A vendor blog is not a price source. A blog can note that a plan
              changed. The number on the tool page still has to be on the
              pricing page or in the docs. Review sites, directories, and
              another site&apos;s comparison are not sources either.
            </p>
            <p>
              A price without a URL and a date does not go on a page. A price
              check is a reading of that page. It is not a claim that
              IndieAppStack ran the product.
            </p>
          </div>
        </section>

        <section className="mt-12" id="affiliates">
          <h2 className="font-serif text-3xl font-semibold text-ink">
            Affiliate relationships do not decide inclusion
          </h2>
          <div className="mt-4 grid gap-4 text-body-md leading-8 text-muted">
            <p>
              IndieAppStack may earn a commission on some links. That
              relationship does not decide whether a tool is in the directory,
              and it does not decide the verdict. The same rule is on the{" "}
              <Link className={linkClassName} href="/affiliate-disclosure">
                affiliate disclosure
              </Link>
              .
            </p>
            <p>
              <Link className={linkClassName} href="/tools/warp">
                Warp
              </Link>{" "}
              and{" "}
              <Link className={linkClassName} href="/tools/keywords-everywhere">
                Keywords Everywhere
              </Link>{" "}
              are partner links. The Warp page still says it is a nice-to-have
              rather than a fix when your current terminal already stays out of
              the way. The Keywords Everywhere page still says to skip it when
              the next job is the App Store listing, and to use an ASO tool
              instead. A paying relationship and that kind of verdict sit on
              both profiles.
            </p>
          </div>
        </section>

        <section className="mt-12" id="correction-log">
          <h2 className="font-serif text-3xl font-semibold text-ink">
            The correction log
          </h2>
          <div className="mt-4 grid gap-4 text-body-md leading-8 text-muted">
            <p>
              This log is for a figure IndieAppStack got wrong. A vendor price
              change is not a row here. It is a re-check, and the tool page
              shows the new figure and the new date.
            </p>
            <p>
              A row records the date the mistake was found, the page, the figure
              that was published, the figure that replaced it, and the source
              URL. As of October 9, 2026, no published price has been recorded
              as wrong against the source named on that page. There is no
              separate public table of older snapshots. The last-checked date on
              each tool page is the record of the last pass.
            </p>
          </div>
          <div className="mt-6 overflow-x-auto rounded-card border border-rule bg-surface">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                Correction log. No published price mistake is recorded as of
                October 9, 2026.
              </caption>
              <thead>
                <tr className="border-b border-rule text-ink">
                  <th className="px-4 py-3 font-semibold" scope="col">
                    Found
                  </th>
                  <th className="px-4 py-3 font-semibold" scope="col">
                    Page
                  </th>
                  <th className="px-4 py-3 font-semibold" scope="col">
                    Published figure
                  </th>
                  <th className="px-4 py-3 font-semibold" scope="col">
                    Corrected figure
                  </th>
                  <th className="px-4 py-3 font-semibold" scope="col">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-4 text-muted" colSpan={5}>
                    None recorded as of October 9, 2026.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12" id="report-a-price-change">
          <h2 className="font-serif text-3xl font-semibold text-ink">
            Report a price change
          </h2>
          <p className="mt-4 text-body-md leading-8 text-muted">
            If a figure on a tool page, guide, or comparison does not match the
            vendor&apos;s pricing page, send the page URL, the figure, and the
            source URL.
          </p>
          <p className="mt-6">
            <a
              className="inline-flex h-11 items-center justify-center rounded-button border border-pine bg-pine px-4 text-sm font-semibold text-surface shadow-field transition-colors hover:border-ink hover:bg-ink focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              href={reportHref}
            >
              Report a price change
            </a>
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">
            The message goes to {ownerContactEmail}.
          </p>
        </section>
      </article>
    </div>
  );
}
