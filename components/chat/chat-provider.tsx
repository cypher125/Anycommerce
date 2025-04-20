"use client"

import { createContext, useState, useCallback, useEffect, ReactNode } from "react"
import { products as sampleProducts } from "@/data/products"
import type { Product } from "@/types/product"

export interface MessageData {
  type?: "products" | "product-detail" | "search-results"
  products?: Product[]
  product?: Product
  layout?: "grid" | "carousel" | "comparison"
  searchTerm?: string
  categories?: Array<{ name: string; count: number }>
  priceRanges?: Array<{ min: number; max: number; count: number }>
  selectedFilters?: string[]
  onBack?: () => void
}

export type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  data?: MessageData
}

type ChatContextType = {
  isOpen: boolean
  messages: Message[]
  isTyping: boolean
  toggleChat: () => void
  sendMessage: (content: string) => void
  clearMessages: () => void
}

export const ChatContext = createContext<ChatContextType>({
  isOpen: false,
  messages: [],
  isTyping: false,
  toggleChat: () => {},
  sendMessage: () => {},
  clearMessages: () => {},
})

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    isOpen: false,
    messages: [] as Message[],
    isTyping: false,
  })

  // Initialize with welcome message
  useEffect(() => {
    if (state.messages.length === 0) {
      setState((prev) => ({
        ...prev,
        messages: [
          {
            id: "welcome",
            content: "Hi there! I'm Cartana, your AI shopping assistant. How can I help you today?",
            role: "assistant",
            timestamp: new Date(),
          },
        ],
      }))
    }
  }, [state.messages.length])

  const toggleChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }))
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: "user",
      timestamp: new Date(),
    }

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }))

    // Simulate AI response (in a real app, this would call your AI service)
    setTimeout(() => {
      let aiMessage: Message;
      
      // Parse intent from user message - this would normally be done by the AI
      const lowercaseContent = content.toLowerCase();
      
      // Show products for product search queries
      if (lowercaseContent.includes("show") || lowercaseContent.includes("find") || lowercaseContent.includes("search") || lowercaseContent.includes("looking for")) {
        // Filter by category if mentioned
        const categoryTerms = ["electronics", "clothing", "beauty", "home", "kitchen"];
        const foundCategory = categoryTerms.find(term => lowercaseContent.includes(term));
        
        let filteredProducts = sampleProducts;
        if (foundCategory) {
          filteredProducts = sampleProducts.filter(p => 
            p.category.toLowerCase().includes(foundCategory)
          );
        }
        
        // Search for products
        if (filteredProducts.length > 0) {
          aiMessage = {
            id: `assistant-${Date.now()}`,
            content: `Here are some ${foundCategory || ""} products that might interest you:`,
            role: "assistant",
            timestamp: new Date(),
            data: {
              type: "products",
              products: filteredProducts.slice(0, 4),
              layout: "carousel"
            }
          };
        } else {
          aiMessage = {
            id: `assistant-${Date.now()}`,
            content: "I couldn't find any products matching your request. Could you try different search terms?",
            role: "assistant",
            timestamp: new Date(),
          };
        }
      }
      // Compare products
      else if (lowercaseContent.includes("compare")) {
        aiMessage = {
          id: `assistant-${Date.now()}`,
          content: "Here's a comparison of products you might be interested in:",
          role: "assistant",
          timestamp: new Date(),
          data: {
            type: "products",
            products: sampleProducts.slice(0, 2),
            layout: "comparison"
          }
        };
      }
      // Detailed product info
      else if (lowercaseContent.includes("detail") || lowercaseContent.includes("more info") || lowercaseContent.includes("specifications")) {
        aiMessage = {
          id: `assistant-${Date.now()}`,
          content: "Here are the details for the product you requested:",
          role: "assistant",
          timestamp: new Date(),
          data: {
            type: "product-detail",
            product: sampleProducts[0]
          }
        };
      }
      // Search results view
      else if (lowercaseContent.includes("search")) {
        const searchTerm = content.replace(/search for|search|find|show me/gi, "").trim();
        aiMessage = {
          id: `assistant-${Date.now()}`,
          content: `Here are your search results for "${searchTerm}":`,
          role: "assistant",
          timestamp: new Date(),
          data: {
            type: "search-results",
            searchTerm: searchTerm,
            products: sampleProducts.slice(0, 6),
            categories: [
              { name: "Electronics", count: 3 },
              { name: "Clothing", count: 2 },
              { name: "Home & Kitchen", count: 1 }
            ],
            priceRanges: [
              { min: 0, max: 100, count: 2 },
              { min: 100, max: 200, count: 3 },
              { min: 200, max: Infinity, count: 1 }
            ]
          }
        };
      }
      // Default text response
      else {
        const responses = [
          "I can help you find products that match your needs. What are you looking for?",
          "Would you like me to recommend some of our bestsellers?",
          "I can show you our latest arrivals if you're interested.",
          "Is there a specific category you're interested in?",
          "I can help you compare different products if you'd like.",
        ]

        aiMessage = {
          id: `assistant-${Date.now()}`,
          content: responses[Math.floor(Math.random() * responses.length)],
          role: "assistant",
          timestamp: new Date(),
        }
      }

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isTyping: false,
      }))
    }, 1500)
  }, [])

  const clearMessages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [
        {
          id: "welcome",
          content: "Hi there! I'm Cartana, your AI shopping assistant. How can I help you today?",
          role: "assistant",
          timestamp: new Date(),
        },
      ],
    }))
  }, [])

  return (
    <ChatContext.Provider
      value={{
        isOpen: state.isOpen,
        messages: state.messages,
        isTyping: state.isTyping,
        toggleChat,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
} 