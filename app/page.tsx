import { Header } from "@/components/layout/header"
import { AnimatedHero } from "@/components/sections/animated-hero"
import { AnimatedFeatures } from "@/components/sections/animated-features"
import { FeaturedProducts } from "@/components/sections/featured-products"
import { CategoriesShowcase } from "@/components/sections/categories-showcase"
import { NewArrivals } from "@/components/sections/new-arrivals"
import { AnimatedTestimonials } from "@/components/sections/animated-testimonials"
import { AnimatedCta } from "@/components/sections/animated-cta"
import { ScrollProgress } from "@/components/ui/scroll-progress"

export default function Home() {
  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <Header />
      <AnimatedHero />
      <AnimatedFeatures />
      <FeaturedProducts />
      <CategoriesShowcase />
      <NewArrivals />
      <AnimatedTestimonials />
      <AnimatedCta />
    </main>
  )
}
