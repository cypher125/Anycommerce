"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { ProductGrid } from "@/components/product/product-grid"
import { products } from "@/data/products"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { AnimatedText } from "@/components/ui/animated-text"
import { ParticleBackground } from "@/components/ui/particle-background"
import { motion } from "framer-motion"

// Separate the products content into its own component to use with Suspense
function ProductsContent() {
  const searchParams = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Get search query from URL parameters
  useEffect(() => {
    const query = searchParams.get("search")
    if (query) {
      setSearchQuery(query)
      filterProducts(query, activeCategory)
    } else {
      // If no search query, show all products in the active category
      filterProducts("", activeCategory)
    }
  }, [searchParams])
  
  // Filter products based on search query and category
  const filterProducts = (query: string, category: string) => {
    let filtered = products
    
    // Filter by search query
    if (query) {
      const terms = query.toLowerCase().split(' ').filter(term => term.length > 0)
      
      filtered = filtered.filter(product => {
        // Check if any search term matches any of these fields
        for (const term of terms) {
          // Check product name
          if (product.name.toLowerCase().includes(term)) {
            return true
          }
          
          // Check product description
          if (product.description.toLowerCase().includes(term)) {
            return true
          }
          
          // Check product category
          if (product.category.toLowerCase().includes(term)) {
            return true
          }
          
          // Check product tags
          if (product.tags && product.tags.some(tag => tag.toLowerCase().includes(term))) {
            return true
          }
        }
        
        return false
      })
    }
    
    // Filter by category
    if (category !== "All") {
      filtered = filtered.filter(product => product.category === category)
    }
    
    setFilteredProducts(filtered)
  }
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    filterProducts(searchQuery, category)
  }

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background effects */}
      <ParticleBackground particleColor="#28809a" particleCount={40} speed={0.3} connected={true} />

      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[#28809a]/5 blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-[#28809a]/10 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedText
              text={searchQuery ? `Results for "${searchQuery}"` : "Our Products"}
              el="h1"
              className="text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-4"
              animation="slide-up"
            />
            <AnimatedText
              text={searchQuery 
                ? `Found ${filteredProducts.length} products matching your search criteria.`
                : "Explore our curated collection of premium products enhanced by AI recommendations."}
              el="p"
              className="text-xl text-[#8D9192]"
              animation="fade"
              delay={0.2}
            />
          </motion.div>

          {/* Filter controls */}
          <motion.div
            className="flex flex-wrap gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {["All", "Electronics", "Clothing", "Home & Kitchen", "Beauty"].map((category, index) => (
              <motion.button
                key={category}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  category === activeCategory ? "bg-[#28809a] text-white" : "bg-[#2A2A2A] text-[#EDEDED] hover:bg-[#28809a]/20"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* No products found message */}
          {filteredProducts.length === 0 && (
            <motion.div 
              className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-8 text-center my-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl font-medium text-[#EDEDED] mb-2">No Products Found</h3>
              <p className="text-[#8D9192]">
                We couldn't find any products matching your search criteria. Try a different search term or category.
              </p>
            </motion.div>
          )}

          <ProductGrid products={filteredProducts} columns={3} />
        </div>
      </div>
    </section>
  )
}

// Main Products page component
export default function Products() {
  return (
    <main className="min-h-screen pt-20">
      <ScrollProgress />
      <Header />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#28809a]"></div>
        </div>
      }>
        <ProductsContent />
      </Suspense>
    </main>
  )
}
