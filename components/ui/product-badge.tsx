"use client"

import { cn } from "@/lib/utils"

interface ProductBadgeProps {
  type: "new" | "sale" | "featured" | "out-of-stock"
  className?: string
}

export function ProductBadge({ type, className }: ProductBadgeProps) {
  const badgeStyles = {
    new: "bg-[#28809a] text-white",
    sale: "bg-[#e63946] text-white",
    featured: "bg-[#f4a261] text-[#252525]",
    "out-of-stock": "bg-[#8D9192] text-white",
  }

  const badgeText = {
    new: "New",
    sale: "Sale",
    featured: "Featured",
    "out-of-stock": "Out of Stock",
  }

  return (
    <div className={cn("px-2 py-1 text-xs font-medium rounded-md inline-block", badgeStyles[type], className)}>
      {badgeText[type]}
    </div>
  )
}
