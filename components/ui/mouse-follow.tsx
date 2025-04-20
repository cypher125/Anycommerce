"use client"

import { type ReactNode, useState, useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface MouseFollowProps {
  children: ReactNode
  className?: string
  intensity?: number
  springConfig?: {
    stiffness?: number
    damping?: number
  }
}

export function MouseFollow({
  children,
  className,
  intensity = 0.1,
  springConfig = { stiffness: 100, damping: 30 },
}: MouseFollowProps) {
  const [isClient, setIsClient] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, {
    stiffness: springConfig.stiffness || 100,
    damping: springConfig.damping || 30,
  })
  const springY = useSpring(mouseY, {
    stiffness: springConfig.stiffness || 100,
    damping: springConfig.damping || 30,
  })

  useEffect(() => {
    setIsClient(true)
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to the center of the screen
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      // Calculate the offset from center
      const offsetX = (e.clientX - centerX) * intensity
      const offsetY = (e.clientY - centerY) * intensity

      mouseX.set(offsetX)
      mouseY.set(offsetY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY, intensity])

  if (!isClient) return <div className={className}>{children}</div>

  return (
    <motion.div className={cn("", className)} style={{ x: springX, y: springY }}>
      {children}
    </motion.div>
  )
}
