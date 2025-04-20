"use client"

import { createContext, useState, useContext, useEffect, ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
} | null

type AuthContextType = {
  user: User
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  forgotPassword: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already logged in on mount
  useEffect(() => {
    // In a real app, you would check for a token in localStorage or cookies
    // and validate it with your backend API
    const checkAuth = async () => {
      try {
        // Simulate an API call to check auth status
        const storedUser = localStorage.getItem("user")
        
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (err) {
        console.error("Auth check failed:", err)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // This would be an actual API call in a real application
      // Simulate login API call
      if (email === "demo@example.com" && password === "password123") {
        const userData = {
          id: "user-1",
          name: "Demo User",
          email: "demo@example.com",
        }
        
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
      } else {
        throw new Error("Invalid email or password")
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred during login")
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // This would be an actual API call in a real application
      // Simulate register API call
      const userData = {
        id: "user-" + Date.now(),
        name,
        email,
      }
      
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred during registration")
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    
    try {
      // This would be an actual API call in a real application
      // Simulate logout
      localStorage.removeItem("user")
      setUser(null)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred during logout")
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // This would be an actual API call in a real application
      // Simulate password reset request
      console.log(`Password reset requested for: ${email}`)
      // In a real app, this would send a reset link to the user's email
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        error, 
        login, 
        register, 
        logout, 
        forgotPassword 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
} 