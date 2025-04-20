"use client"

import type { ReactNode } from "react"
import { PageTransition } from "../transitions/page-transition"

interface AnimatedLayoutProps {
  children: ReactNode
  mode?: "fade" | "slide" | "scale" | "none"
}

export function AnimatedLayout({ children, mode = "fade" }: AnimatedLayoutProps) {
  return (
    <PageTransition mode={mode} className="min-h-screen">
      {children}
    </PageTransition>
  )
}
