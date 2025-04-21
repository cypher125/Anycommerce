"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type Animation = "fade-in" | "slide-up" | "slide-down" | "slide-left" | "slide-right"

interface AnimatedTextProps {
  text: string
  el?: keyof JSX.IntrinsicElements
  className?: string
  animation?: Animation
  delay?: number
  duration?: number
  once?: boolean
  children?: ReactNode
}

const animations = {
  "fade-in": {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  "slide-up": {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  "slide-down": {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  "slide-left": {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  },
  "slide-right": {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  }
}

export function AnimatedText({
  text,
  el = "p",
  className,
  animation = "fade-in",
  delay = 0,
  duration = 0.3,
  once = true,
  children
}: AnimatedTextProps) {
  const Element = motion[el as keyof typeof motion]
  
  const animationConfig = animations[animation]
  
  return (
    <Element
      initial={animationConfig.initial}
      animate={animationConfig.animate}
      exit={animationConfig.exit}
      transition={{ 
        duration, 
        delay,
        ease: "easeOut"
      }}
      viewport={{ once }}
      className={cn(className)}
    >
      {text}
      {children}
    </Element>
  )
} 