"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatIDR } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Loader2, PackageCheck, Search, Truck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: string;
  label: string;
}

interface ProductSidebarProps {
  categories: Category[];
}

const PRICE_PRESETS = [
  { label: "1k - 50k", min: 1000, max: 50000, step: 1000 },
  { label: "1k - 100k", min: 1000, max: 100000, step: 5000 },
  { label: "1k - 500k", min: 1000, max: 500000, step: 10000 },
  { label: "1k - 1jt", min: 1000, max: 1000000, step: 25000 },
];

export function ProductSidebar({ categories }: ProductSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [config, setConfig] = useState(PRICE_PRESETS[1]); // Default pakai 1k - 100k
  const [priceRange, setPriceRange] = useState([config.min, config.max]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [readyStockOnly, setReadyStockOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handlePresetClick = (preset: (typeof PRICE_PRESETS)[0]) => {
    setConfig(preset);
    setPriceRange([preset.min, preset.max]);
  };
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategories(categoryFromUrl.split(","));
    } else {
      setSelectedCategories([]);
    }
    const isReady = searchParams.get("ready") === "true";
    setReadyStockOnly(isReady);

    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");

    if (min && max) {
      setPriceRange([Number(min), Number(max)]);

      const matchedPreset = PRICE_PRESETS.find(
        (p) => p.min === Number(min) && p.max === Number(max),
      );
      if (matchedPreset) setConfig(matchedPreset);
    }
  }, [searchParams]);

  const handleApplyFilters = () => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    } else {
      params.delete("category");
    }

    if (readyStockOnly) {
      params.set("ready", "true");
    } else {
      params.delete("ready");
    }

    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());

    params.delete("page");
    router.push(`/products?${params.toString()}`);

    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    // md:sticky md:top-24
    <aside className="w-full md:w-1/4 h-fit space-y-6">
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-800">Filter</h3>
          {(selectedCategories.length > 0 ||
            searchParams.get("minPrice") ||
            searchParams.get("category") ||
            searchTerm !== "") && (
            <button
              onClick={() => {
                setConfig(PRICE_PRESETS[1]);
                setPriceRange([PRICE_PRESETS[1].min, PRICE_PRESETS[1].max]);
                setSelectedCategories([]);
                setSearchTerm("");

                router.push("/products");
              }}
              className="text-[10px] font-semibold text-primary hover:underline"
            >
              Hapus Filter
            </button>
          )}
        </div>

        {/* --- Kategori --- */}
        <Accordion
          type="single"
          collapsible
          defaultValue="item-1"
          className="mb-6"
        >
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="hover:no-underline py-0 mb-3">
              <Label className="text-sm font-bold text-gray-700 cursor-pointer">
                Kategori
              </Label>
            </AccordionTrigger>

            <AccordionContent className="p-2">
              {categories.length > 5 && (
                <div className="relative mb-3">
                  <Search className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                  <Input
                    placeholder="Cari kategori..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 pl-7 text-xs border-gray-100 rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-100">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center space-x-3 group"
                  >
                    <Checkbox
                      id={cat.id}
                      checked={selectedCategories.includes(cat.id)}
                      onCheckedChange={() => handleCategoryChange(cat.id)}
                    />
                    <label
                      htmlFor={cat.id}
                      className="text-sm text-gray-600 cursor-pointer select-none group-hover:text-primary transition-colors font-medium"
                    >
                      {cat.label}{" "}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator className="my-4 opacity-50" />

        {/* --- Rentang Harga --- */}
        <Accordion
          type="single"
          collapsible
          defaultValue="price-item"
          className="mb-6"
        >
          <AccordionItem value="price-item" className="border-none">
            <AccordionTrigger className="hover:no-underline py-0 mb-4">
              <Label className="text-sm font-bold text-gray-700 cursor-pointer">
                Rentang Harga
              </Label>
            </AccordionTrigger>

            <AccordionContent className="pt-2 pb-1">
              <div className="grid grid-cols-2 gap-2 mb-6">
                {PRICE_PRESETS.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    className={`text-[10px] h-8 rounded-lg transition-all ${
                      config.label === preset.label
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-sm"
                        : "text-gray-500 border-gray-100 hover:bg-gray-50"
                    }`}
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>

              {/* Slider */}
              <div className="px-2">
                <Slider
                  value={priceRange}
                  min={0}
                  max={config.max}
                  step={config.step}
                  onValueChange={(value) => setPriceRange(value)}
                  className="mb-6"
                />
              </div>

              {/* Price Display */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase text-gray-400 font-bold tracking-widest">
                    Min
                  </span>
                  <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-bold text-primary">
                    {formatIDR(priceRange[0])}
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[9px] uppercase text-gray-400 font-bold tracking-widest">
                    Max
                  </span>
                  <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-bold text-primary">
                    {formatIDR(priceRange[1])}
                  </div>
                </div>
              </div>

              <p className="text-[9px] text-gray-400 mt-3 italic text-center">
                *Geser slider untuk kustomisasi harga
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator className="my-4 opacity-50" />

        {/* --- Filter Tambahan: Pengiriman & Stok --- */}
        <div className="mb-6 space-y-3">
          <Label className="text-sm font-bold text-gray-700 mb-1 block">
            Layanan & Stok
          </Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ready-stock"
              checked={readyStockOnly}
              onCheckedChange={(checked) => setReadyStockOnly(!!checked)}
            />
            <label
              htmlFor="ready-stock"
              className="text-xs text-gray-600 flex items-center gap-1.5 cursor-pointer select-none"
            >
              <PackageCheck className="w-3 h-3 text-primary" /> Stok Tersedia
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="cod" />
            <label
              htmlFor="cod"
              className="text-xs text-gray-600 flex items-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-3 h-3 text-primary" /> Bisa COD (Bayar di
              Tempat)
            </label>
          </div>
        </div>

        {/* --- Action Buttons --- */}
        <div className="space-y-2">
          <Button
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 transition-all active:scale-95 shadow-sm font-bold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Terapkan Filter"
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
