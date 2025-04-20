"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart, Star, Heart, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/types/product"

interface ProductDetailMessageProps {
  product: Product
  onBack?: () => void
}

export function ProductDetailMessage({ product, onBack }: ProductDetailMessageProps) {
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0] || null)
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes?.[0] || null)
  const [quantity, setQuantity] = useState(1)
  
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity,
      image: product.images[0] || "/placeholder.svg",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full mb-4 justify-start"
    >
      <div className="max-w-[90%] rounded-2xl bg-[#2A2A2A] text-[#EDEDED] rounded-tl-none overflow-hidden">
        {onBack && (
          <div className="p-3 border-b border-[#8D9192]/20 flex items-center">
            <button 
              onClick={onBack}
              className="text-[#8D9192] hover:text-[#EDEDED] transition-colors flex items-center text-xs font-medium"
            >
              <ArrowLeft className="h-3 w-3 mr-1" /> Back to results
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          {/* Product Images */}
          <div className="flex flex-col">
            <div className="relative h-60 w-full bg-[#252525] rounded-lg overflow-hidden mb-2">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain"
              />
              
              {hasDiscount && (
                <div className="absolute top-2 right-2 bg-[#e63946] text-white text-xs font-medium px-2 py-1 rounded-md">
                  {discount}% OFF
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="flex overflow-x-auto gap-2 pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? "border-[#28809a]" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col">
            <div className="text-xs text-[#8D9192] mb-1">{product.category}</div>
            <h3 className="font-medium text-lg text-[#EDEDED] mb-2">{product.name}</h3>
            
            <div className="flex items-center mb-3">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-current" : ""}`}
                  />
                ))}
                <span className="ml-1 text-xs">{product.rating}</span>
              </div>
              <span className="text-[#8D9192] text-xs ml-1">({product.reviewCount} reviews)</span>
            </div>
            
            <div className="flex items-end gap-2 mb-4">
              <span className="text-[#EDEDED] font-bold text-xl">{formatPrice(product.price)}</span>
              {hasDiscount && (
                <span className="text-[#8D9192] line-through text-sm">{formatPrice(product.originalPrice!)}</span>
              )}
            </div>
            
            <p className="text-sm text-[#8D9192] mb-4">{product.description}</p>
            
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Color</div>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedColor === color ? "ring-2 ring-[#28809a] ring-offset-2 ring-offset-[#2A2A2A]" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    >
                      {selectedColor === color && <Check className="h-4 w-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Size</div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[2.5rem] px-2 h-8 flex items-center justify-center rounded border ${
                        selectedSize === size
                          ? "bg-[#28809a] border-[#28809a] text-white"
                          : "border-[#8D9192]/30 text-[#EDEDED] hover:border-[#8D9192]/60"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Quantity</div>
              <div className="flex h-9 w-24">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 flex items-center justify-center border border-[#8D9192]/30 border-r-0 rounded-l text-[#8D9192] hover:text-[#EDEDED]"
                >
                  -
                </button>
                <div className="flex-1 flex items-center justify-center border-y border-[#8D9192]/30 bg-[#252525] text-[#EDEDED]">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 flex items-center justify-center border border-[#8D9192]/30 border-l-0 rounded-r text-[#8D9192] hover:text-[#EDEDED]"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#28809a] text-white py-2 rounded-md flex items-center justify-center hover:bg-[#28809a]/90 transition-colors"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </button>
              <button
                className="w-9 flex items-center justify-center border border-[#8D9192]/30 rounded-md text-[#8D9192] hover:text-[#e63946] hover:border-[#e63946]/30"
              >
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Product features */}
        <div className="px-4 pb-4">
          <div className="p-3 bg-[#252525] rounded-lg">
            <h4 className="font-medium text-sm mb-2">Key Features</h4>
            <ul className="text-xs text-[#8D9192] space-y-1">
              {product.tags.map((tag, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-3 w-3 text-[#28809a] mr-2 mt-0.5" />
                  <span className="capitalize">{tag}</span>
                </li>
              ))}
              {!product.inStock && (
                <li className="text-[#e63946] font-medium mt-2">Currently out of stock</li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="px-4 pb-3 text-xs text-[#8D9192] italic">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  )
} 