"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  max?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StarRating({ rating, max = 5, size = "md", className }: StarRatingProps) {
  const roundedRating = Math.round(rating * 2) / 2 // Round to nearest 0.5

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1
        const isFilled = roundedRating >= starValue
        const isHalfFilled = roundedRating === starValue - 0.5

        const sizeClass = {
          sm: "w-3 h-3",
          md: "w-4 h-4",
          lg: "w-5 h-5",
        }[size]

        return (
          <span key={i} className="relative">
            {isFilled ? (
              <Star className={cn(sizeClass, "text-[#28809a] fill-[#28809a]")} />
            ) : isHalfFilled ? (
              <>
                <Star className={cn(sizeClass, "text-[#8D9192]/30")} />
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star className={cn(sizeClass, "text-[#28809a] fill-[#28809a]")} />
                </div>
              </>
            ) : (
              <Star className={cn(sizeClass, "text-[#8D9192]/30")} />
            )}
          </span>
        )
      })}
    </div>
  )
}
