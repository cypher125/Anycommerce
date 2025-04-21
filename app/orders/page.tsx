"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { Header } from "@/components/layout/header"
import { getUserOrders } from "@/lib/orders"
import { formatOrderDate, getOrderStatusInfo } from "@/lib/orders"
import { formatPrice } from "@/lib/utils"
import { motion } from "framer-motion"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { PackageCheck, ChevronDown, ChevronUp, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatedText } from "@/components/transitions/animated-text"

export default function OrdersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  
  // Get the user's orders
  const orders = user ? getUserOrders(user.id) : []
  
  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Toggle expanded order details
  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
  }

  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <Header />
      
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#28809a]/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#28809a]/10 blur-3xl" />
        
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <AnimatedText
              text="Your Orders"
              el="h1"
              className="text-4xl font-bold text-[#FFFFFF] mb-4"
              animation="slide-up"
            />
            <p className="text-[#8D9192] max-w-2xl mx-auto">
              Track and manage your orders. View order history, check shipping status and more.
            </p>
          </div>
          
          {!user ? (
            <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-8 text-center">
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-16 h-16 rounded-full bg-[#353535] flex items-center justify-center">
                  <PackageCheck className="h-8 w-8 text-[#28809a]" />
                </div>
              </motion.div>
              
              <h2 className="text-xl font-medium text-[#EDEDED] mb-4">Please Sign In</h2>
              <p className="text-[#8D9192] mb-6">
                Sign in to view your order history and track your shipments.
              </p>
              
              <Link href="/auth/login">
                <Button className="bg-[#28809a] hover:bg-[#28809a]/90">
                  Sign In
                </Button>
              </Link>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-8 text-center">
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-16 h-16 rounded-full bg-[#353535] flex items-center justify-center">
                  <PackageCheck className="h-8 w-8 text-[#28809a]" />
                </div>
              </motion.div>
              
              <h2 className="text-xl font-medium text-[#EDEDED] mb-4">No Orders Yet</h2>
              <p className="text-[#8D9192] mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              
              <Link href="/products">
                <Button className="bg-[#28809a] hover:bg-[#28809a]/90">
                  Shop Now
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Search and Filter Bar */}
              <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-[#8D9192]" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search by order number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#252525] border-[#8D9192]/30 text-[#EDEDED] focus:border-[#28809a]"
                  />
                </div>
              </div>
              
              {/* Orders List */}
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const { label: statusLabel, color: statusColor } = getOrderStatusInfo(order.status)
                  const isExpanded = expandedOrderId === order.id
                  
                  return (
                    <motion.div
                      key={order.id}
                      className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Order Header */}
                      <div 
                        className="p-4 sm:p-6 border-b border-[#8D9192]/10 cursor-pointer"
                        onClick={() => toggleOrderExpand(order.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div>
                            <div className="flex items-center mb-2">
                              <h3 className="text-[#EDEDED] font-medium mr-3">Order {order.id}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full text-white ${statusColor}`}>
                                {statusLabel}
                              </span>
                            </div>
                            <p className="text-sm text-[#8D9192]">
                              Placed on {formatOrderDate(order.date)}
                            </p>
                          </div>
                          
                          <div className="flex items-center mt-2 sm:mt-0">
                            <p className="font-medium text-[#EDEDED] mr-3">
                              {formatPrice(order.total)}
                            </p>
                            <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-[#8D9192]" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-[#8D9192]" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Details (Expanded) */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Order Items */}
                          <div className="p-4 sm:p-6 border-b border-[#8D9192]/10">
                            <h4 className="text-[#EDEDED] font-medium mb-4">Items</h4>
                            <div className="space-y-4">
                              {order.items.map(item => (
                                <div key={`${order.id}-${item.id}`} className="flex gap-3">
                                  <div className="w-16 h-16 relative bg-[#353535] rounded-md overflow-hidden flex-shrink-0">
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
                                      <h5 className="text-[#EDEDED] text-sm font-medium truncate hover:text-[#28809a] transition-colors">
                                        {item.name}
                                      </h5>
                                    </Link>
                                    <div className="flex items-center mt-1">
                                      <span className="text-[#28809a] font-medium text-sm">
                                        {formatPrice(item.price)}
                                      </span>
                                      {item.originalPrice && (
                                        <span className="text-[#8D9192] line-through text-xs ml-2">
                                          {formatPrice(item.originalPrice)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Shipping & Payment Info */}
                          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipping Info */}
                            <div>
                              <h4 className="text-[#EDEDED] font-medium mb-3">Shipping Information</h4>
                              <div className="text-sm text-[#8D9192] space-y-1">
                                <p>
                                  {order.shipping.address}, {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                                </p>
                                <p>{order.shipping.country}</p>
                                <p className="text-[#EDEDED] mt-2">
                                  Method: {order.shipping.method === "standard" 
                                    ? "Standard Shipping (3-5 business days)" 
                                    : order.shipping.method === "express" 
                                      ? "Express Shipping (1-2 business days)" 
                                      : "Overnight Shipping (next business day)"
                                  }
                                </p>
                                
                                {order.trackingNumber && (
                                  <div className="mt-3">
                                    <p className="text-[#EDEDED]">Tracking Number:</p>
                                    <p className="font-mono">{order.trackingNumber}</p>
                                    <Link href={`/orders/${order.id}/tracking`}>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="mt-2 text-[#28809a] border-[#28809a]/50 hover:bg-[#28809a]/10"
                                      >
                                        Track Package
                                      </Button>
                                    </Link>
                                  </div>
                                )}
                                
                                {order.estimatedDelivery && (
                                  <p className="mt-3">
                                    <span className="text-[#EDEDED]">Estimated Delivery:</span>{" "}
                                    {formatOrderDate(order.estimatedDelivery)}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {/* Payment Summary */}
                            <div>
                              <h4 className="text-[#EDEDED] font-medium mb-3">Payment Information</h4>
                              <div className="text-sm text-[#8D9192] space-y-1">
                                <p>
                                  <span className="text-[#EDEDED]">Payment Method:</span>{" "}
                                  {order.payment.method === "credit_card" 
                                    ? `Credit Card (ending in ${order.payment.cardLast4})` 
                                    : order.payment.method}
                                </p>
                              </div>
                              
                              <div className="mt-4 space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-[#8D9192]">Subtotal:</span>
                                  <span className="text-[#EDEDED]">{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#8D9192]">Shipping:</span>
                                  <span className="text-[#EDEDED]">{formatPrice(order.shippingCost)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-[#8D9192]/10">
                                  <span className="font-medium text-[#EDEDED]">Total:</span>
                                  <span className="font-medium text-[#EDEDED]">{formatPrice(order.total)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="p-4 sm:p-6 border-t border-[#8D9192]/10 flex flex-wrap gap-3">
                            <Link href={`/orders/${order.id}`}>
                              <Button 
                                className="bg-[#28809a] hover:bg-[#28809a]/90"
                              >
                                View Order Details
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
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
                
                {filteredOrders.length === 0 && searchTerm && (
                  <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-8 text-center">
                    <h3 className="text-xl font-medium text-[#EDEDED] mb-2">No Orders Found</h3>
                    <p className="text-[#8D9192]">
                      No orders matching "{searchTerm}" were found. Try a different search term.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
} 