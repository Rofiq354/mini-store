"use server";

export interface Province {
  province_id: number;
  province_name: string;
}

export interface City {
  city_id: number;
  province_id: number;
  city_name: string;
}

export interface District {
  district_id: number;
  province_id: number;
  province_name: string;
  city_id: number;
  city_name: string;
  district_name: string;
  postal_code: string;
}

export interface Village {
  village_id: number;
  village_name: string;
  postal_code: string;
}

export interface KomerceRawLocation {
  id: number;
  name: string;
  zip_code: string;
}

export interface ShippingCostResult {
  courier_code: string;
  courier_name: string;
  courier_service_code: string;
  courier_service_name: string;
  description: string;
  duration: string;
  shipment_duration_range: string;
  shipment_duration_unit: string;
  price: number;
}

export interface ShippingOption {
  courier: string;
  courier_name: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

/**
 * RajaOngkir API v1 Service Class
 * Base URL: https://rajaongkir.komerce.id/api/v1/
 */
class RajaOngkirService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.RAJAONGKIR_API_KEY || "";
    this.baseUrl =
      process.env.RAJAONGKIR_BASE_URL || "https://rajaongkir.komerce.id/api/v1";

    console.log(
      "DEBUG: API Key Loaded:",
      this.apiKey
        ? "YES (Starts with " + this.apiKey.substring(0, 4) + ")"
        : "NO",
    );

