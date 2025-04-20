"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { categories } from "@/data/products"

export function CategoriesShowcase() {
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFFF] mb-4">Shop by Category</h2>
          <p className="text-[#8D9192] max-w-2xl mx-auto">
            Browse our wide range of products organized by category to find exactly what you need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="relative rounded-lg overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="aspect-square relative">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#252525] to-transparent opacity-80" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-[#FFFFFF] mb-1">{category.name}</h3>
                <p className="text-sm text-[#EDEDED] mb-3">{category.productCount} Products</p>
                <Link
                  href={`/categories/${category.id}`}
                  className="inline-block text-sm font-medium text-[#28809a] hover:text-[#FFFFFF] transition-colors"
                >
                  Shop Now →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
