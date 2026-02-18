import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store, Package } from "lucide-react";
import { createClient } from "@/utils/supbase/server";
import { Logo } from "./Logo";
import { CartBadge } from "./CartBadge";
import { UserMenu } from "./UserMenu";
import { NavSearch } from "./NavSearch";

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
          <div className="flex items-center gap-6">
            <Logo responsive={false} />

            <div className="hidden lg:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/products" className="flex items-center">
                  <Package className="h-4 w-4" />
                  Produk
                </Link>
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <Link href="/stores" className="flex items-center">
                  <Store className="h-4 w-4" />
                  Toko
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
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">
                    <span className="hidden sm:inline">Daftar</span>
                    <span className="sm:hidden">Daftar</span>
                  </Link>
                </Button>
              </div>
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
