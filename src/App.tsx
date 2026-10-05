import React, { useState, useEffect } from 'react'
import { PRODUCTS } from './data/menu'
import { TELEGRAM_POSTS } from './data/telegramFeed'
import { Product, ProductSize, CartItem, Order, OrderStatus, PaymentMethod } from './types'
import { Navbar } from './components/Navbar'
import { HeroStage } from './components/HeroStage'
import { TelegramLiveTicker } from './components/TelegramLiveTicker'
import { MenuSection } from './components/MenuSection'
import { WoltHighlight } from './components/WoltHighlight'
import { LocationHours } from './components/LocationHours'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { LiveTicketModal } from './components/LiveTicketModal'
import { BaristaKDSModal } from './components/BaristaKDSModal'
import { AddToHomeScreenModal } from './components/AddToHomeScreenModal'
import { Sparkles, Clock } from 'lucide-react'

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

  // All Orders (KDS Queue) persisted to localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('mp_orders')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Current customer active order ID
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mp_active_order_id') || null
    } catch {
      return null
    }
  })

  // Modals state
  const [cartOpen, setCartOpen] = useState(false)
  const [ticketOpen, setTicketOpen] = useState(false)
  const [kdsOpen, setKdsOpen] = useState(false)
  const [a2hsOpen, setA2hsOpen] = useState(false)

  // Current active order object
  const activeOrder = orders.find((o) => o.id === activeOrderId) || null

  // Cross-tab synchronization via storage event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mp_orders' && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue))
        } catch {
          // ignore
        }
      }
      if (e.key === 'mp_stop_list' && e.newValue) {
        try {
          setSoldOutIds(JSON.parse(e.newValue))
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('mp_cart', JSON.stringify(cart))
    } catch (e) {
      console.error('Failed to save cart', e)
    }
  }, [cart])

  // Persist stop list
  useEffect(() => {
    try {
      localStorage.setItem('mp_stop_list', JSON.stringify(soldOutIds))
    } catch (e) {
      console.error('Failed to save stop-list', e)
    }
  }, [soldOutIds])

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem('mp_orders', JSON.stringify(orders))
    } catch (e) {
      console.error('Failed to save orders', e)
    }
  }, [orders])

  // Persist active order ID
  useEffect(() => {
    try {
      if (activeOrderId) {
        localStorage.setItem('mp_active_order_id', activeOrderId)
      } else {
        localStorage.removeItem('mp_active_order_id')
      }
    } catch (e) {
      console.error('Failed to save active order id', e)
    }
  }, [activeOrderId])

  // Check store open status (Baku time UTC+4)
  const checkStoreOpen = (): boolean => {
    const now = new Date()
    const utcHours = now.getUTCHours()
    const bakuHours = (utcHours + 4) % 24
    const day = now.getUTCDay()
    const isOpenDay = day === 3 || day === 6 || day === 0 // Wed, Sat, Sun
    return isOpenDay && bakuHours >= 14 && bakuHours < 21
  }

  const isStoreOpen = checkStoreOpen()

  // Add item to cart
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

  // CHECKOUT HANDLER: Create benchmark Order & Live Ticket
  const handleCheckout = (
    customerName: string,
    orderType: 'takeaway' | 'dinein',
    paymentMethod: PaymentMethod
  ) => {
    if (cart.length === 0) return

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    
    // Sequential ticket counter
    const nextNum = (orders.length > 0 ? Math.max(...orders.map((o) => o.ticketNumber || 0)) : 0) + 1
    const orderId = `#MP-${String(nextNum).padStart(2, '0')}`

    const activePreparingCount = orders.filter((o) => o.status === 'preparing' || o.status === 'paid').length
    const estimatedMinutes = 3 + activePreparingCount * 2

    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const mins = String(now.getMinutes()).padStart(2, '0')

    const newOrder: Order = {
      id: orderId,
      ticketNumber: nextNum,
      createdAt: `${hours}:${mins}`,
      customerName,
      orderType,
      paymentMethod,
      items: [...cart],
      totalAmount,
      status: 'pending_payment',
      estimatedMinutes,
    }

    setOrders((prev) => [newOrder, ...prev])
    setActiveOrderId(orderId)
    setCart([])
    setCartOpen(false)
    setTicketOpen(true)
  }

  // Update order status from Barista KDS
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    )
  }

  // Create demo order for quick testing
  const handleCreateDemoOrder = () => {
    const nextNum = (orders.length > 0 ? Math.max(...orders.map((o) => o.ticketNumber || 0)) : 0) + 1
    const orderId = `#MP-${String(nextNum).padStart(2, '0')}`
    
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const mins = String(now.getMinutes()).padStart(2, '0')

    const demoOrder: Order = {
      id: orderId,
      ticketNumber: nextNum,
      createdAt: `${hours}:${mins}`,
      customerName: 'Лейла М.',
      orderType: 'takeaway',
      paymentMethod: 'nfc_tap',
      items: [
        {
          id: 'berry-boba-M',
          productId: 'berry-boba',
          name: 'Berry Boba Matcha',
          size: 'M',
          price: 9,
          quantity: 1,
        },
        {
          id: 'matcha-bon-standard',
          productId: 'matcha-bon',
          name: 'Matcha Bon',
          size: 'standard',
          price: 8,
          quantity: 1,
        },
      ],
      totalAmount: 17,
      status: 'pending_payment',
      estimatedMinutes: 4,
    }

    setOrders((prev) => [demoOrder, ...prev])
    setActiveOrderId(orderId)
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
      
      {/* ── TOP NAVBAR ── */}
      <Navbar
        cartCount={cartTotalCount}
        activeOrder={activeOrder}
        onOpenCart={() => setCartOpen(true)}
        onOpenTicket={() => setTicketOpen(true)}
        onOpenStopList={() => setKdsOpen(true)}
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

      {/* Cart Drawer */}
      {cartOpen && (
        <CartDrawer
          items={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
          onClose={() => setCartOpen(false)}
        />
      )}

      {/* Customer Live Digital Ticket Modal */}
      {ticketOpen && activeOrder && (
        <LiveTicketModal
          order={activeOrder}
          onClose={() => setTicketOpen(false)}
          onMinimize={() => setTicketOpen(false)}
        />
      )}

      {/* Barista KDS (Queue & Stop-List) Console */}
      {kdsOpen && (
        <BaristaKDSModal
          orders={orders}
          products={PRODUCTS}
          soldOutIds={soldOutIds}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onToggleSoldOut={handleToggleSoldOut}
          onResetStopList={handleResetStopList}
          onCreateDemoOrder={handleCreateDemoOrder}
          onClose={() => setKdsOpen(false)}
        />
      )}

      {/* PWA Add to Home Screen Modal */}
      {a2hsOpen && (
        <AddToHomeScreenModal onClose={() => setA2hsOpen(false)} />
      )}

      {/* ── FLOATING LIVE TICKET TRACKER PILL (Bottom Right) ── */}
      {activeOrder && !ticketOpen && (
        <div className="fixed bottom-5 right-4 sm:right-6 z-40 animate-fade-in">
          <button
            onClick={() => setTicketOpen(true)}
            className={`px-4 py-2.5 rounded-full border shadow-2xl flex items-center gap-2.5 backdrop-blur-md transition-all cursor-pointer active:scale-95 ${
              activeOrder.status === 'ready'
                ? 'bg-[#D4AF37] text-black border-white animate-bounce'
                : 'bg-[#0E1B0F]/90 text-white border-[#7E9C72]/50 hover:border-[#7E9C72]'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeOrder.status === 'ready' ? 'text-black' : 'text-[#D4AF37]'}`} />
            <div className="text-left">
              <span className="font-editorial font-bold text-xs block leading-none">
                Талон {activeOrder.id}
              </span>
              <span className="text-[10px] opacity-70 block mt-0.5">
                {activeOrder.status === 'pending_payment' && 'Ожидает оплаты'}
                {activeOrder.status === 'paid' && 'Оплачен · В очереди'}
                {activeOrder.status === 'preparing' && 'Взбивается 🍵'}
                {activeOrder.status === 'ready' && 'ГОТОВ К ВЫДАЧЕ! ✨'}
                {activeOrder.status === 'completed' && 'Выдан'}
              </span>
            </div>
          </button>
        </div>
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
