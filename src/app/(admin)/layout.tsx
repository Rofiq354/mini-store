export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar khusus Admin/Merchant */}
      <aside className="w-64 bg-orange-600 text-white hidden md:block">
        <div className="p-6 font-bold text-2xl">GeraiKu</div>
        <nav className="mt-10 px-4">{/* Link menu dashboard */}</nav>
      </aside>

      <div className="flex-1">
        {/* Header Dashboard jika perlu */}
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
          <span className="font-semibold text-gray-700">
            Dashboard Merchant
          </span>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
