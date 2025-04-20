"use client"

import { motion } from "framer-motion"
import { ProductGrid } from "@/components/product/product-grid"
import { products } from "@/data/products"

export function NewArrivals() {
  const newProducts = products.filter((product) => product.new)

  return (
    <section className="py-16 bg-[#2A2A2A]">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFFF] mb-4">New Arrivals</h2>
          <p className="text-[#8D9192] max-w-2xl mx-auto">
            Check out our latest products and stay ahead of the curve with the newest trends.
          </p>
        </motion.div>

        <ProductGrid products={newProducts} columns={3} />
      </div>
    </section>
  )
}
