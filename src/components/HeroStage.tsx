import React, { useState } from 'react'
import { Product, ProductSize } from '../types'
import { Plus, Check, Sparkles, Snowflake, Flame } from 'lucide-react'

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
    onAddToCart(activeDrink, selectedSize)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
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

  const backdrop = activeDrink.mountainBackdrop || 'from-[#142614]/50 via-[#101F12]/60 to-[#0B1509]'

  return (
    <section id="hero" className={`relative w-full pt-4 pb-6 flex flex-col justify-between overflow-hidden bg-gradient-to-b ${backdrop} transition-colors duration-700`}>
      
      {/* ── 1. MOUNTAIN SILHOUETTE & EDITORIAL WATERMARK ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <span className="text-[17vw] sm:text-[14vw] font-editorial font-black uppercase tracking-tighter text-white/[0.03] whitespace-nowrap leading-none transform -rotate-1">
          ALWAYS DRINK MATCHA
        </span>
      </div>

      {/* Zen Mountain Peak Silhouette in Background */}
      <div className="absolute bottom-16 left-0 right-0 h-48 pointer-events-none z-0 opacity-20">
        <svg viewBox="0 0 1200 400" className="w-full h-full object-cover" preserveAspectRatio="none">
          <path
            d="M0,400 L0,220 L180,140 L340,240 L520,90 L710,210 L890,110 L1040,190 L1200,80 L1200,400 Z"
            fill="currentColor"
            className="text-[#1A3316]"
          />
        </svg>
      </div>

      {/* Ambient glowing atmosphere aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[480px] h-[300px] sm:h-[480px] rounded-full bg-[#5A7D4D]/20 blur-[100px] pointer-events-none" />

      {/* ── 2. HEADER STATEMENT & PRODUCT TITLES ── */}
      <div className="relative z-10 text-center px-3 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2">
          {isHot ? (
            <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
          ) : (
            <Snowflake className="w-3 h-3 text-[#7E9C72] animate-pulse" />
          )}
          <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-[#A7C09D] font-medium">
            {isHot ? '♨️ ГОРЯЧИЙ ДЗЕН · 65°C' : '❄️ ICED CHILL · MATCHA POINT'}
          </span>
          {activeDrink.tag && (
            <span className="px-1.5 py-0.2 rounded bg-[#7E9C72]/20 text-[#A7C09D] text-[9px] font-bold">
              {activeDrink.tag}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[#FAF6EE] max-w-xl mx-auto transition-all duration-300">
          {activeDrink.name}
        </h1>
        <p className="text-[11px] sm:text-xs text-[#FAF6EE]/60 max-w-md mx-auto mt-1 font-light">
          {activeDrink.subtitle}
        </p>
      </div>

      {/* ── 3. KUMO: CUP ON ZEN MOUNTAIN PEDESTAL + FLOATING ASSETS ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-4 sm:my-6 px-3">
        
        <div className="relative w-full max-w-sm h-[320px] sm:h-[360px] flex items-center justify-center">

          {/* KUMO FLOATING MODULAR INGREDIENTS (SATELLITES) */}
          {activeDrink.ingredients?.map((ing, idx) => (
            <div
              key={ing.name}
              onMouseEnter={() => setHoveredIngredient(ing.name)}
              onMouseLeave={() => setHoveredIngredient(null)}
              className={`absolute z-20 transition-all duration-500 cursor-pointer ${ing.posClass} ${
                idx % 2 === 0 ? 'animate-float-slow' : 'animate-float-reverse'
              }`}
            >
              <div className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full glass-pill flex items-center gap-1.5 text-[11px] font-medium text-[#FAF6EE] shadow-xl hover:scale-105 transition-all ${
                hoveredIngredient === ing.name ? 'ring-2 ring-[#7E9C72] bg-white/20 scale-110' : ''
              }`}>
                <span className="text-xs">{ing.emoji}</span>
                <span className="tracking-tight whitespace-nowrap">{ing.name}</span>
              </div>
            </div>
          ))}

          {/* ── HOT STEAM OR COLD FROST ANIMATION ── */}
          {isHot ? (
            /* Rising Warm Steam Animation */
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex gap-2 opacity-70">
              <span className="w-1.5 h-12 rounded-full bg-gradient-to-t from-white/30 to-transparent blur-[2px] animate-pulse" style={{ animationDuration: '2s' }} />
              <span className="w-2 h-16 rounded-full bg-gradient-to-t from-white/40 to-transparent blur-[2px] animate-pulse" style={{ animationDuration: '2.8s', animationDelay: '0.4s' }} />
              <span className="w-1.5 h-10 rounded-full bg-gradient-to-t from-white/30 to-transparent blur-[2px] animate-pulse" style={{ animationDuration: '2.4s', animationDelay: '0.8s' }} />
            </div>
          ) : (
            /* Iced Frost Mist Vapor */
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-12 bg-white/[0.04] rounded-full blur-xl pointer-events-none z-10 animate-pulse" />
          )}

          {/* ── LAYERED GLASS CUP WITH AUTHENTIC "matcha point baku" TAPE LABEL ── */}
          <div className="relative w-40 sm:w-48 h-60 sm:h-70 rounded-b-[44px] rounded-t-[12px] border-2 border-white/25 bg-white/[0.05] p-1 backdrop-blur-md shadow-2xl shadow-black/90 overflow-hidden flex flex-col justify-end group transition-all duration-500 z-10">
            
            {/* Glass Specular Highlights */}
            <div className="absolute top-0 right-2 bottom-0 w-2.5 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-30" />
            <div className="absolute top-1.5 left-2 right-2 h-1.5 rounded-full bg-white/25 pointer-events-none z-30" />

            {/* Authentic Diagonal Tape Label: "matcha point baku" */}
            <div className="absolute top-28 -left-4 -right-4 py-1 bg-white/90 text-[#0B1509] font-mono font-black text-[9px] uppercase tracking-[0.2em] transform -rotate-12 shadow-md z-30 text-center pointer-events-none border-y border-black/10">
              matcha point baku
            </div>

            {/* Inner Liquid Container */}
            <div className="w-full h-full flex flex-col justify-end rounded-b-[38px] rounded-t-[8px] overflow-hidden relative">
              
              {/* TOP LAYER */}
              <div 
                className="w-full transition-all duration-700 ease-out relative flex items-center justify-center"
                style={{ 
                  height: `${cup.topPercent}%`, 
                  backgroundColor: cup.topColor,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/25" />
                <span className="text-[9px] uppercase font-bold tracking-widest text-white/60 z-10">
                  {isHot ? 'Uji Foam' : 'Ceremonial'}
                </span>
              </div>

              {/* MID LAYER (MILK SWIRL) */}
              <div 
                className="w-full transition-all duration-700 ease-out relative flex items-center justify-center animate-liquid"
                style={{ 
                  height: `${cup.midPercent}%`, 
                  backgroundColor: cup.midColor,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              </div>

              {/* BOTTOM LAYER (BOBA / PUREE / SYRUP) */}
              <div 
                className="w-full transition-all duration-700 ease-out relative flex flex-col items-center justify-end pb-2.5"
                style={{ 
                  height: `${cup.bottomPercent}%`, 
                  backgroundColor: cup.bottomColor,
                }}
              >
                {/* Boba Pearls */}
                {cup.hasBoba && (
                  <div className="flex gap-1.5 items-center justify-center z-10">
                    <span className="w-3 h-3 rounded-full bg-[#1B100C] shadow-md shadow-black/80 animate-bounce" style={{ animationDuration: '2.5s' }} />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#140A07] shadow-md shadow-black/80" />
                    <span className="w-3 h-3 rounded-full bg-[#1B100C] shadow-md shadow-black/80 animate-bounce" style={{ animationDuration: '2.2s' }} />
                  </div>
                )}
              </div>

              {/* Sold-out Overlay */}
              {soldOut && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-3 text-center">
                  <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                    Sold Out
                  </span>
                  <span className="text-[10px] text-white/70 mt-1">Закончилось</span>
                </div>
              )}

            </div>
          </div>

          {/* ── MIDORI ZEN MOUNTAIN ROCK PEDESTAL ── */}
          {/* Top Rock Slab */}
          <div className="absolute -bottom-3 w-48 sm:w-56 h-6 rounded-[28px] bg-gradient-to-b from-[#1C2C19] to-[#0D180C] border-t border-white/20 shadow-xl z-0" />
          {/* Base Rock Shadow & Depth */}
          <div className="absolute -bottom-6 w-56 sm:w-64 h-8 rounded-full bg-black/80 blur-md pointer-events-none z-0" />

        </div>

      </div>

      {/* ── 4. QUICK SIZE SELECTOR & HORIZONTAL RAIL ── */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-2 space-y-3">
        
        {/* Action bar */}
        <div className="glass-panel p-2 sm:p-2.5 rounded-2xl flex items-center justify-between gap-2 shadow-xl">
          
          {/* M / L Toggle */}
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setSelectedSize('M')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedSize === 'M'
                  ? 'bg-[#7E9C72] text-[#0B1509] shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              M
            </button>
            <button
              onClick={() => setSelectedSize('L')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedSize === 'L'
                  ? 'bg-[#7E9C72] text-[#0B1509] shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              L
            </button>
          </div>

          {/* Live Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-serif font-bold text-[#FAF6EE]">
              {currentPrice}
            </span>
            <span className="text-xs font-bold text-[#7E9C72]">₼</span>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            disabled={soldOut}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              soldOut
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-[#FAF6EE] text-[#0B1509] hover:bg-[#7E9C72] hover:text-[#0B1509] shadow active:scale-95'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>В заказе</span>
              </>
            ) : soldOut ? (
              <span>Out</span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Заказать</span>
              </>
            )}
          </button>
        </div>

        {/* Horizontal Drink Selector Rail */}
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1.5 px-1 font-semibold flex items-center justify-between">
            <span>Напиток на пьедестале:</span>
            <span className="text-[#7E9C72]">Свайп →</span>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 px-1">
            {heroDrinks.map((drink) => {
              const active = activeDrink.id === drink.id
              const itemSoldOut = isSoldOut(drink.id)

              return (
                <button
                  key={drink.id}
                  onClick={() => onSelectDrink(drink)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 border cursor-pointer ${
                    active
                      ? 'bg-[#FAF6EE] text-[#0B1509] border-white shadow font-bold scale-102'
                      : 'bg-white/5 text-[#FAF6EE]/80 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: drink.cupVisual?.bottomColor || '#7E9C72' }}
                  />
                  <span>{drink.name.split(' ')[0]}</span>
                  {itemSoldOut && (
                    <span className="text-[8px] px-1 py-0.2 rounded bg-rose-900/60 text-rose-300">
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
