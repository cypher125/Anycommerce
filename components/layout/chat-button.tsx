"use client"

import { motion } from "framer-motion"
import { MessageSquare, X } from "lucide-react"
import { useChat } from "@/hooks/use-chat"

export function ChatButton() {
  const { isOpen, toggleChat } = useChat()

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        className="w-14 h-14 rounded-full bg-[#28809a] text-white shadow-xl flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 3,
          ease: "easeInOut",
        }}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageSquare size={24} />
        )}
      </motion.button>
    </motion.div>
  )
} 