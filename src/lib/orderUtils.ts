import { Product, ProductSize } from '../types'

/** Unique order ID — no collisions across tabs/devices */
export function generateOrderId(): string {
  const short = crypto.randomUUID().slice(0, 8).toUpperCase()
  // Human-readable ticket like MP-3F2A1B9C, also store numeric ticket for display fallback
  return `#MP-${short}`
}

export function nextTicketNumber(existing: { ticketNumber?: number }[]): number {
  if (existing.length === 0) return 1
  return Math.max(...existing.map((o) => o.ticketNumber ?? 0)) + 1
}

export function getDefaultSize(product: Product): ProductSize {
  if (product.prices.M !== undefined) return 'M'
  if (product.prices.L !== undefined) return 'L'
  return 'standard'
}

export function resolvePrice(product: Product, size: ProductSize): number {
  if (size === 'M' && product.prices.M !== undefined) return product.prices.M
  if (size === 'L' && product.prices.L !== undefined) return product.prices.L
  if (size === 'standard' && product.prices.standard !== undefined) return product.prices.standard
  // fallback to first available price
  return product.prices.M ?? product.prices.L ?? product.prices.standard ?? 0
}
