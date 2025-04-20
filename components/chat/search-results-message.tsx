"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart, ArrowRight, Search, Tag, Filter } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/types/product"

interface SearchResultsMessageProps {
  products: Product[]
  searchTerm: string
  categories?: { name: string; count: number }[]
  priceRanges?: { min: number; max: number; count: number }[]
  selectedFilters?: string[]
}

export function SearchResultsMessage({ 
  products, 
  searchTerm, 
  categories = [], 
  priceRanges = [],
  selectedFilters = []
}: SearchResultsMessageProps) {
  const [activeTab, setActiveTab] = useState("grid")
  const { addItem } = useCart()
  
  // Group by category if categories exist
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Helper to handle adding to cart
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
        <div className="flex items-start mb-3">
          <Search className="h-4 w-4 text-[#8D9192] mt-1 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm">
              Here are the results for <span className="font-medium">"{searchTerm}"</span>
            </p>
            <p className="text-xs text-[#8D9192] mt-1">
              Found {products.length} products {selectedFilters.length > 0 && `with ${selectedFilters.length} filters applied`}
            </p>
          </div>
        </div>

        {/* Filters (if any) */}
        {selectedFilters.length > 0 && (
          <div className="mb-3 flex items-center flex-wrap gap-2">
            <div className="text-xs text-[#8D9192] flex items-center">
              <Filter className="h-3 w-3 mr-1" /> Filters:
            </div>
            {selectedFilters.map((filter, index) => (
              <span 
                key={index} 
                className="text-xs bg-[#28809a]/20 text-[#28809a] px-2 py-0.5 rounded-full"
              >
                {filter}
              </span>
            ))}
          </div>
        )}

        {/* View Tabs */}
        <div className="flex border-b border-[#8D9192]/10 mb-3">
          <button
            className={`flex items-center text-xs px-3 py-2 border-b-2 ${
              activeTab === "grid" 
                ? "border-[#28809a] text-[#28809a]" 
                : "border-transparent text-[#8D9192] hover:text-[#EDEDED]"
            } transition-colors`}
            onClick={() => setActiveTab("grid")}
          >
            Grid View
          </button>
          <button
            className={`flex items-center text-xs px-3 py-2 border-b-2 ${
              activeTab === "categories" 
                ? "border-[#28809a] text-[#28809a]" 
                : "border-transparent text-[#8D9192] hover:text-[#EDEDED]"
            } transition-colors`}
            onClick={() => setActiveTab("categories")}
          >
            By Category
          </button>
        </div>

        {/* Grid View */}
        {activeTab === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {products.map((product) => (
              <ProductSearchCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => handleAddToCart(product)} 
              />
            ))}
          </div>
        )}

        {/* Category View */}
        {activeTab === "categories" && Object.keys(productsByCategory).length > 0 && (
          <div className="space-y-4">
            {Object.entries(productsByCategory).map(([category, products]) => (
              <div key={category}>
                <div className="flex items-center mb-2">
                  <Tag className="h-3 w-3 text-[#28809a] mr-1" />
                  <h4 className="text-sm font-medium">{category} ({products.length})</h4>
                </div>
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-3" style={{ minWidth: "max-content" }}>
                    {products.map((product) => (
                      <ProductSearchCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={() => handleAddToCart(product)} 
                        width="w-36"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick filter suggestions */}
        {categories.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#8D9192]/10">
            <div className="text-xs text-[#8D9192] mb-2">Filter by category:</div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="text-xs px-3 py-1 rounded-full bg-[#252525] hover:bg-[#28809a]/10 hover:text-[#28809a] text-[#EDEDED] transition-colors"
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price range filters */}
        {priceRanges.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-[#8D9192] mb-2">Filter by price:</div>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range, index) => (
                <button
                  key={index}
                  className="text-xs px-3 py-1 rounded-full bg-[#252525] hover:bg-[#28809a]/10 hover:text-[#28809a] text-[#EDEDED] transition-colors"
                >
                  {range.min === 0 
                    ? `Under ${formatPrice(range.max)}`
                    : range.max === Infinity
                      ? `Over ${formatPrice(range.min)}`
                      : `${formatPrice(range.min)} - ${formatPrice(range.max)}`
                  } ({range.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* See all results button */}
        <div className="mt-4 text-center">
          <button className="text-xs text-[#28809a] hover:underline flex items-center justify-center mx-auto">
            See all results <ArrowRight className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

interface ProductSearchCardProps {
  product: Product
  onAddToCart: () => void
  width?: string
}

function ProductSearchCard({ product, onAddToCart, width = "w-40" }: ProductSearchCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price

  return (
    <div className={`flex flex-col ${width} bg-[#252525] rounded-lg overflow-hidden border border-[#8D9192]/10 hover:border-[#28809a]/30 transition-all`}>
      <div className="relative h-32 w-full">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
        />
        {product.new && (
          <span className="absolute top-2 left-2 text-xs bg-[#28809a] text-white px-1.5 py-0.5 rounded text-[10px]">
            New
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 text-xs bg-[#e63946] text-white px-1.5 py-0.5 rounded text-[10px]">
            Sale
          </span>
        )}
      </div>
      
      <div className="p-2 flex-1 flex flex-col">
        <h4 className="font-medium text-xs text-[#EDEDED] line-clamp-2 mb-1">{product.name}</h4>
        
        <div className="flex items-end gap-1 mt-auto mb-2">
          <span className="text-[#EDEDED] font-bold text-xs">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-[#8D9192] line-through text-[10px]">{formatPrice(product.originalPrice!)}</span>
          )}
        </div>
      </div>
      
      <button 
        onClick={onAddToCart}
        className="bg-[#28809a] text-white text-xs p-1.5 flex items-center justify-center hover:bg-[#28809a]/90 transition-colors"
      >
        <ShoppingCart className="h-3 w-3 mr-1" /> 
        Add to Cart
      </button>
    </div>
  )
} 