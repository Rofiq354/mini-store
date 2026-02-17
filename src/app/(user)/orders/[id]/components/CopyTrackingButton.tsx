"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CopyTrackingButtonProps {
  trackingNumber: string;
}

export function CopyTrackingButton({
  trackingNumber,
}: CopyTrackingButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackingNumber);
      toast.success("Nomor resi berhasil disalin!");
    } catch (err) {
      toast.error("Gagal menyalin resi");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-cyan-600 hover:bg-cyan-100"
      onClick={handleCopy}
    >
      <Copy className="h-4 w-4" />
      <span className="sr-only">Salin nomor resi</span>
    </Button>
  );
}
