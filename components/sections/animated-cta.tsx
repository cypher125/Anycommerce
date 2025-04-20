"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MouseFollow } from "@/components/ui/mouse-follow"
import { FloatingElement } from "@/components/ui/floating-element"
import { AnimatedText } from "@/components/ui/animated-text"

export function AnimatedCta() {
  return (
    <section className="py-24 bg-[#28809a] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 8%)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating elements */}
      <FloatingElement className="absolute top-1/4 left-1/4 w-40 h-40 opacity-20" xFactor={30} yFactor={20}>
        <div className="w-full h-full rounded-full bg-white blur-3xl" />
      </FloatingElement>

      <FloatingElement
        className="absolute bottom-1/4 right-1/4 w-60 h-60 opacity-10"
        xFactor={-20}
        yFactor={30}
        delay={0.3}
      >
        <div className="w-full h-full rounded-full bg-white blur-3xl" />
      </FloatingElement>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedText
            text="Ready to Revolutionize Your Shopping Experience?"
            el="h2"
            className="text-3xl md:text-5xl font-bold text-white mb-6"
            animation="slide-up"
          />
          <AnimatedText
            text="Join thousands of satisfied customers who have transformed the way they shop online."
            el="p"
            className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
            animation="fade"
            delay={0.2}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <MouseFollow intensity={0.02}>
              <Link
                href="/products"
                className="px-8 py-4 bg-white text-[#28809a] rounded-md font-medium hover:bg-white/90 transition-colors shadow-lg"
              >
                Shop Now
              </Link>
            </MouseFollow>
            <MouseFollow intensity={0.02}>
              <Link
                href="/categories"
                className="px-8 py-4 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </MouseFollow>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
