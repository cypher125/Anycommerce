"use client"

import { motion } from "framer-motion"

export function TypingIndicator() {
  return (
    <div className="flex w-full mb-4 justify-start">
      <div className="bg-[#2A2A2A] text-[#EDEDED] rounded-2xl rounded-tl-none px-4 py-3">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#8D9192]"
              animate={{
                y: ["0%", "-50%", "0%"],
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
