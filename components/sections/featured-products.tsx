"use client"

import { motion } from "framer-motion"
import { ProductGrid } from "@/components/product/product-grid"
import { products } from "@/data/products"

export function FeaturedProducts() {
  const featuredProducts = products.filter((product) => product.featured)

  return (
    <section className="py-16 bg-[#252525]">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFFF] mb-4">Featured Products</h2>
          <p className="text-[#8D9192] max-w-2xl mx-auto">
            Discover our handpicked selection of premium products, curated just for you.
          </p>
        </motion.div>

        <ProductGrid products={featuredProducts} columns={3} />

        <div className="mt-12 text-center">
          <motion.a
            href="/products"
            className="inline-block px-6 py-3 bg-transparent border border-[#28809a] text-[#28809a] rounded-md font-medium hover:bg-[#28809a] hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Products
          </motion.a>
        </div>
      </div>
    </section>
  )
}
