import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const alt = "IndieAppStack";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#F7F4EE",
        color: "#1D2721",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: 72,
        width: "100%",
      }}
    >
      <div
        style={{
          border: "2px solid #B8C7B7",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: 56,
          width: "100%",
        }}
      >
        <div style={{ color: "#2F6F4E", fontSize: 28, fontWeight: 700 }}>
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.05 }}>
          Choose the right tools for your mobile app.
        </div>
        <div style={{ color: "#5F6E64", fontSize: 30, lineHeight: 1.35 }}>
          {siteConfig.description}
        </div>
      </div>
    </div>,
    size,
  );
}
