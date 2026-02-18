"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  CreditCard,
  Wallet,
  Store,
  Truck,
  Package,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { AddressSelector } from "./components/AddressSelector";
import { ShippingOptions } from "./components/ShippingOptions";
import { OrderSummary } from "./components/OrderSummary";

type PaymentMethod = "online" | "cod" | "cash_at_store";
type DeliveryMethod = "delivery" | "pickup";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();

  // Form state
  const [step, setStep] = useState(1); // 1-4
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("delivery");
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  // Auto-select delivery method based on payment
  useEffect(() => {
    if (paymentMethod === "cash_at_store") {
      setDeliveryMethod("pickup");
    }
  }, [paymentMethod]);

  const subtotal = getTotalPrice();
  const shippingCost = selectedShipping?.cost || 0;
  const total = subtotal + shippingCost;

  const handleNext = () => {
    // Validation per step
    if (step === 1 && !paymentMethod) {
      toast.error("Pilih metode pembayaran");
      return;
    }

    if (step === 2 && !deliveryMethod) {
      toast.error("Pilih metode pengiriman");
      return;
    }

    if (step === 3 && deliveryMethod === "delivery" && !selectedAddress) {
      toast.error("Pilih alamat pengiriman");
      return;
    }

    if (step === 3 && deliveryMethod === "delivery" && !selectedShipping) {
      toast.error("Pilih kurir pengiriman");
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      router.push("/cart");
    } else {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image_url: item.image_url ?? undefined,
        })),
        payment_method: paymentMethod,
        delivery_method: deliveryMethod,
        address_id:
          deliveryMethod === "delivery" ? selectedAddress?.id : undefined,
        shipping_courier: selectedShipping?.courier,
        shipping_service: selectedShipping?.service,
        shipping_cost: shippingCost,
        shipping_etd: selectedShipping?.etd,
        customer_notes: customerNotes || undefined,
      };

      const { createOrder } = await import("@/services/order-action");
      const result = await createOrder(orderData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      clearCart(true);

      if (result.requires_payment && result.snap_token) {
        // @ts-ignore
        window.snap.pay(result.snap_token, {
          onSuccess: () => {
            toast.success("Pembayaran berhasil!");
            router.push(`/orders/${result.order_id}`);
          },
          onPending: () => {
            toast.info("Menunggu pembayaran...");
            router.push(`/orders/${result.order_id}`);
          },
          onError: () => {
            toast.error("Pembayaran gagal");
            router.push(`/orders/${result.order_id}`);
          },
          onClose: () => {
            router.push(`/orders/${result.order_id}`);
          },
        });
      } else {
        toast.success("Pesanan berhasil dibuat!");
        router.push(`/orders/${result.order_id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal membuat pesanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 px-4 py-8 md:py-10">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 ml-0 md:-ml-4 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {step === 1 ? "Kembali ke Keranjang" : "Kembali"}
        </Button>

        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground mt-1">
          Lengkapi informasi pesanan Anda untuk menyelesaikan transaksi.
        </p>

        {/* Progress Steps Container */}
        <div className="mt-8 relative">
          <div className="flex items-center justify-between w-full">
            {[
              { n: 1, label: "Pembayaran" },
              { n: 2, label: "Pengiriman" },
              { n: 3, label: "Alamat" },
              { n: 4, label: "Konfirmasi" },
            ].map((item, idx, arr) => (
              <div
                key={item.n}
                className="flex flex-col items-center flex-1 relative"
              >
                {idx < arr.length - 1 && (
                  <div className="absolute top-5 left-[50%] w-full h-0.5 -z-10 bg-muted">
                    <div
                      className={`h-full bg-primary transition-all duration-300 ${
                        step > item.n ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}

                {/* Lingkaran Angka */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold border-2 transition-all duration-300 shadow-sm ${
                    step >= item.n
                      ? "bg-primary border-primary text-primary-foreground scale-110"
                      : "bg-background border-muted text-muted-foreground"
                  }`}
                >
                  {step > item.n ? (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    item.n
                  )}
                </div>

                {/* Label di bawah lingkaran */}
                <span
                  className={`mt-3 text-[10px] md:text-xs font-medium uppercase tracking-wider transition-colors ${
                    step >= item.n ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Payment Method */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value as PaymentMethod)
                  }
                  className="space-y-3"
                >
                  <Label
                    htmlFor="online"
                    className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="online" id="online" />
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Bayar Online</p>
                        <p className="text-sm text-muted-foreground">
                          Kartu kredit, e-wallet, transfer bank
                        </p>
                      </div>
                    </div>
                  </Label>

                  <Label
                    htmlFor="cod"
                    className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="cod" id="cod" />
                      <Wallet className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Cash on Delivery (COD)</p>
                        <p className="text-sm text-muted-foreground">
                          Bayar tunai saat barang diterima
                        </p>
                      </div>
                    </div>
                  </Label>

                  <Label
                    htmlFor="cash_at_store"
                    className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value="cash_at_store"
                        id="cash_at_store"
                      />
                      <Store className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Bayar di Toko</p>
                        <p className="text-sm text-muted-foreground">
                          Ambil dan bayar langsung di toko
                        </p>
                      </div>
                    </div>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Delivery Method */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Metode Pengiriman</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={deliveryMethod}
                  onValueChange={(value) =>
                    setDeliveryMethod(value as DeliveryMethod)
                  }
                  className="space-y-3"
                  disabled={paymentMethod === "cash_at_store"}
                >
                  <Label
                    htmlFor="delivery"
                    className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent ${
                      paymentMethod === "cash_at_store"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value="delivery"
                        id="delivery"
                        disabled={paymentMethod === "cash_at_store"}
                      />
                      <Truck className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Kirim ke Alamat</p>
                        <p className="text-sm text-muted-foreground">
                          Dikirim menggunakan kurir
                        </p>
                      </div>
                    </div>
                  </Label>

                  <Label
                    htmlFor="pickup"
                    className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Package className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Ambil di Toko</p>
                        <p className="text-sm text-muted-foreground">
                          Gratis ongkir, ambil sendiri
                        </p>
                      </div>
                    </div>
                  </Label>
                </RadioGroup>

                {paymentMethod === "cash_at_store" && (
                  <p className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                    💡 Pembayaran di toko otomatis menggunakan metode pickup
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Address & Shipping */}
          {step === 3 && (
            <>
              {deliveryMethod === "delivery" ? (
                <>
                  <AddressSelector
                    selectedAddress={selectedAddress}
                    onSelectAddress={setSelectedAddress}
                  />

                  {selectedAddress && (
                    <ShippingOptions
                      destinationDistrictId={selectedAddress.district_id}
                      weight={1000} // TODO: Calculate from products
                      selectedShipping={selectedShipping}
                      onSelectShipping={setSelectedShipping}
                    />
                  )}
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Pickup di Toko</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4 bg-muted/50">
                        <p className="font-semibold mb-2">Alamat Toko:</p>
                        <p className="text-sm text-muted-foreground">
                          Jl. Example Street No. 123
                          <br />
                          Jakarta Selatan, DKI Jakarta 12190
                        </p>
                      </div>

                      <div className="rounded-lg border p-4 bg-green-50 border-green-200">
                        <p className="font-semibold text-green-900 mb-1">
                          ✓ Gratis Ongkir
                        </p>
                        <p className="text-sm text-green-700">
                          Pesanan akan siap diambil setelah kami konfirmasi
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Step 4: Order Summary & Notes */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Catatan Pesanan (Opsional)</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full min-h-25 rounded-lg border p-3 text-sm"
                  placeholder="Tambahkan catatan untuk pesanan Anda (opsional)"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                />
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {step < 4 ? (
              <Button onClick={handleNext} className="flex-1" size="lg">
                Lanjutkan
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Buat Pesanan"
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shippingCost={shippingCost}
            total={total}
            paymentMethod={paymentMethod}
            deliveryMethod={deliveryMethod}
          />
        </div>
      </div>
    </div>
  );
}
