"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedText } from "@/components/ui/animated-text"
import { StarRating } from "@/components/ui/star-rating"
import { ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Fashion Enthusiast",
    image: "/placeholder.svg?height=100&width=100",
    content:
      "The AI assistant helped me find the perfect outfit for my event. It understood my style preferences and suggested items I wouldn't have found on my own!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Tech Professional",
    image: "/placeholder.svg?height=100&width=100",
    content:
      "I was skeptical about AI shopping, but Anycommerce changed my mind. The recommendations were spot-on and the checkout process was seamless.",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Interior Designer",
    image: "/placeholder.svg?height=100&width=100",
    content:
      "As a designer, I appreciate the attention to detail. The platform suggested complementary items that matched my aesthetic perfectly.",
    rating: 5,
  },
]

export function AnimatedTestimonials() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const next = () => {
    setCurrent((current + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [current, autoplay])

  return (
    <section className="py-24 bg-[#252525] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#28809a]/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#28809a]/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <AnimatedText
            text="What Our Customers Say"
            el="h2"
            className="text-3xl md:text-5xl font-bold text-[#FFFFFF] mb-4"
            animation="slide-up"
          />
          <AnimatedText
            text="Hear from shoppers who have experienced our AI-powered platform"
            el="p"
            className="text-xl text-[#8D9192] max-w-2xl mx-auto"
            animation="fade"
            delay={0.2}
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-[#2A2A2A] rounded-xl p-8 border border-[#8D9192]/10 shadow-xl"
                onMouseEnter={() => setAutoplay(false)}
                onMouseLeave={() => setAutoplay(true)}
              >
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#28809a]">
                      <Image
                        src={testimonials[current].image || "/placeholder.svg"}
                        alt={testimonials[current].name}
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <StarRating rating={testimonials[current].rating} className="mb-4" />
                    <p className="text-[#EDEDED] text-lg italic mb-6">"{testimonials[current].content}"</p>
                    <div>
                      <h4 className="text-[#FFFFFF] font-bold">{testimonials[current].name}</h4>
                      <p className="text-[#8D9192]">{testimonials[current].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <motion.button
                onClick={prev}
                className="w-12 h-12 rounded-full bg-[#2A2A2A] border border-[#8D9192]/20 flex items-center justify-center text-[#EDEDED] hover:bg-[#28809a]/20 hover:border-[#28809a]/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      current === index ? "bg-[#28809a]" : "bg-[#8D9192]/30"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <motion.button
                onClick={next}
                className="w-12 h-12 rounded-full bg-[#2A2A2A] border border-[#8D9192]/20 flex items-center justify-center text-[#EDEDED] hover:bg-[#28809a]/20 hover:border-[#28809a]/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
