import Link from "next/link";
import { Logo } from "./Logo";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Logo showText={true} />
            <p className="text-sm text-muted-foreground">
              Platform marketplace UMKM digital yang menghubungkan pedagang
              lokal dengan pembeli di seluruh Indonesia.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <Link
                href="#"
                className="h-9 w-9 rounded-lg bg-background border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="h-9 w-9 rounded-lg bg-background border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="h-9 w-9 rounded-lg bg-background border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Untuk Pembeli
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Jelajahi Produk
                </Link>
              </li>
              <li>
                <Link
                  href="/kategori"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Kategori
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Keranjang
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Pesanan Saya
                </Link>
              </li>
            </ul>
          </div>

          {/* Merchant Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Untuk Pedagang
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/signup"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Buka Gerai
                </Link>
              </li>
              <li>
                <Link
                  href="#cara-kerja"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/dashboard"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Bantuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Hubungi Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-muted-foreground">
                <Mail className="h-5 w-5 shrink-0 mt-0.5" />
                <a
                  href="mailto:support@geraiku.com"
                  className="hover:text-primary transition-colors"
                >
                  support@geraiku.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <Phone className="h-5 w-5 shrink-0 mt-0.5" />
                <a
                  href="tel:+6281234567890"
                  className="hover:text-primary transition-colors"
                >
                  +62 812-3456-7890
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 GeraiKu. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
              >
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
