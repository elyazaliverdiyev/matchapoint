import React from 'react'
import { Coffee, Ticket, Radio, Bike, ShoppingBag } from 'lucide-react'
import { Order } from '../types'
import { playTapSound } from '../lib/audio'

export type TabType = 'menu' | 'ticket' | 'feed' | 'wolt' | 'cart'

interface BottomTabBarProps {
  activeTab: TabType
  onSelectTab: (tab: TabType) => void
  cartCount: number
  cartTotal: number
  activeOrder: Order | null
  onOpenCartDrawer: () => void
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  cartTotal,
  activeOrder,
  onOpenCartDrawer,
}) => {
  const handleTabClick = (tab: TabType) => {
    playTapSound()
    if (tab === 'cart') {
      onOpenCartDrawer()
    } else {
      onSelectTab(tab)
    }
  }

  const hasActiveTicket = !!activeOrder && activeOrder.status !== 'completed'
  const isTicketReady = activeOrder?.status === 'ready'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe pointer-events-auto">
      {/* Container max-width to align with mobile container */}
      <div className="w-full max-w-[440px] mx-auto px-3 pb-3 pt-1">
        <div className="backdrop-blur-2xl bg-[#0E1A0E]/95 border border-white/15 rounded-3xl p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center justify-around">
          
          {/* TAB 1: МЕНЮ */}
          <button
            onClick={() => handleTabClick('menu')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-[#7E9C72] text-[#0B1509] font-bold shadow-md shadow-[#7E9C72]/20 scale-102'
                : 'text-[#FAF6EE]/70 hover:text-white'
            }`}
          >
            <Coffee className={`w-5 h-5 transition-transform ${activeTab === 'menu' ? 'scale-110' : ''}`} />
            <span className="text-[10px] mt-1 tracking-tight font-medium leading-none">
              Меню
            </span>
          </button>

          {/* TAB 2: ТАЛОН (ЖИВОЙ ЗАКАЗ) */}
          <button
            onClick={() => handleTabClick('ticket')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-2xl relative transition-all cursor-pointer ${
              activeTab === 'ticket'
                ? 'bg-[#7E9C72] text-[#0B1509] font-bold shadow-md shadow-[#7E9C72]/20 scale-102'
                : 'text-[#FAF6EE]/70 hover:text-white'
            }`}
          >
            <div className="relative">
              <Ticket className={`w-5 h-5 transition-transform ${activeTab === 'ticket' ? 'scale-110' : ''}`} />
              {hasActiveTicket && (
                <span
                  className={`absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#0E1A0E] ${
                    isTicketReady ? 'bg-[#D4AF37] animate-bounce' : 'bg-emerald-400 animate-ping'
                  }`}
                />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight font-medium leading-none flex items-center gap-0.5">
              Талон
              {hasActiveTicket && (
                <span className="text-[8px] opacity-80 font-mono font-bold">
                  {activeOrder.id.replace('#MP-', '')}
                </span>
              )}
            </span>
          </button>

          {/* TAB 3: СВОДКИ (TELEGRAM LIVE) */}
          <button
            onClick={() => handleTabClick('feed')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-2xl relative transition-all cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-[#7E9C72] text-[#0B1509] font-bold shadow-md shadow-[#7E9C72]/20 scale-102'
                : 'text-[#FAF6EE]/70 hover:text-white'
            }`}
          >
            <div className="relative">
              <Radio className={`w-5 h-5 transition-transform ${activeTab === 'feed' ? 'scale-110' : ''}`} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#2AABEE] animate-pulse" />
            </div>
            <span className="text-[10px] mt-1 tracking-tight font-medium leading-none">
              Сводки TG
            </span>
          </button>

          {/* TAB 4: WOLT ДОСТАВКА */}
          <button
            onClick={() => handleTabClick('wolt')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'wolt'
                ? 'bg-[#00C2E8] text-black font-bold shadow-md shadow-[#00C2E8]/20 scale-102'
                : 'text-[#FAF6EE]/70 hover:text-[#00C2E8]'
            }`}
          >
            <Bike className={`w-5 h-5 transition-transform ${activeTab === 'wolt' ? 'scale-110' : ''}`} />
            <span className="text-[10px] mt-1 tracking-tight font-medium leading-none">
              Wolt
            </span>
          </button>

          {/* TAB 5: КОРЗИНА */}
          <button
            onClick={() => handleTabClick('cart')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-2xl relative transition-all cursor-pointer ${
              cartCount > 0
                ? 'bg-[#D4AF37]/90 text-black font-bold shadow-lg shadow-[#D4AF37]/20 scale-102'
                : 'text-[#FAF6EE]/70 hover:text-white'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[10px] font-black rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight font-medium leading-none">
              {cartCount > 0 ? `${cartTotal.toFixed(0)} ₼` : 'Корзина'}
            </span>
          </button>

        </div>
      </div>
    </nav>
  )
}
