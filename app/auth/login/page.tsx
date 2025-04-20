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

            <div className="mt-8">
              <div className="relative">
                <Separator className="bg-[#8D9192]/20" />
                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-[#2A2A2A] text-[#8D9192] text-sm">
                  Or continue with
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center px-4 py-2 border border-[#8D9192]/30 rounded-md hover:bg-[#252525] transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center px-4 py-2 border border-[#8D9192]/30 rounded-md hover:bg-[#252525] transition-colors"
                >
                  <svg className="h-5 w-5 mr-2 text-[#EDEDED] fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                  </svg>
                  GitHub
                </motion.button>
              </div>
            </div>

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