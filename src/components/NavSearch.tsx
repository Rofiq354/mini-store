"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Store, Package, Loader2, Tags } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supbase/client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function NavSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    products: any[];
    stores: any[];
    categories: any[];
  }>({ products: [], stores: [], categories: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const allResults = [
    ...results.categories.map((c) => ({
      ...c,
      type: "category",
      url: `/products?category=${c.slug}`,
    })),
    ...results.stores.map((s) => ({
      ...s,
      type: "store",
      url: `/stores/${s.shop_slug}`,
    })),
    ...results.products.map((p) => ({
      ...p,
      type: "product",
      url: `/products/${p.id}`,
    })),
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchData = async () => {
      if (query.length < 2) {
        setResults({ products: [], stores: [], categories: [] });
        setActiveIndex(-1);
        return;
      }
      setIsLoading(true);
      const [prodRes, storeRes, catRes] = await Promise.all([
        supabase
          .from("products")
          .select("id, name")
          .ilike("name", `%${query}%`)
          .limit(5),
        supabase
          .from("profiles")
          .select("id, shop_name, shop_slug")
          .eq("role", "merchant")
          .ilike("shop_name", `%${query}%`)
          .limit(3),
        supabase
          .from("categories")
          .select("id, name, slug")
          .ilike("name", `%${query}%`)
          .limit(4),
      ]);
      setResults({
        products: prodRes.data || [],
        stores: storeRes.data || [],
        categories: catRes.data || [],
      });
      setIsLoading(false);
      setIsOpen(true);
      setActiveIndex(-1);
    };

    const debounce = setTimeout(searchData, 300);
    return () => clearTimeout(debounce);
  }, [query, supabase]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(-1);
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || allResults.length === 0) {
      if (e.key === "Enter" && query.length >= 2) {
        handleSelect(`/products?search=${encodeURIComponent(query)}`);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < allResults.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex >= 0 && activeIndex < allResults.length) {
        handleSelect(allResults[activeIndex].url);
      } else if (activeIndex === allResults.length || activeIndex === -1) {
        handleSelect(`/products?search=${encodeURIComponent(query)}`);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full group">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length > 0) setIsOpen(true);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Cari produk, kategori, atau warung..."
          className="pl-10 w-full transition-all focus-visible:ring-1 focus-visible:ring-primary"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-popover text-popover-foreground border rounded-xl shadow-xl overflow-hidden z-100 animate-in fade-in slide-in-from-top-1">
          <Command
            className="
              rounded-none border-none
              [&_[data-selected=true]:not(.bg-accent)]:bg-transparent
              **:data-[selected=true]:text-inherit
            "
            shouldFilter={false}
            loop={false}
          >
            <CommandList className="max-h-[min(450px,70vh)]">
              <CommandEmpty className="py-6 text-center text-sm">
                {isLoading ? "Mencari..." : `Tidak ada hasil untuk "${query}"`}
              </CommandEmpty>

              {results.categories.length > 0 && (
                <CommandGroup heading="Kategori" value="categories">
                  {results.categories.map((cat, i) => {
                    const globalIndex = i;
                    return (
                      <CommandItem
                        key={cat.id}
                        value={`cat-${cat.id}`}
                        onSelect={() =>
                          handleSelect(`/products?category=${cat.slug}`)
                        }
                        className={cn(
                          "cursor-pointer flex items-center gap-2 py-2",
                          activeIndex === globalIndex &&
                            "bg-accent text-accent-foreground",
                        )}
                      >
                        <Tags className="h-4 w-4 text-muted-foreground" />
                        <span>{cat.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              {results.stores.length > 0 && (
                <CommandGroup heading="Toko / Warung">
                  {results.stores.map((store, i) => {
                    const globalIndex = results.categories.length + i;
                    return (
                      <CommandItem
                        key={store.id}
                        value={`store-${store.id}`}
                        onSelect={() =>
                          handleSelect(`/stores/${store.shop_slug}`)
                        }
                        className={cn(
                          "cursor-pointer flex items-center gap-2 py-2",
                          activeIndex === globalIndex &&
                            "bg-accent text-accent-foreground",
                        )}
                      >
                        <Store className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{store.shop_name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              {results.products.length > 0 && (
                <CommandGroup heading="Produk">
                  {results.products.map((prod, i) => {
                    const globalIndex =
                      results.categories.length + results.stores.length + i;
                    return (
                      <CommandItem
                        key={prod.id}
                        value={`prod-${prod.id}`}
                        onSelect={() => handleSelect(`/products/${prod.id}`)}
                        className={cn(
                          "cursor-pointer flex items-center gap-2 py-2",
                          activeIndex === globalIndex &&
                            "bg-accent text-accent-foreground",
                        )}
                      >
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{prod.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              <CommandSeparator />
              <div
                onClick={() => handleSelect(`/products?search=${query}`)}
                className={cn(
                  "p-3 text-xs text-center text-primary font-bold hover:bg-muted cursor-pointer transition-colors",
                  activeIndex === allResults.length && "bg-accent",
                )}
              >
                Lihat semua hasil untuk "{query}"
              </div>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
