"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Header } from "@/components/layout/header"
import { getOrderById, formatOrderDate, getOrderStatusInfo, getTrackingEvents } from "@/lib/orders"
import { formatPrice } from "@/lib/utils"
import { motion } from "framer-motion"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { ArrowLeft, PackageCheck, MapPin, Map, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedText } from "@/components/transitions/animated-text"
import { useRouter } from "next/navigation"
import type { Order, OrderWithTracking, TrackingEvent } from "@/types/order"

interface OrderTrackingPageProps {
  params: {
    id: string
  }
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { id } = params
  const router = useRouter()
  const { user } = useAuth()
  const [orderWithTracking, setOrderWithTracking] = useState<OrderWithTracking | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    
    const orderData = getOrderById(id)
    
    if (orderData && orderData.userId === user.id) {
      if (orderData.trackingNumber) {
        const trackingEvents = getTrackingEvents(orderData.trackingNumber)
        
        setOrderWithTracking({
          ...orderData,
          trackingEvents
        })
      } else {
        setOrderWithTracking({
          ...orderData,
          trackingEvents: []
        })
      }
    }
    
    setLoading(false)
  }, [id, user, router])
  
  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#28809a]"></div>
        </div>
      </main>
    )
  }
  
  if (!orderWithTracking) {
    return (
      <main className="min-h-screen">
        <Header />
        <section className="relative py-32 overflow-hidden">
          <div className="container max-w-5xl mx-auto px-4 relative z-10">
            <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-8 text-center">
              <h2 className="text-xl font-medium text-[#EDEDED] mb-4">Order Not Found</h2>
              <p className="text-[#8D9192] mb-6">
                We couldn't find the order you're looking for. It may have been removed or you may not have permission to view it.
              </p>
              
              <Link href="/orders">
                <Button className="bg-[#28809a] hover:bg-[#28809a]/90">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Orders
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }
  
  if (!orderWithTracking.trackingNumber) {
    return (
      <main className="min-h-screen">
        <Header />
        <section className="relative py-32 overflow-hidden">
          <div className="container max-w-5xl mx-auto px-4 relative z-10">
            <div className="mb-8">
              <Link href={`/orders/${id}`} className="inline-flex items-center text-[#8D9192] hover:text-[#28809a] transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Order Details
              </Link>
            </div>
            
            <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-8 text-center">
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-16 h-16 rounded-full bg-[#353535] flex items-center justify-center">
                  <Package className="h-8 w-8 text-[#28809a]" />
                </div>
              </motion.div>
              
              <h2 className="text-xl font-medium text-[#EDEDED] mb-4">No Tracking Information</h2>
              <p className="text-[#8D9192] mb-6">
                This order doesn't have any tracking information yet. Please check back later.
              </p>
              
              <Link href={`/orders/${id}`}>
                <Button className="bg-[#28809a] hover:bg-[#28809a]/90">
                  Back to Order Details
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }
  
  const { label: statusLabel, color: statusColor } = getOrderStatusInfo(orderWithTracking.status)
  
  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <Header />
      
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#28809a]/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#28809a]/10 blur-3xl" />
        
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <div className="mb-8">
            <Link href={`/orders/${id}`} className="inline-flex items-center text-[#8D9192] hover:text-[#28809a] transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Order Details
            </Link>
          </div>
          
          <div className="text-center mb-12">
            <AnimatedText
              text="Track Your Package"
              el="h1"
              className="text-3xl font-bold text-[#FFFFFF] mb-4"
              animation="slide-up"
            />
            <p className="text-[#8D9192] max-w-2xl mx-auto">
              Follow your shipment in real-time. View delivery status and estimated arrival.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Order Summary */}
            <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-6">
              <h3 className="text-lg font-medium text-[#EDEDED] mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Summary
              </h3>
              
              <div className="space-y-3 text-[#8D9192] text-sm">
                <div>
                  <span className="text-[#EDEDED]">Order Number:</span><br />
                  {orderWithTracking.id}
                </div>
                
                <div>
                  <span className="text-[#EDEDED]">Order Date:</span><br />
                  {formatOrderDate(orderWithTracking.date)}
                </div>
                
                <div>
                  <span className="text-[#EDEDED]">Order Status:</span><br />
                  <span className={`inline-block px-2 py-0.5 rounded text-xs text-white ${statusColor} mt-1`}>
                    {statusLabel}
                  </span>
                </div>
                
                <div>
                  <span className="text-[#EDEDED]">Total Amount:</span><br />
                  {formatPrice(orderWithTracking.total)}
                </div>
              </div>
            </div>
            
            {/* Tracking Info */}
            <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-6">
              <h3 className="text-lg font-medium text-[#EDEDED] mb-4 flex items-center">
                <Map className="w-5 h-5 mr-2" />
                Tracking Information
              </h3>
              
              <div className="space-y-3 text-[#8D9192] text-sm">
                <div>
                  <span className="text-[#EDEDED]">Tracking Number:</span><br />
                  <code className="font-mono">{orderWithTracking.trackingNumber}</code>
                </div>
                
                <div>
                  <span className="text-[#EDEDED]">Carrier:</span><br />
                  AnyCommerce Shipping
                </div>
                
                <div>
                  <span className="text-[#EDEDED]">Shipping Method:</span><br />
                  {orderWithTracking.shipping.method === "standard" 
                    ? "Standard Shipping (3-5 business days)" 
                    : orderWithTracking.shipping.method === "express" 
                      ? "Express Shipping (1-2 business days)" 
                      : "Overnight Shipping (next business day)"}
                </div>
                
                {orderWithTracking.estimatedDelivery && (
                  <div>
                    <span className="text-[#EDEDED]">Estimated Delivery:</span><br />
                    {formatOrderDate(orderWithTracking.estimatedDelivery)}
                  </div>
                )}
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-6">
              <h3 className="text-lg font-medium text-[#EDEDED] mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </h3>
              
              <div className="text-[#8D9192] text-sm">
                <p>
                  {orderWithTracking.shipping.address}<br />
                  {orderWithTracking.shipping.city}, {orderWithTracking.shipping.state} {orderWithTracking.shipping.zipCode}<br />
                  {orderWithTracking.shipping.country}
                </p>
              </div>
            </div>
          </div>
          
          {/* Tracking Timeline */}
          <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-[#EDEDED] mb-6">Tracking Timeline</h3>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-[15px] top-0 bottom-0 w-px bg-[#8D9192]/30"></div>
              
              {/* Tracking Events */}
              <div className="space-y-8 relative">
                {orderWithTracking.trackingEvents && orderWithTracking.trackingEvents.map((event, index) => (
                  <motion.div 
                    key={index} 
                    className="flex"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="rounded-full w-8 h-8 bg-[#28809a] flex items-center justify-center z-10">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="ml-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h4 className="text-[#EDEDED] font-medium">{event.status}</h4>
                        <span className="text-sm text-[#8D9192]">{formatOrderDate(event.date)}</span>
                      </div>
                      <p className="text-sm text-[#8D9192] mt-1">{event.location}</p>
                      <p className="text-sm text-[#8D9192] mt-1">{event.description}</p>
                    </div>
                  </motion.div>
                ))}
                
                {/* Current Status */}
                <motion.div 
                  className="flex"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: (orderWithTracking.trackingEvents?.length || 0) * 0.1 }}
                >
                  <div className={`rounded-full w-8 h-8 ${statusColor} flex items-center justify-center z-10`}>
                    <PackageCheck className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h4 className="text-[#EDEDED] font-medium">{statusLabel}</h4>
                      <span className="text-sm text-[#8D9192]">Current Status</span>
                    </div>
                    <p className="text-sm text-[#8D9192] mt-1">
                      {orderWithTracking.status === "delivered" 
                        ? "Your package has been delivered."
                        : orderWithTracking.status === "shipped" 
                          ? "Your package is on its way."
                          : "Your order is being processed."}
                    </p>
                    {orderWithTracking.estimatedDelivery && orderWithTracking.status !== "delivered" && (
                      <p className="text-sm text-[#28809a] mt-1">
                        Estimated delivery: {formatOrderDate(orderWithTracking.estimatedDelivery)}
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href={`/orders/${id}`}>
              <Button variant="outline" className="border-[#8D9192]/20 text-[#EDEDED] hover:bg-[#353535]">
                Back to Order Details
              </Button>
            </Link>
            
            <Link href="/orders">
              <Button className="bg-[#28809a] hover:bg-[#28809a]/90">
                View All Orders
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
} 