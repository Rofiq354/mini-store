"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFCF8] px-4 text-center">
      {/* Container dengan style kertas tua / rustic */}
      <div className="max-w-md space-y-6 p-8 border border-[#E2D1B3] bg-white shadow-sm rounded-sm">
        {/* Ikon atau Logo Kecil */}
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-[#8B4513]/10 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#8B4513]" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-serif text-[#5D4037]">
            Farewell for now
          </h1>
          <p className="text-[#8D6E63] italic">
            "Thank you for stopping by The Kind Counter. We're tidying up your
            desk and closing the ledger."
          </p>
        </div>

        <div className="pt-4 border-t border-[#F5E6D3]">
          <p className="text-xs uppercase tracking-widest text-[#A1887F]">
            Redirecting to the front porch...
          </p>
        </div>
      </div>
    </div>
  );
}
