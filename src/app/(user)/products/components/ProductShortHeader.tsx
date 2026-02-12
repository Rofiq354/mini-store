"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";

interface ProductSortHeaderProps {
  totalProducts: number;
}

export function ProductSortHeader({ totalProducts }: ProductSortHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const currentSort = searchParams.get("sort") || "terbaru";

  return (
    <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <div className="space-y-2 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">
            Menampilkan{" "}
            <span className="font-bold text-gray-900">{totalProducts}</span>{" "}
            Produk Berkualitas
          </p>
        </div>
        <div className="h-1.5 w-16 bg-primary/80 rounded-full"></div>
      </div>

      <div className="flex items-end gap-4 w-full sm:w-auto">
        <div className="hidden lg:flex items-center border border-gray-100 rounded-xl p-1 bg-gray-50/50">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 bg-white shadow-sm text-primary rounded-lg"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400">
            <List className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-1.5 flex-1 sm:flex-none">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">
            Urutkan Berdasarkan
          </Label>
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-52 h-10 border-gray-200 focus:ring-primary rounded-xl bg-white text-xs font-medium">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3 w-3 text-gray-400" />
                <SelectValue placeholder="Pilih Urutan" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-xl border-gray-100">
              <SelectItem value="terbaru" className="text-xs">
                Terbaru
              </SelectItem>
              <SelectItem value="terlama" className="text-xs">
                Terlama
              </SelectItem>
              <SelectItem value="termurah" className="text-xs">
                Harga: Rendah ke Tinggi
              </SelectItem>
              <SelectItem value="termahal" className="text-xs">
                Harga: Tinggi ke Rendah
              </SelectItem>
              <SelectItem value="populer" className="text-xs">
                Paling Populer
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
