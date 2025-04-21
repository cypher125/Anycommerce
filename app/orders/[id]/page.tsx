"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { Header } from "@/components/layout/header"
import { getOrderById, formatOrderDate, getOrderStatusInfo, formatShippingMethod } from "@/lib/orders"
import { formatPrice } from "@/lib/utils"
import { motion } from "framer-motion"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { ArrowLeft, PackageCheck, Truck, CreditCard, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedText } from "@/components/transitions/animated-text"
import { useRouter } from "next/navigation"
import type { Order } from "@/types/order"

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = params
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    
    const orderData = getOrderById(id)
    if (orderData && orderData.userId === user.id) {
      setOrder(orderData)
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
  
  if (!order) {
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
  
  const { label: statusLabel, color: statusColor } = getOrderStatusInfo(order.status)
  
  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <Header />
      
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#28809a]/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#28809a]/10 blur-3xl" />
        
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <div className="mb-8">
            <Link href="/orders" className="inline-flex items-center text-[#8D9192] hover:text-[#28809a] transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </div>
          
          <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg overflow-hidden mb-8">
            {/* Order Header */}
            <div className="p-6 border-b border-[#8D9192]/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <AnimatedText
                      text={`Order ${order.id}`}
                      el="h1"
                      className="text-2xl font-bold text-[#FFFFFF]"
                      animation="fade-in"
                    />
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <p className="text-[#8D9192]">
                    Placed on {formatOrderDate(order.date)}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-[#EDEDED] text-xl font-medium">
                    {formatPrice(order.total)}
                  </div>
                  <div className="text-[#8D9192] text-sm">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Status Timeline */}
            {(order.status === "shipped" || order.status === "delivered") && (
              <div className="p-6 border-b border-[#8D9192]/10 bg-[#252525]">
                <h3 className="text-lg font-medium text-[#EDEDED] mb-4">Order Status</h3>
                
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-[15px] top-0 bottom-0 w-px bg-[#8D9192]/30"></div>
                  
                  {/* Status Points */}
                  <div className="space-y-6 relative">
                    <motion.div 
                      className="flex"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <div className="rounded-full w-8 h-8 bg-green-500 flex items-center justify-center z-10">
                        <ShoppingBag className="w-4 h-4 text-white" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-[#EDEDED] font-medium">Order Placed</h4>
                        <p className="text-sm text-[#8D9192]">{formatOrderDate(order.date)}</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <div className="rounded-full w-8 h-8 bg-green-500 flex items-center justify-center z-10">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-[#EDEDED] font-medium">Payment Confirmed</h4>
                        <p className="text-sm text-[#8D9192]">{formatOrderDate(new Date(new Date(order.date).getTime() + 5 * 60 * 1000).toISOString())}</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <div className={`rounded-full w-8 h-8 ${order.status === "shipped" || order.status === "delivered" ? 'bg-green-500' : 'bg-[#8D9192]/40'} flex items-center justify-center z-10`}>
                        <PackageCheck className="w-4 h-4 text-white" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-[#EDEDED] font-medium">Order Processed</h4>
                        <p className="text-sm text-[#8D9192]">
                          {order.status === "shipped" || order.status === "delivered" 
                            ? formatOrderDate(new Date(new Date(order.date).getTime() + 1 * 24 * 60 * 60 * 1000).toISOString())
                            : "Pending"}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <div className={`rounded-full w-8 h-8 ${order.status === "shipped" || order.status === "delivered" ? 'bg-green-500' : 'bg-[#8D9192]/40'} flex items-center justify-center z-10`}>
                        <Truck className="w-4 h-4 text-white" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-[#EDEDED] font-medium">Shipped</h4>
                        <p className="text-sm text-[#8D9192]">
                          {order.status === "shipped" || order.status === "delivered" 
                            ? formatOrderDate(new Date(new Date(order.date).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString())
                            : "Pending"}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      <div className={`rounded-full w-8 h-8 ${order.status === "delivered" ? 'bg-green-500' : 'bg-[#8D9192]/40'} flex items-center justify-center z-10`}>
                        <PackageCheck className="w-4 h-4 text-white" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-[#EDEDED] font-medium">Delivered</h4>
                        <p className="text-sm text-[#8D9192]">
                          {order.status === "delivered" 
                            ? formatOrderDate(new Date(new Date(order.date).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString())
                            : order.estimatedDelivery
                              ? `Estimated: ${formatOrderDate(order.estimatedDelivery)}`
                              : "Pending"}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Order Items */}
            <div className="p-6 border-b border-[#8D9192]/10">
              <h3 className="text-lg font-medium text-[#EDEDED] mb-4">Items</h3>
              
              <div className="divide-y divide-[#8D9192]/10">
                {order.items.map((item, index) => (
                  <motion.div 
                    key={`${order.id}-${item.id}`} 
                    className="flex gap-4 py-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="w-20 h-20 relative bg-[#353535] rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#28809a] rounded-full text-xs flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.id}`}>
                        <h4 className="text-[#EDEDED] font-medium truncate hover:text-[#28809a] transition-colors">
                          {item.name}
                        </h4>
                      </Link>
                      <div className="flex items-center mt-1">
                        <span className="text-[#28809a] font-medium">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-[#8D9192] line-through text-xs ml-2">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-[#8D9192]">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                    
                    <div className="text-right hidden sm:block">
                      <div className="text-[#EDEDED] font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Shipping & Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-[#8D9192]/10">
              {/* Shipping Details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-medium text-[#EDEDED] mb-4">Shipping Information</h3>
                
                <div className="space-y-3 text-[#8D9192]">
                  <p>
                    {order.shipping.address}<br />
                    {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}<br />
                    {order.shipping.country}
                  </p>
                  
                  <div>
                    <span className="text-[#EDEDED]">Shipping Method:</span><br />
                    {formatShippingMethod(order.shipping.method)}
                  </div>
                  
                  {order.trackingNumber && (
                    <div>
                      <span className="text-[#EDEDED]">Tracking Number:</span><br />
                      <span className="font-mono">{order.trackingNumber}</span>
                      
                      <div className="mt-2">
                        <Link href={`/orders/${order.id}/tracking`}>
                          <Button className="bg-[#28809a] hover:bg-[#28809a]/90 text-sm">
                            Track Package
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  {order.estimatedDelivery && (
                    <div>
                      <span className="text-[#EDEDED]">Estimated Delivery:</span><br />
                      {formatOrderDate(order.estimatedDelivery)}
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Payment Details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3 className="text-lg font-medium text-[#EDEDED] mb-4">Payment Information</h3>
                
                <div className="space-y-3 text-[#8D9192]">
                  <div>
                    <span className="text-[#EDEDED]">Payment Method:</span><br />
                    {order.payment.method === "credit_card" 
                      ? `Credit Card (ending in ${order.payment.cardLast4})` 
                      : order.payment.method}
                  </div>
                  
                  <div className="pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="text-[#EDEDED]">{formatPrice(order.subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span className="text-[#EDEDED]">{formatPrice(order.shippingCost)}</span>
                    </div>
                    
                    <div className="flex justify-between pt-2 border-t border-[#8D9192]/10">
                      <span className="font-medium text-[#EDEDED]">Total:</span>
                      <span className="font-medium text-[#EDEDED]">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Actions */}
            <div className="p-6 flex flex-wrap gap-3">
              {order.trackingNumber && (
                <Link href={`/orders/${order.id}/tracking`}>
                  <Button className="bg-[#28809a] hover:bg-[#28809a]/90">
                    Track Package
                  </Button>
                </Link>
              )}
              
              <Link href="/products">
                <Button variant="outline" className="border-[#8D9192]/20 text-[#EDEDED] hover:bg-[#353535]">
                  Continue Shopping
                </Button>
              </Link>
              
              {order.status === "delivered" && (
                <Button 
                  variant="outline" 
                  className="border-[#8D9192]/20 text-[#EDEDED] hover:bg-[#353535]"
                >
                  Buy Again
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 