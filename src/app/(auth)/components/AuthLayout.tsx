import { Logo } from "@/components/Logo";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Kolom Kiri: Area Form (Client/Children) */}
      <div className="relative flex flex-col justify-between p-6 md:p-10 bg-background">
        <div className="flex justify-center md:justify-start">
          <Logo className="scale-110" />
        </div>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm space-y-8">{children}</div>
        </div>

        <div className="text-center md:text-left">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} GeraiKu — Solusi Digital UMKM
            Indonesia.
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Visual Branding (Sama untuk Login/Register) */}
      <div className="relative hidden lg:flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="/images/auth-image.jpg"
          alt="GeraiKu Merchant"
          fill
          priority
          className="object-cover blur-[3px] scale-105 transition-all duration-700"
          sizes="50vw"
        />

        <div className="absolute inset-0 bg-orange-950/20" />

        <div className="relative z-10 p-12 text-center">
          <h2 className="text-4xl font-black tracking-tight text-white mb-4 leading-tight drop-shadow-md">
            {title}
          </h2>
          <p className="text-lg text-white/90 max-w-md mx-auto drop-shadow-sm font-medium">
            {description}
          </p>
        </div>

        <div className="absolute bottom-10 right-10 z-10 opacity-20">
          <Logo
            showText={false}
            className="scale-[3] rotate-12 grayscale brightness-200"
          />
        </div>
      </div>
    </div>
  );
}
