"use client"

import { Header } from "@/components/layout/header"
import { ChatInterface } from "@/components/chat/chat-interface"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { AnimatedText } from "@/components/ui/animated-text"
import { ParticleBackground } from "@/components/ui/particle-background"
import { motion } from "framer-motion"
import { TiltCard } from "@/components/ui/tilt-card"
import { Github, Linkedin, Mail, Globe } from "lucide-react"
import Image from "next/image"

export default function About() {
  const developers = [
    {
      name: "Alex Chen",
      role: "Frontend Developer",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Alex is a passionate frontend developer with expertise in React, Next.js, and animation libraries like Framer Motion. With 5+ years of experience building interactive user interfaces, Alex focuses on creating engaging and accessible web experiences.",
      skills: ["React", "Next.js", "TypeScript", "Framer Motion", "Tailwind CSS", "UI/UX Design"],
      social: {
        github: "https://github.com/alexchen",
        linkedin: "https://linkedin.com/in/alexchen",
        email: "alex@anycommerce.com",
        website: "https://alexchen.dev",
      },
    },
    {
      name: "Jordan Taylor",
      role: "Backend Developer",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Jordan is a skilled backend developer specializing in AI integration, database architecture, and API development. With a background in machine learning and natural language processing, Jordan brings powerful AI capabilities to the Anycommerce platform.",
      skills: ["Node.js", "Python", "AI/ML", "Database Design", "API Development", "Cloud Architecture"],
      social: {
        github: "https://github.com/jordantaylor",
        linkedin: "https://linkedin.com/in/jordantaylor",
        email: "jordan@anycommerce.com",
        website: "https://jordantaylor.dev",
      },
    },
  ]

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
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <AnimatedText
                text="About Anycommerce"
                el="h1"
                className="text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-4"
                animation="slide-up"
              />
              <AnimatedText
                text="Revolutionizing online shopping with AI-powered assistance"
                el="p"
                className="text-xl text-[#8D9192]"
                animation="fade"
                delay={0.2}
              />
            </motion.div>

            {/* App Description */}
            <motion.div
              className="mb-20 bg-[#2A2A2A] rounded-xl p-8 border border-[#8D9192]/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-[#FFFFFF] mb-4">Our Mission</h2>
              <p className="text-[#EDEDED] mb-6">
                Anycommerce is an AI-powered e-commerce platform designed to transform the online shopping experience.
                By combining cutting-edge artificial intelligence with a user-friendly interface, we're making shopping
                more intuitive, personalized, and enjoyable.
              </p>

              <h2 className="text-2xl font-bold text-[#FFFFFF] mb-4">The Problem We're Solving</h2>
              <p className="text-[#EDEDED] mb-6">
                Traditional e-commerce platforms often overwhelm shoppers with too many options and limited guidance.
                Finding the right product can be time-consuming and frustrating, leading to abandoned carts and
                unsatisfied customers. Additionally, most platforms lack personalized assistance that understands
                individual preferences and needs.
              </p>

              <h2 className="text-2xl font-bold text-[#FFFFFF] mb-4">Our Solution</h2>
              <p className="text-[#EDEDED] mb-6">
                Anycommerce addresses these challenges through our innovative AI shopping assistant that provides:
              </p>

              <ul className="list-disc pl-6 mb-6 text-[#EDEDED] space-y-2">
                <li>
                  <span className="font-medium text-[#28809a]">Conversational Shopping:</span> Interact naturally with
                  our AI to find products that match your specific needs and preferences.
                </li>
                <li>
                  <span className="font-medium text-[#28809a]">Personalized Recommendations:</span> Receive tailored
                  product suggestions based on your browsing history, preferences, and conversation context.
                </li>
                <li>
                  <span className="font-medium text-[#28809a]">Simplified Decision-Making:</span> Get detailed product
                  comparisons and honest advice to help you make informed purchasing decisions.
                </li>
                <li>
                  <span className="font-medium text-[#28809a]">24/7 Assistance:</span> Shop with confidence knowing
                  expert help is always available, day or night.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-[#FFFFFF] mb-4">Our Technology</h2>
              <p className="text-[#EDEDED]">
                Anycommerce leverages state-of-the-art natural language processing, machine learning, and a responsive
                frontend to create a seamless shopping experience. Our platform continuously learns from interactions to
                improve recommendations and better understand customer needs, making each shopping experience better
                than the last.
              </p>
            </motion.div>

            {/* Team Section */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-[#FFFFFF] mb-8 text-center">Meet Our Team</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {developers.map((developer, index) => (
                  <motion.div
                    key={developer.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
                  >
                    <TiltCard className="bg-[#2A2A2A] rounded-xl overflow-hidden border border-[#8D9192]/10">
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#28809a]/20 flex-shrink-0">
                            <Image
                              src={developer.image || "/placeholder.svg"}
                              alt={developer.name}
                              width={128}
                              height={128}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-[#FFFFFF] mb-1">{developer.name}</h3>
                            <p className="text-[#28809a] font-medium mb-3">{developer.role}</p>
                            <p className="text-[#EDEDED] mb-4">{developer.bio}</p>

                            <h4 className="text-sm font-medium text-[#FFFFFF] mb-2">Skills & Expertise</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {developer.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-1 bg-[#28809a]/10 text-[#28809a] text-xs rounded-md"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>

                            <div className="flex gap-3">
                              <a
                                href={developer.social.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#8D9192] hover:text-[#FFFFFF] transition-colors"
                                aria-label={`${developer.name}'s GitHub`}
                              >
                                <Github size={18} />
                              </a>
                              <a
                                href={developer.social.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#8D9192] hover:text-[#FFFFFF] transition-colors"
                                aria-label={`${developer.name}'s LinkedIn`}
                              >
                                <Linkedin size={18} />
                              </a>
                              <a
                                href={`mailto:${developer.social.email}`}
                                className="text-[#8D9192] hover:text-[#FFFFFF] transition-colors"
                                aria-label={`Email ${developer.name}`}
                              >
                                <Mail size={18} />
                              </a>
                              <a
                                href={developer.social.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#8D9192] hover:text-[#FFFFFF] transition-colors"
                                aria-label={`${developer.name}'s Website`}
                              >
                                <Globe size={18} />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h2 className="text-2xl font-bold text-[#FFFFFF] mb-4">Get In Touch</h2>
              <p className="text-[#EDEDED] mb-6">
                Have questions about Anycommerce or interested in learning more? We'd love to hear from you!
              </p>
              <motion.a
                href="mailto:info@anycommerce.com"
                className="inline-block px-6 py-3 bg-[#28809a] text-white rounded-md font-medium hover:bg-[#28809a]/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      <ChatInterface />
    </main>
  )
}
