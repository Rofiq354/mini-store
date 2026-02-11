import Link from "next/link";
import { signout } from "@/services/auth-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ShoppingCart,
  Store,
  LogOut,
  User,
  Package,
  LayoutDashboard,
} from "lucide-react";
import { createClient } from "@/utils/supbase/server";
import { Logo } from "./Logo";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user?.user_metadata?.role;

  // TODO: Fetch cart count from database
  const cartCount = 0;

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
            {/* Cart Button (Only for customers) */}
            {(!user || role === "customer") && (
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* Dashboard Button for Merchant */}
                {role === "merchant" && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/products">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                  </Button>
                )}

                {/* User Menu Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user.email}
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
                    <DropdownMenuItem asChild>
                      <form action={signout} className="w-full">
                        <button className="flex w-full items-center text-destructive">
                          <LogOut className="h-4 w-4 mr-2" />
                          Keluar
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
