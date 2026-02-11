"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/services/category-action";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

interface DeleteCategoryButtonProps {
  id: string;
  name: string;
}

export function DeleteCategoryButton({ id, name }: DeleteCategoryButtonProps) {
  async function handleDelete() {
    await deleteCategory(id);
  }

  return (
    <DeleteConfirmDialog
      trigger={
        <Button
          variant="outline"
          size="icon"
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      }
      title="Hapus Kategori?"
      description={
        <>
          Apakah Anda yakin ingin menghapus kategori <strong>{name}</strong>?
          Tindakan ini tidak dapat dibatalkan.
        </>
      }
      onConfirm={handleDelete}
      confirmLabel="Ya, Hapus Kategori"
      toastMessages={{
        loading: `Menghapus kategori ${name}...`,
        success: `Kategori ${name} berhasil dihapus!`,
        error: (err: Error) => err.message || "Gagal menghapus kategori.",
      }}
    />
  );
}
