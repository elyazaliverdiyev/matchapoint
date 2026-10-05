import React, { useState, useEffect, useCallback } from 'react'
import { PRODUCTS } from './data/menu'
import { TELEGRAM_POSTS as FALLBACK_TELEGRAM_POSTS } from './data/telegramFeed'
import { Product, ProductSize, CartItem, Order, OrderStatus, PaymentMethod, TelegramPost } from './types'
import { AppHeader } from './components/AppHeader'
import { BottomTabBar, TabType } from './components/BottomTabBar'
import { ActiveTicketBanner } from './components/ActiveTicketBanner'
import { TelegramFeedView } from './components/TelegramFeedView'
import { WoltView } from './components/WoltView'
import { TicketTabContent } from './components/TicketTabContent'
import { QRCodeSVG } from './components/QRCodeSVG'
import { HeroStage } from './components/HeroStage'
import { TelegramLiveTicker } from './components/TelegramLiveTicker'
import { MenuSection } from './components/MenuSection'
import { LocationHours } from './components/LocationHours'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { LiveTicketModal } from './components/LiveTicketModal'
import { BaristaKDSModal } from './components/BaristaKDSModal'
import { AddToHomeScreenModal } from './components/AddToHomeScreenModal'
import { HeroUIQuickOrder } from './components/HeroUIQuickOrder'
import { 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Send, 
  Sliders, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Bike,
  ExternalLink 
} from 'lucide-react'
import { 
  fetchCloudOrders, 
  saveCloudOrder, 
  updateCloudOrderStatus, 
  fetchCloudTelegramPosts, 
  publishCloudTelegramPost,
  subscribeToMatchaUpdates
} from './lib/supabaseService'
import { playOrderReadySound, playTapSound } from './lib/audio'

