import React, { useState } from 'react'
import { Product, ProductCategory, ProductSize } from '../types'
import { Plus, Check, AlertCircle, Sparkles } from 'lucide-react'

interface MenuSectionProps {
  products: Product[]
  onAddToCart: (product: Product, size: ProductSize) => void
  isSoldOut: (productId: string) => boolean
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  products,
  onAddToCart,
  isSoldOut,
}) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all')
  const [itemSizes, setItemSizes] = useState<Record<string, ProductSize>>({})
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null)

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory)

  const handleSizeChange = (productId: string, size: ProductSize) => {
    setItemSizes((prev) => ({ ...prev, [productId]: size }))
  }

  const handleAdd = (product: Product) => {
    const size = itemSizes[product.id] || (product.prices.M ? 'M' : 'standard')
    onAddToCart(product, size)
    setRecentlyAddedId(product.id)
    setTimeout(() => setRecentlyAddedId(null), 1200)
  }

  return (
    <section id="menu" className="py-6 sm:py-10 px-3 sm:px-4 w-full">
      
      {/* ── SECTION HEADER ── */}
      <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#7E9C72] font-semibold">
          Kyoto Matcha & Baku Bakery
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-[#FAF6EE] mt-1 tracking-tight">
          Полное Меню Бара
        </h2>
        <p className="text-xs text-[#FAF6EE]/60 mt-1 font-normal">
          Японская церемониальная матча и свежая ежедневная выпечка.
        </p>

        {/* ── CATEGORY FILTER PILLS (Mobile horizontal scroll) ── */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-4 justify-start sm:justify-center">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all flex-shrink-0 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#FAF6EE] text-[#0B1509] shadow-md font-bold'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            Все ({products.length})
          </button>
          <button
            onClick={() => setActiveCategory('matcha')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all flex-shrink-0 cursor-pointer ${
              activeCategory === 'matcha'
                ? 'bg-[#7E9C72] text-[#0B1509] shadow-md font-bold'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            Matcha 🍃
          </button>
          <button
            onClick={() => setActiveCategory('bakery')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all flex-shrink-0 cursor-pointer ${
              activeCategory === 'bakery'
                ? 'bg-[#E3D7B1] text-[#0B1509] shadow-md font-bold'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            Выпечка 🥐
          </button>
          <button
            onClick={() => setActiveCategory('coffee_tea')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all flex-shrink-0 cursor-pointer ${
              activeCategory === 'coffee_tea'
                ? 'bg-[#FAF6EE] text-[#0B1509] shadow-md font-bold'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            Кофе & Чай ☕
          </button>
        </div>
      </div>

      {/* ── EDITORIAL MENU LIST ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredProducts.map((product) => {
          const soldOut = isSoldOut(product.id)
          const currentSize = itemSizes[product.id] || (product.prices.M ? 'M' : 'standard')
          const price = currentSize === 'M'
            ? product.prices.M
            : currentSize === 'L'
            ? product.prices.L
            : product.prices.standard
          const isAdded = recentlyAddedId === product.id

          const hasSizes = !!(product.prices.M && product.prices.L)

          return (
            <div
              key={product.id}
              className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between border ${
                soldOut
                  ? 'bg-black/30 border-white/5 opacity-60'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-white/20 shadow-xl'
              }`}
            >
              {/* Card top row: Tags & Badges */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  {product.tag ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#A7C09D] text-[10px] font-bold uppercase tracking-wider">
                      {product.tag}
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider text-white/30">
                      MP Baku
                    </span>
                  )}

                  {soldOut && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/40 text-[10px] font-bold uppercase">
                      Sold Out
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[#FAF6EE] leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#FAF6EE]/60 mt-0.5 leading-relaxed">
                      {product.subtitle}
                    </p>
                  </div>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-13 h-13 object-contain flex-shrink-0 drop-shadow-md rounded-lg"
                    />
                  )}
                </div>
                {product.description && (
                  <p className="text-[11px] text-[#FAF6EE]/40 mt-2 italic line-clamp-2">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Card bottom row: Size Switcher + Price + Add Button */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                
                {/* Size toggle or standard badge */}
                {hasSizes ? (
                  <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/5 text-[11px]">
                    <button
                      onClick={() => handleSizeChange(product.id, 'M')}
                      className={`px-2.5 py-1 rounded font-bold transition-all ${
                        currentSize === 'M'
                          ? 'bg-[#7E9C72] text-[#0B1509]'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      M
                    </button>
                    <button
                      onClick={() => handleSizeChange(product.id, 'L')}
                      className={`px-2.5 py-1 rounded font-bold transition-all ${
                        currentSize === 'L'
                          ? 'bg-[#7E9C72] text-[#0B1509]'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      L
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#A7C09D] font-medium">
                    Свежая порция
                  </span>
                )}

                {/* Price and Add CTA */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-lg font-bold tracking-tight text-[#FAF6EE]">
                      {price}
                    </span>
                    <span className="text-xs text-[#7E9C72] ml-0.5 font-bold">₼</span>
                  </div>

                  <button
                    onClick={() => handleAdd(product)}
                    disabled={soldOut}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      soldOut
                        ? 'bg-white/5 text-white/20 cursor-not-allowed'
                        : isAdded
                        ? 'bg-emerald-500 text-white scale-105'
                        : 'bg-[#FAF6EE] text-[#0B1509] hover:bg-[#7E9C72] hover:scale-105 active:scale-95 shadow'
                    }`}
                  >
                    {isAdded ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>

              </div>

            </div>
          )
        })}
      </div>

    </section>
  )
}
