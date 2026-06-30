import type { Metadata, Viewport } from "next";
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
  icons: {
    icon: [
      { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
      {
        rel: "icon",
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon-64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
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

export const viewport: Viewport = {
  themeColor: "#0F172A",
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
