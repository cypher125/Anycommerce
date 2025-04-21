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
      name: "Osawaye Cyrus",
      role: "Frontend Developer",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Osawaye is a full stack developer with 4 years of experience. With expertise in UI/UX design, Next.js, and TailwindCSS, he combines technical skills with an eye for user experience. His knowledge in AI, Django, and machine learning allows him to create sophisticated yet accessible web applications.",
      skills: ["UI/UX", "Next.js", "TailwindCSS", "AI", "Django", "Python", "Machine Learning", "Web Automation", "Pentesting", "Software Engineering"],
      social: {
        github: "https://github.com/osawaecyrus",
        linkedin: "https://linkedin.com/in/osawaecyrus",
        email: "osawaye@anycommerce.com",
        website: "https://osawaecyrus.dev",
      },
    },
    {
      name: "Pelumi Faith",
      role: "Backend Developer",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Pelumi is a full stack developer with 4 years of experience specializing in backend technologies. With strong skills in .NET, C#, and Python, she brings robust engineering capabilities to the Anycommerce platform. Her expertise in machine learning adds intelligence to our software architecture.",
      skills: [".NET", "C#", "Python", "Machine Learning", "Software Engineering", "Database Design", "API Development"],
      social: {
        github: "https://github.com/pelumifaith",
        linkedin: "https://linkedin.com/in/pelumifaith",
        email: "pelumi@anycommerce.com",
        website: "https://pelumifaith.dev",
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
                AnyCommerce is an AI-powered multi-modal e-commerce platform designed to transform online shopping through text, voice, and image interactions. Powered by our intelligent shopping assistant Cartana, we make shopping more intuitive, personalized, and enjoyable through advanced AI understanding and interaction.
              </p>

              <h2 className="text-2xl font-bold text-[#FFFFFF] mb-4">The Problem We're Solving</h2>
              <p className="text-[#EDEDED] mb-6">
                Traditional e-commerce platforms often overwhelm shoppers with too many options, limited search capabilities, and minimal guidance. Finding the right product becomes time-consuming and frustrating when relying solely on text search and manual filtering, leading to abandoned carts and unsatisfied customers.
              </p>

              <h2 className="text-2xl font-bold text-[#FFFFFF] mb-4">Our Solution</h2>
              <p className="text-[#EDEDED] mb-6">
                AnyCommerce addresses these challenges through Cartana, our innovative AI shopping assistant that provides:
              </p>

              <ul className="list-disc pl-6 mb-6 text-[#EDEDED] space-y-2">
                <li>
                  <span className="font-medium text-[#28809a]">Multi-Modal Shopping:</span> Interact with Cartana through text, voice, or image uploads to find exactly what you need.
                </li>
                <li>
                  <span className="font-medium text-[#28809a]">Natural Language Understanding:</span> Simply describe what you're looking for in everyday language—Cartana understands intent and context.
                </li>
                <li>
                  <span className="font-medium text-[#28809a]">Personalized Recommendations:</span> Receive tailored product suggestions based on your preferences, history, and conversational context.
                </li>
                <li>
                  <span className="font-medium text-[#28809a]">Seamless Order Management:</span> Check orders, track deliveries, and reorder favorite products through simple conversations.
                </li>
                <li>
                  <span className="font-medium text-[#28809a]">24/7 Intelligent Assistance:</span> Shop with confidence knowing expert AI help is always available to guide your decisions.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-[#FFFFFF] mb-4">Our Technology</h2>
              <p className="text-[#EDEDED] mb-6">
                AnyCommerce leverages state-of-the-art technologies to create a seamless shopping experience:
              </p>
              
              <ul className="list-disc pl-6 mb-6 text-[#EDEDED] space-y-2">
                <li>
                  <span className="font-medium text-[#28809a]">Frontend:</span> Next.js, TypeScript, and TailwindCSS for a responsive and accessible user interface.
                </li>
                <li>
                  <span className="font-medium text-[#28809a]">Backend:</span> .NET Web API providing robust service architecture.
                </li>
                <li>
                  <span className="font-medium text-[#28809a]">Database:</span> PostgreSQL with pgvector extension for AI-driven search and matching.
                </li>
                <li>
                  <span className="font-medium text-[#28809a]">AI Model:</span> Powered by GPT-4o via OpenAI API for natural language understanding and reasoning.
                </li>
                <li>
                  <span className="font-medium text-[#28809a]">Hybrid Chat Interface:</span> A conversational UI that combines form actions with assistant interaction.
                </li>
              </ul>
              
              <p className="text-[#EDEDED]">
                Our platform continuously learns from interactions to improve recommendations and better understand customer needs, making each shopping experience better than the last. With vector search capabilities in our database, we can match products semantically to natural language descriptions, finding exactly what you're looking for even when you don't know the exact terms.
              </p>
            </motion.div>

            {/* Cartana Capabilities Section */}
            <motion.div
              className="mb-20 bg-[#2A2A2A] rounded-xl p-8 border border-[#8D9192]/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <h2 className="text-2xl font-bold text-[#FFFFFF] mb-4 flex items-center">
                <span className="inline-flex mr-3 w-8 h-8 rounded-full bg-[#28809a]/20 items-center justify-center">
                  <span className="w-4 h-4 rounded-full bg-[#28809a] animate-pulse"></span>
                </span>
                What Cartana Can Do For You
              </h2>
              
              <p className="text-[#EDEDED] mb-6">
                Our AI shopping assistant Cartana is designed to make your shopping experience effortless and enjoyable. Here's how Cartana can help you:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <TiltCard className="bg-[#28809a]/5 rounded-xl overflow-hidden border border-[#28809a]/20 p-6">
                  <h3 className="text-xl font-bold text-[#FFFFFF] mb-3">Product Discovery</h3>
                  <ul className="space-y-2 text-[#EDEDED]">
                    <li className="flex items-start">
                      <span className="text-[#28809a] mr-2">•</span>
                      <span>"Find black sneakers under $70 in size 42"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#28809a] mr-2">•</span>
                      <span>"Show me lightweight waterproof running shoes"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#28809a] mr-2">•</span>
                      <span>"Find products similar to this" (with image upload)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#28809a] mr-2">•</span>
                      <span>"Compare these two laptops for me"</span>
                    </li>
                  </ul>
                </TiltCard>
                
                <TiltCard className="bg-[#28809a]/5 rounded-xl overflow-hidden border border-[#28809a]/20 p-6">
                  <h3 className="text-xl font-bold text-[#FFFFFF] mb-3">Shopping Assistance</h3>
                  <ul className="space-y-2 text-[#EDEDED]">
                    <li className="flex items-start">
                      <span className="text-[#28809a] mr-2">•</span>
                      <span>"Add this to my cart"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#28809a] mr-2">•</span>
                      <span>"Remove the red shirt from my cart"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#28809a] mr-2">•</span>
                      <span>"What's in my cart?"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#28809a] mr-2">•</span>
                      <span>"Calculate my total with shipping"</span>
                    </li>
                  </ul>
                </TiltCard>
                
                <TiltCard className="bg-[#28809a]/5 rounded-xl overflow-hidden border border-[#28809a]/20 p-6">
                  <h3 className="text-xl font-bold text-[#FFFFFF] mb-3">Order Management</h3>
                  <ul className="space-y-2 text-[#EDEDED]">
                    <li className="flex items-start">
                      <span className="text-[#28809a] mr-2">•</span>
                      <span>"Track my order from last week"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#28809a] mr-2">•</span>
                      <span>"Reorder my last pack of Nescafe"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#28809a] mr-2">•</span>
                      <span>"Cancel my recent order"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#28809a] mr-2">•</span>
                      <span>"Show me my order history"</span>
                    </li>
                  </ul>
                </TiltCard>
                
                <TiltCard className="bg-[#28809a]/5 rounded-xl overflow-hidden border border-[#28809a]/20 p-6">
                  <h3 className="text-xl font-bold text-[#FFFFFF] mb-3">Personalization</h3>
                  <ul className="space-y-2 text-[#EDEDED]">
                    <li className="flex items-start">
                      <span className="text-[#28809a] mr-2">•</span>
                      <span>"Set a price alert for this TV when under $500"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#28809a] mr-2">•</span>
                      <span>"Show me products I might like"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#28809a] mr-2">•</span>
                      <span>"Are there any discount codes available for me?"</span>
                    </li>
                  </ul>
                </TiltCard>
              </div>
              
              <div className="bg-[#28809a]/10 rounded-lg p-4 border border-[#28809a]/20">
                <p className="text-[#EDEDED] text-center italic">
                  Simply type, speak, or upload an image—Cartana understands and takes action immediately.
                </p>
              </div>
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
