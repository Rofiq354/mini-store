export type PaymentMethod = "online" | "cod" | "cash_at_store";
export type DeliveryMethod = "delivery" | "pickup";
export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled"
  | "failed";

export interface Address {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  phone_number: string;
  province_id: number;
  province_name: string;
  city_id: number;
  city_name: string;
  district?: string;
  postal_code?: string;
  street_address: string;
  notes?: string;
  is_primary: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  merchant_id: string;
  transaction_id?: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  delivery_method: DeliveryMethod;
  subtotal: number;
  shipping_cost: number;
  total_price: number;
  address_id?: string;
  shipping_courier?: string;
  shipping_service?: string;
  shipping_etd?: string;
  tracking_number?: string;
  customer_notes?: string;
  admin_notes?: string;
  payment_type?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface ShippingOption {
  courier: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}
