"use client";

import { useState, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteConfirmDialogProps {
  trigger?: ReactNode;
  title?: string;
  description?: string | ReactNode;
  itemName?: string;
  onConfirm: () => Promise<void>;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  useToast?: boolean;
  toastMessages?: {
    loading?: string;
    success?: string;
    error?: string | ((err: any) => string);
  };
}

export function DeleteConfirmDialog({
  trigger,
  title = "Konfirmasi Hapus",
  description,
  itemName,
  onConfirm,
  confirmLabel = "Ya, Hapus",
  cancelLabel = "Batal",
  loadingLabel = "Menghapus...",
  useToast = true,
  toastMessages,
}: DeleteConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);

    if (useToast) {
      const defaultToastMessages = {
        loading: toastMessages?.loading || `Menghapus ${itemName || "item"}...`,
        success:
          toastMessages?.success || `${itemName || "Item"} berhasil dihapus!`,
        error: toastMessages?.error || "Gagal menghapus. Silakan coba lagi.",
      };

      toast.promise(onConfirm(), {
        loading: defaultToastMessages.loading,
        success: () => {
          setIsLoading(false);
          setOpen(false);
          return defaultToastMessages.success;
        },
        error: (err) => {
          setIsLoading(false);
          return err?.message || defaultToastMessages.error;
        },
      });
    } else {
      try {
        await onConfirm();
        setOpen(false);
      } catch (error) {
        console.error("Delete error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const defaultDescription = itemName
    ? `Apakah Anda yakin ingin menghapus "${itemName}"? Tindakan ini tidak dapat dibatalkan.`
    : "Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan.";

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? loadingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
