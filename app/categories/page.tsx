"use client"

import { Header } from "@/components/layout/header"
import { ChatInterface } from "@/components/chat/chat-interface"
import { CategoriesShowcase } from "@/components/sections/categories-showcase"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { AnimatedText } from "@/components/ui/animated-text"
import { ParticleBackground } from "@/components/ui/particle-background"
import { motion } from "framer-motion"

export default function Categories() {
  return (
    <main className="min-h-screen pt-20">
      <ScrollProgress />
      <Header />

      <section className="relative py-16 overflow-hidden">
        {/* Background effects */}
        <ParticleBackground particleColor="#28809a" particleCount={40} speed={0.3} connected={true} />

        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[#28809a]/5 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-[#28809a]/10 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <AnimatedText
                text="Product Categories"
                el="h1"
                className="text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-4"
                animation="slide-up"
              />
              <AnimatedText
                text="Browse our products by category to find exactly what you need with AI-powered recommendations."
                el="p"
                className="text-xl text-[#8D9192]"
                animation="fade"
                delay={0.2}
              />
            </motion.div>

            {/* Stats section */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {[
                { label: "Categories", value: "12+" },
                { label: "Products", value: "500+" },
                { label: "Happy Customers", value: "10k+" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-[#2A2A2A] rounded-lg p-6 text-center"
                  whileHover={{ y: -5, backgroundColor: "rgba(40, 128, 154, 0.1)" }}
                  transition={{ duration: 0.3 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <motion.div
                    className="text-3xl font-bold text-[#28809a] mb-2"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-[#8D9192]">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <CategoriesShowcase />

      <ChatInterface />
    </main>
  )
}