    if (!this.apiKey) {
      throw new Error("RAJAONGKIR_API_KEY is not set");
    }
  }

  async getProvinces(): Promise<Province[]> {
    try {
      const response = await fetch(`${this.baseUrl}/destination/province`, {
        method: "GET",
        headers: {
          key: this.apiKey,
        },
        cache: "force-cache", // Cache provinces
        next: {
          revalidate: 86400, // Revalidate every 24 hours
        },
      });

      const data = await response.json();

      if (response.status !== 200 || data.meta?.status !== "success") {
        console.log("Full Error Data:", data);
        throw new Error(data.meta?.message || `HTTP Error: ${response.status}`);
      }

      return data.data.map((p: any) => ({
        province_id: p.id,
        province_name: p.name,
      }));
    } catch (error: any) {
      console.error("Error fetching provinces:", error);
      throw new Error(error.message || "Gagal mengambil data provinsi");
    }
  }

  async getCities(provinceId: number): Promise<City[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/destination/city/${provinceId}`,
        {
          method: "GET",
          headers: {
            key: this.apiKey,
          },
          cache: "force-cache",
          next: {
            revalidate: 86400,
          },
        },
      );

      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error(data.message || "Format data kota tidak sesuai");
      }

      return data.data.map((item: any) => ({
        city_id: item.id,
        province_id: provinceId,
        city_name: item.name,
      }));
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengambil data kota");
    }
  }

  async getDistricts(cityId: number): Promise<KomerceRawLocation[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/destination/district/${cityId}`,
        {
          method: "GET",
          headers: {
            key: this.apiKey,
          },
          cache: "force-cache",
        },
      );

      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error(data.message || "Format data kecamatan tidak sesuai");
      }

      return data.data;
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengambil data kecamatan");
    }
  }

  async getVillages(districtId: number): Promise<Village[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/destination/sub-district/${districtId}`,
        {
          method: "GET",
          headers: {
            key: this.apiKey,
          },
          cache: "force-cache",
          next: {
            revalidate: 86400,
          },
        },
      );

      const data = await response.json();

      if (data.meta?.status !== "success" && !data.success) {
        throw new Error(
          data.meta?.message || data.message || "Failed to fetch villages",
        );
      }

      return data.data.map((v: any) => ({
        village_id: v.id,
        village_name: v.name,
        postal_code: v.zip_code,
      }));
    } catch (error: any) {
      console.error("Error fetching villages:", error);
      throw new Error(error.message || "Gagal mengambil data desa/kelurahan");
    }
  }

  /**
   * Calculate shipping cost (API v1 - supports multiple couriers)
   * @param params.origin - Origin district ID (merchant location)
   * @param params.destination - Destination district ID (customer location)
   * @param params.weight - Package weight in grams
   * @param params.couriers - Array of courier codes or single string with : separator
   * @param params.price - Sort by 'lowest' or 'highest' (optional)
   */
  async calculateCost(params: {
    origin: number;
    destination: number;
    weight: number;
    couriers?: string[] | string;
    price?: "lowest" | "highest";
  }): Promise<any[]> {
    try {
      const courierString = Array.isArray(params.couriers)
        ? params.couriers.join(":")
        : params.couriers || "jne:pos:tiki:jnt:sicepat:anteraja";

      const body = new URLSearchParams();
      body.append("origin", params.origin.toString());
      body.append("destination", params.destination.toString());
      body.append("weight", params.weight.toString());
      body.append("courier", courierString);
      if (params.price) body.append("price", params.price);

      const response = await fetch(
        `${this.baseUrl}/calculate/district/domestic-cost`,
        {
          method: "POST",
          headers: {
            key: this.apiKey,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (result.meta?.code !== 200 && !result.success) {
        throw new Error(
          result.meta?.message || "Gagal menghitung ongkos kirim",
        );
      }

      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get shipping options for multiple couriers in ONE request (API v1 feature)
   * Returns flattened array of all available shipping services
   */
  async getShippingOptions(params: {
    origin: number;
    destination: number;
    weight: number;
    couriers?: string[];
    sortBy?: "lowest" | "highest";
  }): Promise<ShippingOption[]> {
    try {
      const results = await this.calculateCost({
        origin: params.origin,
        destination: params.destination,
        weight: params.weight,
        couriers: params.couriers,
        price: params.sortBy || "lowest",
      });

      if (!Array.isArray(results)) return [];

      return results.map((result) => ({
        courier: result.code?.toLowerCase() || "unknown",
        courier_name: result.name || "Kurir",
        service: result.service || "",
        description: result.description || "",
        cost: Number(result.cost) || 0,
        etd: result.etd || "-",
      }));
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

// Singleton instance
const rajaOngkir = new RajaOngkirService();

/**
 * Public API - Get provinces
 */
export async function getProvinces() {
  try {
    const provinces = await rajaOngkir.getProvinces();
    return { data: provinces };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getCities(provinceId: number) {
  try {
    const cities = await rajaOngkir.getCities(provinceId);
    return { data: cities };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getDistricts(
  cityId: number,
): Promise<{ data?: KomerceRawLocation[]; error?: string }> {
  try {
    const districts = await rajaOngkir.getDistricts(cityId);
    return { data: districts };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getVillages(districtId: number) {
  try {
    const villages = await rajaOngkir.getVillages(districtId);
    return { data: villages };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Public API - Calculate shipping cost
 * @param params.destinationDistrictId - Destination district ID (customer)
 * @param params.weight - Package weight in grams
 * @param params.couriers - Array of courier codes (optional)
 */
export async function calculateShippingCost(params: {
  destinationDistrictId: number;
  weight: number;
  couriers?: string[];
}) {
  try {
    const originDistrictId = parseInt(
      process.env.MERCHANT_ORIGIN_DISTRICT_ID || "5823",
    );

    const results = await rajaOngkir.calculateCost({
      origin: originDistrictId,
      destination: params.destinationDistrictId,
      weight: params.weight,
      couriers: params.couriers,
      price: "lowest",
    });

    return { data: results };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Public API - Get all shipping options
 * Returns all available shipping services sorted by price
 */
export async function getShippingOptions(params: {
  destinationDistrictId: number;
  weight: number;
  couriers?: string[];
}) {
  try {
    if (!params.destinationDistrictId) {
      throw new Error("ID Kecamatan tujuan diperlukan");
    }

    const originDistrictId = parseInt(
      process.env.MERCHANT_ORIGIN_DISTRICT_ID || "584",
    );

    const options = await rajaOngkir.getShippingOptions({
      origin: originDistrictId,
      destination: params.destinationDistrictId,
      weight: params.weight,
      couriers: params.couriers,
      sortBy: "lowest",
    });

    return { data: options };
  } catch (error: any) {
    console.error("Shipping Action Error:", error.message);
    return { error: error.message };
  }
}

/**
 * Calculate total package weight from cart items
 * Assumes each product has a weight property or uses default weight
 */
export async function calculatePackageWeight(
  items: { product_id: string; quantity: number; weight?: number }[],
): Promise<number> {
  const DEFAULT_WEIGHT_PER_ITEM = 500;

  const totalWeight = items.reduce((total, item) => {
    const itemWeight = item.weight || DEFAULT_WEIGHT_PER_ITEM;
    return total + itemWeight * item.quantity;
  }, 0);

  return Math.max(totalWeight, 1000);
}

/**
 * Validate district exists in RajaOngkir
 */
export async function validateDistrict(districtId: number) {
  try {
    const district = await rajaOngkir.getVillages(districtId);

    if (!district) {
      return { valid: false, error: "Kecamatan tidak valid" };
    }

    return { valid: true, district };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

/**
 * Format shipping option for display
 */
export async function formatShippingOption(option: ShippingOption) {
  return `${option.courier_name.toUpperCase()} - ${option.service} (${option.etd} hari) - Rp ${option.cost.toLocaleString("id-ID")}`;
}

/**
 * Get cheapest shipping option
 */
export async function getCheapestOption(options: ShippingOption[]) {
  if (options.length === 0) return null;
  return options.reduce((cheapest, current) =>
    current.cost < cheapest.cost ? current : cheapest,
  );
}

/**
 * Get fastest shipping option
 */
export async function getFastestOption(options: ShippingOption[]) {
  if (options.length === 0) return null;

  return options.reduce((fastest, current) => {
    const getDays = (etd: string) =>
      parseInt(etd.replace(/[^0-9]/g, "")) || 999;
    return getDays(current.etd) < getDays(fastest.etd) ? current : fastest;
  });
}
