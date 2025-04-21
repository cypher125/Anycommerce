"use client"

import { useParams } from "next/navigation"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { StarRating } from "@/components/ui/star-rating"
import { ProductBadge } from "@/components/ui/product-badge"
import { formatPrice } from "@/lib/utils"
import { products } from "@/data/products"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { TiltCard } from "@/components/ui/tilt-card"
import { MouseFollow } from "@/components/ui/mouse-follow"
import { FloatingElement } from "@/components/ui/floating-element"
import { motion } from "framer-motion"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { ParticleBackground } from "@/components/ui/particle-background"
import { useCart } from "@/components/cart-provider"
import { ShoppingCart, Heart } from "lucide-react"

export default function ProductDetail() {
  const params = useParams()
  const productId = params.id as string
  const { addItem } = useCart()
  
  const product = products.find((p) => p.id === productId)

  if (!product) {
    notFound()
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      image: product.images[0] || "/placeholder.svg",
    })
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price

  // Related products (just for demo)
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <main className="min-h-screen pt-20">
      <ScrollProgress />
      <Header />

      <section className="relative py-16 overflow-hidden">
        {/* Background effects */}
        <ParticleBackground particleColor="#28809a" particleCount={40} speed={0.3} connected={true} />

        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[#28809a]/5 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-[#28809a]/10 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
            {/* Breadcrumbs */}
            <Breadcrumb className="mb-8">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/categories?category=${encodeURIComponent(product.category)}`}>{product.category}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>{product.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image */}
              <motion.div
                className="rounded-xl overflow-hidden bg-[#2A2A2A]"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="aspect-square relative">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Product Details */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-[#2A2A2A] rounded-xl p-8">
                  <div className="mb-1 text-sm text-[#8D9192] uppercase">{product.category}</div>
                  <h1 className="text-3xl font-bold text-[#FFFFFF] mb-3">{product.name}</h1>
                  
                  <div className="flex items-center mb-6">
                <StarRating rating={product.rating} size="md" />
                    <span className="ml-2 text-[#8D9192]">({product.reviewCount} reviews)</span>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-[#FFFFFF]">{formatPrice(product.price)}</span>
                {hasDiscount && (
                        <>
                  <span className="text-lg text-[#8D9192] line-through">{formatPrice(product.originalPrice!)}</span>
                          <span className="px-2 py-1 bg-[#28809a]/20 text-[#28809a] text-sm font-medium rounded-full">
                            {product.discount}% OFF
                          </span>
                        </>
                )}
                    </div>
                    <div className="text-[#8D9192]">
                      {product.inStock ? 
                        <span className="text-green-500">In Stock</span> : 
                        <span className="text-red-500">Out of Stock</span>
                      }
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-[#FFFFFF] mb-2">Description</h3>
                    <p className="text-[#8D9192]">{product.description}</p>
                  </div>

              {product.colors && product.colors.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-[#FFFFFF] mb-3">Colors</h3>
                      <div className="flex gap-3">
                    {product.colors.map((color, index) => (
                          <button 
                            key={index}
                            className="w-8 h-8 rounded-full border-2 border-[#8D9192]/30 flex items-center justify-center"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                    </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-[#FFFFFF] mb-3">Sizes</h3>
                      <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size, index) => (
                          <button 
                            key={index}
                            className="min-w-[3rem] px-3 py-2 rounded-md bg-[#252525] text-[#EDEDED] hover:bg-[#28809a]/20 transition-colors"
                      >
                        {size}
                          </button>
                    ))}
                  </div>
                    </div>
              )}

                  <div className="flex gap-4 mt-8">
                  <motion.button
                      className="flex-1 px-6 py-3 bg-[#28809a] text-white rounded-md font-medium flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!product.inStock}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                  </motion.button>
                  <motion.button
                      className="px-6 py-3 border border-[#8D9192]/30 text-[#EDEDED] rounded-md hover:bg-[#8D9192]/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                      <Heart className="w-5 h-5 mr-2" />
                      Wishlist
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Product tabs - specs, reviews, etc. could be added here */}
            </div>
        </div>
      </section>
    </main>
  )
}
