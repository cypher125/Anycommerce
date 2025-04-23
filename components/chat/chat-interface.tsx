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
  const { 
    isOpen, 
    messages, 
    isTyping, 
    sendMessage, 
    clearMessages, 
    uploadImage,
    lastUploadedImage 
  } = useChat()
  const [inputValue, setInputValue] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Suggestions for quick replies
  const suggestions = [
    "Show me popular products",
    "What are your best sellers?",
    "I'm looking for a new laptop",
    "Help me find a gift for my friend",
    "Compare these two products",
  ]

  // Check if viewport is mobile-sized
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640); // 640px is the sm breakpoint in Tailwind
    };
    
    // Initial check
    checkIfMobile();
    
    // Add listener for resize events
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      setIsUploading(true);
      // Simulating upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);
      
      // Use the uploadImage function from ChatContext
      await uploadImage(file);
      
      // Complete the progress bar
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
      
      // Set suggested message and focus input
      const suggestedMessage = "Find products similar to this image";
      setInputValue(suggestedMessage);
      inputRef.current?.focus();
      
      // Automatically send the message after a short delay
      setTimeout(() => {
        sendMessage(suggestedMessage);
        setInputValue("");
      }, 800);
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
    
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
                : "sm:top-[50%] sm:right-6 sm:left-auto sm:bottom-auto sm:w-96 sm:-translate-y-1/2 top-auto bottom-2 right-2 left-2 w-full h-[400px]"
            } bg-[#252525] rounded-lg shadow-xl flex flex-col overflow-hidden`}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: isExpanded ? 0 : isMobile ? 0 : "-50%", 
              scale: 1 
            }}
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
                  <h3 className="text-[#FFFFFF] font-medium">Cartana</h3>
                  <p className="text-[#8D9192] text-xs">AI Shopping Assistant</p>
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
              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="h-1 w-full bg-[#1e2021] mb-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#28809a]" 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              
              {/* Last uploaded image preview */}
              {lastUploadedImage && !isUploading && (
                <div className="mb-2 flex items-center text-xs text-[#8D9192]">
                  <div className="w-5 h-5 mr-1 rounded overflow-hidden flex-shrink-0">
                    <img src={lastUploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                  </div>
                  <span>Image uploaded. Ask Cartana about this image.</span>
                </div>
              )}
              
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
                    className={`${isUploading ? 'text-[#28809a]' : 'text-[#8D9192] hover:text-[#28809a]'} transition-colors`}
                    aria-label="Upload image"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
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
                    disabled={!inputValue.trim() || isUploading}
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
