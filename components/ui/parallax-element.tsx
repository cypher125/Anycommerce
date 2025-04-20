"use client"

import { type ReactNode, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface ParallaxElementProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: "up" | "down" | "left" | "right"
}

export function ParallaxElement({ children, className, speed = 0.5, direction = "up" }: ParallaxElementProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const getTransformValue = () => {
    switch (direction) {
      case "up":
        return [100 * speed, -100 * speed]
      case "down":
        return [-100 * speed, 100 * speed]
      case "left":
        return [100 * speed, -100 * speed]
      case "right":
        return [-100 * speed, 100 * speed]
      default:
        return [100 * speed, -100 * speed]
    }
  }

  const transformValue = getTransformValue()

  const y = useTransform(scrollYProgress, [0, 1], direction === "up" || direction === "down" ? transformValue : [0, 0])
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left" || direction === "right" ? transformValue : [0, 0],
  )

  return (
    <motion.div ref={ref} className={cn("relative", className)} style={{ y, x }}>
      {children}
    </motion.div>
  )
}
