"use client"

import { motion } from "framer-motion"
import type { Message } from "@/hooks/use-chat"
import { cn } from "@/lib/utils"
import { ProductCardMessage } from "./product-card-message"
import { ProductDetailMessage } from "./product-detail-message"
import { SearchResultsMessage } from "./search-results-message"
import type { Product } from "@/types/product"

export interface ChatMessageProps {
  message: Message
  isLast: boolean
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.role === "user"

  // Handle different message types
  const renderMessageContent = () => {
    // Check if message contains product data
    if (!isUser && message.data) {
      if (message.data.type === "products" && message.data.products?.length > 0) {
        return (
          <ProductCardMessage 
            products={message.data.products} 
            layout={message.data.layout} 
            message={message.content}
          />
        )
      }
      
      if (message.data.type === "product-detail" && message.data.product) {
        return (
          <ProductDetailMessage 
            product={message.data.product} 
            onBack={message.data.onBack}
          />
        )
      }
      
      if (message.data.type === "search-results" && message.data.products?.length > 0) {
        return (
          <SearchResultsMessage 
            products={message.data.products}
            searchTerm={message.data.searchTerm || ""}
            categories={message.data.categories}
            priceRanges={message.data.priceRanges}
            selectedFilters={message.data.selectedFilters}
          />
        )
      }
    }
    
    // Default text message
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}
      >
        <div
          className={cn(
            "max-w-[80%] rounded-2xl px-4 py-3",
            isUser ? "bg-[#28809a] text-white rounded-tr-none" : "bg-[#2A2A2A] text-[#EDEDED] rounded-tl-none",
          )}
        >
          {/* If an image was referenced, show the image (for both user and assistant) */}
          {message.data?.image_url && (
            <div className="mb-2 rounded overflow-hidden">
              <img 
                src={message.data.image_url} 
                alt="Uploaded image" 
                className="w-full max-h-40 object-contain"
              />
              {!isUser && <p className="text-xs text-[#8D9192] mt-1">Image analyzed by Cartana</p>}
            </div>
          )}
          
          <p className="text-sm whitespace-pre-line">{message.content}</p>
          
          {/* Show tools used (if any) */}
          {!isUser && message.data?.tools_used && message.data.tools_used.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {message.data.tools_used.map((tool) => (
                <span 
                  key={tool} 
                  className="inline-block px-2 py-0.5 rounded-full bg-[#1A1A1A] text-[#8D9192] text-xs"
                >
                  {tool.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-1 text-xs opacity-70">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </motion.div>
    )
  }

  return renderMessageContent()
}
