import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Published rates re-opened Oct 29, 2026.
// RevenueCat: free up to $2,500 MTR, then 1% of the whole MTR.
//   https://www.revenuecat.com/pricing/
//   https://www.revenuecat.com/docs/welcome/set-up-revenuecat/account-management
//   Billing doc example: $2,600 MTR bills $26.
// Adapty: free while revenue is under $5,000, then 1% of monthly tracked revenue.
//   https://adapty.io/pricing/
// Qonversion Pro: free at or under $7,000 MTR, then 0.8% of total tracked revenue.
//   Page examples: $64 at $8,000, $400 at $50,000.
//   https://qonversion.io/pricing
// Apphud Free through $10,000 MTR, then Pro: 0.99% of MTR with a $49 minimum.
//   https://apphud.com/pricing
// StoreKit 2: Apple's purchase API, no third-party vendor fee.
//   https://developer.apple.com/storekit/
// Superwall is omitted from the fee chart. Its 1% applies to paywall-attributed
// revenue only (https://superwall.com/pricing), so one MTR bar would overstate it.

export const FEE_CHART_CHECKED_LABEL = "Oct 29, 2026";
export const FEE_LEVELS = [3000, 8000, 15000, 50000];

const REVENUECAT_FREE_MTR = 2500;
const ADAPTY_FREE_UNDER = 5000;
const QONVERSION_FREE_MTR = 7000;
const APPHUD_FREE_MTR = 10000;
const APPHUD_PRO_MINIMUM = 49;

function percentOf(monthlyRevenue, hundredthsOfAPercent) {
  return (monthlyRevenue * hundredthsOfAPercent) / 10000;
}

export function revenueCatMonthlyFee(monthlyTrackedRevenue) {
  if (monthlyTrackedRevenue <= REVENUECAT_FREE_MTR) {
    return 0;
  }

  return percentOf(monthlyTrackedRevenue, 100);
}

export function adaptyMonthlyFee(monthlyTrackedRevenue) {
  if (monthlyTrackedRevenue < ADAPTY_FREE_UNDER) {
    return 0;
  }

  return percentOf(monthlyTrackedRevenue, 100);
}

export function qonversionMonthlyFee(monthlyTrackedRevenue) {
  if (monthlyTrackedRevenue <= QONVERSION_FREE_MTR) {
    return 0;
  }

  return percentOf(monthlyTrackedRevenue, 80);
}

export function apphudFreeToProMonthlyFee(monthlyTrackedRevenue) {
  if (monthlyTrackedRevenue <= APPHUD_FREE_MTR) {
    return 0;
  }

  return Math.max(APPHUD_PRO_MINIMUM, percentOf(monthlyTrackedRevenue, 99));
}

export function storeKitMonthlyFee() {
  return 0;
}

export const FEE_SERIES = [
  {
    id: "revenueCat",
    label: "RevenueCat",
    color: "#9a6b23",
    feeAt: revenueCatMonthlyFee,
  },
  {
    id: "adapty",
    label: "Adapty",
    color: "#2c5f4f",
    feeAt: adaptyMonthlyFee,
  },
  {
    id: "qonversion",
    label: "Qonversion",
    color: "#20241f",
    feeAt: qonversionMonthlyFee,
  },
  {
    id: "apphud",
    label: "Apphud Free→Pro",
    color: "#9e4434",
    feeAt: apphudFreeToProMonthlyFee,
  },
  {
    id: "storeKit",
    label: "StoreKit 2",
    color: "#6e6a5e",
    feeAt: storeKitMonthlyFee,
  },
];

export function feesAt(monthlyTrackedRevenue) {
  return Object.fromEntries(
    FEE_SERIES.map((series) => [
      series.id,
      series.feeAt(monthlyTrackedRevenue),
    ]),
  );
}

