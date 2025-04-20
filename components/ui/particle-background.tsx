"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ParticleBackgroundProps {
  className?: string
  particleColor?: string
  particleSize?: number
  particleCount?: number
  speed?: number
  connected?: boolean
  connectionColor?: string
  mouseInteraction?: boolean
}

export function ParticleBackground({
  className,
  particleColor = "#28809a",
  particleSize = 2,
  particleCount = 50,
  speed = 0.5,
  connected = true,
  connectionColor = "#28809a",
  mouseInteraction = true,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    const mouse = { x: 0, y: 0, radius: 100 }

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * particleSize + 1
        this.speedX = (Math.random() - 0.5) * speed
        this.speedY = (Math.random() - 0.5) * speed
      }

      update() {
        // Move particles
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX
        }

        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY
        }

        // Mouse interaction
        if (mouseInteraction) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance
            const forceDirectionY = dy / distance
            const force = (mouse.radius - distance) / mouse.radius

            const directionX = forceDirectionX * force * 2
            const directionY = forceDirectionY * force * 2

            this.speedX -= directionX
            this.speedY -= directionY
          }
        }
      }

      draw() {
        ctx.fillStyle = particleColor
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Set canvas size
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Mouse move event
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    if (mouseInteraction) {
      window.addEventListener("mousemove", handleMouseMove)
    }

    // Initialize particles
    function initParticles() {
      particles = []
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    // Connect particles with lines
    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.strokeStyle =
              connectionColor +
              Math.floor((1 - distance / 150) * 255)
                .toString(16)
                .padStart(2, "0")
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }

      if (connected) {
        connectParticles()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    initParticles()
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (mouseInteraction) {
        window.removeEventListener("mousemove", handleMouseMove)
      }
      cancelAnimationFrame(animationFrameId)
    }
  }, [particleColor, particleSize, particleCount, speed, connected, connectionColor, mouseInteraction])

  return <canvas ref={canvasRef} className={cn("absolute inset-0 -z-10", className)} />
}
