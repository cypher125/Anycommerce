"use client"

import type { ReactNode } from "react"
import { AnimatedLayout } from "@/components/layout/animated-layout"

export default function Template({ children }: { children: ReactNode }) {
  return <AnimatedLayout mode="slide">{children}</AnimatedLayout>
}
