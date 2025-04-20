"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Header } from "@/components/layout/header"
import { AnimatedText } from "@/components/ui/animated-text"
import { ParticleBackground } from "@/components/ui/particle-background"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FloatingElement } from "@/components/ui/floating-element"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)
  const { forgotPassword } = useAuth()
  
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsSubmitting(true)
    setResetError(null)
    
    try {
      await forgotPassword(data.email)
      setIsSubmitted(true)
    } catch (error) {
      if (error instanceof Error) {
        setResetError(error.message)
      } else {
        setResetError("An error occurred. Please try again later.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <section className="relative min-h-screen py-16 flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <ParticleBackground
          particleColor="#28809a"
          particleCount={40}
          speed={0.3}
          connected={true}
        />
        
        <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-[#28809a]/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 rounded-full bg-[#28809a]/10 blur-3xl" />

        <div className="container max-w-md mx-auto px-4 relative z-10">
          <motion.div
            className="bg-[#2A2A2A] rounded-xl p-8 border border-[#8D9192]/20 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {!isSubmitted ? (
              <>
                <div className="mb-8 text-center">
                  <AnimatedText
                    text="Forgot Password"
                    el="h1"
                    className="text-3xl font-bold text-[#FFFFFF] mb-3"
                    animation="slide-up"
                  />
                  <AnimatedText
                    text="Enter your email to receive a password reset link"
                    el="p"
                    className="text-[#8D9192]"
                    animation="fade"
                    delay={0.2}
                  />
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#EDEDED]">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="bg-[#252525] border-[#8D9192]/30 text-[#EDEDED] focus:border-[#28809a] transition-colors"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full bg-[#28809a] hover:bg-[#28809a]/90 text-white font-medium py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Reset Link"}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </motion.div>
                  
                  {resetError && (
                    <p className="mt-2 text-red-500 text-sm">{resetError}</p>
                  )}
                </form>
              </>
            ) : (
              <motion.div 
                className="text-center py-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="flex justify-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                >
                  <CheckCircle2 className="h-16 w-16 text-[#28809a]" />
                </motion.div>
                
                <AnimatedText
                  text="Check Your Email"
                  el="h1"
                  className="text-2xl font-bold text-[#FFFFFF] mb-3"
                  animation="slide-up"
                />
                
                <p className="text-[#8D9192] mb-6">
                  We've sent a password reset link to your email address. 
                  Please check your inbox and follow the instructions.
                </p>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-[#28809a] hover:bg-[#28809a]/90 text-white font-medium py-3 px-6"
                  >
                    Resend Email
                  </Button>
                </motion.div>
              </motion.div>
            )}

            <div className="mt-8 text-center">
              <p className="text-[#8D9192]">
                Remember your password?{" "}
                <Link href="/auth/login" className="text-[#28809a] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Decorative floating elements */}
          <FloatingElement
            className="absolute top-10 right-5 w-20 h-20 opacity-10 hidden md:block"
            xFactor={20}
            yFactor={15}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#28809a] to-transparent blur-xl" />
          </FloatingElement>

          <FloatingElement
            className="absolute bottom-10 left-5 w-16 h-16 opacity-10 hidden md:block"
            xFactor={-10}
            yFactor={15}
            delay={0.2}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#28809a] to-transparent blur-lg" />
          </FloatingElement>
        </div>
      </section>
    </main>
  )
} 