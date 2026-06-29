import type { Metadata } from "next";
import localFont from "next/font/local";
import { PlausibleAnalytics } from "@/components/analytics/plausible-analytics";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const sourceSerif = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/source-serif-4/files/source-serif-4-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/source-serif-4/files/source-serif-4-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/source-serif-4/files/source-serif-4-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: "%s | IndieAppStack",
  },
  description: siteConfig.description,
  openGraph: {
    description: siteConfig.description,
    images: [
      {
        alt: `${siteConfig.name} preview`,
        height: 630,
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
      },
    ],
    siteName: siteConfig.name,
    title: siteConfig.name,
    type: "website",
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    description: siteConfig.description,
    images: [absoluteUrl("/opengraph-image")],
    title: siteConfig.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sourceSerif.variable}>
      <body>
        {children}
        <PlausibleAnalytics />
      </body>
    </html>
  );
}
