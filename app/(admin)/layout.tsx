export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="min-h-dvh bg-paper text-ink">{children}</section>;
}