function formatFee(amount) {
  const cents = Math.round(amount * 100);
  const dollars = cents / 100;

  if (cents % 100 === 0) {
    return `$${dollars.toLocaleString("en-US")}`;
  }

  return `$${dollars.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

const FEE_WIDTH = 1200;
const FEE_HEIGHT = 1040;
const PLOT = { left: 64, right: 1136, top: 214, bottom: 468 };
const FEE_Y_MAX = 500;

function feeY(fee) {
  return PLOT.bottom - (fee / FEE_Y_MAX) * (PLOT.bottom - PLOT.top);
}

export function buildFeeChartSvg() {
  const groupWidth = (PLOT.right - PLOT.left) / FEE_LEVELS.length;
  const barWidth = 34;
  const barGap = 8;
  const clusterWidth =
    FEE_SERIES.length * barWidth + (FEE_SERIES.length - 1) * barGap;

  const yTicks = [0, 100, 250, 500];
  const grid = yTicks
    .map((fee) => {
      const y = feeY(fee).toFixed(1);
      return `<line x1="${PLOT.left}" y1="${y}" x2="${PLOT.right}" y2="${y}" stroke="#e7e2d7"/>
  <text x="${PLOT.left - 10}" y="${(Number(y) + 4).toFixed(1)}" class="tick" text-anchor="end">${formatFee(fee)}</text>`;
    })
    .join("\n  ");

  const groups = FEE_LEVELS.map((level, groupIndex) => {
    const groupLeft = PLOT.left + groupIndex * groupWidth;
    const clusterLeft = groupLeft + (groupWidth - clusterWidth) / 2;
    const bars = FEE_SERIES.map((series, seriesIndex) => {
      const fee = series.feeAt(level);
      const height = Math.max(4, PLOT.bottom - feeY(fee));
      const x = clusterLeft + seriesIndex * (barWidth + barGap);
      const y = PLOT.bottom - height;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth}" height="${height.toFixed(1)}" rx="3" fill="${series.color}"/>`;
    }).join("\n  ");
    const label = `$${level.toLocaleString("en-US")}`;
    return `${bars}
  <text x="${(groupLeft + groupWidth / 2).toFixed(1)}" y="496" class="group" text-anchor="middle">${label} MTR</text>`;
  }).join("\n  ");

  const legend = FEE_SERIES.map((series, index) => {
    const x = 64 + index * 220;
    return `<rect x="${x}" y="162" width="14" height="14" rx="2" fill="${series.color}"/>
  <text x="${x + 22}" y="174" class="legend">${escapeXml(series.label)}</text>`;
  }).join("\n  ");

  const tableTop = 536;
  const rowHeight = 36;
  const columns = [250, 438, 626, 814, 1002];
  const header = FEE_LEVELS.map((level, index) => {
    return `<text x="${columns[index + 1]}" y="${tableTop + 22}" class="tick" text-anchor="middle">$${level.toLocaleString("en-US")}</text>`;
  }).join("\n  ");
  const rows = FEE_SERIES.map((series, rowIndex) => {
    const y = tableTop + rowHeight * (rowIndex + 1) + 22;
    const cells = FEE_LEVELS.map((level, index) => {
      return `<text x="${columns[index + 1]}" y="${y}" class="cell" text-anchor="middle">${formatFee(series.feeAt(level))}</text>`;
    }).join("\n  ");
    const band =
      rowIndex % 2 === 0
        ? `<rect x="56" y="${tableTop + rowHeight * (rowIndex + 1)}" width="1088" height="${rowHeight}" fill="#f7f4ee"/>`
        : "";
    return `${band}
  <text x="72" y="${y}" class="legend">${escapeXml(series.label)}</text>
  ${cells}`;
  }).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${FEE_WIDTH}" height="${FEE_HEIGHT}" viewBox="0 0 ${FEE_WIDTH} ${FEE_HEIGHT}" role="img" aria-labelledby="title desc">
  <title id="title">Monthly vendor fee at four revenue levels</title>
  <desc id="desc">Prices checked ${FEE_CHART_CHECKED_LABEL}. At $3,000, $8,000, $15,000, and $50,000 of monthly tracked revenue, the bars are RevenueCat at 1% after $2,500, Adapty at 1% after $5,000, Qonversion at 0.8% after $7,000, Apphud on the Free plan through $10,000 then Pro at 0.99% with a $49 minimum, and StoreKit 2 at no vendor fee. Qonversion's $64 and $400 match the pricing page examples. The other cells are arithmetic on the published rates, not invoices.</desc>
  <defs>
    <style>
      .eyebrow { font: 700 13px ui-monospace, "SF Mono", Menlo, Consolas, monospace; letter-spacing: 1.6px; text-transform: uppercase; fill: #2c5f4f; }
      .title { font: 600 32px "Source Serif 4", Georgia, serif; fill: #20241f; }
      .dek { font: 400 15px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6e6a5e; }
      .tick { font: 500 13px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6e6a5e; }
      .legend { font: 600 14px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #20241f; }
      .group { font: 600 14px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #20241f; }
      .cell { font: 600 14px ui-monospace, "SF Mono", Menlo, Consolas, monospace; fill: #20241f; }
      .foot { font: 500 14px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6e6a5e; }
    </style>
  </defs>
  <rect width="${FEE_WIDTH}" height="${FEE_HEIGHT}" fill="#fbfaf7"/>
  <text x="64" y="48" class="eyebrow">Price ledger | checked ${FEE_CHART_CHECKED_LABEL}</text>
  <text x="64" y="92" class="title">Monthly vendor fee at four revenue levels</text>
  <text x="64" y="124" class="dek">One number, treated as monthly tracked revenue. Superwall is not on this chart: its 1% applies only to paywall-attributed revenue.</text>
  <text x="64" y="146" class="dek">A $0 bar is a 4px cap. Read the table for the figure. Not an invoice.</text>
  ${legend}
  <rect x="56" y="198" width="1088" height="312" rx="7" fill="#ffffff" stroke="#e7e2d7"/>
  ${grid}
  ${groups}
  <text x="600" y="522" class="tick" text-anchor="middle">Monthly tracked revenue</text>
  <rect x="56" y="${tableTop}" width="1088" height="${rowHeight * (FEE_SERIES.length + 1)}" rx="7" fill="#ffffff" stroke="#e7e2d7"/>
  <text x="72" y="${tableTop + 22}" class="tick">Option</text>
  ${header}
  ${rows}
  <text x="64" y="792" class="foot">RevenueCat: $0 at or under $2,500 MTR, otherwise 1% of the whole MTR. Adapty: $0 under $5,000, otherwise 1% of monthly tracked revenue.</text>
  <text x="64" y="816" class="foot">Qonversion: $0 at or under $7,000 MTR, otherwise 0.8% of total MTR. The $64 and $400 cells are the pricing page's own examples.</text>
  <text x="64" y="840" class="foot">Apphud Free→Pro: $0 at or under $10,000 MTR, otherwise the greater of $49 and 0.99% of MTR. The $49 floor does not change the $15,000 or $50,000 cells.</text>
  <text x="64" y="864" class="foot">StoreKit 2: $0 vendor fee. Other cells are arithmetic on the published rates, not invoices.</text>
  <text x="64" y="900" class="foot">Prices checked ${FEE_CHART_CHECKED_LABEL} · vendor pricing pages</text>
  <text x="64" y="928" class="foot">Sources: revenuecat.com/pricing, RevenueCat billing docs, adapty.io/pricing, qonversion.io/pricing, apphud.com/pricing, developer.apple.com/storekit.</text>
  <text x="64" y="956" class="foot">IndieAppStack chart. Recheck the vendor pages before you commit spend.</text>
</svg>
`;
}

const FREE_WIDTH = 1200;
const FREE_HEIGHT = 860;
const FREE_BAR_LEFT = 300;
const FREE_BAR_MAX = 620;
const FREE_SCALE = 10000;

const FREE_ROWS = [
  {
    name: "RevenueCat",
    meter: "MTR",
    ceiling: 2500,
    label: "$2,500 MTR",
    color: "#9a6b23",
  },
  {
    name: "Adapty",
    meter: "tracked revenue",
    ceiling: 5000,
    label: "under $5,000",
    color: "#2c5f4f",
  },
  {
    name: "Qonversion",
    meter: "MTR",
    ceiling: 7000,
    label: "$7,000 MTR",
    color: "#20241f",
  },
  {
    name: "Apphud",
    meter: "MTR",
    ceiling: 10000,
    label: "$10,000 MTR",
    color: "#9e4434",
  },
  {
    name: "Superwall Indie",
    meter: "MAR, paywall revenue only",
    ceiling: 10000,
    label: "$10,000 MAR",
    color: "#6e6a5e",
  },
];

export function buildFreeTierChartSvg() {
  const rowTop = 214;
  const rowPitch = 88;
  const guides = [2500, 5000, 7000, 10000]
    .map((ceiling) => {
      const x = FREE_BAR_LEFT + (ceiling / FREE_SCALE) * FREE_BAR_MAX;
      return `<line x1="${x.toFixed(1)}" y1="200" x2="${x.toFixed(1)}" y2="680" stroke="#e7e2d7" stroke-dasharray="3 4"/>`;
    })
    .join("\n  ");

  const rows = FREE_ROWS.map((row, index) => {
    const y = rowTop + index * rowPitch;
    const width = (row.ceiling / FREE_SCALE) * FREE_BAR_MAX;
    const hatch =
      row.name === "Superwall Indie"
        ? `<rect x="${FREE_BAR_LEFT}" y="${y}" width="${width.toFixed(1)}" height="28" rx="4" fill="none" stroke="${row.color}" stroke-width="3"/>`
        : `<rect x="${FREE_BAR_LEFT}" y="${y}" width="${width.toFixed(1)}" height="28" rx="4" fill="${row.color}"/>`;
    return `<text x="48" y="${y + 14}" class="name">${escapeXml(row.name)}</text>
  <text x="48" y="${y + 36}" class="meter">${escapeXml(row.meter)}</text>
  ${hatch}
  <text x="${(FREE_BAR_LEFT + width + 12).toFixed(1)}" y="${y + 19}" class="value">${escapeXml(row.label)}</text>`;
  }).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${FREE_WIDTH}" height="${FREE_HEIGHT}" viewBox="0 0 ${FREE_WIDTH} ${FREE_HEIGHT}" role="img" aria-labelledby="title desc">
  <title id="title">Where each free tier ends</title>
  <desc id="desc">Prices checked ${FEE_CHART_CHECKED_LABEL}. RevenueCat is free up to $2,500 MTR. Adapty is free while revenue is under $5,000. Qonversion is free at or under $7,000 MTR. Apphud is free up to $10,000 MTR. Superwall Indie is free up to $10,000 of paywall-attributed revenue, which is not the same meter. StoreKit 2 has no vendor fee.</desc>
  <defs>
    <style>
      .eyebrow { font: 700 13px ui-monospace, "SF Mono", Menlo, Consolas, monospace; letter-spacing: 1.6px; text-transform: uppercase; fill: #2c5f4f; }
      .title { font: 600 32px "Source Serif 4", Georgia, serif; fill: #20241f; }
      .dek { font: 400 15px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6e6a5e; }
      .name { font: 600 16px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #20241f; }
      .meter { font: 500 13px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6e6a5e; }
      .value { font: 600 14px ui-monospace, "SF Mono", Menlo, Consolas, monospace; fill: #20241f; }
      .foot { font: 500 14px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6e6a5e; }
      .note { font: 600 16px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #20241f; }
    </style>
  </defs>
  <rect width="${FREE_WIDTH}" height="${FREE_HEIGHT}" fill="#fbfaf7"/>
  <text x="48" y="48" class="eyebrow">Price ledger | checked ${FEE_CHART_CHECKED_LABEL}</text>
  <text x="48" y="92" class="title">Where the free tier ends</text>
  <text x="48" y="126" class="dek">Length is the published free ceiling. Superwall Indie is outlined because the meter is paywall-attributed revenue, not all tracked revenue.</text>
  <text x="48" y="150" class="dek">Adapty's bar is the "under $5,000" line from its pricing page. StoreKit 2 has no ceiling because there is no vendor fee.</text>
  ${guides}
  ${rows}
  <text x="48" y="668" class="note">StoreKit 2: no vendor fee, at any revenue.</text>
  <text x="48" y="724" class="foot">RevenueCat up to $2,500 MTR. Adapty under $5,000. Qonversion at or under $7,000 MTR. Apphud up to $10,000 MTR. Superwall Indie up to $10,000 MAR.</text>
  <text x="48" y="756" class="foot">Prices checked ${FEE_CHART_CHECKED_LABEL} · vendor pricing pages</text>
  <text x="48" y="788" class="foot">Sources: revenuecat.com/pricing, adapty.io/pricing, qonversion.io/pricing, apphud.com/pricing, superwall.com/pricing, developer.apple.com/storekit.</text>
  <text x="48" y="820" class="foot">IndieAppStack chart. Recheck the vendor pages before you commit spend.</text>
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
  const articlesDir = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../public/content-visuals/articles",
  );
  fs.writeFileSync(
    path.join(articlesDir, "revenuecat-alternatives-fees-oct-2026.svg"),
    buildFeeChartSvg(),
  );
  fs.writeFileSync(
    path.join(articlesDir, "revenuecat-alternatives-free-tiers-oct-2026.svg"),
    buildFreeTierChartSvg(),
  );
}
