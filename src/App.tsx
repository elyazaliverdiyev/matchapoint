import React, { useState, useEffect } from 'react'
import { PRODUCTS } from './data/menu'
import { TELEGRAM_POSTS } from './data/telegramFeed'
import { Product, ProductSize, CartItem } from './types'
import { Navbar } from './components/Navbar'
import { HeroStage } from './components/HeroStage'
import { TelegramLiveTicker } from './components/TelegramLiveTicker'
import { MenuSection } from './components/MenuSection'
import { WoltHighlight } from './components/WoltHighlight'
import { LocationHours } from './components/LocationHours'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { BaristaStopListModal } from './components/BaristaStopListModal'
import { AddToHomeScreenModal } from './components/AddToHomeScreenModal'

export const App: React.FC = () => {
  // Hero selection state
  const heroDrinks = PRODUCTS.filter((p) => p.isHero)
  const [activeDrink, setActiveDrink] = useState<Product>(heroDrinks[0] || PRODUCTS[0])

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mp_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Barista Stop-List state persisted to localStorage
  const [soldOutIds, setSoldOutIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mp_stop_list')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Modals state
  const [cartOpen, setCartOpen] = useState(false)
  const [stopListOpen, setStopListOpen] = useState(false)
  const [a2hsOpen, setA2hsOpen] = useState(false)

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('mp_cart', JSON.stringify(cart))
    } catch (e) {
      console.error('Failed to save cart to localStorage', e)
    }
  }, [cart])

  // Persist stop list
  useEffect(() => {
    try {
      localStorage.setItem('mp_stop_list', JSON.stringify(soldOutIds))
    } catch (e) {
      console.error('Failed to save stop-list to localStorage', e)
    }
  }, [soldOutIds])

  // Check if store is currently open (Wed=3, Sat=6, Sun=0, between 14:00 and 21:00 Baku time UTC+4)
  const checkStoreOpen = (): boolean => {
    const now = new Date()
    // Baku is UTC+4
    const utcHours = now.getUTCHours()
    const bakuHours = (utcHours + 4) % 24
    const day = now.getUTCDay()
    const isOpenDay = day === 3 || day === 6 || day === 0 // Wed, Sat, Sun
    return isOpenDay && bakuHours >= 14 && bakuHours < 21
  }

  const isStoreOpen = checkStoreOpen()

  // Add to cart handler
  const handleAddToCart = (product: Product, size: ProductSize) => {
    if (soldOutIds.includes(product.id)) return

    const price = size === 'M'
      ? (product.prices.M ?? 0)
      : size === 'L'
      ? (product.prices.L ?? 0)
      : (product.prices.standard ?? 0)

    const compositeId = `${product.id}-${size}`

    setCart((prev) => {
      const existing = prev.find((item) => item.id === compositeId)
      if (existing) {
        return prev.map((item) =>
          item.id === compositeId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [
        ...prev,
        {
          id: compositeId,
          productId: product.id,
          name: product.name,
          size,
          price,
          quantity: 1,
        },
      ]
    })
  }

  // Update item quantity in cart
  const handleUpdateQuantity = (compositeId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === compositeId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const handleRemoveItem = (compositeId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== compositeId))
  }

  const handleClearCart = () => {
    setCart([])
  }

  // Barista stop-list toggle
  const handleToggleSoldOut = (productId: string) => {
    setSoldOutIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const handleResetStopList = () => {
    setSoldOutIds([])
  }

  const isSoldOut = (productId: string) => soldOutIds.includes(productId)

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-[#0B1509] text-[#FAF6EE] selection:bg-[#7E9C72] selection:text-[#0B1509] relative">
      
      {/* ── STICKY TOP NAVBAR ── */}
      <Navbar
        cartCount={cartTotalCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenStopList={() => setStopListOpen(true)}
        isStoreOpen={isStoreOpen}
      />

      <main>
        {/* ── 1. KUMO + MIDORI SYNTHESIS HERO STAGE ── */}
        <HeroStage
          heroDrinks={heroDrinks}
          activeDrink={activeDrink}
          onSelectDrink={(drink) => setActiveDrink(drink)}
          onAddToCart={handleAddToCart}
          isSoldOut={isSoldOut}
        />

        {/* ── 2. LIVE TELEGRAM BROADCAST STRIP ── */}
        <TelegramLiveTicker posts={TELEGRAM_POSTS} />

        {/* ── 3. FULL EDITORIAL MENU SECTION ── */}
        <MenuSection
          products={PRODUCTS}
          onAddToCart={handleAddToCart}
          isSoldOut={isSoldOut}
        />

        {/* ── 4. WOLT DELIVERY & SURPRISE BOX SPOTLIGHT ── */}
        <WoltHighlight />

        {/* ── 5. LOCATION, SCHEDULE & MAP ── */}
        <LocationHours />
      </main>

      {/* ── 6. BRAND FOOTER ── */}
      <Footer />

      {/* ── MODALS & DRAWERS ── */}
      {cartOpen && (
        <CartDrawer
          items={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onClose={() => setCartOpen(false)}
        />
      )}

      {stopListOpen && (
        <BaristaStopListModal
          products={PRODUCTS}
          soldOutIds={soldOutIds}
          onToggleSoldOut={handleToggleSoldOut}
          onResetStopList={handleResetStopList}
          onClose={() => setStopListOpen(false)}
        />
      )}

      {a2hsOpen && (
        <AddToHomeScreenModal onClose={() => setA2hsOpen(false)} />
      )}

      {/* Floating PWA / Install Pill for mobile users */}
      <div className="fixed bottom-4 left-4 z-40 hidden sm:block">
        <button
          onClick={() => setA2hsOpen(true)}
          className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-[11px] font-bold text-[#A7C09D] transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
        >
          <span>📱 Установить PWA на телефон</span>
        </button>
      </div>

    </div>
  )
}

export default App
