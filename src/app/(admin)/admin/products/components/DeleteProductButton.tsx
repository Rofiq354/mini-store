"use client";

import { useState } from "react";
import { deleteProduct } from "@/services/product-action";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner"; // Atau alert biasa kalau gak pake sonner

export function DeleteProductButton({
  id,
  imageUrl,
}: {
  id: string;
  imageUrl: string | null;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    setIsDeleting(true);
    try {
      const result = await deleteProduct(id, imageUrl);
      if (result?.error) {
        alert(result.error);
      } else {
        alert("Produk berhasil dihapus!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive hover:text-destructive"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
