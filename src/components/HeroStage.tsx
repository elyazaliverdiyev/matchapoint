import React, { useState } from 'react'
import { Product, ProductSize } from '../types'
import { Plus, Check, Sparkles, ExternalLink } from 'lucide-react'

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

  const currentPrice = selectedSize === 'M' ? activeDrink.prices.M : activeDrink.prices.L
  const soldOut = isSoldOut(activeDrink.id)

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

  return (
    <section id="hero" className="relative w-full pt-4 sm:pt-6 pb-6 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0B1509] via-[#112110] to-[#0B1509]">
      
      {/* ── 1. MIDORI: KINETIC EDITORIAL WATERMARK TYPOGRAPHY ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <span className="text-[18vw] sm:text-[14vw] font-editorial font-black uppercase tracking-tighter text-white/[0.03] whitespace-nowrap leading-none transform -rotate-1">
          ALWAYS DRINK MATCHA
        </span>
      </div>

      {/* Ambient background matcha light aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-[#5A7D4D]/15 blur-[100px] pointer-events-none" />

      {/* ── 2. HEADER STATEMENT & PRODUCT TITLES ── */}
      <div className="relative z-10 text-center px-3 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2">
          <Sparkles className="w-3 h-3 text-[#7E9C72]" />
          <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-[#A7C09D] font-medium">
            MP BAKU · SPECIALTY MATCHA
          </span>
          {activeDrink.tag && (
            <span className="px-1.5 py-0.2 rounded bg-[#7E9C72]/20 text-[#A7C09D] text-[9px] font-bold">
              {activeDrink.tag}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-[#FAF6EE] max-w-xl mx-auto transition-all duration-300">
          {activeDrink.name}
        </h1>
        <p className="text-[11px] sm:text-xs text-[#FAF6EE]/60 max-w-md mx-auto mt-1 font-light">
          {activeDrink.subtitle}
        </p>
      </div>

      {/* ── 3. KUMO: INTERACTIVE HERO CUP + FLOATING INGREDIENTS ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-6 sm:my-8 px-4">
        
        <div className="relative w-full max-w-md h-[340px] sm:h-[400px] flex items-center justify-center">

          {/* KUMO FLOATING INGREDIENT SATELLITES */}
          {activeDrink.ingredients?.map((ing, idx) => (
            <div
              key={ing.name}
              onMouseEnter={() => setHoveredIngredient(ing.name)}
              onMouseLeave={() => setHoveredIngredient(null)}
              className={`absolute z-20 transition-all duration-500 cursor-pointer ${ing.posClass} ${
                idx % 2 === 0 ? 'animate-float-slow' : 'animate-float-reverse'
              }`}
            >
              <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass-pill flex items-center gap-2 text-xs font-medium text-[#FAF6EE] shadow-xl hover:scale-105 hover:bg-white/15 transition-all ${
                hoveredIngredient === ing.name ? 'ring-2 ring-[#7E9C72] bg-white/20 scale-110' : ''
              }`}>
                <span className="text-sm">{ing.emoji}</span>
                <span className="tracking-wide hidden xs:inline">{ing.name}</span>
                <span className="tracking-wide xs:hidden">{ing.name.split(' ')[0]}</span>
              </div>
            </div>
          ))}

          {/* LAYERED GLASS CUP (Liquid Engine) */}
          <div className="relative w-44 sm:w-52 h-64 sm:h-76 rounded-b-[48px] rounded-t-[12px] border-2 border-white/20 bg-white/[0.04] p-1.5 backdrop-blur-md shadow-2xl shadow-black/80 overflow-hidden flex flex-col justify-end group transition-all duration-500">
            
            {/* Glass specular light glare */}
            <div className="absolute top-0 right-3 bottom-0 w-3 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none z-30" />
            <div className="absolute top-2 left-2 right-2 h-2 rounded-full bg-white/20 pointer-events-none z-30" />

            {/* Inner Liquid Container */}
            <div className="w-full h-full flex flex-col justify-end rounded-b-[40px] rounded-t-[8px] overflow-hidden relative">
              
              {/* TOP: Ceremonial Matcha layer */}
              <div 
                className="w-full transition-all duration-700 ease-out relative flex items-center justify-center"
                style={{ 
                  height: `${cup.topPercent}%`, 
                  backgroundColor: cup.topColor,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/20" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/50 z-10">
                  Uji Matcha
                </span>
              </div>

              {/* MID: Milk Cloud swirl layer */}
              <div 
                className="w-full transition-all duration-700 ease-out relative flex items-center justify-center animate-liquid"
                style={{ 
                  height: `${cup.midPercent}%`, 
                  backgroundColor: cup.midColor,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/25 to-transparent" />
              </div>

              {/* BOTTOM: Puree / Boba / Syrup layer */}
              <div 
                className="w-full transition-all duration-700 ease-out relative flex flex-col items-center justify-end pb-3"
                style={{ 
                  height: `${cup.bottomPercent}%`, 
                  backgroundColor: cup.bottomColor,
                }}
              >
                {/* Boba tapioca pearls */}
                {cup.hasBoba && (
                  <div className="flex gap-2 items-center justify-center z-10">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#1B100C] shadow-md shadow-black/60 animate-bounce" style={{ animationDuration: '3s' }} />
                    <span className="w-4 h-4 rounded-full bg-[#140A07] shadow-md shadow-black/60" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#1B100C] shadow-md shadow-black/60 animate-bounce" style={{ animationDuration: '2.4s' }} />
                    <span className="w-3 h-3 rounded-full bg-[#24130C] shadow-md shadow-black/60" />
                  </div>
                )}
              </div>

              {/* Sold-out overlay on cup if disabled */}
              {soldOut && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-3 text-center">
                  <span className="px-2.5 py-1 rounded-full bg-rose-600/90 text-white font-bold text-xs uppercase tracking-wider shadow">
                    Sold Out
                  </span>
                  <span className="text-[11px] text-white/70 mt-1">Закончилось на сегодня</span>
                </div>
              )}

            </div>
          </div>

          {/* MIDORI PEDESTAL / STONE SLAB */}
          <div className="absolute -bottom-6 w-48 sm:w-60 h-8 rounded-full bg-black/60 blur-md pointer-events-none z-0" />
          <div className="absolute -bottom-4 w-40 sm:w-48 h-3 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />

        </div>

      </div>

      {/* ── 4. MIDORI CONTROLS & SELECTION RAIL ── */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 space-y-4">
        
        {/* SIZE SELECTOR & QUICK ADD ACTION BAR */}
        <div className="glass-panel p-2.5 sm:p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
          
          {/* M / L Volume switcher */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setSelectedSize('M')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedSize === 'M'
                  ? 'bg-[#7E9C72] text-[#0B1509] shadow'
                  : 'text-[#FAF6EE]/60 hover:text-white'
              }`}
            >
              M · 350ml
            </button>
            <button
              onClick={() => setSelectedSize('L')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedSize === 'L'
                  ? 'bg-[#7E9C72] text-[#0B1509] shadow'
                  : 'text-[#FAF6EE]/60 hover:text-white'
              }`}
            >
              L · 500ml
            </button>
          </div>

          {/* Current Live Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF6EE]">
              {currentPrice}
            </span>
            <span className="text-sm font-semibold text-[#7E9C72]">₼ AZN</span>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            disabled={soldOut}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              soldOut
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-[#FAF6EE] text-[#0B1509] hover:bg-[#7E9C72] hover:text-[#0B1509] shadow-lg active:scale-95'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Добавлено</span>
              </>
            ) : soldOut ? (
              <span>Закончилось</span>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>В заказ · {currentPrice} ₼</span>
              </>
            )}
          </button>
        </div>

        {/* MIDORI HORIZONTAL SELECTOR RAIL */}
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#FAF6EE]/40 mb-2 px-1 font-semibold flex items-center justify-between">
            <span>Выбрать напиток на сцене:</span>
            <span className="text-[#7E9C72]">Свайп влево/вправо →</span>
          </div>

          <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1 px-1">
            {heroDrinks.map((drink) => {
              const active = activeDrink.id === drink.id
              const itemSoldOut = isSoldOut(drink.id)

              return (
                <button
                  key={drink.id}
                  onClick={() => onSelectDrink(drink)}
                  className={`flex-shrink-0 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 border cursor-pointer ${
                    active
                      ? 'bg-[#FAF6EE] text-[#0B1509] border-white shadow-lg shadow-[#7E9C72]/20 scale-102 font-bold'
                      : 'bg-white/5 text-[#FAF6EE]/80 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: drink.cupVisual?.bottomColor || '#7E9C72' }}
                  />
                  <span>{drink.name}</span>
                  {itemSoldOut && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-rose-900/60 text-rose-300">
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
