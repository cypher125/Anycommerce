"use client"

import { motion } from "framer-motion"

interface SuggestionChipsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
}

export function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-4">
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className="bg-[#2A2A2A] text-[#EDEDED] px-3 py-1.5 rounded-full text-xs border border-[#8D9192]/20 hover:bg-[#28809a]/10 hover:border-[#28809a]/30 transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {suggestion}
        </motion.button>
      ))}
    </div>
  )
}
