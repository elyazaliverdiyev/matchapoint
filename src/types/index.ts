export type ProductCategory = 'matcha' | 'bakery' | 'coffee_tea'

export type ProductSize = 'M' | 'L' | 'standard'

export type PaymentMethod = 'nfc_tap' | 'qr_m10' | 'pos_cash'

export type OrderStatus = 'pending_payment' | 'paid' | 'preparing' | 'ready' | 'completed' | 'cancelled'

export interface IngredientSatellite {
  name: string
  emoji: string
  posClass: string
}

export interface CupVisualLayer {
  topColor: string
  midColor: string
  bottomColor: string
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

export interface Order {
  id: string // e.g. "MP-07"
  ticketNumber: number
  createdAt: string
  customerName: string
  phone?: string
  orderType: 'takeaway' | 'dinein'
  paymentMethod: PaymentMethod
  items: CartItem[]
  totalAmount: number
  status: OrderStatus
  estimatedMinutes: number
  notes?: string
}

export interface TelegramPost {
  id: string
  timestamp: string
  author: string
  text: string
  badge?: string
  isUrgent?: boolean
}
