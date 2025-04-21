"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react"
import { useCart, CartItem } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

export function CartDropdown() {
  const { items, cartOpen, totalItems, subtotal, savings, setCartOpen, updateQuantity, removeItem } = useCart()
  const cartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartOpen(false)
      }
    }

    if (cartOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [cartOpen, setCartOpen])

  if (!cartOpen) return null

  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <ShoppingBag className="h-16 w-16 text-[#8D9192]/50 mb-4" />
      <h3 className="text-lg font-medium text-[#EDEDED] mb-2">Your cart is empty</h3>
      <p className="text-[#8D9192] text-sm mb-4 text-center">
        Looks like you haven't added anything to your cart yet.
      </p>
      <Button
        onClick={() => setCartOpen(false)}
        className="bg-[#28809a] hover:bg-[#28809a]/90"
      >
        Browse Products
      </Button>
    </div>
  )

  const CartItemComponent = ({ item }: { item: CartItem }) => (
    <div className="flex gap-4 py-3 border-b border-[#8D9192]/10">
      <div className="w-20 h-20 relative bg-[#353535] rounded-md overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h4 className="text-[#EDEDED] font-medium">{item.name}</h4>
        <div className="flex items-center mt-1">
          <span className="text-[#28809a] font-bold">{formatPrice(item.price)}</span>
          {item.originalPrice && (
            <span className="text-[#8D9192] line-through text-sm ml-2">
              {formatPrice(item.originalPrice)}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center border border-[#8D9192]/20 rounded-md">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 text-[#8D9192] hover:text-[#EDEDED]"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-2 text-sm text-[#EDEDED]">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 text-[#8D9192] hover:text-[#EDEDED]"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          
          <button 
            onClick={() => removeItem(item.id)}
            className="text-[#8D9192] hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="cart-dropdown"
        ref={cartRef}
        className="fixed top-[60px] right-0 left-0 sm:absolute sm:top-full sm:left-auto sm:right-0 mt-2 w-full sm:w-96 max-h-[80vh] overflow-auto bg-[#2A2A2A] rounded-xl shadow-xl border border-[#8D9192]/20 z-50 mx-auto sm:mx-0 max-w-[95vw] sm:max-w-none"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-4 border-b border-[#8D9192]/10 flex justify-between items-center">
          <h3 className="text-lg font-medium text-[#EDEDED]">Your Cart ({totalItems})</h3>
          <button
            onClick={() => setCartOpen(false)}
            className="text-[#8D9192] hover:text-[#EDEDED]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto px-4">
          {items.length === 0 ? (
            <EmptyCart key="empty-cart" />
          ) : (
            <div className="py-2">
              {items.map((item) => (
                <CartItemComponent key={`cart-item-${item.id}`} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-[#8D9192]/10">
            <div className="space-y-2 mb-4">
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
              <div className="flex justify-between text-[#EDEDED] font-bold pt-2 border-t border-[#8D9192]/10">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link 
                href="/cart" 
                onClick={() => setCartOpen(false)}
                className="flex justify-center items-center px-4 py-2 border border-[#28809a] rounded-md text-[#28809a] hover:bg-[#28809a]/10 transition-colors"
              >
                View Cart
              </Link>
              <Link 
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="flex justify-center items-center px-4 py-2 bg-[#28809a] hover:bg-[#28809a]/90 rounded-md text-white transition-colors"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
} 