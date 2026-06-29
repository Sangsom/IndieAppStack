import { PublicShell } from "@/components/public/public-shell";
import { organizationJsonLd } from "@/lib/seo";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PublicShell>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
        type="application/ld+json"
      />
      {children}
    </PublicShell>
  );
}
