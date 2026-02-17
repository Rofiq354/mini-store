"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface CopyAddressButtonProps {
  address: {
    recipient_name: string;
    phone_number: string;
    street_address: string;
    district_name: string;
    city_name: string;
    postal_code: string;
  };
}

export default function CopyAddressButton({ address }: CopyAddressButtonProps) {
  const handleCopy = () => {
    if (!address) {
      toast.error("Data alamat tidak ditemukan");
      return;
    }

    const name = address.recipient_name || "";
    const phone = address.phone_number || "";
    const street = address.street_address || "";
    const district = address.district_name || "";
    const city = address.city_name || "";
    const postal = address.postal_code || "";

    const fullAddress = `${name} | ${phone}\n${street}, ${district}, ${city}, ${postal}`;

    navigator.clipboard.writeText(fullAddress);
    toast.success("Alamat berhasil disalin");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 text-[10px] gap-1.5"
      onClick={handleCopy}
    >
      <Copy className="h-3 w-3" />
      Salin Alamat
    </Button>
  );
}
