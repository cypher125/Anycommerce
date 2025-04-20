"use client"

import { createContext, useState, useContext, useEffect, ReactNode } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  originalPrice?: number
  quantity: number
  image: string
}

type CartContextType = {
  items: CartItem[]
  cartOpen: boolean
  totalItems: number
  subtotal: number
  savings: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType>({
  items: [],
  cartOpen: false,
  totalItems: 0,
  subtotal: 0,
  savings: 0,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  setCartOpen: () => {}
})

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    }
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isInitialized])

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  
  const savings = items.reduce((total, item) => {
    if (item.originalPrice) {
      return total + ((item.originalPrice - item.price) * item.quantity)
    }
    return total
  }, 0)

  const addItem = (newItem: CartItem) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(item => item.id === newItem.id)
      
      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = [...currentItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity
        }
        return updatedItems
      } else {
        // Item doesn't exist, add to cart
        return [...currentItems, newItem]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        cartOpen,
        totalItems,
        subtotal,
        savings,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  )
} 