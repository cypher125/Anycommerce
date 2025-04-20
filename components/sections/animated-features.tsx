"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { TiltCard } from "@/components/ui/tilt-card"
import { AnimatedText } from "@/components/ui/animated-text"
import { ShoppingBag, MessageSquare, Search, Zap, Heart, Sparkles } from "lucide-react"

const features = [
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Conversational Shopping",
    description: "Shop through natural conversations with our AI assistant that understands your preferences.",
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Smart Search",
    description: "Find products instantly with our AI-powered search that understands natural language queries.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Personalized Recommendations",
    description: "Get tailored product suggestions based on your browsing history and preferences.",
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: "Seamless Checkout",
    description:
      "Complete your purchase in seconds with our streamlined checkout process and multiple payment options.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Wishlist & Favorites",
    description: "Save products you love for later and get notified about price drops and availability.",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Exclusive Deals",
    description: "Access personalized deals and promotions tailored to your shopping preferences.",
  },
]

export function AnimatedFeatures() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section ref={containerRef} className="py-24 bg-[#2A2A2A] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#252525] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#252525] to-transparent" />

      {/* Floating background elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#28809a]/5 blur-3xl"
        style={{ y, x: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#28809a]/10 blur-3xl"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [100, -100]),
          x: useTransform(scrollYProgress, [0, 1], [50, -50]),
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <AnimatedText
            text="Intelligent Features"
            el="h2"
            className="text-3xl md:text-5xl font-bold text-[#FFFFFF] mb-4"
            animation="slide-up"
          />
          <AnimatedText
            text="Discover how our AI-powered platform enhances your shopping experience"
            el="p"
            className="text-xl text-[#8D9192] max-w-2xl mx-auto"
            animation="fade"
            delay={0.2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TiltCard className="h-full bg-[#252525] rounded-xl p-6 border border-[#8D9192]/10">
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 rounded-lg bg-[#28809a]/20 flex items-center justify-center text-[#28809a] mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#FFFFFF] mb-2">{feature.title}</h3>
                  <p className="text-[#8D9192] flex-grow">{feature.description}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
