"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { MouseFollow } from "@/components/ui/mouse-follow"
import { FloatingElement } from "@/components/ui/floating-element"
import { AnimatedText } from "@/components/ui/animated-text"
import { ParticleBackground } from "@/components/ui/particle-background"

export function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
      style={{ opacity, scale, y }}
    >
      {/* Particle background */}
      <ParticleBackground
        particleColor="#28809a"
        connectionColor="#28809a"
        particleCount={80}
        particleSize={1.5}
        speed={0.3}
      />

      {/* Decorative floating elements */}
      <FloatingElement
        className="absolute top-1/4 left-1/4 w-32 h-32 opacity-20 hidden md:block"
        xFactor={30}
        yFactor={40}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#28809a] to-transparent blur-2xl" />
      </FloatingElement>

      <FloatingElement
        className="absolute bottom-1/3 right-1/5 w-40 h-40 opacity-10 hidden md:block"
        xFactor={-20}
        yFactor={30}
        delay={0.2}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tl from-[#EDEDED] to-transparent blur-3xl" />
      </FloatingElement>

      <FloatingElement
        className="absolute top-1/3 right-1/4 w-24 h-24 opacity-20 hidden md:block"
        xFactor={-15}
        yFactor={-25}
        delay={0.4}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#28809a] to-transparent blur-xl" />
      </FloatingElement>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-4 inline-block"
            >
              <span className="px-4 py-1.5 rounded-full bg-[#28809a]/20 text-[#28809a] text-sm font-medium border border-[#28809a]/30">
                AI-Powered Shopping Experience
              </span>
            </motion.div>

            <AnimatedText
              text="Discover the Future of Shopping with AI"
              el="h1"
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#FFFFFF] mb-6 leading-tight"
              animation="slide-up"
            />

            <AnimatedText
              text="Anycommerce combines cutting-edge AI technology with a seamless shopping experience to help you find exactly what you need through natural conversations."
              el="p"
              className="text-xl text-[#8D9192] mb-12 max-w-3xl mx-auto"
              animation="fade"
              delay={0.4}
            />

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <MouseFollow intensity={0.03}>
                <Link
                  href="/products"
                  className="px-8 py-4 bg-[#28809a] text-white rounded-md font-medium text-center hover:bg-[#28809a]/90 transition-colors shadow-lg shadow-[#28809a]/20 mb-4 sm:mb-0"
                >
                  Browse Products
                </Link>
              </MouseFollow>

              <MouseFollow intensity={0.03}>
                <Link
                  href="/categories"
                  className="px-8 py-4 bg-transparent border border-[#8D9192] text-[#EDEDED] rounded-md font-medium text-center hover:bg-[#8D9192]/10 transition-colors"
                >
                  View Categories
                </Link>
              </MouseFollow>
            </motion.div>
          </div>

          {/* Hero image with 3D effect */}
          <motion.div
            className="relative mx-auto max-w-4xl mt-12 sm:mt-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <MouseFollow intensity={0.02}>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-[#8D9192]/20 shadow-2xl shadow-[#28809a]/10">
                <Image
                  src="/placeholder.svg?height=1080&width=1920"
                  alt="AI Shopping Assistant"
                  width={1920}
                  height={1080}
                  className="object-cover"
                  priority
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#252525] via-transparent to-transparent opacity-70" />

                {/* Floating chat bubble */}
                <FloatingElement
                  className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 max-w-[180px] sm:max-w-xs bg-[#2A2A2A] p-3 sm:p-4 rounded-lg shadow-lg"
                  xFactor={10}
                  yFactor={10}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#28809a] flex items-center justify-center shrink-0">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#EDEDED] text-xs sm:text-sm">How can I help you find the perfect product today?</p>
                    </div>
                  </div>
                </FloatingElement>

                {/* Floating product card */}
                <FloatingElement
                  className="absolute top-4 sm:top-8 right-4 sm:right-8 w-36 sm:w-48 bg-[#2A2A2A] rounded-lg overflow-hidden shadow-lg"
                  xFactor={-15}
                  yFactor={15}
                  delay={0.2}
                >
                  <div className="h-32 bg-[#333333]"></div>
                  <div className="p-3">
                    <h3 className="text-[#FFFFFF] text-sm font-medium">Wireless Headphones</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[#28809a] text-xs font-bold">$249.99</span>
                      <span className="text-[#8D9192] text-xs line-through">$299.99</span>
                    </div>
                  </div>
                </FloatingElement>
              </div>
            </MouseFollow>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.div
          className="w-8 h-12 rounded-full border-2 border-[#8D9192] flex items-center justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
        >
          <motion.div className="w-1.5 h-3 bg-[#28809a] rounded-full" />
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
