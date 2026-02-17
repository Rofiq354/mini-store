"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Truck, Package } from "lucide-react";
import { getShippingOptions } from "@/services/shipping-action";
import { formatIDR } from "@/lib/utils";

interface ShippingOptionsProps {
  destinationDistrictId: number;
  weight: number;
  selectedShipping: any;
  onSelectShipping: (shipping: any) => void;
}

export function ShippingOptions({
  destinationDistrictId,
  weight,
  selectedShipping,
  onSelectShipping,
}: ShippingOptionsProps) {
  const [options, setOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (destinationDistrictId && destinationDistrictId > 0) {
      loadShippingOptions();
    } else {
      setOptions([]);
      setError("Silakan pilih alamat pengiriman terlebih dahulu");
    }
  }, [destinationDistrictId, weight]);

  const loadShippingOptions = async () => {
    setIsLoading(true);
    setError("");

    const { data, error: err } = await getShippingOptions({
      destinationDistrictId,
      weight,
      couriers: ["jne", "pos", "tiki", "jnt", "sicepat", "anteraja"],
    });

    if (err) {
      setError(err);
    } else if (data) {
      setOptions(data);
      if (!selectedShipping && data.length > 0) {
        onSelectShipping(data[0]);
      }
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pilih Kurir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Menghitung ongkos kirim...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pilih Kurir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (options.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pilih Kurir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Tidak ada layanan pengiriman tersedia
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCourierLogo = (courier: string) => {
    // You can add custom logos here
    return <Truck className="h-5 w-5 text-primary" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Pilih Kurir
        </CardTitle>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Tujuan: ID Kecamatan {destinationDistrictId}
          </p>
          <p className="text-sm font-medium">
            Berat: {(weight / 1000).toFixed(1)} kg
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={
            selectedShipping
              ? `${selectedShipping.courier}-${selectedShipping.service}`
              : ""
          }
          onValueChange={(value) => {
            const option = options.find(
              (o) => `${o.courier}-${o.service}` === value,
            );
            if (option) onSelectShipping(option);
          }}
          className="space-y-3"
        >
          {options.map((option, index) => {
            const uniqueKey = `${option.courier}-${option.service}`;
            const isCheapest = index === 0;

            return (
              <div key={uniqueKey}>
                <RadioGroupItem
                  value={uniqueKey}
                  id={uniqueKey}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={uniqueKey}
                  className="flex items-center justify-between rounded-lg border-2 p-4 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all relative"
                >
                  {isCheapest && (
                    <div className="absolute -top-2 right-4 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                      TERMURAH
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold uppercase text-sm">
                          {option.courier}
                        </span>
                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded uppercase">
                          {option.service}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {option.description}
                      </p>
                      <p className="text-[10px] font-medium text-orange-600 mt-1 uppercase">
                        Estimasi: {option.etd.replace(/HARI/gi, "")} Hari
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-base text-primary">
                      {formatIDR(option.cost)}
                    </p>
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
