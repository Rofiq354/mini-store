import Link from "next/link";
import { signout } from "@/app/(auth)/auth/action";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Store, LogOut } from "lucide-react";
import { createClient } from "@/utils/supbase/server";
import { Logo } from "./Logo";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="fixed w-full z-50 top-0 bg-background/95 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex shrink-0 items-center">
          {/* Di layar HP cuma logo (kalau lebar ga cukup), di Desktop lengkap */}
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
            <form action={signout}>
              <Button variant="ghost" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" /> Keluar
              </Button>
            </form>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700" asChild>
                <Link href="/signup">Buka Gerai</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
