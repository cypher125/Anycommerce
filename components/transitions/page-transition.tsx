"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { type ReactNode, useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"

interface PageTransitionProps {
  children: ReactNode
  className?: string
  mode?: "fade" | "slide" | "scale" | "none"
}

export function PageTransition({ children, className = "", mode = "fade" }: PageTransitionProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    // Skip animation on first render
    const timer = setTimeout(() => {
      setIsFirstRender(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // If user prefers reduced motion or it's first render, don't animate
  const shouldAnimate = !prefersReducedMotion && !isFirstRender

  // Define animation variants based on mode
  const getVariants = () => {
    if (!shouldAnimate) return { initial: {}, animate: {}, exit: {} }

    switch (mode) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: {
            opacity: 1,
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          },
          exit: {
            opacity: 0,
            transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
          },
        }
      case "slide":
        return {
          initial: { opacity: 0, y: 20 },
          animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          },
          exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
          },
        }
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          },
          exit: {
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
          },
        }
      default:
        return { initial: {}, animate: {}, exit: {} }
    }
  }

  const variants = getVariants()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
