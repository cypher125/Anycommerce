import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ChatProvider } from "@/components/chat/chat-provider"
import { ChatButton } from "@/components/layout/chat-button"
import { ChatInterface } from "@/components/chat/chat-interface"
import { AuthProvider } from "@/components/auth-provider"
import { CartProvider } from "@/components/cart-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Anycommerce - AI-Powered Shopping",
  description: "Shop smarter with our AI-powered ecommerce platform",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#252525] text-white`}>
        <AuthProvider>
          <CartProvider>
            <ChatProvider>
              {children}
              <ChatButton />
              <ChatInterface />
            </ChatProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
