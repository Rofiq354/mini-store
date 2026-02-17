"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus, MapPin, Loader2, Phone, Info, CheckCircle2 } from "lucide-react";
import { getUserAddresses } from "@/services/address-action";
import { AddressFormDialog } from "./AddressFormDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AddressSelectorProps {
  selectedAddress: any;
  onSelectAddress: (address: any) => void;
}

export function AddressSelector({
  selectedAddress,
  onSelectAddress,
}: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setIsLoading(true);
    const { data, error } = await getUserAddresses();

    if (error) {
      console.error("Failed to load addresses:", error);
    } else if (data) {
      setAddresses(data);
      const primary = data.find((addr: any) => addr.is_primary);
      if (primary && !selectedAddress) {
        onSelectAddress(primary);
      }
    }
    setIsLoading(false);
  };

  const handleAddressAdded = () => {
    setShowAddressForm(false);
    loadAddresses();
  };

  if (isLoading) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              Alamat Pengiriman
            </h3>
            <p className="text-sm text-muted-foreground">
              Pilih lokasi tujuan pengiriman pesanan Anda
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddressForm(true)}
            className="h-9"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Alamat
          </Button>
        </div>

        {addresses.length === 0 ? (
          <Card className="border-dashed bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-4">
                Belum ada alamat tersimpan
              </p>
              <Button onClick={() => setShowAddressForm(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Alamat Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <RadioGroup
            value={selectedAddress?.id}
            onValueChange={(value) => {
              const addr = addresses.find((a) => a.id === value);
              onSelectAddress(addr);
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {addresses.map((address) => {
              const isSelected = selectedAddress?.id === address.id;
              return (
                <div key={address.id} className="relative h-full">
                  <RadioGroupItem
                    value={address.id}
                    id={address.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={address.id}
                    className={cn(
                      "flex flex-col h-full gap-2 rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-accent/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
                      isSelected ? "border-primary shadow-sm" : "border-muted",
                    )}
                  >
                    {/* Header Alamat */}
                    <div className="flex items-start justify-between w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base tracking-tight leading-none">
                          {address.recipient_name}
                        </span>
                        <div className="flex gap-1">
                          <Badge
                            variant="secondary"
                            className="capitalize text-[10px] h-4 px-1.5 italic font-normal"
                          >
                            {address.label}
                          </Badge>
                          {address.is_primary && (
                            <Badge className="text-[10px] h-4 px-1.5 bg-primary/10 text-primary border-primary/20">
                              Utama
                            </Badge>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 animate-in zoom-in duration-300" />
                      )}
                    </div>

                    {/* Kontak */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {address.phone_number}
                    </div>

                    {/* Detail Lokasi */}
                    <div className="space-y-1 mt-1 text-sm leading-snug text-foreground/80 flex-1">
                      <p className="line-clamp-2 italic">
                        {address.street_address}
                      </p>
                      <p className="font-medium text-foreground">
                        {address.district_name}, {address.city_name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {address.province_name} • {address.postal_code}
                      </p>
                    </div>

                    {/* Catatan */}
                    {address.notes && (
                      <div className="mt-auto pt-2">
                        <div className="flex items-start gap-2 rounded-md bg-muted/50 p-2 text-[11px] text-muted-foreground border border-muted/50">
                          <Info className="h-3 w-3 mt-0.5 shrink-0" />
                          <span className="line-clamp-1">
                            Catatan: {address.notes}
                          </span>
                        </div>
                      </div>
                    )}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        )}
      </div>

      <AddressFormDialog
        open={showAddressForm}
        onClose={() => setShowAddressForm(false)}
        onSuccess={handleAddressAdded}
      />
    </>
  );
}
