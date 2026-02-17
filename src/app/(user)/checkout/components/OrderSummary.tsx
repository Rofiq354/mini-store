"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/utils";
import { ShoppingBag, CreditCard, Truck, Package } from "lucide-react";
import Image from "next/image";

interface OrderSummaryProps {
  items: any[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
}

export function OrderSummary({
  items,
  subtotal,
  shippingCost,
  total,
  paymentMethod,
  deliveryMethod,
}: OrderSummaryProps) {
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "online":
        return "Bayar Online";
      case "cod":
        return "Cash on Delivery";
      case "cash_at_store":
        return "Bayar di Toko";
      default:
        return method;
    }
  };

  const getDeliveryMethodLabel = (method: string) => {
    switch (method) {
      case "delivery":
        return "Kirim ke Alamat";
      case "pickup":
        return "Ambil di Toko";
      default:
        return method;
    }
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Ringkasan Pesanan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items List */}
        <div className="space-y-3 max-h-75 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.quantity} x {formatIDR(item.price)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-sm">
                  {formatIDR(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Subtotal ({items.length} item)
            </span>
            <span className="font-medium">{formatIDR(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Ongkos Kirim</span>
            <span className="font-medium">
              {shippingCost === 0 ? (
                <span className="text-green-600">Gratis</span>
              ) : (
                formatIDR(shippingCost)
              )}
            </span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total</span>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {formatIDR(total)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Payment & Delivery Info */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Pembayaran:</span>
            <Badge variant="secondary" className="ml-auto">
              {getPaymentMethodLabel(paymentMethod)}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Pengiriman:</span>
            <Badge variant="secondary" className="ml-auto">
              {getDeliveryMethodLabel(deliveryMethod)}
            </Badge>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
          💡 Pesanan akan diproses setelah pembayaran dikonfirmasi
        </div>
      </CardContent>
    </Card>
  );
}
