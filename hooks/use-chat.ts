"use client"

import { useContext } from "react"
import { ChatContext } from "@/components/chat/chat-provider"

export type { Message, MessageData } from "@/components/chat/chat-provider"

export function useChat() {
  const context = useContext(ChatContext)
  
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  
  return context
}
