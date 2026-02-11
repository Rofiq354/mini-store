"use client";

import Image from "next/image";
import { ProductDialog } from "./ProductDialog";
import { DeleteProductButton } from "./DeleteProductButton";
import { DataTable } from "@/components/DataTable";

export function ProductTable({ data }: { data: any[] }) {
  const productColumns = [
    {
      header: "Image",
      accessor: (product: any) => (
        <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
          <Image
            src={product.image_url || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ),
    },
    {
      header: "Name",
      accessor: "name" as const,
      searchable: true, // Bisa dicari berdasarkan nama
    },
    {
      header: "Category",
      accessor: (item: any) => (
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {item.categories?.name || "-"}
        </span>
      ),
    },
    {
      header: "Price",
      accessor: (item: any) => (
        <span className="font-medium">
          Rp {item.price.toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      header: "Stock",
      accessor: (item: any) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            item.stock > 10
              ? "bg-green-50 text-green-700"
              : item.stock > 0
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700"
          }`}
        >
          {item.stock}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      accessor: (product: any) => (
        <div className="flex justify-end gap-2">
          <ProductDialog initialData={product} />
          <DeleteProductButton
            id={product.id}
            name={product.name}
            imageUrl={product.image_url}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={productColumns}
      initialPageSize={10}
      searchPlaceholder="Search products..."
    />
  );
}
