import React, { useState } from 'react'
import { Product, ProductCategory, ProductSize } from '../types'
import { Plus, Minus, Check, ShoppingBag, Snowflake, Flame } from 'lucide-react'
import { playTapSound } from '../lib/audio'

interface HeroUIQuickOrderProps {
  products: Product[]
  onAddToCart: (product: Product, size: ProductSize) => void
  isSoldOut: (productId: string) => boolean
}

export const HeroUIQuickOrder: React.FC<HeroUIQuickOrderProps> = ({
  products,
  onAddToCart,
  isSoldOut,
}) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all')
  const [selectedSizes, setSelectedSizes] = useState<Record<string, ProductSize>>({})
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({})

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory)

  const handleSelectSize = (productId: string, size: ProductSize) => {
    playTapSound()
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }))
  }

  const handleQuickAdd = (product: Product) => {
    playTapSound()
    const size = selectedSizes[product.id] || (product.prices.M ? 'M' : 'standard')
    onAddToCart(product, size)

    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }))
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }))
    }, 1000)
  }

  return (
    <div className="p-3 sm:p-4 space-y-4 animate-fade-in">
      
      {/* ── HEROUI PILL CATEGORY SELECTOR ── */}
      <div className="bg-black/50 p-1 rounded-2xl border border-white/10 flex items-center gap-1 overflow-x-auto no-scrollbar shadow-inner">
        <button
          onClick={() => {
            playTapSound()
            setActiveCategory('all')
          }}
          className={`flex-1 min-w-[70px] py-1.5 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-[#FAF6EE] text-[#0B1509] shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Все ({products.length})
        </button>
        <button
          onClick={() => {
            playTapSound()
            setActiveCategory('matcha')
          }}
          className={`flex-1 min-w-[85px] py-1.5 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
            activeCategory === 'matcha'
              ? 'bg-[#7E9C72] text-[#0B1509] shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Matcha 🍃
        </button>
        <button
          onClick={() => {
            playTapSound()
            setActiveCategory('bakery')
          }}
          className={`flex-1 min-w-[85px] py-1.5 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
            activeCategory === 'bakery'
              ? 'bg-[#E3D7B1] text-[#0B1509] shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Выпечка 🥐
        </button>
        <button
          onClick={() => {
            playTapSound()
            setActiveCategory('coffee_tea')
          }}
          className={`flex-1 min-w-[85px] py-1.5 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
            activeCategory === 'coffee_tea'
              ? 'bg-[#FAF6EE] text-[#0B1509] shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Кофе & Чай ☕
        </button>
      </div>

      {/* ── HEROUI ULTRA-CLEAN COMPACT LIST CARDS ── */}
      <div className="space-y-2.5">
        {filtered.map((product) => {
          const soldOut = isSoldOut(product.id)
          const size = selectedSizes[product.id] || (product.prices.M ? 'M' : 'standard')
          const price = size === 'M'
            ? (product.prices.M ?? 0)
            : size === 'L'
            ? (product.prices.L ?? 0)
            : (product.prices.standard ?? 0)

          const hasSizes = !!(product.prices.M && product.prices.L)
          const isAdded = !!addedItemIds[product.id]

          return (
            <div
              key={product.id}
              className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                soldOut
                  ? 'bg-black/40 border-white/5 opacity-50'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 shadow-sm'
              }`}
            >
              {/* Left Column: Color Dot + Name + Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: product.cupVisual?.bottomColor || (product.category === 'matcha' ? '#7E9C72' : '#E3D7B1')
                    }}
                  />
                  <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                    {product.name}
                  </h4>
                  {product.temperature === 'hot' ? (
                    <Flame className="w-3 h-3 text-amber-400 flex-shrink-0" />
                  ) : product.temperature === 'iced' ? (
                    <Snowflake className="w-3 h-3 text-[#7E9C72] flex-shrink-0" />
                  ) : null}
                  {product.tag && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-[#A7C09D] font-bold hidden xs:inline">
                      {product.tag}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-white/50 truncate mt-0.5 pl-4.5">
                  {product.subtitle}
                </p>

                {/* Size Pills (if applicable) */}
                {hasSizes && !soldOut && (
                  <div className="flex items-center gap-1 mt-2 pl-4.5">
                    <button
                      onClick={() => handleSelectSize(product.id, 'M')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                        size === 'M'
                          ? 'bg-[#7E9C72] text-[#0B1509]'
                          : 'bg-black/40 text-white/60 hover:text-white'
                      }`}
                    >
                      M · {product.prices.M} ₼
                    </button>
                    <button
                      onClick={() => handleSelectSize(product.id, 'L')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                        size === 'L'
                          ? 'bg-[#7E9C72] text-[#0B1509]'
                          : 'bg-black/40 text-white/60 hover:text-white'
                      }`}
                    >
                      L · {product.prices.L} ₼
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Price & Add Button */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-[#E3D7B1]">
                    {price} ₼
                  </span>
                </div>

                <button
                  onClick={() => handleQuickAdd(product)}
                  disabled={soldOut}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                    soldOut
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : isAdded
                      ? 'bg-emerald-500 text-white scale-105'
                      : 'bg-[#FAF6EE] text-[#0B1509] hover:bg-[#7E9C72] shadow'
                  }`}
                >
                  {isAdded ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
