"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  UserCircle,
} from "lucide-react";
import { signout } from "@/services/auth-action";

interface UserMenuProps {
  email: string | undefined;
  role: string | null;
}

export function UserMenu({ email, role }: UserMenuProps) {
  const handleLogout = async () => {
    await signout();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Dashboard button: hanya tampil di sm ke atas */}
      {role === "merchant" && (
        <Button variant="outline" size="sm" asChild className="hidden sm:flex">
          <Link href="/admin/dashboard">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <UserIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5 text-sm font-medium opacity-70 italic truncate">
            {email}
          </div>
          <DropdownMenuSeparator />

          {/* Dashboard masuk dropdown di mobile */}
          {role === "merchant" && (
            <>
              <DropdownMenuItem asChild className="sm:hidden">
                <Link href="/admin/dashboard" className="cursor-pointer">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="sm:hidden" />
            </>
          )}

          {role === "customer" && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/orders" className="cursor-pointer">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Pesanan Saya
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <UserCircle className="h-4 w-4 mr-2" />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
