export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  rating: number
  reviewCount: number
  images: string[]
  category: string
  tags: string[]
  inStock: boolean
  featured?: boolean
  new?: boolean
  colors?: string[]
  sizes?: string[]
}

export interface ProductCategory {
  id: string
  name: string
  description: string
  image: string
  productCount: number
}