export const App: React.FC = () => {
  // Mobile frame vs wide mode (default 'mobile' on all screens for authentic PWA feel!)
  const [viewMode, setViewMode] = useState<'mobile' | 'wide'>('mobile')

  // Active Bottom Tab
  const [activeTab, setActiveTab] = useState<TabType>('menu')

  // Menu presentation mode: Kumo showcase vs HeroUI quick order
  const [menuViewMode, setMenuViewMode] = useState<'kumo' | 'quick'>('kumo')

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

  // Barista Stop-List state
  const [soldOutIds, setSoldOutIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mp_stop_list')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Orders State (Synced with Supabase & LocalStorage)
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

  // Telegram Posts Feed (Synced with Supabase Cloud)
  const [telegramPosts, setTelegramPosts] = useState<TelegramPost[]>(() => {
    try {
      const saved = localStorage.getItem('mp_telegram_posts')
      return saved ? JSON.parse(saved) : FALLBACK_TELEGRAM_POSTS
    } catch {
      return FALLBACK_TELEGRAM_POSTS
    }
  })

  // Modals state
  const [cartOpen, setCartOpen] = useState(false)
  const [ticketModalOpen, setTicketModalOpen] = useState(false)
  const [kdsOpen, setKdsOpen] = useState(() => {
    const path = window.location.pathname.toLowerCase()
    const hash = window.location.hash.toLowerCase()
    return path.includes('barista') || path.includes('admin') || hash.includes('barista')
  })
  const [a2hsOpen, setA2hsOpen] = useState(false)

  // Current active order object
  const activeOrder = orders.find((o) => o.id === activeOrderId) || null

  // Cart financial summary
  const cartTotalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // ── CLOUD SYNC: INITIAL LOAD & SUPABASE REALTIME ──
  const syncWithCloud = useCallback(async () => {
    const cloudOrders = await fetchCloudOrders()
    if (cloudOrders && cloudOrders.length > 0) {
      setOrders(cloudOrders)
    }

    const cloudPosts = await fetchCloudTelegramPosts()
    if (cloudPosts && cloudPosts.length > 0) {
      setTelegramPosts(cloudPosts)
    }
  }, [])

  useEffect(() => {
    syncWithCloud()
    const unsubscribe = subscribeToMatchaUpdates(() => {
      syncWithCloud()
    })
    return () => unsubscribe()
  }, [syncWithCloud])

  // Cross-tab synchronization via storage event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mp_orders' && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue))
        } catch {}
      }
      if (e.key === 'mp_stop_list' && e.newValue) {
        try {
          setSoldOutIds(JSON.parse(e.newValue))
        } catch {}
      }
      if (e.key === 'mp_telegram_posts' && e.newValue) {
        try {
          setTelegramPosts(JSON.parse(e.newValue))
        } catch {}
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Persist local storage states
  useEffect(() => {
    try {
      localStorage.setItem('mp_cart', JSON.stringify(cart))
    } catch {}
  }, [cart])

  useEffect(() => {
    try {
      localStorage.setItem('mp_stop_list', JSON.stringify(soldOutIds))
    } catch {}
  }, [soldOutIds])

  useEffect(() => {
    try {
      localStorage.setItem('mp_orders', JSON.stringify(orders))
    } catch {}
  }, [orders])

  useEffect(() => {
    try {
      localStorage.setItem('mp_telegram_posts', JSON.stringify(telegramPosts))
    } catch {}
  }, [telegramPosts])

  useEffect(() => {
    try {
      if (activeOrderId) {
        localStorage.setItem('mp_active_order_id', activeOrderId)
      } else {
        localStorage.removeItem('mp_active_order_id')
      }
    } catch {}
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

  // CHECKOUT: Create benchmark order & save to Supabase cloud
  const handleCheckout = async (
    customerName: string,
    orderType: 'takeaway' | 'dinein',
    paymentMethod: PaymentMethod
  ) => {
    if (cart.length === 0) return

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    
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
    setActiveTab('ticket')

    // Save to Supabase Cloud in background
    saveCloudOrder(newOrder).catch(() => {})
  }

  // Barista updates order status
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    )
    if (newStatus === 'ready' && orderId === activeOrderId) {
      playOrderReadySound()
    }
    updateCloudOrderStatus(orderId, newStatus).catch(() => {})
  }

  // Create demo order for test
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
    setActiveTab('ticket')
    saveCloudOrder(demoOrder).catch(() => {})
  }

  // Barista publishes new Telegram Broadcast
  const handlePublishTelegramPost = async (text: string, badge?: string, isUrgent?: boolean) => {
    const newPost = await publishCloudTelegramPost({ text, badge, isUrgent })
    if (newPost) {
      setTelegramPosts((prev) => [newPost, ...prev])
    }
  }

  // Stop-list toggle
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

  return (
    <div className="min-h-screen bg-[#070E06] text-[#FAF6EE] selection:bg-[#7E9C72] selection:text-[#0B1509] relative flex flex-col items-center justify-start overflow-x-hidden">
      
      {/* ── AMBIENT ZEN KYOTO LIGHTING (DESKTOP BACKDROP) ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#1A3316]/30 blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#003B46]/15 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* ── DESKTOP MAIN WRAPPER ── */}
      <div className={`w-full relative z-10 flex items-start justify-center ${viewMode === 'wide' ? 'max-w-7xl px-4' : 'max-w-6xl'}`}>
        
        {/* ── LEFT DESKTOP COMPANION SIDEBAR (Brand & Story) ── */}
        {viewMode === 'mobile' && (
          <aside className="hidden xl:flex w-72 flex-col justify-between py-10 pl-6 sticky top-0 h-screen text-left space-y-6 animate-fade-in pointer-events-auto">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1.5 shadow-xl">
                  <img src="/assets/mp-logo.png" alt="mp. Baku" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="font-editorial text-xl font-bold tracking-wider text-[#FAF6EE] leading-none">
                    MP BAKU
                  </h1>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#7E9C72] font-semibold block mt-1">
                    Baku · Since 2023
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-l-2 border-[#7E9C72]/40 pl-3">
                <p className="font-editorial font-bold text-xs uppercase tracking-wider text-white/90">
                  ALWAYS DRINK MATCHA
                </p>
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  Specialty Japanese Uji matcha & fresh daily bakery in Baku, Azerbaijan.
                </p>
              </div>

              {/* Hours Card */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#7E9C72] font-bold">
                  <Clock className="w-4 h-4" />
                  <span>График Бара</span>
                </div>
                <div className="space-y-1 text-white/80 text-[11px]">
                  <div className="flex justify-between">
                    <span>Среда:</span>
                    <strong className="font-mono text-white">14:00 – 21:00</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Сб – Вс:</span>
                    <strong className="font-mono text-white">14:00 – 21:00</strong>
                  </div>
                </div>
                <div className="pt-1 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-white/50">
                  <MapPin className="w-3 h-3 text-white/40" />
                  <span>Baku, Azerbaijan</span>
                </div>
              </div>

              {/* Quick links */}
              <div className="space-y-2 pt-2">
                <a
                  href="https://wolt.com/az/aze/baku/restaurant/matchapoint"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#00C2E8]/10 hover:bg-[#00C2E8]/20 border border-[#00C2E8]/30 text-xs text-[#00C2E8] transition-all"
                >
                  <span className="font-bold flex items-center gap-2">
                    <Bike className="w-4 h-4" /> Wolt Baku Доставка
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://t.me/+tbdweAM1P0ExMWNi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#2AABEE]/10 hover:bg-[#2AABEE]/20 border border-[#2AABEE]/30 text-xs text-[#2AABEE] transition-all"
                >
                  <span className="font-bold flex items-center gap-2">
                    <Send className="w-4 h-4" /> Telegram Канал
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Cloud Status Indicator */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-white/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Supabase Cloud Realtime Online</span>
            </div>
          </aside>
        )}

        {/* ── THE MOBILE PWA PHONE CONTAINER (CENTER) ── */}
        <div
          className={`w-full transition-all duration-300 relative ${
            viewMode === 'mobile'
              ? 'max-w-[440px] sm:my-5 sm:rounded-[50px] sm:border-[8px] sm:border-[#162714] sm:shadow-[0_25px_90px_rgba(0,0,0,0.95)] sm:ring-1 sm:ring-white/10 overflow-hidden bg-[#0B1509] flex flex-col min-h-screen sm:min-h-[94vh]'
              : 'max-w-7xl bg-[#0B1509] min-h-screen py-4'
          }`}
        >
          {/* Top Speaker / Dynamic Island Simulation (Desktop only) */}
          {viewMode === 'mobile' && (
            <div className="hidden sm:flex justify-center pt-2 pb-1 bg-[#0B1509]">
              <div className="w-24 h-4 bg-black/80 rounded-full border border-white/10 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#182915] mr-3" />
                <span className="w-10 h-1.5 rounded-full bg-zinc-900" />
              </div>
            </div>
          )}

          {/* ── MOBILE APP HEADER ── */}
          <AppHeader
            isStoreOpen={isStoreOpen}
            onOpenKDS={() => setKdsOpen(true)}
            onOpenA2HS={() => setA2hsOpen(true)}
          />

          {/* ── TAB CONTENT ROUTER ── */}
          <main className="flex-1 w-full pb-16">
            
            {/* 1. MENU TAB */}
            {activeTab === 'menu' && (
              <div className="space-y-4">
                
                {/* ── HEROUI MODE SWITCHER (KUMO VS QUICK) ── */}
                <div className="px-3 pt-3">
                  <div className="bg-black/60 p-1 rounded-2xl border border-white/10 flex items-center justify-between text-xs shadow-inner">
                    <button
                      onClick={() => {
                        playTapSound()
                        setMenuViewMode('kumo')
                      }}
                      className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        menuViewMode === 'kumo'
                          ? 'bg-[#7E9C72] text-[#0B1509] shadow'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <span>🍵 Kumo Шоукейс</span>
                    </button>
                    <button
                      onClick={() => {
                        playTapSound()
                        setMenuViewMode('quick')
                      }}
                      className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        menuViewMode === 'quick'
                          ? 'bg-[#FAF6EE] text-[#0B1509] shadow'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <span>⚡ HeroUI Быстрый заказ</span>
                    </button>
                  </div>
                </div>

                {menuViewMode === 'kumo' ? (
                  <>
                    {/* Hero Cup on Zen Mountain Pedestal */}
                    <HeroStage
                      heroDrinks={heroDrinks}
                      activeDrink={activeDrink}
                      onSelectDrink={(drink) => setActiveDrink(drink)}
                      onAddToCart={handleAddToCart}
                      isSoldOut={isSoldOut}
                    />

                    {/* Telegram Live Barista Broadcast Strip */}
                    <TelegramLiveTicker posts={telegramPosts} />

                    {/* Full Categorized Menu */}
                    <MenuSection
                      products={PRODUCTS}
                      onAddToCart={handleAddToCart}
                      isSoldOut={isSoldOut}
                    />
                  </>
                ) : (
                  /* HeroUI / iPhone Ultra-Clean Quick List */
                  <HeroUIQuickOrder
                    products={PRODUCTS}
                    onAddToCart={handleAddToCart}
                    isSoldOut={isSoldOut}
                  />
                )}

                {/* Location, Schedule & Map */}
                <LocationHours />

                {/* Footer */}
                <Footer />
              </div>
            )}

            {/* 2. TICKET TAB */}
            {activeTab === 'ticket' && (
              <TicketTabContent
                order={activeOrder}
                onGoToMenu={() => setActiveTab('menu')}
                onCreateDemoOrder={handleCreateDemoOrder}
              />
            )}

            {/* 3. TELEGRAM FEED TAB */}
            {activeTab === 'feed' && (
              <TelegramFeedView posts={telegramPosts} />
            )}

            {/* 4. WOLT DELIVERY TAB */}
            {activeTab === 'wolt' && (
              <WoltView />
            )}

          </main>

          {/* ── PERSISTENT ACTIVE TICKET FLOATING BANNER ── */}
          {activeOrder && activeOrder.status !== 'completed' && (
            <ActiveTicketBanner
              order={activeOrder}
              onClick={() => {
                setActiveTab('ticket')
                setTicketModalOpen(true)
              }}
            />
          )}

          {/* ── NATIVE MOBILE BOTTOM TAB BAR ── */}
          <BottomTabBar
            activeTab={activeTab}
            onSelectTab={(t) => setActiveTab(t)}
            cartCount={cartTotalCount}
            cartTotal={cartTotalAmount}
            activeOrder={activeOrder}
            onOpenCartDrawer={() => setCartOpen(true)}
          />

        </div>

        {/* ── RIGHT DESKTOP COMPANION SIDEBAR (QR Code & Quick Actions) ── */}
        {viewMode === 'mobile' && (
          <aside className="hidden xl:flex w-72 flex-col justify-between py-10 pr-6 sticky top-0 h-screen text-left space-y-6 animate-fade-in pointer-events-auto">
            <div className="space-y-5">
              
              {/* QR Code Card */}
              <div className="p-4 rounded-3xl bg-white/[0.04] border border-white/10 space-y-3 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7E9C72] block">
                  Открыть на смартфоне
                </span>
                <div className="flex justify-center">
                  <QRCodeSVG size={130} />
                </div>
                <p className="text-[11px] text-white/60 leading-relaxed font-light">
                  Наведите камеру iPhone / Android для мгновенного запуска PWA без App Store.
                </p>
              </div>

              {/* View Switcher Toggle */}
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-white/40 block">
                  Режим отображения:
                </span>
                <div className="grid grid-cols-2 gap-1.5 bg-black/40 p-1 rounded-xl">
                  <button
                    onClick={() => {
                      playTapSound()
                      setViewMode('mobile')
                    }}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                      viewMode === 'mobile'
                        ? 'bg-[#7E9C72] text-[#0B1509] shadow'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>PWA (430px)</span>
                  </button>
                  <button
                    onClick={() => {
                      playTapSound()
                      setViewMode('wide')
                    }}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                      viewMode === 'wide'
                        ? 'bg-[#7E9C72] text-[#0B1509] shadow'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Широкий</span>
                  </button>
                </div>
              </div>

              {/* Barista KDS Console Launch */}
              <button
                onClick={() => {
                  playTapSound()
                  setKdsOpen(true)
                }}
                className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-[#A7C09D] flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
              >
                <Sliders className="w-4 h-4" />
                <span>Панель Бариста (KDS)</span>
              </button>

              {/* A2HS Guide */}
              <button
                onClick={() => {
                  playTapSound()
                  setA2hsOpen(true)
                }}
                className="w-full py-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-[11px] text-white/60 hover:text-white border border-white/5 transition-colors cursor-pointer"
              >
                📱 Как установить на экран «Домой»
              </button>

            </div>

            <div className="text-[11px] text-white/40 leading-tight">
              <span>MP Baku PWA v2.0 · Mobile First</span>
            </div>
          </aside>
        )}

      </div>

      {/* Floating Toggle in Wide Mode to return to Mobile PWA */}
      {viewMode === 'wide' && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <button
            onClick={() => {
              playTapSound()
              setViewMode('mobile')
            }}
            className="px-4 py-2.5 rounded-full bg-[#7E9C72] text-[#0B1509] font-bold text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 hover:bg-[#6A895F] transition-all cursor-pointer active:scale-95"
          >
            <Smartphone className="w-4 h-4" />
            <span>Вернуться в вид смартфона (PWA)</span>
          </button>
        </div>
      )}

      {/* ── MODALS & BOTTOM SHEETS ── */}

      {/* Cart Drawer / Bottom Sheet */}
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
      {ticketModalOpen && activeOrder && (
        <LiveTicketModal
          order={activeOrder}
          onClose={() => setTicketModalOpen(false)}
          onMinimize={() => setTicketModalOpen(false)}
        />
      )}

      {/* Barista KDS (Queue & Stop-List & Telegram Dispatcher) Console */}
      {kdsOpen && (
        <BaristaKDSModal
          orders={orders}
          products={PRODUCTS}
          soldOutIds={soldOutIds}
          telegramPosts={telegramPosts}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onToggleSoldOut={handleToggleSoldOut}
          onResetStopList={handleResetStopList}
          onPublishTelegramPost={handlePublishTelegramPost}
          onCreateDemoOrder={handleCreateDemoOrder}
          onClose={() => setKdsOpen(false)}
        />
      )}

      {/* PWA Add to Home Screen Modal */}
      {a2hsOpen && (
        <AddToHomeScreenModal onClose={() => setA2hsOpen(false)} />
      )}

    </div>
  )
}

export default App
