import { orders } from "../data/orders"
import { format, parseISO } from "date-fns"
import type { Order, OrderStatus, TrackingEvent } from "../types/order"

// Get orders for a specific user
export function getUserOrders(userId: string): Order[] {
  return orders.filter(order => order.userId === userId)
}

// Get a specific order by ID
export function getOrderById(orderId: string): Order | undefined {
  return orders.find(order => order.id === orderId)
}

// Format the order date in a human-readable format
export function formatOrderDate(dateString: string): string {
  const date = parseISO(dateString)
  return format(date, "MMM d, yyyy 'at' h:mm a")
}

// Get a label and color for an order status
export function getOrderStatusInfo(status: OrderStatus): { label: string; color: string } {
  switch (status) {
    case "processing":
      return { label: "Processing", color: "bg-yellow-500" }
    case "confirmed":
      return { label: "Confirmed", color: "bg-blue-500" }
    case "shipped":
      return { label: "Shipped", color: "bg-purple-500" }
    case "delivered":
      return { label: "Delivered", color: "bg-green-500" }
    case "cancelled":
      return { label: "Cancelled", color: "bg-red-500" }
    default:
      return { label: "Unknown", color: "bg-gray-500" }
  }
}

// Format a shipping method to human-readable text
export function formatShippingMethod(method: string): string {
  switch (method) {
    case "standard":
      return "Standard Shipping (3-5 business days)"
    case "express":
      return "Express Shipping (1-2 business days)"
    case "overnight":
      return "Overnight Shipping (next business day)"
    default:
      return method
  }
}

// Mock function to get tracking events for an order
export function getTrackingEvents(trackingNumber?: string): TrackingEvent[] {
  if (!trackingNumber) return []
  
  const now = new Date()
  
  return [
    {
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Sorting Facility, New York",
      status: "Shipment Received",
      description: "Package received at sorting facility"
    },
    {
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Distribution Center, New Jersey",
      status: "In Transit",
      description: "Package in transit to next facility"
    },
    {
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Local Delivery Facility, Boston",
      status: "Out for Delivery",
      description: "Package out for delivery"
    }
  ]
} 