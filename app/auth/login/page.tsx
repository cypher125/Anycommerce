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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const { login } = useAuth()
  const router = useRouter()
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoggingIn(true)
    setLoginError(null)
    
    try {
      await login(data.email, data.password)
      router.push("/") // Redirect to home page after successful login
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(error.message)
      } else {
        setLoginError("An error occurred during login")
      }
    } finally {
      setIsLoggingIn(false)
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
        
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#28809a]/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#28809a]/10 blur-3xl" />

        <div className="container max-w-md mx-auto px-4 relative z-10">
          <motion.div
            className="bg-[#2A2A2A] rounded-xl p-8 border border-[#8D9192]/20 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 text-center">
              <AnimatedText
                text="Welcome Back"
                el="h1"
                className="text-3xl font-bold text-[#FFFFFF] mb-3"
                animation="slide-up"
              />
              <AnimatedText
                text="Sign in to your account to continue"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-[#8D9192]/30 bg-[#252525] text-[#28809a] focus:ring-[#28809a]"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-[#EDEDED]">
                    Remember me
                  </label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-[#28809a] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full bg-[#28809a] hover:bg-[#28809a]/90 text-white font-medium py-3"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Signing In..." : "Sign In"}
                  {!isLoggingIn && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </motion.div>

              {loginError && (
                <p className="mt-2 text-red-500 text-sm">{loginError}</p>
              )}
            </form>


            <div className="mt-8 text-center">
              <p className="text-[#8D9192]">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-[#28809a] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Decorative floating elements */}
          <FloatingElement
            className="absolute top-10 right-10 w-20 h-20 opacity-10 hidden md:block"
            xFactor={20}
            yFactor={20}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#28809a] to-transparent blur-xl" />
          </FloatingElement>

          <FloatingElement
            className="absolute bottom-10 left-10 w-16 h-16 opacity-10 hidden md:block"
            xFactor={-15}
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