import React, { memo, useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AddressDetailSectionProps {
  streetAddress: string;
  notes: string;
  onChange: (e: any) => void;
}

const AddressDetailSection = memo(
  ({ streetAddress, notes, onChange }: AddressDetailSectionProps) => {
    const [localStreet, setLocalStreet] = useState(streetAddress);
    const [localNotes, setLocalNotes] = useState(notes);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      setLocalStreet(streetAddress);
      setLocalNotes(notes);
    }, [streetAddress, notes]);

    const debounceUpdateParent = (name: string, value: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onChange({ target: { name, value } });
      }, 300);
    };

    const handleLocalChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const { name, value } = e.target;

      if (name === "street_address") setLocalStreet(value);
      if (name === "notes") setLocalNotes(value);

      debounceUpdateParent(name, value);
    };

    return (
      <>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="street_address">Alamat Lengkap *</Label>
          <Textarea
            id="street_address"
            name="street_address"
            className="w-full"
            value={localStreet}
            onChange={handleLocalChange}
            placeholder="Nama jalan, nomor rumah, RT/RW, dll"
            rows={3}
            required
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="notes">Catatan Alamat (Opsional)</Label>
          <Input
            id="notes"
            name="notes"
            className="w-full"
            value={localNotes}
            onChange={handleLocalChange}
            placeholder="Patokan, warna rumah, dll"
          />
        </div>
      </>
    );
  },
);

AddressDetailSection.displayName = "AddressDetailSection";
export default AddressDetailSection;
