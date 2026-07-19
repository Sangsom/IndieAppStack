import { JsonLd } from "@/components/public/json-ld";
import { PublicShell } from "@/components/public/public-shell";
import { organizationJsonLd } from "@/lib/seo";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PublicShell>
      <JsonLd data={organizationJsonLd()} />
      {children}
    </PublicShell>
  );
}
