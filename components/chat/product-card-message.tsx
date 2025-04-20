"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, ShoppingCart, Eye, ArrowRight } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/types/product"

interface ProductCardMessageProps {
  products: Product[]
  layout?: "grid" | "carousel" | "comparison"
  message?: string
}

export function ProductCardMessage({ products, layout = "carousel", message }: ProductCardMessageProps) {
  const { addItem } = useCart()

  // No products to display
  if (products.length === 0) {
    return null
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
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
      <div className="max-w-[90%] rounded-2xl px-4 py-3 bg-[#2A2A2A] text-[#EDEDED] rounded-tl-none">
        {message && <p className="text-sm mb-3">{message}</p>}

        {layout === "carousel" && (
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3" style={{ minWidth: "max-content" }}>
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={() => handleAddToCart(product)} 
                />
              ))}
            </div>
          </div>
        )}

        {layout === "grid" && (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => handleAddToCart(product)} 
              />
            ))}
          </div>
        )}

        {layout === "comparison" && products.length >= 2 && (
          <ComparisonView products={products} onAddToCart={handleAddToCart} />
        )}
      </div>
    </motion.div>
  )
}

interface ProductCardProps {
  product: Product
  onAddToCart: () => void
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const hasDiscount = product.originalPrice && product.originalPrice > product.price

  return (
    <div 
      className="flex flex-col w-44 bg-[#252525] rounded-lg overflow-hidden border border-[#8D9192]/10 hover:border-[#28809a]/30 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-36 w-full">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
        />
        {product.new && (
          <span className="absolute top-2 left-2 text-xs bg-[#28809a] text-white px-2 py-0.5 rounded-md">
            New
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 text-xs bg-[#e63946] text-white px-2 py-0.5 rounded-md">
            Sale
          </span>
        )}
      </div>
      
      <div className="p-3 flex-1 flex flex-col">
        <div className="text-xs text-[#8D9192] mb-1">{product.category}</div>
        <h4 className="font-medium text-sm text-[#EDEDED] line-clamp-2 mb-1">{product.name}</h4>
        
        <div className="flex items-center mt-auto">
          <div className="flex items-center text-yellow-400 text-xs">
            <Star className="h-3 w-3 fill-current" />
            <span className="ml-1">{product.rating}</span>
          </div>
          <span className="text-[#8D9192] text-xs ml-1">({product.reviewCount})</span>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1">
            <span className="text-[#EDEDED] font-bold text-sm">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-[#8D9192] line-through text-xs">{formatPrice(product.originalPrice!)}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-2 pt-0 flex justify-between gap-1">
        <button 
          onClick={onAddToCart}
          className="flex-1 bg-[#28809a] text-white text-xs py-1.5 rounded flex items-center justify-center hover:bg-[#28809a]/90 transition-colors"
        >
          <ShoppingCart className="h-3 w-3 mr-1" /> 
          Add
        </button>
        <button 
          className="flex-1 border border-[#8D9192]/30 text-[#EDEDED] text-xs py-1.5 rounded flex items-center justify-center hover:bg-[#8D9192]/10 transition-colors"
        >
          <Eye className="h-3 w-3 mr-1" /> 
          Details
        </button>
      </div>
    </div>
  )
}

interface ComparisonViewProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

function ComparisonView({ products, onAddToCart }: ComparisonViewProps) {
  // Take only the first 2 products for comparison
  const comparisonProducts = products.slice(0, 2)
  
  // Define some key specs to compare
  const specs = [
    { name: "Price", key: "price", format: (value: number) => formatPrice(value) },
    { name: "Rating", key: "rating", format: (value: number) => `${value}/5 (${products[0].reviewCount} reviews)` },
    { name: "In Stock", key: "inStock", format: (value: boolean) => value ? "Yes" : "No" }
  ]

  return (
    <div className="border border-[#8D9192]/20 rounded-lg overflow-hidden">
      <div className="grid grid-cols-2 gap-2 p-3">
        {comparisonProducts.map((product) => (
          <div key={product.id} className="flex flex-col items-center">
            <div className="relative h-32 w-32 mb-2">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <h4 className="font-medium text-sm text-[#EDEDED] text-center mb-1">{product.name}</h4>
            <button 
              onClick={() => onAddToCart(product)}
              className="mt-2 bg-[#28809a] text-white text-xs py-1.5 px-3 rounded flex items-center justify-center hover:bg-[#28809a]/90 transition-colors"
            >
              <ShoppingCart className="h-3 w-3 mr-1" /> 
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      
      <div className="bg-[#252525] p-3 border-t border-[#8D9192]/20">
        <h5 className="text-sm font-medium text-[#EDEDED] mb-2">Comparison</h5>
        
        <table className="w-full text-xs">
          <tbody>
            {specs.map((spec) => (
              <tr key={spec.key} className="border-b border-[#8D9192]/10 last:border-0">
                <td className="py-2 text-[#8D9192]">{spec.name}</td>
                {comparisonProducts.map((product) => {
                  const value = product[spec.key as keyof Product];
                  const formattedValue = spec.format(value as never);
                  
                  // Determine which product has the better value for this spec
                  let isBetter = false;
                  if (spec.key === 'price') {
                    isBetter = product.price < comparisonProducts.find(p => p.id !== product.id)?.price!;
                  } else if (spec.key === 'rating') {
                    isBetter = product.rating > comparisonProducts.find(p => p.id !== product.id)?.rating!;
                  }
                  
                  return (
                    <td 
                      key={`${product.id}-${spec.key}`} 
                      className={`py-2 text-center ${isBetter ? 'text-green-400 font-medium' : 'text-[#EDEDED]'}`}
                    >
                      {formattedValue}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className="py-2 text-[#8D9192]">Features</td>
              {comparisonProducts.map((product) => (
                <td key={`${product.id}-features`} className="py-2 text-center text-[#EDEDED]">
                  <ul className="list-disc list-inside text-left pl-2">
                    {product.tags.slice(0, 3).map((tag, index) => (
                      <li key={index} className="capitalize">{tag}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        
        <button className="w-full mt-3 flex items-center justify-center text-[#28809a] hover:text-[#28809a]/80 text-xs">
          View detailed comparison <ArrowRight className="h-3 w-3 ml-1" />
        </button>
      </div>
    </div>
  )
} 