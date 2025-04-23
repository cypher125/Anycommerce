"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/auth-provider"
import { Header } from "@/components/layout/header"
import { AnimatedText } from "@/components/ui/animated-text"
import { ParticleBackground } from "@/components/ui/particle-background"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FloatingElement } from "@/components/ui/floating-element"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const { register: registerUser } = useAuth()
  const router = useRouter()
  
  const form = useForm<Omit<RegisterFormValues, 'terms'> & { terms: boolean }>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    setIsRegistering(true)
    setRegisterError(null)
    
    try {
      await registerUser(data.name, data.email, data.password)
      router.push("/") // Redirect to home page after successful registration
    } catch (error) {
      if (error instanceof Error) {
        setRegisterError(error.message)
      } else {
        setRegisterError("An error occurred during registration")
      }
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <section className="relative min-h-screen py-16 flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <ParticleBackground
          particleColor="#28809a"
          particleCount={60}
          speed={0.3}
          connected={true}
        />
        
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[#28809a]/5 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-[#28809a]/10 blur-3xl" />

        <div className="container max-w-md mx-auto px-4 relative z-10">
          <motion.div
            className="bg-[#2A2A2A] rounded-xl p-8 border border-[#8D9192]/20 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 text-center">
              <AnimatedText
                text="Create Account"
                el="h1"
                className="text-3xl font-bold text-[#FFFFFF] mb-3"
                animation="slide-up"
              />
              <AnimatedText
                text="Join the AI-powered shopping experience"
                el="p"
                className="text-[#8D9192]"
                animation="fade"
                delay={0.2}
              />
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#EDEDED]">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="bg-[#252525] border-[#8D9192]/30 text-[#EDEDED] focus:border-[#28809a] transition-colors"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#EDEDED]">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-[#252525] border-[#8D9192]/30 text-[#EDEDED] focus:border-[#28809a] transition-colors pr-10"
                    {...form.register("password")}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D9192] hover:text-[#EDEDED]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#EDEDED]">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-[#252525] border-[#8D9192]/30 text-[#EDEDED] focus:border-[#28809a] transition-colors pr-10"
                    {...form.register("confirmPassword")}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D9192] hover:text-[#EDEDED]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 mt-1 rounded border-[#8D9192]/30 bg-[#252525] text-[#28809a] focus:ring-[#28809a]"
                    {...form.register("terms")}
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-[#EDEDED]">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#28809a] hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#28809a] hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {form.formState.errors.terms && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.terms.message}</p>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full bg-[#28809a] hover:bg-[#28809a]/90 text-white font-medium py-3"
                  disabled={isRegistering}
                >
                  {isRegistering ? "Creating Account..." : "Create Account"}
                  {!isRegistering && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </motion.div>

              {registerError && (
                <p className="mt-2 text-red-500 text-sm">{registerError}</p>
              )}
            </form>

            <div className="mt-8 text-center">
              <p className="text-[#8D9192]">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-[#28809a] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Decorative floating elements */}
          <FloatingElement
            className="absolute top-10 left-10 w-20 h-20 opacity-10 hidden md:block"
            xFactor={15}
            yFactor={20}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#28809a] to-transparent blur-xl" />
          </FloatingElement>

          <FloatingElement
            className="absolute bottom-10 right-10 w-16 h-16 opacity-10 hidden md:block"
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