// Published rates opened 2026-10-29.
// Superwall Indie: $0 up to $10k MAR, then 1% of total MAR.
//   https://superwall.com/pricing
//   The series assumes every dollar went through a Superwall paywall.
// RevenueCat: free up to $2,500 MTR, then 1% of the whole MTR.
//   https://www.revenuecat.com/pricing/
//   https://www.revenuecat.com/docs/welcome/set-up-revenuecat/account-management
//   Billing example: $2,600 MTR bills $26.
// Adapty: free up to $5,000 a month, then 1% of the full month.
//   https://adapty.io/pricing/
// Qonversion Pro: free at or under $7,000 MTR, then 0.8% of total tracked revenue.
//   https://qonversion.io/pricing
//   Page examples: $64 at $8,000, $400 at $50,000.
// Apphud Free: $0 up to $10,000 MTR. Above that the Free plan publishes no fee.
// Apphud Pro: max($49, 0.99% of MTR). Paid plans are free in a month under $1,000 MTR.
//   https://apphud.com/pricing
// Purchasely and Nami ML publish no price and are not plotted.

export const FEE_CHART_CHECKED_LABEL = "Oct 29, 2026";
export const FEE_LEVELS = [5000, 10000, 25000, 50000];

function percent(revenue, hundredthsOfAPercent) {
  return (revenue * hundredthsOfAPercent) / 10000;
}

export function superwallIndieMonthlyFee(monthlyAttributedRevenue) {
  if (monthlyAttributedRevenue <= 10000) {
    return 0;
  }

  return percent(monthlyAttributedRevenue, 100);
}

export function revenueCatMonthlyFee(monthlyTrackedRevenue) {
  if (monthlyTrackedRevenue <= 2500) {
    return 0;
  }

  return percent(monthlyTrackedRevenue, 100);
}

export function adaptyMonthlyFee(monthlyTrackedRevenue) {
  if (monthlyTrackedRevenue <= 5000) {
    return 0;
  }

  return percent(monthlyTrackedRevenue, 100);
}

export function qonversionMonthlyFee(monthlyTrackedRevenue) {
  if (monthlyTrackedRevenue <= 7000) {
    return 0;
  }

  return percent(monthlyTrackedRevenue, 80);
}

export function apphudFreeMonthlyFee(monthlyTrackedRevenue) {
  if (monthlyTrackedRevenue <= 10000) {
    return 0;
  }

  return null;
}

export function apphudProMonthlyFee(monthlyTrackedRevenue) {
  if (monthlyTrackedRevenue < 1000) {
    return 0;
  }

  return Math.max(49, percent(monthlyTrackedRevenue, 99));
}

function money(amount) {
  if (amount === null) {
    return "over cap";
  }

  if (amount === 0) {
    return "$0";
  }

  const negative = amount < 0;
  const absolute = Math.abs(amount);
  const fixed = Number.isInteger(absolute)
    ? String(absolute)
    : absolute.toFixed(2);
  const [whole, fraction] = fixed.split(".");
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const body = fraction ? `${withCommas}.${fraction}` : withCommas;

  return `${negative ? "-" : ""}$${body}`;
}

const SERIES = [
  {
    bar: "#2c5f4f",
    fee: superwallIndieMonthlyFee,
    name: "Superwall Indie",
  },
  {
    bar: "#9a6b23",
    fee: revenueCatMonthlyFee,
    name: "RevenueCat",
  },
  {
    bar: "#20241f",
    fee: adaptyMonthlyFee,
    name: "Adapty",
  },
  {
    bar: "#6e6a5e",
    fee: qonversionMonthlyFee,
    name: "Qonversion Pro",
  },
  {
    bar: "#2c5f4f",
    fee: apphudFreeMonthlyFee,
    name: "Apphud Free",
  },
  {
    bar: "#9a6b23",
    fee: apphudProMonthlyFee,
    name: "Apphud Pro",
  },
];

