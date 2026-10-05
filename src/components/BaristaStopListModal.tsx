import React, { useState } from 'react'
import { Product } from '../types'
import { X, Search, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface BaristaStopListModalProps {
  products: Product[]
  soldOutIds: string[]
  onToggleSoldOut: (productId: string) => void
  onResetStopList: () => void
  onClose: () => void
}

export const BaristaStopListModal: React.FC<BaristaStopListModalProps> = ({
  products,
  soldOutIds,
  onToggleSoldOut,
  onResetStopList,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-5 sm:p-6 border border-white/20 max-h-[85vh] flex flex-col shadow-2xl animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="font-serif font-bold text-lg text-[#FAF6EE]">
                Панель Бариста · Стоп-лист
              </h3>
            </div>
            <p className="text-xs text-[#FAF6EE]/50 mt-0.5">
              Управление наличием позиций в меню в 1 клик
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Stats */}
        <div className="py-3 space-y-2 border-b border-white/10">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Поиск по названию или ингредиенту..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-[#FAF6EE] placeholder:text-white/40 focus:outline-none focus:border-[#7E9C72]"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-white/60 px-1">
            <span>
              В стоп-листе: <strong className="text-rose-400">{soldOutIds.length}</strong> из {products.length}
            </span>
            {soldOutIds.length > 0 && (
              <button
                onClick={onResetStopList}
                className="flex items-center gap-1 text-[11px] text-[#A7C09D] hover:text-white underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Вернуть всё в наличие
              </button>
            )}
          </div>
        </div>

        {/* Product list with toggles */}
        <div className="flex-1 overflow-y-auto space-y-2 py-3 no-scrollbar">
          {filtered.map((product) => {
            const isSoldOut = soldOutIds.includes(product.id)

            return (
              <div
                key={product.id}
                onClick={() => onToggleSoldOut(product.id)}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${
                  isSoldOut
                    ? 'bg-rose-950/20 border-rose-800/40'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#FAF6EE] truncate">
                      {product.name}
                    </span>
                    {product.tag && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/60">
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/40 truncate">
                    {product.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                    isSoldOut
                      ? 'bg-rose-900/60 text-rose-300'
                      : 'bg-emerald-950/60 text-emerald-300'
                  }`}>
                    {isSoldOut ? 'Sold Out' : 'В наличии'}
                  </span>
                  <div className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                    isSoldOut ? 'bg-rose-700 justify-end' : 'bg-zinc-700 justify-start'
                  }`}>
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-white/40">
            Сохраняется в памяти браузера
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#FAF6EE] text-[#0B1509] font-bold text-xs cursor-pointer hover:bg-white"
          >
            Готово
          </button>
        </div>

      </div>
    </div>
  )
}
