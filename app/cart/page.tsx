"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { AnimatedText } from "@/components/ui/animated-text"
import { ParticleBackground } from "@/components/ui/particle-background"

export default function CartPage() {
  const { items, subtotal, savings, updateQuantity, removeItem } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState<string | null>(null)

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code")
      return
    }
    // In a real app, you would validate the promo code with the backend
    setPromoError("Invalid promo code")
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen">
        <Header />
        
        <section className="relative min-h-screen py-32 flex items-center justify-center overflow-hidden">
          <ParticleBackground
            particleColor="#28809a"
            particleCount={30}
            speed={0.3}
            connected={true}
          />
          
          <div className="container max-w-4xl mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ShoppingBag className="h-24 w-24 mx-auto text-[#8D9192]/30 mb-6" />
              
              <AnimatedText
                text="Your Cart is Empty"
                el="h1"
                className="text-4xl font-bold text-[#FFFFFF] mb-4"
                animation="slide-up"
              />
              
              <p className="text-[#8D9192] text-lg max-w-lg mx-auto mb-8">
                Looks like you haven't added anything to your cart yet. Explore our products and discover amazing deals.
              </p>
              
              <Link href="/products">
                <Button className="bg-[#28809a] hover:bg-[#28809a]/90 px-8 py-6 text-lg">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#28809a]/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#28809a]/10 blur-3xl" />
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <AnimatedText
            text="Your Cart"
            el="h1"
            className="text-3xl md:text-4xl font-bold text-[#FFFFFF] mb-8"
            animation="slide-up"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-[#8D9192]/10">
                <h2 className="text-xl font-medium text-[#EDEDED]">Items ({items.length})</h2>
              </div>
              
              <div className="divide-y divide-[#8D9192]/10">
                {items.map(item => (
                  <div key={item.id} className="p-6 flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-24 h-24 relative bg-[#353535] rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-[#EDEDED]">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-[#8D9192] hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center mt-2">
                        <span className="text-[#28809a] font-bold text-lg">{formatPrice(item.price)}</span>
                        {item.originalPrice && (
                          <span className="text-[#8D9192] line-through text-sm ml-2">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center mt-4 space-x-2">
                        <div className="inline-flex items-center border border-[#8D9192]/20 rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 text-[#8D9192] hover:text-[#EDEDED]"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 text-[#EDEDED]">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-[#8D9192] hover:text-[#EDEDED]"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="text-[#8D9192] text-sm">
                          Item total: <span className="text-[#EDEDED]">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t border-[#8D9192]/10 flex justify-between">
                <Link href="/products">
                  <Button variant="outline" className="border-[#8D9192]/20 text-[#EDEDED] hover:bg-[#353535]">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg h-fit">
              <div className="p-6 border-b border-[#8D9192]/10">
                <h2 className="text-xl font-medium text-[#EDEDED]">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-[#EDEDED]">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Savings</span>
                    <span>-{formatPrice(savings)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-[#8D9192]">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                
                <form onSubmit={handleApplyPromo} className="pt-4 border-t border-[#8D9192]/10">
                  <label htmlFor="promo" className="block text-[#EDEDED] mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="promo"
                      className="flex-1 bg-[#252525] border border-[#8D9192]/30 rounded-md px-3 py-2 text-[#EDEDED] focus:outline-none focus:border-[#28809a]"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value)
                        setPromoError(null)
                      }}
                      placeholder="Enter code"
                    />
                    <Button type="submit" variant="secondary" className="bg-[#353535] hover:bg-[#404040]">
                      Apply
                    </Button>
                  </div>
                  {promoError && <p className="text-red-400 text-sm mt-1">{promoError}</p>}
                </form>
                
                <div className="flex justify-between text-[#EDEDED] font-bold text-xl pt-4 border-t border-[#8D9192]/10">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <Link href="/checkout" className="block mt-6">
                  <Button className="w-full bg-[#28809a] hover:bg-[#28809a]/90 py-6 text-lg">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <p className="text-[#8D9192] text-xs text-center mt-4">
                  By proceeding to checkout, you agree to our <Link href="/terms" className="text-[#28809a] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#28809a] hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 