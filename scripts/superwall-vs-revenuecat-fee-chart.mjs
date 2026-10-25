import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Published rates re-checked Oct 25, 2026.
// RevenueCat: free up to $2,500 MTR, then 1% of the whole MTR.
//   https://www.revenuecat.com/pricing/
//   https://www.revenuecat.com/docs/welcome/set-up-revenuecat/account-management
//   Worked example on the billing doc: $2,600 MTR bills $26 (1% of the whole).
// Superwall Indie: $0 up to $10,000 MAR, then 1% of total MAR.
//   https://superwall.com/pricing
// The Superwall series assumes every dollar also went through a Superwall paywall.

export const FEE_CHART_CHECKED_LABEL = "Oct 25, 2026";
export const REVENUECAT_FREE_MTR = 2500;
export const SUPERWALL_INDIE_FREE_MAR = 10000;
export const FEE_CHART_REVENUE_MAX = 50000;

export function revenueCatMonthlyFee(monthlyTrackedRevenue) {
  if (monthlyTrackedRevenue <= REVENUECAT_FREE_MTR) {
    return 0;
  }

  return monthlyTrackedRevenue * 0.01;
}

export function superwallIndieMonthlyFee(monthlyAttributedRevenue) {
  if (monthlyAttributedRevenue <= SUPERWALL_INDIE_FREE_MAR) {
    return 0;
  }

  return monthlyAttributedRevenue * 0.01;
}

const WIDTH = 1200;
const HEIGHT = 760;
const PLOT = { left: 108, right: 1128, top: 228, bottom: 548 };
const Y_MAX = 550;

function xOf(revenue) {
  return (
    PLOT.left + (revenue / FEE_CHART_REVENUE_MAX) * (PLOT.right - PLOT.left)
  );
}

function yOf(fee) {
  return PLOT.bottom - (fee / Y_MAX) * (PLOT.bottom - PLOT.top);
}

function coord(revenue, fee) {
  return `${xOf(revenue).toFixed(1)},${yOf(fee).toFixed(1)}`;
}

function stepPoints(feeAt) {
  const freeUntil =
    feeAt === revenueCatMonthlyFee
      ? REVENUECAT_FREE_MTR
      : SUPERWALL_INDIE_FREE_MAR;
  const atFreeLine = feeAt(freeUntil);
  const justOver = feeAt(freeUntil + 0.01);
  const atMax = feeAt(FEE_CHART_REVENUE_MAX);

  return [
    coord(0, feeAt(0)),
    coord(freeUntil, atFreeLine),
    coord(freeUntil, justOver),
    coord(FEE_CHART_REVENUE_MAX, atMax),
  ].join(" ");
}

function moneyLabel(amount) {
  return `$${amount.toLocaleString("en-US")}`;
}

