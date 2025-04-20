"use client"

import type React from "react"

import { type ReactNode, useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface TiltCardProps {
  children: ReactNode
  className?: string
  tiltFactor?: number
  perspective?: number
  glareOpacity?: number
  springConfig?: {
    stiffness?: number
    damping?: number
  }
}

export function TiltCard({
  children,
  className,
  tiltFactor = 10,
  perspective = 1000,
  glareOpacity = 0.2,
  springConfig = { stiffness: 400, damping: 40 },
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, {
    stiffness: springConfig.stiffness || 400,
    damping: springConfig.damping || 40,
  })
  const springY = useSpring(y, {
    stiffness: springConfig.stiffness || 400,
    damping: springConfig.damping || 40,
  })

  const rotateX = useTransform(springY, [-0.5, 0.5], [tiltFactor, -tiltFactor])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-tiltFactor, tiltFactor])

  const glareX = useTransform(springX, [-0.5, 0.5], ["-20%", "120%"])
  const glareY = useTransform(springY, [-0.5, 0.5], ["-20%", "120%"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // Calculate normalized position (0 to 1) within the card
    const normalizedX = (e.clientX - rect.left) / width - 0.5
    const normalizedY = (e.clientY - rect.top) / height - 0.5

    x.set(normalizedX)
    y.set(normalizedY)
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        x.set(0)
        y.set(0)
      }}
      style={{
        perspective,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      {children}

      {/* Glare effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,${glareOpacity}), transparent 70%)`,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </motion.div>
  )
}
