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
  tools_used?: string[]
  image_url?: string
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
  lastUploadedImage: string | null;
  toggleChat: () => void
  sendMessage: (content: string) => void
  clearMessages: () => void
  uploadImage: (file: File) => Promise<string>
}

export const ChatContext = createContext<ChatContextType>({
  isOpen: false,
  messages: [],
  isTyping: false,
  lastUploadedImage: null,
  toggleChat: () => {},
  sendMessage: () => {},
  clearMessages: () => {},
  uploadImage: async () => "",
})

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    isOpen: false,
    messages: [] as Message[],
    isTyping: false,
    sessionId: "",
    lastUploadedImage: null as string | null,
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

  // Initialize session ID from localStorage or create a new one
  useEffect(() => {
    const storedSessionId = localStorage.getItem('cartana_session_id');
    if (storedSessionId) {
      setState(prev => ({ ...prev, sessionId: storedSessionId }));
    }
  }, []);

  const toggleChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }))
  }, [])

  // Function to upload image to backend
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    try {
      setState(prev => ({ ...prev, isTyping: true }));

      const formData = new FormData();
      formData.append('image', file);
      
      if (state.sessionId) {
        formData.append('session_id', state.sessionId);
      }

      // In a real implementation, this would hit your actual API endpoint
      // const response = await fetch('/api/cartana/upload-image/', {
      //   method: 'POST',
      //   body: formData,
      // });

      // Simulate response in demo mode
      await new Promise(resolve => setTimeout(resolve, 1000));
      const imageUrl = URL.createObjectURL(file);
      
      setState(prev => ({ 
        ...prev, 
        lastUploadedImage: imageUrl,
        isTyping: false 
      }));

      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setState(prev => ({ ...prev, isTyping: false }));
      throw error;
    }
  }, [state.sessionId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: "user",
      timestamp: new Date(),
      // Add image reference to user message if it's related to an image and we have lastUploadedImage
      data: state.lastUploadedImage && 
            (content.toLowerCase().includes("image") || 
             content.toLowerCase().includes("similar") || 
             content.toLowerCase().includes("this")) ? 
        { image_url: state.lastUploadedImage } : undefined
    }

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }))

    try {
      // In a real implementation, this would call your Cartana API
      // const response = await fetch('/api/cartana/message/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     message: content,
      //     session_id: state.sessionId 
      //   }),
      // });
      // const data = await response.json();
      // const { response: responseText, session_id, tools_used } = data;

      // For demo, simulate AI response with a timeout and pattern matching
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let aiMessage: Message;
      
      // Parse intent from user message - this would normally be done by the AI
      const lowercaseContent = content.toLowerCase();
      
      // Handle image-related messages if we have a last uploaded image
      if (state.lastUploadedImage && 
          (lowercaseContent.includes("this image") || 
           lowercaseContent.includes("the image") || 
           lowercaseContent.includes("my image") ||
           lowercaseContent.includes("image") ||
           lowercaseContent.includes("uploaded image") ||
           lowercaseContent.includes("similar"))) {
        
        aiMessage = {
          id: `assistant-${Date.now()}`,
          content: `I analyzed your uploaded image and found these similar products:`,
          role: "assistant",
          timestamp: new Date(),
          data: {
            type: "products",
            products: sampleProducts.slice(0, 4),
            layout: "carousel",
            image_url: state.lastUploadedImage,
            tools_used: ["image_product_search"]
          }
        };
      }
      // Show products for product search queries
      else if (lowercaseContent.includes("show") || lowercaseContent.includes("find") || lowercaseContent.includes("search") || lowercaseContent.includes("looking for")) {
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
              layout: "carousel",
              tools_used: ["search_products"]
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
            layout: "comparison",
            tools_used: ["compare_products"]
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
            product: sampleProducts[0],
            tools_used: ["get_product_details"]
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
            ],
            tools_used: ["search_products"]
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
          "You can also upload an image, and I'll find similar products for you!"
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
      }));
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add an error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "Sorry, I encountered an error processing your request. Please try again.",
        role: "assistant", 
        timestamp: new Date(),
      };
      
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isTyping: false,
      }));
    }
  }, [state.lastUploadedImage, state.sessionId])

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
      lastUploadedImage: null,
    }))
  }, [])

  return (
    <ChatContext.Provider
      value={{
        isOpen: state.isOpen,
        messages: state.messages,
        isTyping: state.isTyping,
        lastUploadedImage: state.lastUploadedImage,
        toggleChat,
        sendMessage,
        clearMessages,
        uploadImage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
} 