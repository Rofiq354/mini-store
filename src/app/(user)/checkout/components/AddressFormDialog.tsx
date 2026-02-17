"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createAddress } from "@/services/address-action";
import {
  getProvinces,
  getDistricts,
  KomerceRawLocation,
  getCities,
  getVillages,
} from "@/services/shipping-action";
import ReceiverSection from "./addressForm/ReceiverSection";
import AddressDetailSection from "./addressForm/AddressDetailSection";

interface AddressFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  address?: any;
}

export function AddressFormDialog({
  open,
  onClose,
  onSuccess,
  address,
}: AddressFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    label: address?.label || "home",
    recipient_name: address?.recipient_name || "",
    phone_number: address?.phone_number || "",
    province_id: address?.province_id || 0,
    province_name: address?.province_name || "",
    city_id: address?.city_id || 0,
    city_name: address?.city_name || "",
    district_id: address?.district_id || 0,
    district_name: address?.district_name || "",
    postal_code: address?.postal_code || "",
    village_id: address?.village_id || 0,
    village_name: address?.village_name || "",
    street_address: address?.street_address || "",
    notes: address?.notes || "",
    is_primary: address?.is_primary || false,
  });

  useEffect(() => {
    if (open) {
      loadProvinces();
    }
  }, [open]);

  const loadProvinces = async () => {
    setIsLoadingProvinces(true);
    const { data, error } = await getProvinces();
    if (data) setProvinces(data);
    setIsLoadingProvinces(false);
  };

  const loadCities = async (provinceId: number) => {
    setIsLoadingLocations(true);
    const { data, error } = await getCities(provinceId);

    if (error) {
      toast.error(`Gagal: ${error}`);
    } else if (data) {
      setCities(data);
    }
    setIsLoadingLocations(false);
  };

  const loadDistricts = async (cityId: number, cityName: string) => {
    setIsLoadingLocations(true);
    const { data, error } = await getDistricts(cityId);

    if (error) {
      toast.error(`Gagal: ${error}`);
    } else if (data && data.length > 0) {
      const formatted = data.slice(1).map((item: KomerceRawLocation) => ({
        district_id: item.id,
        district_name: item.name,
        postal_code: item.zip_code === "0" ? "" : item.zip_code,
        city_id: cityId,
        city_name: cityName,
        province_id: formData.province_id,
        province_name: formData.province_name,
      }));
      setDistricts(formatted);
    }
    setIsLoadingLocations(false);
  };

  const loadVillages = async (districtId: number) => {
    setIsLoadingLocations(true);
    const { data, error } = await getVillages(districtId);
    if (data) {
      setVillages(data);
    }
    setIsLoadingLocations(false);
  };

  const handleProvinceChange = (provinceId: string) => {
    const pId = parseInt(provinceId);
    const province = provinces.find((p) => p.province_id === pId);

    if (province) {
      setFormData({
        ...formData,
        province_id: pId,
        province_name: province.province_name,
        city_id: 0,
        city_name: "",
        district_id: 0,
        district_name: "",
        postal_code: "",
      });
      setCities([]);
      setDistricts([]);
      loadCities(pId);
    }
  };

  const handleCityChange = (cityIdStr: string) => {
    const cId = parseInt(cityIdStr);
    const selectedCity = cities.find((c) => c.city_id === cId);

    if (selectedCity) {
      setFormData({
        ...formData,
        city_id: cId,
        city_name: selectedCity.city_name,
        district_id: 0,
        district_name: "",
        postal_code: "",
      });
      loadDistricts(cId, selectedCity.city_name);
    }
  };

  // Handle Perubahan Kecamatan
  const handleDistrictChange = (districtId: string) => {
    const dId = parseInt(districtId);
    const district = districts.find((d) => d.district_id === dId);

    if (district) {
      setFormData({
        ...formData,
        district_id: district.district_id,
        district_name: district.district_name,
        postal_code: district.postal_code,
      });
      setVillages([]);
      loadVillages(dId);
    }
  };

  const handleVillageChange = (val: string) => {
    const vId = parseInt(val);
    const village = villages.find((v) => v.village_id === vId);

    if (village) {
      setFormData((prev) => ({
        ...prev,
        village_id: vId,
        village_name: village.village_name,
        postal_code:
          village.postal_code && village.postal_code !== "0"
            ? village.postal_code
            : prev.postal_code,
      }));
    }
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.recipient_name || !formData.phone_number) {
      toast.error("Nama dan nomor telepon wajib diisi");
      return;
    }

    if (!formData.street_address) {
      toast.error("Alamat lengkap wajib diisi");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await createAddress(formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Alamat berhasil ditambahkan");
      onSuccess();
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle>
            {address ? "Edit Alamat" : "Tambah Alamat Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama & Telepon */}
            <ReceiverSection
              recipientName={formData.recipient_name}
              phoneNumber={formData.phone_number}
              onChange={handleInputChange}
            />

            {/* Provinsi & Kota */}
            <div className="space-y-2">
              <Label htmlFor="province">Provinsi *</Label>
              <Select
                name="province_id"
                value={
                  formData.province_id && formData.province_id !== 0
                    ? formData.province_id.toString()
                    : ""
                }
                onValueChange={handleProvinceChange}
                disabled={isLoadingProvinces}
              >
                <SelectTrigger id="province" className="w-full">
                  <SelectValue
                    placeholder={
                      isLoadingProvinces ? "Memuat..." : "Pilih provinsi"
                    }
                  >
                    {formData.province_name || "Pilih provinsi"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => (
                    <SelectItem
                      key={p.province_id}
                      value={p.province_id.toString()}
                    >
                      {p.province_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Kota/Kabupaten *</Label>
              <Select
                name="city_id"
                value={formData.city_id ? formData.city_id.toString() : ""}
                onValueChange={handleCityChange}
                disabled={isLoadingLocations || !formData.province_id}
              >
                <SelectTrigger id="city" className="w-full">
                  <SelectValue placeholder="Pilih kota" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c.city_id} value={c.city_id.toString()}>
                      {c.city_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Kecamatan & Desa */}
            <div className="space-y-2">
              <Label htmlFor="district">Kecamatan *</Label>
              <Select
                name="district_id"
                value={
                  formData.district_id ? formData.district_id.toString() : ""
                }
                onValueChange={handleDistrictChange}
                disabled={isLoadingLocations || !formData.city_id}
              >
                <SelectTrigger id="district" className="w-full">
                  <SelectValue placeholder="Pilih kecamatan" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem
                      key={d.district_id}
                      value={d.district_id.toString()}
                    >
                      {d.district_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="village">Desa/Kelurahan *</Label>
              <Select
                name="village_id"
                value={
                  formData.village_id !== 0
                    ? formData.village_id.toString()
                    : ""
                }
                onValueChange={handleVillageChange}
                disabled={isLoadingLocations || !formData.district_id}
              >
                <SelectTrigger id="village" className="w-full">
                  <SelectValue
                    placeholder={
                      isLoadingLocations ? "Memuat..." : "Pilih desa"
                    }
                  >
                    {formData.village_name || "Pilih desa"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {villages.map((v) => (
                    <SelectItem
                      key={v.village_id}
                      value={v.village_id.toString()}
                    >
                      {v.village_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Label Alamat & Kode Pos */}
            <div className="space-y-2">
              <Label htmlFor="label">Label Alamat</Label>
              <Select
                name="label"
                value={formData.label}
                onValueChange={(value) =>
                  setFormData({ ...formData, label: value })
                }
              >
                <SelectTrigger id="label" className="w-full">
                  <SelectValue placeholder="Pilih Label" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">🏠 Rumah</SelectItem>
                  <SelectItem value="office">🏢 Kantor</SelectItem>
                  <SelectItem value="other">📍 Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code">Kode Pos</Label>
              <Input
                id="postal_code"
                name="postal_code"
                className="w-full"
                value={formData.postal_code || ""}
                onChange={(e) =>
                  setFormData({ ...formData, postal_code: e.target.value })
                }
                placeholder="12190"
              />
            </div>

            {/* Alamat Lengkap & Catatan */}
            <AddressDetailSection
              streetAddress={formData.street_address}
              notes={formData.notes}
              onChange={handleInputChange}
            />

            {/* Checkbox Utama */}
            <div className="md:col-span-2 flex items-center gap-2 py-2">
              <Checkbox
                id="is_primary"
                name="is_primary"
                checked={formData.is_primary}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_primary: checked as boolean })
                }
              />
              <Label
                htmlFor="is_primary"
                className="cursor-pointer text-sm font-medium"
              >
                Jadikan alamat utama
              </Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 order-2 md:order-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 order-1 md:order-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Alamat"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