export function buildFeeChartSvg() {
  const width = 1240;
  const height = 1080;
  const rows = SERIES.map((series) => ({
    ...series,
    values: FEE_LEVELS.map((level) => series.fee(level)),
  }));
  const maxFee = 500;
  const labelX = 72;
  const columns = [430, 640, 850, 1060];
  const rowTop = 292;
  const rowHeight = 74;

  const header = FEE_LEVELS.map((level, index) => {
    return `<text x="${columns[index]}" y="228" text-anchor="middle" class="col">${money(level)}</text>`;
  }).join("\n  ");

  const body = rows
    .map((series, rowIndex) => {
      const y = rowTop + rowIndex * rowHeight;
      const band =
        rowIndex % 2 === 0
          ? `<rect x="48" y="${y - 22}" width="1144" height="${rowHeight}" fill="#ffffff"/>`
          : "";
      const cells = series.values
        .map((value, index) => {
          const x = columns[index];
          if (value === null) {
            return `<text x="${x}" y="${y + 8}" text-anchor="middle" class="over">over cap</text>`;
          }

          const barWidth =
            value === 0 ? 0 : Math.max(8, (value / maxFee) * 150);
          const bar =
            value === 0
              ? ""
              : `<rect x="${x - barWidth / 2}" y="${y + 18}" width="${barWidth.toFixed(1)}" height="10" rx="4" fill="${series.bar}"/>`;

          return `<text x="${x}" y="${y + 8}" text-anchor="middle" class="money">${money(value)}</text>\n    ${bar}`;
        })
        .join("\n    ");

      return `${band}
  <text x="${labelX}" y="${y + 8}" class="vendor">${series.name}</text>
    ${cells}`;
    })
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">Monthly fees for Superwall alternatives at four revenue levels</title>
  <desc id="desc">Prices checked Oct 29, 2026. Fees at $5,000, $10,000, $25,000, and $50,000 for Superwall Indie, RevenueCat, Adapty, Qonversion Pro, and Apphud Free and Pro. The Superwall series assumes all revenue goes through the paywall. Purchasely and Nami ML are omitted because they have no public price.</desc>
  <style>
    .eyebrow { font: 700 13px ui-monospace, "SF Mono", Menlo, Consolas, monospace; letter-spacing: 1.6px; text-transform: uppercase; fill: #2c5f4f; }
    .title { font: 600 34px "Source Serif 4", Georgia, serif; fill: #20241f; }
    .dek { font: 400 16px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6e6a5e; }
    .col { font: 700 14px ui-monospace, "SF Mono", Menlo, Consolas, monospace; letter-spacing: 0.6px; fill: #2c5f4f; }
    .vendor { font: 600 18px "Source Serif 4", Georgia, serif; fill: #20241f; }
    .money { font: 600 18px ui-monospace, "SF Mono", Menlo, Consolas, monospace; fill: #20241f; }
    .over { font: 500 15px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6e6a5e; }
    .foot { font: 500 14px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6e6a5e; }
  </style>
  <rect width="${width}" height="${height}" fill="#fbfaf7"/>
  <text x="48" y="48" class="eyebrow">Price ledger</text>
  <text x="48" y="96" class="title">Monthly fee at four revenue levels</text>
  <text x="48" y="132" class="dek">Published rates applied to each column. Not an invoice.</text>
  <text x="48" y="158" class="dek">Superwall uses paywall-attributed revenue. This chart assumes all of the column goes through the paywall.</text>
  <line x1="48" y1="186" x2="1192" y2="186" stroke="#e7e2d7" stroke-width="2"/>
  ${header}
  ${body}
  <line x1="48" y1="760" x2="1192" y2="760" stroke="#e7e2d7" stroke-width="2"/>
  <text x="48" y="796" class="foot">Prices checked Oct 29, 2026 · vendor pricing pages</text>
  <text x="48" y="822" class="foot">Purchasely and Nami ML are omitted: no public price (sales demo).</text>
  <text x="48" y="856" class="foot">Superwall Indie = $0 up to $10,000 MAR, else 1% of total MAR.</text>
  <text x="48" y="880" class="foot">RevenueCat = $0 up to $2,500 MTR, else 1% of the whole MTR.</text>
  <text x="48" y="904" class="foot">Adapty = $0 up to $5,000, else 1% of the full month's tracked revenue.</text>
  <text x="48" y="928" class="foot">Qonversion Pro = $0 at or under $7,000 MTR, else 0.8% of total tracked revenue.</text>
  <text x="48" y="952" class="foot">Apphud Free = $0 up to $10,000 MTR. Above that, the Free plan publishes no fee.</text>
  <text x="48" y="976" class="foot">Apphud Pro = the greater of $49 and 0.99% of MTR. These columns are above the $1,000 month in which paid plans are free.</text>
  <text x="48" y="1008" class="foot">Sources: superwall.com/pricing, revenuecat.com/pricing, adapty.io/pricing, qonversion.io/pricing, apphud.com/pricing.</text>
</svg>
`;
}
