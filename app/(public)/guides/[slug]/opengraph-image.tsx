import { ImageResponse } from "next/og";

import { getGuideDetail } from "@/lib/guide-data";
import { siteConfig } from "@/lib/site";

export const alt = "IndieAppStack field guide";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

// Per-article Open Graph card. Rendered at build for each guide slug
// (guides use generateStaticParams), themed to the brand: ink ground,
// gold eyebrow, paper headline (the article's own title), domain footer.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideDetail(slug);

  const eyebrow = `INDIEAPPSTACK · ${(guide?.category ?? "Field guide").toUpperCase()}`;
  const title = guide?.title ?? siteConfig.name;
  const subtitle =
    guide?.subtitle ??
    "A source-checked field guide for solo mobile developers.";
  const titleSize = title.length > 52 ? 52 : 62;

  return new ImageResponse(
    <div
      style={{
        background: "#20241F",
        color: "#FBFAF7",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: 72,
        position: "relative",
        width: "100%",
      }}
    >
      {/* Faint terminal-prompt motif (owned, conceptual) */}
      <div
        style={{
          bottom: -34,
          color: "#2C5F4F",
          display: "flex",
          fontSize: 300,
          fontWeight: 700,
          opacity: 0.16,
          position: "absolute",
          right: 52,
        }}
      >
        {">_"}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            color: "#D4A85A",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 3,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            fontWeight: 800,
            lineHeight: 1.08,
            maxWidth: 1010,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "#B8B2A4",
            display: "flex",
            fontSize: 27,
            lineHeight: 1.3,
            maxWidth: 900,
          }}
        >
          {subtitle}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div
          style={{
            background: "#D4A85A",
            height: 1,
            opacity: 0.5,
            width: "100%",
          }}
        />
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: "#D4A85A", fontSize: 22, fontWeight: 700 }}>
            indieappstack.com
          </div>
          <div style={{ color: "#B8B2A4", fontSize: 18 }}>
            A field guide for solo mobile developers
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
