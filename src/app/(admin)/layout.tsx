import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./components/AdminSidebar";
import { createClient } from "@/utils/supbase/server";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || user.user_metadata.role !== "merchant") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <Toaster />
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
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
