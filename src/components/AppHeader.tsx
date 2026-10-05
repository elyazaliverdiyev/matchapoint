import React from 'react'
import { Sliders, Send, Smartphone, Sparkles } from 'lucide-react'
import { playTapSound } from '../lib/audio'

interface AppHeaderProps {
  isStoreOpen: boolean
  onOpenKDS: () => void
  onOpenA2HS: () => void
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  isStoreOpen,
  onOpenKDS,
  onOpenA2HS,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#0B1509]/90 border-b border-white/10 px-4 py-2.5 transition-all">
      <div className="flex items-center justify-between">
        
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1 shadow-md">
            <img
              src="/assets/mp-logo.png"
              alt="mp. Baku"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none'
              }}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-[#FAF6EE] leading-none">
                MP BAKU
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#7E9C72]/20 text-[#A7C09D] font-mono font-bold">
                PWA
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isStoreOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-[10px] text-[#A7C09D] font-medium leading-none">
                {isStoreOpen ? 'Открыто 14:00–21:00' : 'Ср, Сб–Вс 14:00–21:00'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Pills */}
        <div className="flex items-center gap-1.5">
          
          {/* Telegram Channel button */}
          <a
            href="https://t.me/+tbdweAM1P0ExMWNi"
            target="_blank"
            rel="noopener noreferrer"
            title="Telegram канал MP Baku"
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#2AABEE] border border-white/10 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </a>

          {/* Barista KDS Console */}
          <button
            onClick={() => {
              playTapSound()
              onOpenKDS()
            }}
            title="Экран кухни Бариста (KDS)"
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 hover:bg-white/15 text-[10px] font-bold text-[#A7C09D] border border-white/10 transition-colors cursor-pointer"
          >
            <Sliders className="w-3 h-3" />
            <span>KDS</span>
          </button>

          {/* PWA Install Guide */}
          <button
            onClick={() => {
              playTapSound()
              onOpenA2HS()
            }}
            title="Установить PWA на экран телефона"
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#7E9C72]/20 hover:bg-[#7E9C72]/30 text-[10px] font-bold text-[#FAF6EE] border border-[#7E9C72]/40 transition-colors cursor-pointer"
          >
            <Smartphone className="w-3 h-3 text-[#7E9C72]" />
            <span className="hidden xs:inline">Установить</span>
          </button>

        </div>

      </div>
    </header>
  )
}
