"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "@/hooks/use-chat"
import { ChatMessage } from "./chat-message"
import { TypingIndicator } from "./typing-indicator"
import { SuggestionChips } from "./suggestion-chips"
import { Send, Mic, RefreshCw, Maximize2, Minimize2, Image as ImageIcon } from "lucide-react"

export function ChatInterface() {
  const { isOpen, messages, isTyping, toggleChat, sendMessage, clearMessages } = useChat()
  const [inputValue, setInputValue] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Suggestions for quick replies
  const suggestions = [
    "What's new in store?",
    "Show me bestsellers",
    "I need help finding a gift",
    "What's on sale?",
    "Compare products",
  ]

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      sendMessage(inputValue)
      setInputValue("")
    }
  }

  const handleSuggestionSelect = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // In a real implementation, you would upload the image to your server
    // and then process it with your AI model for visual search
    
    // For now, we'll just simulate a product search based on image upload
    sendMessage("Find products similar to the image I uploaded")
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed z-[999] border border-[#8D9192]/20 ${
              isExpanded
                ? "top-[10vh] right-[10vw] left-[10vw] bottom-[10vh] w-auto h-auto"
                : "top-[50%] right-6 w-full sm:w-96 h-[400px] -translate-y-1/2"
            } bg-[#252525] rounded-lg shadow-xl flex flex-col overflow-hidden`}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: isExpanded ? 0 : "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            layout
          >
            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 border-b border-[#8D9192]/20 bg-[#2A2A2A]">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#28809a] flex items-center justify-center mr-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[#FFFFFF] font-medium">Shopping Assistant</h3>
                  <p className="text-[#8D9192] text-xs">AI-powered help</p>
                </div>
              </div>
              <div className="flex items-center">
                <motion.button
                  onClick={clearMessages}
                  className="text-[#8D9192] hover:text-[#FFFFFF] transition-colors p-2 rounded-full hover:bg-[#8D9192]/10 mr-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Reset conversation"
                >
                  <RefreshCw size={16} />
                </motion.button>
                <motion.button
                  onClick={toggleExpand}
                  className="text-[#8D9192] hover:text-[#FFFFFF] transition-colors p-2 rounded-full hover:bg-[#8D9192]/10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isExpanded ? "Minimize chat" : "Expand chat"}
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </motion.button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#252525]">
              {messages.map((message, index) => (
                <ChatMessage key={message.id} message={message} isLast={index === messages.length - 1} />
              ))}

              {/* Show suggestions after assistant's first message */}
              {messages.length === 1 && messages[0].role === "assistant" && (
                <SuggestionChips suggestions={suggestions} onSelect={handleSuggestionSelect} />
              )}

              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-[#8D9192]/20 bg-[#2A2A2A]">
              <div className="flex items-center rounded-full bg-[#252525] border border-[#8D9192]/20 px-4 py-2">
                <input
                  type="text"
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-[#EDEDED] outline-none text-sm"
                />
                <div className="flex items-center space-x-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-[#8D9192] hover:text-[#28809a] transition-colors"
                    aria-label="Upload image"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon size={18} />
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-[#8D9192] hover:text-[#28809a] transition-colors"
                    aria-label="Voice input"
                  >
                    <Mic size={18} />
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={!inputValue.trim()}
                    className="text-[#28809a] disabled:text-[#8D9192]/50 transition-colors"
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </motion.button>
                </div>
              </div>
              
              {/* Hidden file input for image upload */}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
