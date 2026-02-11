"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatIDR } from "@/lib/utils"; // Asumsi kamu punya helper format uang
import Image from "next/image";
import { ProductDialog } from "./ProductDialog";
import { DeleteProductButton } from "./DeleteProductButton";

export function ProductTable({ data }: { data: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No products found.
            </TableCell>
          </TableRow>
        ) : (
          data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                  <Image
                    src={product.image_url || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>Rp {product.price.toLocaleString("id-ID")}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell className="text-right">
                <ProductDialog initialData={product} />
                <DeleteProductButton
                  id={product.id}
                  imageUrl={product.image_url}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