export function buildFeeChartSvg() {
  const revenueCatPoints = stepPoints(revenueCatMonthlyFee);
  const superwallPoints = stepPoints(superwallIndieMonthlyFee);
  const revenueCatAtTenThousand = revenueCatMonthlyFee(10000);
  const superwallAtTenThousand = superwallIndieMonthlyFee(10000);
  const bothAtFiftyThousand = revenueCatMonthlyFee(FEE_CHART_REVENUE_MAX);

  const yTicks = [0, 100, 200, 300, 400, 500];
  const xTicks = [0, 10000, 20000, 30000, 40000, 50000];
  const grid = yTicks
    .map((fee) => {
      const y = yOf(fee).toFixed(1);
      return `<line x1="${PLOT.left}" y1="${y}" x2="${PLOT.right}" y2="${y}" stroke="#e7e2d7"/>
  <text x="${PLOT.left - 12}" y="${(yOf(fee) + 4).toFixed(1)}" class="tick" text-anchor="end">${moneyLabel(fee)}</text>`;
    })
    .join("\n  ");
  const xLabels = xTicks
    .map((revenue) => {
      const label = revenue === 0 ? "$0" : `$${revenue / 1000}k`;
      return `<text x="${xOf(revenue).toFixed(1)}" y="578" class="tick" text-anchor="middle">${label}</text>`;
    })
    .join("\n  ");

  const freeLine = (
    revenue,
    label,
    labelY,
  ) => `<line x1="${xOf(revenue).toFixed(1)}" y1="${PLOT.top}" x2="${xOf(revenue).toFixed(1)}" y2="${PLOT.bottom}" stroke="#e7e2d7" stroke-dasharray="3 4"/>
  <text x="${(xOf(revenue) + 8).toFixed(1)}" y="${labelY}" class="guide">${label}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="title desc">
  <title id="title">Estimated monthly fees for RevenueCat and Superwall Indie</title>
  <desc id="desc">Checked ${FEE_CHART_CHECKED_LABEL}. From $0 to $50,000 in monthly revenue, RevenueCat is $0 through $2,500 of monthly tracked revenue, then 1% of the whole amount. Superwall Indie is $0 through $10,000 of monthly attributed revenue, then 1% of the total, assuming every dollar went through a Superwall paywall. Above $10,000 the lines meet. Arithmetic from published rates, not invoices.</desc>
  <defs>
    <style>
      .eyebrow { font: 700 13px ui-monospace, "SF Mono", Menlo, Consolas, monospace; letter-spacing: 1.6px; text-transform: uppercase; fill: #2c5f4f; }
      .title { font: 600 32px "Source Serif 4", Georgia, serif; fill: #20241f; }
      .dek { font: 400 15px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6e6a5e; }
      .tick { font: 500 13px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6e6a5e; }
      .guide { font: 600 12px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6e6a5e; }
      .legend { font: 600 14px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #20241f; }
      .note { font: 500 14px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #20241f; }
      .foot { font: 500 13px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6e6a5e; }
      .point { font: 600 13px ui-monospace, "SF Mono", Menlo, Consolas, monospace; fill: #20241f; }
    </style>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#fbfaf7"/>
  <text x="48" y="44" class="eyebrow">Price ledger | checked ${FEE_CHART_CHECKED_LABEL}</text>
  <text x="48" y="88" class="title">Monthly fee against monthly revenue</text>
  <text x="48" y="122" class="dek">Whole amount on both meters. The step is 1% of the whole month, not 1% of only the overflow.</text>
  <text x="48" y="146" class="dek">Superwall Indie assumes every dollar went through a Superwall paywall. Not an invoice.</text>

  <line x1="48" y1="176" x2="96" y2="176" stroke="#9a6b23" stroke-width="3"/>
  <text x="106" y="181" class="legend">RevenueCat</text>
  <line x1="230" y1="176" x2="278" y2="176" stroke="#2c5f4f" stroke-width="3" stroke-dasharray="7 5"/>
  <text x="288" y="181" class="legend">Superwall Indie</text>

  <rect x="56" y="204" width="1088" height="430" rx="7" fill="#ffffff" stroke="#e7e2d7"/>
  ${grid}
  ${xLabels}
  <text x="618" y="602" class="tick" text-anchor="middle">Monthly revenue</text>
  <text transform="rotate(-90 36 388)" x="36" y="388" class="tick" text-anchor="middle">Monthly fee</text>

  ${freeLine(REVENUECAT_FREE_MTR, "RevenueCat free line", 246)}
  ${freeLine(SUPERWALL_INDIE_FREE_MAR, "Superwall free line", 246)}

  <polyline points="${revenueCatPoints}" fill="none" stroke="#9a6b23" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
  <polyline points="${superwallPoints}" fill="none" stroke="#2c5f4f" stroke-width="3" stroke-dasharray="7 5" stroke-linejoin="round" stroke-linecap="round"/>

  <text x="${xOf(6000).toFixed(1)}" y="${yOf(160).toFixed(1)}" class="point" text-anchor="middle">1% of all MTR</text>
  <text x="${xOf(30000).toFixed(1)}" y="${(yOf(revenueCatMonthlyFee(30000)) - 16).toFixed(1)}" class="point" text-anchor="middle">Both 1% of the whole</text>
  <text x="${(xOf(FEE_CHART_REVENUE_MAX) - 10).toFixed(1)}" y="${(yOf(bothAtFiftyThousand) - 14).toFixed(1)}" class="point" text-anchor="end">${moneyLabel(bothAtFiftyThousand)}</text>

  <text x="72" y="652" class="note">After $10,000 the lines meet: both are 1% of the whole amount when every dollar is on both meters.</text>
  <text x="48" y="700" class="foot">Arithmetic from published rates, checked ${FEE_CHART_CHECKED_LABEL}; not invoices. Sources: revenuecat.com/pricing, RevenueCat billing docs, superwall.com/pricing.</text>
  <text x="48" y="724" class="foot">At $10,000, RevenueCat is ${moneyLabel(revenueCatAtTenThousand)} and Superwall Indie is ${moneyLabel(superwallAtTenThousand)}. At $50,000 both are ${moneyLabel(bothAtFiftyThousand)}. IndieAppStack chart. Recheck the vendor pages before committing spend.</text>
</svg>
`;
}

function isDirectRun() {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }

  return path.resolve(entry) === fileURLToPath(import.meta.url);
}

if (isDirectRun()) {
  const destination = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../public/content-visuals/articles/superwall-vs-revenuecat-monthly-fee-chart.svg",
  );
  fs.writeFileSync(destination, buildFeeChartSvg());
}
