import Link from "next/link";
import { signout } from "@/services/auth-action";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { LogOut } from "lucide-react";
import { createClient } from "@/utils/supbase/server";
import { Logo } from "./Logo";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user?.user_metadata?.role;

  return (
    <nav className="fixed w-full z-50 top-0 bg-background/95 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex shrink-0 items-center">
          <Logo responsive={true} />
        </div>

        {/* NAVIGASI TENGAH (Menggunakan NavigationMenu Shadcn) */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="#fitur">Solusi</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="#cara-kerja">Cara Kerja</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              {role === "merchant" && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/products">Dashboard</Link>
                </Button>
              )}

              <form action={signout}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" /> Keluar
                </Button>
              </form>
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Buka Gerai</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
