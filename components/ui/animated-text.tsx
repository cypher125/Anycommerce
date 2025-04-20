"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"
import type { JSX } from "react"

type AnimatedTextProps = {
  text: string | string[]
  el?: keyof JSX.IntrinsicElements
  className?: string
  once?: boolean
  repeatDelay?: number
  animation?: "typewriter" | "fade" | "slide-up" | "bounce"
  delay?: number
}

const defaultAnimations = {
  typewriter: {
    hidden: { opacity: 0, y: 0 },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  bounce: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 12 } },
  },
}

export const AnimatedText = ({
  text,
  el: Wrapper = "p",
  className,
  once = true,
  repeatDelay = 0,
  animation = "fade",
  delay = 0,
}: AnimatedTextProps) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.1,
  })

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const show = () => {
      controls.start("visible")
      if (repeatDelay) {
        timeout = setTimeout(async () => {
          await controls.start("hidden")
          controls.start("visible")
        }, repeatDelay)
      }
    }

    if (inView) {
      show()
    } else {
      controls.start("hidden")
    }

    return () => clearTimeout(timeout)
  }, [controls, inView, repeatDelay])

  const getAnimations = () => {
    return defaultAnimations[animation]
  }

  const animations = getAnimations()

  const renderWords = () => {
    const words = Array.isArray(text) ? text : [text]
    return (
      <motion.span
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {},
        }}
        aria-hidden
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={{
              hidden: { ...animations.hidden, transition: { duration: 0.5 } },
              visible: {
                ...animations.visible,
                transition: { duration: 0.5, delay: delay + i * 0.1 },
              },
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.span>
    )
  }

  return <Wrapper className={cn("", className)}>{renderWords()}</Wrapper>
}
