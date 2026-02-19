import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store, Package, UserIcon } from "lucide-react";
import { createClient } from "@/utils/supbase/server";
import { Logo } from "./Logo";
import { CartBadge } from "./CartBadge";
import { UserMenu } from "./UserMenu";
import { NavSearch } from "./NavSearch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dbRole = user?.user_metadata?.role;

  if (user && !dbRole) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    dbRole = profile?.role;
  }

  const isCustomer = dbRole === "customer";

  return (
    <nav className="fixed w-full z-50 top-0 bg-background/95 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:gap-6">
            <Logo responsive={false} />

            {/* Tampil di mobile & sm, sembunyi di md, tampil lagi di lg */}
            <div className="flex md:hidden lg:flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/products" className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>Produk</span>
                </Link>
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <Link href="/stores" className="flex items-center gap-1">
                  <Store className="h-4 w-4" />
                  <span>Toko</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl">
            <NavSearch />
          </div>

          <div className="flex items-center gap-2">
            {user && isCustomer && <CartBadge />}

            {user ? (
              <UserMenu email={user.email} role={dbRole} />
            ) : (
              <>
                {/* Desktop: tampil langsung */}
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Masuk</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/signup">Daftar</Link>
                  </Button>
                </div>

                {/* Mobile: dropdown */}
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <UserIcon className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem asChild>
                        <Link href="/login" className="cursor-pointer">
                          Masuk
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/signup"
                          className="cursor-pointer font-semibold text-primary"
                        >
                          Daftar
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="md:hidden pb-3">
          <NavSearch />
        </div>
      </div>
    </nav>
  );
}
