"use client"

import type { Product } from "@/types/product"
import { ProductCard } from "./product-card"

interface ProductGridProps {
  products: Product[]
  columns?: 2 | 3 | 4
  className?: string
}

export function ProductGrid({ products, columns = 3, className }: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[columns]

  return (
    <div className={`grid ${gridCols} gap-6 ${className || ""}`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}
