"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Save,
  AlertCircle,
  Truck,
  Package,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/services/order-action";
import { cn } from "@/lib/utils";

type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled"
  | "failed";

interface UpdateStatusFormProps {
  order: any;
}

export default function UpdateStatusForm({ order }: UpdateStatusFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    status: order.status as OrderStatus,
    tracking_number: order.tracking_number || "",
    admin_notes: order.admin_notes || "",
  });

  // Define valid status transitions
  const getAvailableStatuses = (): { value: OrderStatus; label: string }[] => {
    const currentStatus = order.status as OrderStatus;

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending_payment: ["paid", "cancelled", "failed"],
      paid: ["processing", "cancelled"],
      processing: ["ready_to_ship", "cancelled"],
      ready_to_ship: ["shipped", "delivered", "cancelled"],
      shipped: ["delivered", "cancelled"],
      delivered: ["completed"],
      completed: [],
      cancelled: [],
      failed: [],
    };

    const available = validTransitions[currentStatus] || [];

    const statusLabels: Record<OrderStatus, string> = {
      pending_payment: "Menunggu Pembayaran",
      paid: "Dibayar",
      processing: "Diproses",
      ready_to_ship:
        order.delivery_method === "pickup" ? "Siap Diambil" : "Siap Dikirim",
      shipped: "Dalam Pengiriman",
      delivered:
        order.delivery_method === "pickup" ? "Sudah Diambil" : "Sudah Diterima",
      completed: "Selesai",
      cancelled: "Dibatalkan",
      failed: "Gagal",
    };

    return [
      {
        value: currentStatus,
        label: `${statusLabels[currentStatus]} (Saat Ini)`,
      },
      ...available.map((status) => ({
        value: status,
        label: statusLabels[status],
      })),
    ];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      formData.status === order.status &&
      formData.tracking_number === (order.tracking_number || "") &&
      formData.admin_notes === (order.admin_notes || "")
    ) {
      toast.info("Tidak ada perubahan");
      return;
    }

    // Validate tracking number for shipped status
    if (formData.status === "shipped" && !formData.tracking_number.trim()) {
      toast.error("Nomor resi wajib diisi untuk status 'Dikirim'");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await updateOrderStatus(order.id, formData.status, {
      tracking_number: formData.tracking_number || undefined,
      admin_notes: formData.admin_notes || undefined,
    });

    if (error) {
      toast.error(error);
    } else {
      toast.success("Status pesanan berhasil diupdate");
      router.refresh();
    }

    setIsSubmitting(false);
  };

  const availableStatuses = getAvailableStatuses();
  const canUpdate = availableStatuses.length > 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Status Pesanan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Selection Section */}
          <div className="space-y-2">
            <Label
              htmlFor="status"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Status Pesanan
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value as OrderStatus })
              }
              disabled={!canUpdate}
            >
              <SelectTrigger
                className={cn(
                  "w-full h-11 font-medium transition-all shadow-sm focus:ring-primary/20",
                  !canUpdate && "bg-muted/50 opacity-80 cursor-not-allowed",
                )}
              >
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => (
                  <SelectItem
                    key={status.value}
                    value={status.value}
                    className="font-medium"
                  >
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!canUpdate && (
              <div className="flex items-center gap-2 text-[11px] text-amber-600 font-medium mt-1.5 bg-amber-50 p-2 rounded-md border border-amber-100">
                <AlertCircle className="h-3 w-3" />
                Pesanan ini sudah final dan tidak dapat diubah lagi.
              </div>
            )}
          </div>

          {/* Tracking Number Section */}
          {order.delivery_method === "delivery" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label
                htmlFor="tracking_number"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between"
              >
                Nomor Resi
                {formData.status === "shipped" && (
                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full animate-pulse">
                    WAJIB DIISI
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="tracking_number"
                  value={formData.tracking_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tracking_number: e.target.value,
                    })
                  }
                  className="h-11 pl-10 font-mono text-sm tracking-widest placeholder:tracking-normal placeholder:font-sans"
                  placeholder="Contoh: JNE123456789"
                  required={formData.status === "shipped"}
                />
                <Truck className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="text-[11px] text-muted-foreground italic px-1">
                Kurir:{" "}
                <span className="font-bold text-foreground">
                  {order.shipping_courier?.toUpperCase() || "Internal"}
                </span>
              </p>
            </div>
          )}

          {/* Admin Notes Section */}
          <div className="space-y-2">
            <Label
              htmlFor="admin_notes"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Catatan Internal / Pesan ke Customer
            </Label>
            <Textarea
              id="admin_notes"
              value={formData.admin_notes}
              onChange={(e) =>
                setFormData({ ...formData, admin_notes: e.target.value })
              }
              placeholder="Tulis alasan pembatalan atau instruksi tambahan di sini..."
              className="min-h-25 resize-none focus-visible:ring-primary/20 transition-all"
            />
          </div>

          {/* Dynamic Helper Info Box */}
          <div className="relative overflow-hidden transition-all duration-300">
            {formData.status === "processing" && (
              <InfoBox color="purple" icon={<Package className="h-4 w-4" />}>
                Mulai siapkan pesanan. Customer akan menerima notifikasi bahwa
                pesanan sedang diproses.
              </InfoBox>
            )}

            {formData.status === "ready_to_ship" && (
              <InfoBox
                color="indigo"
                icon={<CheckCircle2 className="h-4 w-4" />}
              >
                {order.delivery_method === "pickup"
                  ? "Pesanan siap diambil. Notifikasi pickup akan dikirim ke customer."
                  : "Pesanan siap dikirim. Siapkan paket untuk diserahkan ke kurir."}
              </InfoBox>
            )}

            {formData.status === "shipped" && (
              <InfoBox color="cyan" icon={<Truck className="h-4 w-4" />}>
                Pastikan nomor resi valid. Pesanan akan berpindah ke tab
                "Dikirim".
              </InfoBox>
            )}
          </div>

          {/* Action Button */}
          <Button
            type="submit"
            className="w-full h-12 text-sm font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
            disabled={isSubmitting || !canUpdate}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Status Pesanan
              </>
            )}
          </Button>
        </form>

        {/* Payment Info */}
        <div className="mt-6 pt-6 border-t space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Metode Pembayaran:</span>
            <span className="font-medium">
              {order.payment_method === "online"
                ? "Online"
                : order.payment_method === "cod"
                  ? "COD"
                  : "Bayar di Toko"}
            </span>
          </div>
          {order.payment_type && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipe Pembayaran:</span>
              <span className="font-medium uppercase">
                {order.payment_type}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Metode Pengiriman:</span>
            <span className="font-medium">
              {order.delivery_method === "delivery" ? "Kirim" : "Pickup"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Komponen pembantu untuk Info Box agar kode di atas tidak berantakan
 */
function InfoBox({
  color,
  icon,
  children,
}: {
  color: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    purple:
      "bg-purple-50 border-purple-200 text-purple-900 icon:text-purple-600",
    indigo:
      "bg-indigo-50 border-indigo-200 text-indigo-900 icon:text-indigo-600",
    cyan: "bg-cyan-50 border-cyan-200 text-cyan-900 icon:text-cyan-600",
    green: "bg-green-50 border-green-200 text-green-900 icon:text-green-600",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 border rounded-xl text-xs leading-relaxed animate-in fade-in zoom-in-95 duration-300",
        colors[color],
      )}
    >
      <div className="mt-0.5 shrink-0 opacity-80">{icon}</div>
      <p className="font-medium">{children}</p>
    </div>
  );
}
