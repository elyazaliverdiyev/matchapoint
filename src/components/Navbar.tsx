import React from 'react'
import { ShoppingBag, Sliders, ExternalLink, Send } from 'lucide-react'

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

interface NavbarProps {
  cartCount: number
  onOpenCart: () => void
  onOpenStopList: () => void
  isStoreOpen: boolean
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenStopList,
  isStoreOpen,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-[#0B1509]/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand identity: mp. */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 transition-transform">
              <img 
                src="/assets/mp-logo.png" 
                alt="mp. Baku" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to text if image is not loaded
                  (e.target as HTMLElement).style.display = 'none'
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-lg sm:text-xl font-bold tracking-wider text-[#FAF6EE] leading-none">
                mp.
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#7E9C72] font-semibold mt-0.5">
                Baku · 2023
              </span>
            </div>
          </a>

          {/* Live Open / Schedule indicator badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#E6ECE2]">
            <span className={`w-2 h-2 rounded-full ${isStoreOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isStoreOpen ? 'Открыто сегодня 14:00–21:00' : 'График: Ср, Сб–Вс 14:00–21:00'}</span>
          </div>
        </div>

        {/* Center / Navigation links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest text-[#FAF6EE]/70 font-medium">
          <a href="#hero" className="hover:text-white transition-colors">Specialty Matcha</a>
          <a href="#menu" className="hover:text-white transition-colors">Меню & Выпечка</a>
          <a href="#telegram" className="hover:text-white transition-colors">Telegram Live</a>
          <a href="#wolt" className="hover:text-[#00C2E8] transition-colors flex items-center gap-1">
            Wolt Доставка
          </a>
          <a href="#location" className="hover:text-white transition-colors">Локация</a>
        </nav>

        {/* Action icons & controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Telegram Channel link */}
          <a
            href="https://t.me/+tbdweAM1P0ExMWNi"
            target="_blank"
            rel="noopener noreferrer"
            title="Официальный Telegram канал"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-[#FAF6EE] border border-white/10 transition-colors"
          >
            <Send className="w-4 h-4 text-[#2AABEE]" />
          </a>

          {/* Instagram link */}
          <a
            href="https://www.instagram.com/matchapointbaku/"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram: @matchapointbaku"
            className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center bg-white/5 hover:bg-white/10 text-[#FAF6EE] border border-white/10 transition-colors"
          >
            <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
          </a>

          {/* Barista Stop-List Toggle */}
          <button
            onClick={onOpenStopList}
            title="Стоп-лист бариста (наличие блюд)"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-xs text-[#A7C09D] border border-white/10 transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Стоп-лист</span>
          </button>

          {/* Cart button with floating badge */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#7E9C72] hover:bg-[#6A895F] text-[#0B1509] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#7E9C72]/20 cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Корзина</span>
            {cartCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[#0B1509] text-white text-[11px] font-bold animate-fade-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  )
}
