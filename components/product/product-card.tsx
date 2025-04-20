"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/utils"

import type { Product } from "@/types/product"
import { StarRating } from "@/components/ui/star-rating"
import { ProductBadge } from "@/components/ui/product-badge"
import { cn } from "@/lib/utils"
import { TiltCard } from "@/components/ui/tilt-card"

interface ProductCardProps {
  product: Product
  index?: number
  className?: string
}

export function ProductCard({ product, index = 0, className }: ProductCardProps) {
  const { addItem } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const hasDiscount = product.originalPrice && product.originalPrice > product.price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      image: product.images[0] || "/placeholder.svg",
    })
  }

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  return (
    <motion.div
      className={cn("group relative", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      <TiltCard
        className="rounded-lg overflow-hidden bg-[#2A2A2A]"
        tiltFactor={10}
        perspective={1000}
        glareOpacity={0.1}
      >
        {/* Product badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.new && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ProductBadge type="new" />
            </motion.div>
          )}
          {hasDiscount && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ProductBadge type="sale" />
            </motion.div>
          )}
          {product.featured && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <ProductBadge type="featured" />
            </motion.div>
          )}
          {!product.inStock && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <ProductBadge type="out-of-stock" />
            </motion.div>
          )}
        </div>

        {/* Favorite button */}
        <motion.button
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-[#252525]/80 text-[#EDEDED] hover:text-[#e63946] transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-[#e63946] text-[#e63946]")} />
        </motion.button>

        {/* Product image */}
        <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out"
            style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
          />

          {/* Overlay with quick actions */}
          <motion.div
            className="absolute inset-0 bg-[#252525]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <div className="flex gap-2">
              <motion.button
                className="p-2 rounded-full bg-[#FFFFFF] text-[#252525] hover:bg-[#28809a] hover:text-[#FFFFFF] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Eye className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="p-2 rounded-full bg-[#FFFFFF] text-[#252525] hover:bg-[#28809a] hover:text-[#FFFFFF] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </Link>

        {/* Product info */}
        <div className="p-4">
          <div className="mb-1 text-xs text-[#8D9192] uppercase">{product.category}</div>
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-medium text-[#FFFFFF] hover:text-[#28809a] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={product.rating} size="sm" />
            <span className="text-xs text-[#8D9192]">({product.reviewCount})</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.span
                className="font-bold text-[#FFFFFF]"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {formatPrice(product.price)}
              </motion.span>
              {hasDiscount && (
                <motion.span
                  className="text-sm text-[#8D9192] line-through"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {formatPrice(product.originalPrice!)}
                </motion.span>
              )}
            </div>

            {discount > 0 && (
              <span className="text-green-400 text-xs font-medium">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}
