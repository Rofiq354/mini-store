import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Store, Package } from "lucide-react";
import { createClient } from "@/utils/supbase/server";
import { Logo } from "./Logo";
import { CartBadge } from "./CartBadge";
import { UserMenu } from "./UserMenu";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user?.user_metadata?.role;

  return (
    <nav className="fixed w-full z-50 top-0 bg-background/95 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4">
        {/* Main Navbar */}
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Logo responsive={true} />

            {/* Categories Dropdown - Desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden lg:flex">
                  <Package className="h-4 w-4 mr-2" />
                  Kategori
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem>
                  <Link href="/kategori/makanan" className="w-full">
                    🍔 Makanan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/kategori/minuman" className="w-full">
                    🥤 Minuman
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/kategori/snack" className="w-full">
                    🍿 Snack
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/kategori/sembako" className="w-full">
                    🌾 Sembako
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/kategori" className="w-full font-medium">
                    Lihat Semua Kategori
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search Bar - Center (Desktop Only) */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari produk, kategori, atau warung..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Right Section: Cart + Auth */}
          <div className="flex items-center gap-2">
            {user && role === "customer" && <CartBadge />}

            {user ? (
              <UserMenu email={user.email} role={role} />
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">
                    <Store className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Buka Gerai</span>
                    <span className="sm:hidden">Daftar</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari produk..."
              className="pl-10 w-full"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
