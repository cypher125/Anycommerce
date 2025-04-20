"use client"

import { Header } from "@/components/layout/header"
import { ProductGrid } from "@/components/product/product-grid"
import { products } from "@/data/products"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { AnimatedText } from "@/components/ui/animated-text"
import { ParticleBackground } from "@/components/ui/particle-background"
import { motion } from "framer-motion"

export default function Products() {
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
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <AnimatedText
                text="Our Products"
                el="h1"
                className="text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-4"
                animation="slide-up"
              />
              <AnimatedText
                text="Explore our curated collection of premium products enhanced by AI recommendations."
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
                    category === "All" ? "bg-[#28809a] text-white" : "bg-[#2A2A2A] text-[#EDEDED] hover:bg-[#28809a]/20"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>

            <ProductGrid products={products} columns={3} />
          </div>
        </div>
      </section>
    </main>
  )
}
