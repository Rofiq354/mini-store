"use client";

import {
  LayoutDashboard,
  Users,
  Settings,
  Package,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";
import { usePathname } from "next/navigation";
import Link from "next/link";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r">
      <SidebarHeader className="py-6 mb-2">
        <div
          className={`flex items-center transition-all duration-300 ${isCollapsed ? "justify-center" : "px-4"}`}
        >
          <Logo showText={!isCollapsed} />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {" "}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider">
            Main Menu
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {" "}
              {items.map((item) => {
                // Cek apakah item ini aktif
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`h-10 px-4 transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                          : "hover:bg-accent"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon
                          className={`size-5 ${isActive ? "text-primary" : ""}`}
                        />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        {" "}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full h-10 px-4 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="size-5" />
              <span className="font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
