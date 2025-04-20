"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"

import { Header } from "@/components/layout/header"
import { ProductGrid } from "@/components/product/product-grid"
import { categories, products } from "@/data/products"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { AnimatedText } from "@/components/ui/animated-text"
import { ParticleBackground } from "@/components/ui/particle-background"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { ChevronRight } from "lucide-react"

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.id as string
  
  // Find the current category
  const category = categories.find(cat => cat.id === categoryId)
  
  // Filter products by category
  const categoryProducts = products.filter(
    product => product.category.toLowerCase() === category?.name.toLowerCase()
  )
  
  if (!category) {
    return (
      <main className="min-h-screen pt-20">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl text-[#FFFFFF]">Category not found</h1>
        </div>
      </main>
    )
  }

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
                <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>{category.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <AnimatedText
                text={category.name}
                el="h1"
                className="text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-4"
                animation="slide-up"
              />
              <AnimatedText
                text={category.description}
                el="p"
                className="text-xl text-[#8D9192] mb-2"
                animation="fade"
                delay={0.2}
              />
              <p className="text-[#28809a]">{category.productCount} products</p>
            </motion.div>

            {/* Filters */}
            <motion.div
              className="flex flex-wrap gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {["All", "Price: Low to High", "Price: High to Low", "Newest", "Most Popular"].map((filter, index) => (
                <motion.button
                  key={filter}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === "All" ? "bg-[#28809a] text-white" : "bg-[#2A2A2A] text-[#EDEDED] hover:bg-[#28809a]/20"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  {filter}
                </motion.button>
              ))}
            </motion.div>

            {categoryProducts.length > 0 ? (
              <ProductGrid products={categoryProducts} columns={3} />
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-xl text-[#8D9192]">No products found in this category.</p>
                <motion.button
                  className="mt-4 px-6 py-3 bg-[#28809a] text-white rounded-md font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Other Categories
                </motion.button>
              </motion.div>
            )}

            {/* Related categories */}
            {categoryProducts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-[#FFFFFF] mb-8">You might also like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categories
                    .filter(cat => cat.id !== categoryId)
                    .slice(0, 4)
                    .map((relatedCategory, index) => (
                      <motion.div
                        key={relatedCategory.id}
                        className="relative overflow-hidden rounded-lg bg-[#2A2A2A] group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-[#252525] to-transparent z-10" />
                          <div className="absolute bottom-4 left-4 z-20">
                            <h3 className="text-lg font-medium text-[#FFFFFF]">{relatedCategory.name}</h3>
                            <p className="text-sm text-[#8D9192]">{relatedCategory.productCount} products</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
} 