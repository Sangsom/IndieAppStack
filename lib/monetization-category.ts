import type {
  ComparisonColumn,
  ComparisonRow,
} from "@/components/public/comparison-table";

export type MonetizationFaq = {
  answer: string;
  question: string;
};

type NamedTool = {
  name: string;
};

export const monetizationPriceCheckedLabel = "Sep 25, 2026";

export const monetizationShortAnswer =
  "App monetization tools sit between your app and the store. RevenueCat, Adapty, Qonversion, and Superwall each stay free under their own revenue threshold, then bill a percentage of tracked or paywall-attributed revenue. Apple's store commission is a separate bill. It does not change with the tool you pick.";

export const monetizationHeading = "App monetization tools";

export const monetizationFaq: MonetizationFaq[] = [
  {
    question: "What are app monetization tools?",
    answer:
      "They are the purchase layer for a mobile app: receipt validation, entitlements, paywalls, and revenue reporting. The four tools in this category are RevenueCat, Adapty, Qonversion, and Superwall. Store products still live in App Store Connect or Google Play.",
  },
  {
    question: "Which app monetization tool stays free the longest?",
    answer:
      "On published thresholds checked Sep 25, 2026, Superwall's subscription infrastructure is free at any scale, and its Indie paywall plan is free up to $10,000 in monthly attributed revenue. Qonversion's Pro plan is free through $7,000 in monthly tracked revenue. Adapty is free under $5,000. RevenueCat is free under $2,500. The meters are not the same, so a higher threshold is not automatically the lower bill.",
  },
  {
    question: "Do the September 2026 App Store terms change these tool prices?",
    answer:
      "No. Apple's EU business terms take effect Oct 1, 2026. For a solo developer on EU In-App Purchase in the Small Business Program, Apple's commission is 15 percent of the price the customer pays. That rate is the same whether the purchase goes through RevenueCat, Adapty, Qonversion, Superwall, or StoreKit 2. The vendor percentage is a second bill, on a different base.",
  },
  {
    question: "When should a solo app skip a monetization tool?",
    answer:
      "Skip the SDK when the app is iOS-only, the purchase surface is one product or a single unlock, and you will not change the paywall without an App Store release. StoreKit 2 can own that case. Add a tool when receipt validation, restores, or a cross-platform customer record are the risk you do not want to maintain.",
  },
];

export const monetizationArchetypes = [
  {
    href: "/stacks/subscription-consumer-app",
    name: "Subscription consumer app",
    pick: "RevenueCat for entitlements, Superwall for remote paywall tests.",
  },
  {
    href: "/stacks/content-community-app",
    name: "Content and community app",
    pick: "RevenueCat once access depends on a subscription. The backend stays Supabase.",
  },
  {
    href: "/stacks/b2b-productivity-app",
    name: "B2B and productivity app",
    pick: "RevenueCat if the iOS app sells a subscription. Team billing on the web is a separate path.",
  },
  {
    href: "/stacks/casual-game-app",
    name: "Casual game",
    pick: "RevenueCat plus Superwall when the game sells subscriptions and you will test the paywall remotely.",
  },
  {
    href: "/stacks/free-utility-app",
    name: "Free utility app",
    pick: "No purchase SDK until you add a paid unlock. RevenueCat is the later add, not the starting stack.",
  },
  {
    href: "/stacks/prelaunch-waitlist-app",
    name: "Pre-launch waitlist",
    pick: "No monetization tool yet. The stack is a landing page, a list, and store research.",
  },
] as const;

const columnOrder = [
  "RevenueCat",
  "Adapty",
  "Qonversion",
  "Superwall",
] as const;

function columnsFor(tools: NamedTool[]): ComparisonColumn[] {
  const names = new Set(tools.map((tool) => tool.name));

  return columnOrder
    .filter((name) => names.has(name))
    .map((name) => ({ key: name, label: name }));
}

export function buildMonetizationComparison(tools: NamedTool[]): {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  sources: string;
} {
  const columns = columnsFor(tools);

  const rows: ComparisonRow[] = [
    {
      feature: "Free while",
      cells: {
        RevenueCat: "Monthly tracked revenue under $2,500",
        Adapty: "Monthly revenue under $5,000",
        Qonversion: "Monthly tracked revenue at or under $7,000",
        Superwall:
          "Infrastructure is free at any scale. Indie paywalls are free up to $10,000 monthly attributed revenue",
      },
    },
    {
      feature: "Rate after that",
      cells: {
        RevenueCat: "1% of the whole monthly tracked revenue",
        Adapty: "1% of that month's revenue",
        Qonversion: "0.8% of the whole monthly tracked revenue",
        Superwall:
          "Indie: 1% of total monthly attributed revenue. Startup $49/month plus 1%. Scale $199/month plus 1%",
      },
    },
    {
      feature: "What the meter covers",
      cells: {
        RevenueCat:
          "Amount charged to the customer, before store commission and taxes, including one-time purchases",
        Adapty:
          "Revenue Adapty tracks that month, in USD, before Apple, Google, or Stripe take their cut",
        Qonversion:
          "Revenue processed through the SDK in the calendar month, including renewals and one-time purchases",
        Superwall:
          "Paywall revenue only: dollars that flowed through a Superwall-rendered paywall. Other subscriptions are not on that meter",
      },
    },
    {
      feature: "Vendor bill at $8,000 charged to the customer",
      cells: {
        RevenueCat: "$80",
        Adapty: "$80",
        Qonversion: "$64",
        Superwall:
          "$0 on Indie while attributed revenue stays at or under $10,000",
      },
    },
    {
      feature: "Apple, EU Small Business, In-App Purchase",
      cells: {
        RevenueCat: "15% of the customer price. $1,200 on $8,000",
        Adapty: "15% of the customer price. $1,200 on $8,000",
        Qonversion: "15% of the customer price. $1,200 on $8,000",
        Superwall: "15% of the customer price. $1,200 on $8,000",
      },
    },
    {
      feature: "Pricing checked",
      cells: {
        RevenueCat: monetizationPriceCheckedLabel,
        Adapty: monetizationPriceCheckedLabel,
        Qonversion: monetizationPriceCheckedLabel,
        Superwall: monetizationPriceCheckedLabel,
      },
    },
  ];

  return {
    columns,
    rows: rows.map((row) => ({
      ...row,
      cells: Object.fromEntries(
        columns.map((column) => [column.key, row.cells[column.key] ?? ""]),
      ),
    })),
    sources:
      "Vendor rows checked Sep 25, 2026 on revenuecat.com/pricing, RevenueCat billing docs, adapty.io/pricing, qonversion.io/pricing, and superwall.com/pricing. The $8,000 vendor bills use each vendor's published rule: 1% of $8,000, 1% of $8,000, 0.8% of $8,000, and Superwall Indie still inside the $10,000 band. Apple's 15% is the EU Small Business Program In-App Purchase rate under terms effective Oct 1, 2026, from the September 2026 cost guide. Do not add 15% and the vendor rate as if they share one base.",
  };
}
