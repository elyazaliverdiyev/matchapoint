export type ProductCategory = 'matcha' | 'bakery' | 'coffee_tea'

export type ProductSize = 'M' | 'L' | 'standard'

export interface IngredientSatellite {
  name: string
  emoji: string
  posClass: string // e.g. "top-4 left-4"
}

export interface CupVisualLayer {
  topColor: string // matcha foam/whisk
  midColor: string // milk/swirl
  bottomColor: string // puree/syrup/boba
  hasBoba?: boolean
  topPercent: number
  midPercent: number
  bottomPercent: number
}

export interface Product {
  id: string
  name: string
  category: ProductCategory
  subtitle: string
  description: string
  prices: {
    M?: number
    L?: number
    standard?: number
  }
  tag?: string
  isHero?: boolean
  ingredients?: IngredientSatellite[]
  cupVisual?: CupVisualLayer
  image?: string
}

export interface CartItem {
  id: string
  productId: string
  name: string
  size: ProductSize
  price: number
  quantity: number
}

export interface TelegramPost {
  id: string
  timestamp: string
  author: string
  text: string
  badge?: string
  isUrgent?: boolean
}
