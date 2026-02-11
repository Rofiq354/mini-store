import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Tombol untuk toggle sidebar di mobile/desktop */}
          <div className="flex items-center mb-6">
            <SidebarTrigger />
            <div className="ml-4 h-4 w-px bg-border mr-4" />
            <h1 className="font-semibold">Dashboard Overview</h1>
          </div>

          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
