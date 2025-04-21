"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, ShoppingCart, Search, User, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { CartDropdown } from "@/components/layout/cart-dropdown"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { cartOpen, setCartOpen, totalItems } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      setIsProfileMenuOpen(false)
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchOpen(false)
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#252525]/90 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              className="text-[#FFFFFF] font-bold text-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[#28809a]">Any</span>commerce
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`text-[#EDEDED] hover:text-[#28809a] transition-colors relative ${
                    pathname === item.href ? "text-[#28809a]" : ""
                  }`}
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#28809a] rounded-full"
                      layoutId="underline"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <motion.button
              className="p-2 text-[#EDEDED] hover:text-[#FFFFFF] transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Cart Button */}
            <div className="relative">
            <motion.button
              className="p-2 text-[#EDEDED] hover:text-[#FFFFFF] transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              aria-label="Cart"
                onClick={() => setCartOpen(!cartOpen)}
            >
              <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#28809a] rounded-full text-xs flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
            </motion.button>
              
              <CartDropdown />
            </div>

            {/* User Button */}
            <div className="relative">
            <motion.button
              className="p-2 text-[#EDEDED] hover:text-[#FFFFFF] transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              aria-label="User Account"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <User className="w-5 h-5" />
            </motion.button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-[#252525] border border-[#8D9192]/30 rounded-md shadow-lg z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {user ? (
                      <div>
                        <div className="px-4 py-3 border-b border-[#8D9192]/30">
                          <p className="text-sm font-medium text-[#EDEDED] truncate">{user.name}</p>
                          <p className="text-xs text-[#8D9192] truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            key="profile-link"
                            href="/profile"
                            className="block px-4 py-2 text-sm text-[#EDEDED] hover:bg-[#8D9192]/10"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Profile
                          </Link>
                          <Link
                            key="orders-link"
                            href="/orders"
                            className="block px-4 py-2 text-sm text-[#EDEDED] hover:bg-[#8D9192]/10"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Orders
                          </Link>
                          <button
                            key="signout-button"
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#8D9192]/10"
                            onClick={handleLogout}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-1">
                        <Link
                          key="signin-link"
                          href="/auth/login"
                          className="block px-4 py-2 text-sm text-[#EDEDED] hover:bg-[#8D9192]/10"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Sign in
                        </Link>
                        <Link
                          key="register-link"
                          href="/auth/register"
                          className="block px-4 py-2 text-sm text-[#EDEDED] hover:bg-[#8D9192]/10"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Create account
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="p-2 text-[#EDEDED] hover:text-[#FFFFFF] transition-colors md:hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="fixed inset-0 bg-[#252525]/95 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              className="bg-[#2A2A2A] rounded-xl border border-[#8D9192]/20 shadow-lg p-6 w-full max-w-xl mx-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-[#EDEDED]">Search Products</h2>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="text-[#8D9192] hover:text-[#EDEDED] transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D9192]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full p-3 pl-10 bg-[#252525] border border-[#8D9192]/30 rounded-md text-[#EDEDED] focus:border-[#28809a] focus:ring-1 focus:ring-[#28809a]/30 focus:outline-none transition-colors"
                    autoFocus
                  />
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="px-4 py-2 text-[#8D9192] hover:text-[#EDEDED] hover:bg-[#353535] rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#28809a] hover:bg-[#28809a]/80 text-white rounded-md transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-[#252525] z-40 pt-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-8">
              <nav className="flex flex-col space-y-6">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`text-2xl font-medium ${pathname === item.href ? "text-[#28809a]" : "text-[#EDEDED]"}`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
