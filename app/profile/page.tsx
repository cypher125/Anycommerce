"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Edit, Package, LogOut, CreditCard, Settings, Bell, Eye, UserCircle } from "lucide-react"

import { Header } from "@/components/layout/header"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { useAuth } from "@/components/auth-provider"
import { getUserOrders } from "@/lib/orders"
import { formatOrderDate, getOrderStatusInfo } from "@/lib/orders"
import { formatPrice } from "@/lib/utils"
import { AnimatedText } from "@/components/ui/animated-text"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ParticleBackground } from "@/components/ui/particle-background"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
    
    // Get recent orders
    if (user) {
      const orders = getUserOrders(user.id)
      setRecentOrders(orders.slice(0, 3)) // Get 3 most recent orders
    }
  }, [user, isLoading, router])
  
  const handleLogout = async () => {
    try {
      await logout()
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#28809a]"></div>
      </div>
    )
  }
  
  if (!user) return null

  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <Header />
      
      <section className="relative py-16 md:py-32 overflow-hidden">
        <ParticleBackground particleColor="#28809a" particleCount={40} speed={0.3} connected={true} />
        
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#28809a]/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#28809a]/10 blur-3xl" />
        
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-6 md:mb-10">
            {/* Profile Overview */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <motion.div
                className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-4 md:p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#353535] flex items-center justify-center overflow-hidden">
                    <UserCircle className="w-14 h-14 md:w-16 md:h-16 text-[#28809a]" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-7 h-7 md:w-8 md:h-8 bg-[#28809a] rounded-full flex items-center justify-center text-white">
                    <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
                
                <h2 className="text-lg md:text-xl font-bold text-[#EDEDED] mb-1">{user.name}</h2>
                <p className="text-sm md:text-base text-[#8D9192] mb-4">{user.email}</p>
                
                <div className="flex justify-center mb-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#8D9192]/20 text-[#EDEDED] hover:bg-[#353535] text-xs md:text-sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                    Sign Out
                  </Button>
                </div>
                
                <div className="border-t border-[#8D9192]/10 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-[#8D9192]">Member Since</span>
                    <span className="text-sm text-[#EDEDED]">November 2023</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8D9192]">Orders</span>
                    <span className="text-sm text-[#EDEDED]">{recentOrders.length}</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Profile Content */}
            <div className="w-full md:w-2/3">
              <Tabs 
                defaultValue="overview" 
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="bg-[#2A2A2A] border border-[#8D9192]/20 mb-6 w-full flex">
                  <TabsTrigger value="overview" className="text-xs sm:text-sm flex-1 data-[state=active]:bg-[#28809a] data-[state=active]:text-white">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="text-xs sm:text-sm flex-1 data-[state=active]:bg-[#28809a] data-[state=active]:text-white">
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs sm:text-sm flex-1 data-[state=active]:bg-[#28809a] data-[state=active]:text-white">
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-4 md:p-6 mb-4 md:mb-6">
                      <h3 className="text-base md:text-lg font-medium text-[#EDEDED] mb-4 flex items-center">
                        <Package className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                        Recent Orders
                      </h3>
                      
                      {recentOrders.length > 0 ? (
                        <div className="space-y-3 md:space-y-4">
                          {recentOrders.map((order) => {
                            const { label: statusLabel, color: statusColor } = getOrderStatusInfo(order.status)
                            
                            return (
                              <div key={order.id} className="flex flex-col sm:flex-row justify-between p-3 md:p-4 bg-[#252525] rounded-lg">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <h4 className="text-sm md:text-base text-[#EDEDED] font-medium">Order {order.id}</h4>
                                    <span className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full text-white ${statusColor}`}>
                                      {statusLabel}
                                    </span>
                                  </div>
                                  <p className="text-xs md:text-sm text-[#8D9192]">
                                    Placed on {formatOrderDate(order.date)}
                                  </p>
                                  <p className="text-xs md:text-sm text-[#8D9192] mt-1">
                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                  </p>
                                </div>
                                
                                <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
                                  <p className="text-sm md:text-base text-[#EDEDED] font-medium">
                                    {formatPrice(order.total)}
                                  </p>
                                  <Link href={`/orders/${order.id}`}>
                                    <Button 
                                      variant="link" 
                                      size="sm" 
                                      className="p-0 h-auto text-xs md:text-sm text-[#28809a] hover:text-[#28809a]/80"
                                    >
                                      View details
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-[#8D9192] text-center py-4">
                          You haven't placed any orders yet.
                        </p>
                      )}
                      
                      {recentOrders.length > 0 && (
                        <div className="mt-4 text-center">
                          <Link href="/orders">
                            <Button variant="outline" size="sm" className="text-xs md:text-sm border-[#8D9192]/20 text-[#EDEDED] hover:bg-[#353535]">
                              View All Orders
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-4 md:p-6">
                      <h3 className="text-base md:text-lg font-medium text-[#EDEDED] mb-4 flex items-center">
                        <Bell className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                        Notifications
                      </h3>
                      
                      <div className="p-3 md:p-4 bg-[#252525] rounded-lg text-center">
                        <p className="text-sm text-[#8D9192]">
                          You're all caught up! No new notifications.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
                
                {/* Orders Tab */}
                <TabsContent value="orders">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-4 md:p-6"
                  >
                    <h3 className="text-base md:text-lg font-medium text-[#EDEDED] mb-4 flex items-center">
                      <Package className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Order History
                    </h3>
                    
                    {recentOrders.length > 0 ? (
                      <div className="space-y-4">
                        {recentOrders.map((order) => {
                          const { label: statusLabel, color: statusColor } = getOrderStatusInfo(order.status)
                          
                          return (
                            <div key={order.id} className="p-3 md:p-4 bg-[#252525] rounded-lg">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 md:mb-4">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <h4 className="text-sm md:text-base text-[#EDEDED] font-medium">Order {order.id}</h4>
                                    <span className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full text-white ${statusColor}`}>
                                      {statusLabel}
                                    </span>
                                  </div>
                                  <p className="text-xs md:text-sm text-[#8D9192]">
                                    Placed on {formatOrderDate(order.date)}
                                  </p>
                                </div>
                                
                                <p className="text-sm md:text-base text-[#EDEDED] font-medium mt-2 sm:mt-0">
                                  {formatPrice(order.total)}
                                </p>
                              </div>
                              
                              <div className="border-t border-[#8D9192]/10 pt-3 md:pt-4 mt-2">
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                  {order.items.map((item) => (
                                    <div key={`${order.id}-${item.id}`} className="flex gap-2 md:gap-3 bg-[#2A2A2A] p-2 rounded-md">
                                      <div className="w-8 h-8 md:w-10 md:h-10 relative bg-[#353535] rounded-md overflow-hidden flex-shrink-0">
                                        <Image
                                          src={item.image}
                                          alt={item.name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      
                                      <div className="flex-1 min-w-0">
                                        <h5 className="text-xs md:text-sm text-[#EDEDED] font-medium truncate">
                                          {item.name}
                                        </h5>
                                        <div className="flex items-center">
                                          <span className="text-[10px] md:text-xs text-[#28809a] font-medium">
                                            {formatPrice(item.price)} × {item.quantity}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="mt-3 md:mt-4 flex justify-end">
                                  <Link href={`/orders/${order.id}`}>
                                    <Button 
                                      size="sm" 
                                      className="text-xs md:text-sm h-8 md:h-9 bg-[#28809a] hover:bg-[#28809a]/90"
                                    >
                                      View Order Details
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 md:py-10">
                        <Package className="w-12 h-12 md:w-16 md:h-16 text-[#8D9192] mx-auto mb-3 md:mb-4" />
                        <h4 className="text-base md:text-lg font-medium text-[#EDEDED] mb-2">No Orders Yet</h4>
                        <p className="text-sm md:text-base text-[#8D9192] mb-4 md:mb-6">
                          You haven't placed any orders yet. Start shopping to see your order history here.
                        </p>
                        <Link href="/products">
                          <Button size="sm" className="text-xs md:text-sm bg-[#28809a] hover:bg-[#28809a]/90">
                            Browse Products
                          </Button>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-4 md:p-6 mb-4 md:mb-6">
                      <h3 className="text-base md:text-lg font-medium text-[#EDEDED] mb-4 flex items-center">
                        <Settings className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                        Account Settings
                      </h3>
                      
                      <div className="space-y-4 md:space-y-6">
                        <div>
                          <label htmlFor="name" className="block text-xs md:text-sm font-medium text-[#EDEDED] mb-1 md:mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            defaultValue={user.name}
                            className="w-full p-2 text-sm bg-[#252525] border border-[#8D9192]/30 rounded-md text-[#EDEDED] focus:border-[#28809a] focus:ring-1 focus:ring-[#28809a]/30 focus:outline-none"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-xs md:text-sm font-medium text-[#EDEDED] mb-1 md:mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            defaultValue={user.email}
                            className="w-full p-2 text-sm bg-[#252525] border border-[#8D9192]/30 rounded-md text-[#EDEDED] focus:border-[#28809a] focus:ring-1 focus:ring-[#28809a]/30 focus:outline-none"
                          />
                        </div>
                        
                        <div className="pt-2 md:pt-4 flex justify-end">
                          <Button size="sm" className="text-xs md:text-sm h-8 md:h-9 bg-[#28809a] hover:bg-[#28809a]/90">
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-4 md:p-6 mb-4 md:mb-6">
                      <h3 className="text-base md:text-lg font-medium text-[#EDEDED] mb-4 flex items-center">
                        <CreditCard className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                        Payment Methods
                      </h3>
                      
                      <div className="p-3 md:p-4 bg-[#252525] rounded-lg flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                        <div className="flex items-center">
                          <div className="min-w-[40px] h-6 bg-blue-500 rounded mr-2 md:mr-3 flex items-center justify-center text-white text-xs">
                            VISA
                          </div>
                          <div>
                            <p className="text-xs md:text-sm text-[#EDEDED]">•••• •••• •••• 4242</p>
                            <p className="text-[10px] md:text-xs text-[#8D9192]">Expires 12/25</p>
                          </div>
                        </div>
                        <div>
                          <Button variant="ghost" size="sm" className="h-7 md:h-8 px-2 text-xs text-[#8D9192]">
                            Edit
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-3 md:mt-4">
                        <Button variant="outline" size="sm" className="text-xs md:text-sm h-8 md:h-9 border-[#8D9192]/20 text-[#EDEDED] hover:bg-[#353535]">
                          Add Payment Method
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-4 md:p-6">
                      <h3 className="text-base md:text-lg font-medium text-[#EDEDED] mb-4 flex items-center">
                        <Eye className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                        Password & Security
                      </h3>
                      
                      <div className="space-y-3 md:space-y-4">
                        <div>
                          <label htmlFor="current-password" className="block text-xs md:text-sm font-medium text-[#EDEDED] mb-1 md:mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="current-password"
                            placeholder="••••••••"
                            className="w-full p-2 text-sm bg-[#252525] border border-[#8D9192]/30 rounded-md text-[#EDEDED] focus:border-[#28809a] focus:ring-1 focus:ring-[#28809a]/30 focus:outline-none"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="new-password" className="block text-xs md:text-sm font-medium text-[#EDEDED] mb-1 md:mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="new-password"
                            placeholder="••••••••"
                            className="w-full p-2 text-sm bg-[#252525] border border-[#8D9192]/30 rounded-md text-[#EDEDED] focus:border-[#28809a] focus:ring-1 focus:ring-[#28809a]/30 focus:outline-none"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="confirm-password" className="block text-xs md:text-sm font-medium text-[#EDEDED] mb-1 md:mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirm-password"
                            placeholder="••••••••"
                            className="w-full p-2 text-sm bg-[#252525] border border-[#8D9192]/30 rounded-md text-[#EDEDED] focus:border-[#28809a] focus:ring-1 focus:ring-[#28809a]/30 focus:outline-none"
                          />
                        </div>
                        
                        <div className="pt-2 md:pt-4 flex justify-end">
                          <Button size="sm" className="text-xs md:text-sm h-8 md:h-9 bg-[#28809a] hover:bg-[#28809a]/90">
                            Update Password
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 