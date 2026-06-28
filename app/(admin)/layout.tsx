export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-dvh bg-ink text-paper">
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-6 py-8 sm:px-10">
        {children}
      </div>
    </section>
  );
}
