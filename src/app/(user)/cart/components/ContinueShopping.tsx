"use client";

import Link from "next/link";
import { Store, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContinueShopping() {
  return (
    <div className="mt-6 flex justify-center">
      <Button variant="outline" asChild>
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Lanjut Belanja
        </Link>
      </Button>
    </div>
  );
}
