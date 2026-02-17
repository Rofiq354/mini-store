import React, { memo, useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ReceiverSectionProps {
  recipientName: string;
  phoneNumber: string;
  onChange: (e: any) => void;
}

const ReceiverSection = memo(
  ({ recipientName, phoneNumber, onChange }: ReceiverSectionProps) => {
    const [localName, setLocalName] = useState(recipientName);
    const [localPhone, setLocalPhone] = useState(phoneNumber);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      setLocalName(recipientName);
      setLocalPhone(phoneNumber);
    }, [recipientName, phoneNumber]);

    const debounceUpdateParent = (name: string, value: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        onChange({ target: { name, value } });
      }, 300);
    };

    const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (name === "recipient_name") setLocalName(value);
      if (name === "phone_number") setLocalPhone(value);

      debounceUpdateParent(name, value);
    };

    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="recipient_name">Nama Penerima *</Label>
          <Input
            id="recipient_name"
            name="recipient_name"
            value={localName}
            onChange={handleLocalChange}
            placeholder="Nama penerima"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone_number">Nomor Telepon *</Label>
          <Input
            id="phone_number"
            name="phone_number"
            type="tel"
            value={localPhone}
            onChange={handleLocalChange}
            placeholder="08xxxxxxxxxx"
            required
          />
        </div>
      </>
    );
  },
);

ReceiverSection.displayName = "ReceiverSection";
export default ReceiverSection;
