"use client"

import { type ReactNode, useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface FloatingElementProps {
  children: ReactNode
  className?: string
  xFactor?: number
  yFactor?: number
  delay?: number
  duration?: number
  springConfig?: {
    stiffness?: number
    damping?: number
  }
}

export function FloatingElement({
  children,
  className,
  xFactor = 20,
  yFactor = 20,
  delay = 0,
  duration = 3,
  springConfig = { stiffness: 100, damping: 30 },
}: FloatingElementProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const springY = useSpring(scrollYProgress, {
    stiffness: springConfig.stiffness || 100,
    damping: springConfig.damping || 30,
  })

  const y = useTransform(springY, [0, 1], [yFactor, -yFactor])
  const x = useTransform(springY, [0, 1], [-xFactor, xFactor])

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      style={{ y, x }}
    >
      {children}
    </motion.div>
  )
}
