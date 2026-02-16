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
import { User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { signout } from "@/services/auth-action";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  email: string | undefined;
  role: string | null;
}

export function UserMenu({ email, role }: UserMenuProps) {
  const router = useRouter();
  const handleLogout = async () => {
    await signout();
  };

  return (
    <div className="flex items-center gap-2">
      {role === "merchant" && (
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span className="inline">Dashboard</span>
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

          {role === "customer" && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/orders">Pesanan Saya</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">Profil</Link>
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
