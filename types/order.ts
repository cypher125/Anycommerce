import type { CartItem } from "../components/cart-provider"

export type OrderStatus = "processing" | "confirmed" | "shipped" | "delivered" | "cancelled"

export interface OrderItem extends CartItem {
  // OrderItem extends CartItem to ensure compatibility
}

export interface ShippingInfo {
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  method: "standard" | "express" | "overnight"
  cost: number
}

export interface PaymentInfo {
  method: "credit_card" | "paypal" | "apple_pay" | "google_pay"
  cardLast4?: string
}

export interface Order {
  id: string
  userId: string
  date: string // ISO string
  status: OrderStatus
  estimatedDelivery?: string // ISO string
  trackingNumber?: string
  items: OrderItem[]
  shipping: ShippingInfo
  payment: PaymentInfo
  subtotal: number
  shippingCost: number
  total: number
}

export interface OrderWithTracking extends Order {
  trackingEvents?: TrackingEvent[]
}

export interface TrackingEvent {
  date: string // ISO string
  location: string
  status: string
  description: string
} 