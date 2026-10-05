import React, { useState } from 'react'
import { Product, ProductSize } from '../types'
import { Plus, Check, Snowflake, Flame } from 'lucide-react'
import { playTapSound } from '../lib/audio'

interface HeroStageProps {
  heroDrinks: Product[]
  activeDrink: Product
  onSelectDrink: (drink: Product) => void
  onAddToCart: (product: Product, size: ProductSize) => void
  isSoldOut: (productId: string) => boolean
}

export const HeroStage: React.FC<HeroStageProps> = ({
  heroDrinks,
  activeDrink,
  onSelectDrink,
  onAddToCart,
  isSoldOut,
}) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize>('M')
  const [justAdded, setJustAdded] = useState(false)
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null)

  const currentPrice = selectedSize === 'M' ? (activeDrink.prices.M ?? 9) : (activeDrink.prices.L ?? 12)
  const soldOut = isSoldOut(activeDrink.id)
  const isHot = activeDrink.temperature === 'hot'

  const handleAdd = () => {
    if (soldOut) return
    playTapSound()
    onAddToCart(activeDrink, selectedSize)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1400)
  }

  const cup = activeDrink.cupVisual || {
    topColor: '#4A723D',
    midColor: '#F6F2E7',
    bottomColor: '#8C2647',
    hasBoba: true,
    topPercent: 35,
    midPercent: 35,
    bottomPercent: 30,
  }

  const backdrop = activeDrink.mountainBackdrop || 'from-[#142614]/60 via-[#101F12]/70 to-[#0B1509]'

  return (
    <section id="hero" className={`relative w-full pt-2 pb-4 flex flex-col justify-between overflow-hidden bg-gradient-to-b ${backdrop} transition-colors duration-700`}>
      
      {/* ── AMBIENT GLOWING AURA (DYNAMIC PER DRINK) ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[380px] h-[260px] sm:h-[380px] rounded-full bg-[#7E9C72]/15 blur-[90px] pointer-events-none" />

      {/* ── 1. COMPACT IPHONE HEADER: BADGE & PRODUCT TITLE ── */}
      <div className="relative z-10 text-center px-4 pt-1">
        
        {/* iOS Capsule Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-1.5">
          {isHot ? (
            <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
          ) : (
            <Snowflake className="w-3 h-3 text-[#7E9C72] animate-pulse" />
          )}
          <span className="text-[10px] tracking-wider uppercase text-[#FAF6EE] font-medium">
            {isHot ? 'Горячий 65°C' : 'Iced Chill'}
          </span>
          {activeDrink.tag && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#7E9C72]/30 text-[#CAD8C3] text-[9.5px] font-semibold">
              {activeDrink.tag}
            </span>
          )}
        </div>

        {/* Clean, Apple-style Product Name (no giant serifs) */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAF6EE] transition-all duration-300">
          {activeDrink.name}
        </h1>
        
        {/* 1-Line Compact Note */}
        <p className="text-[11px] text-[#FAF6EE]/70 max-w-xs mx-auto mt-0.5 font-normal truncate">
          {activeDrink.subtitle}
        </p>
      </div>

      {/* ── 2. STAGE: DRINK ON MATCHA MOSS PEDESTAL + SATELLITES ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-2 sm:my-3 px-3">
        <div className="relative w-full max-w-xs h-[260px] sm:h-[285px] flex flex-col items-center justify-end">

          {/* DYNAMIC SATELLITE INGREDIENTS */}
          {activeDrink.ingredients?.map((ing, idx) => (
            <div
              key={ing.name}
              onMouseEnter={() => setHoveredIngredient(ing.name)}
              onMouseLeave={() => setHoveredIngredient(null)}
              className={`absolute z-30 transition-all duration-500 cursor-pointer ${ing.posClass} ${
                idx % 2 === 0 ? 'animate-float-slow' : 'animate-float-reverse'
              }`}
            >
              <div className={`px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/15 flex items-center gap-1.5 text-[10.5px] font-medium text-[#FAF6EE] shadow-lg hover:scale-105 transition-all ${
                hoveredIngredient === ing.name ? 'ring-2 ring-[#7E9C72] bg-black/70 scale-110' : ''
              }`}>
                <span className="text-xs">{ing.emoji}</span>
                <span className="tracking-tight whitespace-nowrap">{ing.name}</span>
              </div>
            </div>
          ))}

          {/* HOT STEAM OR ICED VAPOR FX */}
          {isHot ? (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex gap-1.5 opacity-75">
              <span className="w-1.5 h-10 rounded-full bg-gradient-to-t from-white/40 to-transparent blur-[2px] animate-pulse" style={{ animationDuration: '2.1s' }} />
              <span className="w-2 h-14 rounded-full bg-gradient-to-t from-white/50 to-transparent blur-[2px] animate-pulse" style={{ animationDuration: '2.7s', animationDelay: '0.3s' }} />
              <span className="w-1.5 h-9 rounded-full bg-gradient-to-t from-white/40 to-transparent blur-[2px] animate-pulse" style={{ animationDuration: '2.3s', animationDelay: '0.7s' }} />
            </div>
          ) : (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-44 h-8 bg-white/[0.05] rounded-full blur-xl pointer-events-none z-10 animate-pulse" />
          )}

          {/* ── DRINK VISUAL (REAL PNG OR LAYERED GLASS) ── */}
          <div className="relative z-20 flex flex-col items-center justify-end">
            {activeDrink.image ? (
              <div className="relative group">
                <img
                  key={activeDrink.id}
                  src={activeDrink.image}
                  alt={activeDrink.name}
                  className="h-44 sm:h-48 w-auto object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.9)] transition-all duration-500 transform group-hover:scale-102"
                />
                
                {soldOut && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-2 text-center z-40">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[11px] uppercase tracking-wider">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Layered Glass Cup Fallback with Tape Label */
              <div className="relative w-36 sm:w-40 h-52 sm:h-56 rounded-b-[38px] rounded-t-[10px] border-2 border-white/20 bg-white/[0.04] p-1 backdrop-blur-md shadow-2xl shadow-black/90 overflow-hidden flex flex-col justify-end">
                <div className="absolute top-24 -left-4 -right-4 py-0.5 bg-white/95 text-[#0B1509] font-mono font-black text-[8px] uppercase tracking-[0.2em] transform -rotate-12 shadow z-30 text-center pointer-events-none">
                  matcha point baku
                </div>
                <div className="w-full h-full flex flex-col justify-end rounded-b-[32px] rounded-t-[6px] overflow-hidden relative">
                  <div 
                    className="w-full transition-all duration-700 ease-out relative flex items-center justify-center"
                    style={{ height: `${cup.topPercent}%`, backgroundColor: cup.topColor }}
                  >
                    <span className="text-[8.5px] uppercase font-bold tracking-widest text-white/60">
                      {isHot ? 'Foam' : 'Uji'}
                    </span>
                  </div>
                  <div 
                    className="w-full transition-all duration-700 ease-out relative"
                    style={{ height: `${cup.midPercent}%`, backgroundColor: cup.midColor }}
                  />
                  <div 
                    className="w-full transition-all duration-700 ease-out relative flex items-center justify-center"
                    style={{ height: `${cup.bottomPercent}%`, backgroundColor: cup.bottomColor }}
                  >
                    {cup.hasBoba && (
                      <div className="flex gap-1 items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1B100C]" />
                        <span className="w-3 h-3 rounded-full bg-[#140A07]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1B100C]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── ORGANIC MATCHA MOSS PEDESTAL (COMPACT COASTER) ── */}
          <div className="relative -mt-5 sm:-mt-6 z-10 flex flex-col items-center pointer-events-none select-none">
            <img
              src="/drinks/moss-pedestal.png"
              alt="Matcha Moss Pedestal"
              className="w-52 sm:w-60 h-auto object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.95)] opacity-95"
            />
            {/* Ground Contact Shadow */}
            <div className="absolute -bottom-1.5 w-44 sm:w-52 h-3.5 bg-black/85 rounded-full blur-md -z-10" />
          </div>

        </div>
      </div>

      {/* ── 3. IPHONE CONTROLS: SIZE SELECTOR & QUICK ADD ── */}
      <div className="relative z-10 w-full max-w-xs mx-auto px-2 space-y-2.5">
        
        {/* iOS Native Pill Bar */}
        <div className="bg-black/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 flex items-center justify-between gap-2 shadow-2xl">
          
          {/* iOS Segmented Control M / L */}
          <div className="flex items-center bg-white/10 p-0.5 rounded-xl border border-white/5">
            <button
              onClick={() => {
                playTapSound()
                setSelectedSize('M')
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedSize === 'M'
                  ? 'bg-[#7E9C72] text-[#0B1509] shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              M
            </button>
            <button
              onClick={() => {
                playTapSound()
                setSelectedSize('L')
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedSize === 'L'
                  ? 'bg-[#7E9C72] text-[#0B1509] shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              L
            </button>
          </div>

          {/* Clean Price */}
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-bold tracking-tight text-[#FAF6EE]">
              {currentPrice}
            </span>
            <span className="text-xs font-bold text-[#7E9C72]">₼</span>
          </div>

          {/* Apple-style Quick Add Button */}
          <button
            onClick={handleAdd}
            disabled={soldOut}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              soldOut
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-[#FAF6EE] text-[#0B1509] hover:bg-[#7E9C72] hover:text-[#0B1509] active:scale-95 shadow-md'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Добавлено</span>
              </>
            ) : soldOut ? (
              <span>Out</span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>В заказ</span>
              </>
            )}
          </button>
        </div>

        {/* ── 4. HORIZONTAL DRINK SWITCHER RAIL ── */}
        <div>
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-[9.5px] font-semibold uppercase tracking-wider text-white/50">
              Выбрать на пьедестал
            </span>
            <span className="text-[9.5px] text-[#7E9C72] font-medium">Свайп →</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
            {heroDrinks.map((drink) => {
              const active = activeDrink.id === drink.id
              const itemSoldOut = isSoldOut(drink.id)

              return (
                <button
                  key={drink.id}
                  onClick={() => {
                    playTapSound()
                    onSelectDrink(drink)
                  }}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-xl text-[11px] transition-all flex items-center gap-1.5 border cursor-pointer ${
                    active
                      ? 'bg-[#FAF6EE] text-[#0B1509] border-white shadow-md font-bold scale-102'
                      : 'bg-white/5 text-[#FAF6EE]/80 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: drink.cupVisual?.topColor || '#7E9C72' }}
                  />
                  <span className="whitespace-nowrap">{drink.name.replace(' Matcha', '').replace(' (Lotus)', '')}</span>
                  {itemSoldOut && (
                    <span className="text-[7.5px] px-1 py-0.2 rounded bg-rose-900/80 text-rose-300 font-bold">
                      Out
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

      </div>

    </section>
  )
}
