import React, { useState } from 'react'
import { CartItem } from '../types'
import { X, Trash2, Plus, Minus, ShoppingBag, Send, ExternalLink, ArrowRight } from 'lucide-react'

interface CartDrawerProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, delta: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
  onClose: () => void
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onClose,
}) => {
  const [orderType, setOrderType] = useState<'takeaway' | 'dinein'>('takeaway')
  const [customerName, setCustomerName] = useState('')

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // Generate WhatsApp order message
  const handleWhatsAppCheckout = () => {
    const lines = [
      `🍵 *Заказ в MATCHA BAR | MP BAKU*`,
      `Тип: ${orderType === 'takeaway' ? 'С собой (Takeaway)' : 'В баре (Dine-in)'}`,
      customerName ? `Имя: ${customerName}` : '',
      `--------------------------`,
      ...items.map(
        (it) => `• ${it.name} (${it.size}) × ${it.quantity} шт = ${it.price * it.quantity} ₼`
      ),
      `--------------------------`,
      `*Итого: ${totalAmount} ₼ AZN*`,
      `\nПожалуйста, подтвердите готовность заказа! 💚`,
    ].filter(Boolean).join('\n')

    const encoded = encodeURIComponent(lines)
    // Baku standard direct contact
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-[#0E1A0C] border-l border-white/10 flex flex-col shadow-2xl p-5 sm:p-6 text-[#FAF6EE]">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#7E9C72]/20 flex items-center justify-center text-[#7E9C72]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg">
                Ваш Заказ
              </h3>
              <p className="text-xs text-white/50">
                {totalCount > 0 ? `${totalCount} поз.` : 'Корзина пуста'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <span className="text-4xl">🍵</span>
              <p className="text-sm font-medium text-white/70">
                В вашей корзине пока нет напитков и десертов
              </p>
              <p className="text-xs text-white/40 max-w-xs">
                Выберите любимую матчу или свежий синнабон в меню бара.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors cursor-pointer"
              >
                Вернуться в меню
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-bold truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-[#A7C09D] font-bold">
                      {item.size}
                    </span>
                    <span className="text-xs font-serif font-bold text-white/80">
                      {item.price} ₼
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center bg-black/40 rounded-lg border border-white/5">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="w-7 h-7 flex items-center justify-center text-white/30 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout & Options Section */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-4">
            
            {/* Takeaway / Dine-in Selector */}
            <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl border border-white/5 text-xs font-bold">
              <button
                onClick={() => setOrderType('takeaway')}
                className={`py-2 rounded-lg transition-all ${
                  orderType === 'takeaway'
                    ? 'bg-[#7E9C72] text-[#0B1509]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                С собой (Takeaway)
              </button>
              <button
                onClick={() => setOrderType('dinein')}
                className={`py-2 rounded-lg transition-all ${
                  orderType === 'dinein'
                    ? 'bg-[#7E9C72] text-[#0B1509]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                В баре (Dine-in)
              </button>
            </div>

            {/* Total calculation */}
            <div className="flex items-baseline justify-between px-1">
              <span className="text-xs uppercase tracking-widest text-white/50">
                Итого к оплате
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-serif font-bold text-[#FAF6EE]">
                  {totalAmount}
                </span>
                <span className="text-sm font-bold text-[#7E9C72]">₼ AZN</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-3.5 rounded-2xl bg-[#FAF6EE] hover:bg-white text-[#0B1509] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                <span>Оформить предзаказ (WhatsApp)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wolt.com/az/aze/baku/restaurant/matchapoint"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#00C2E8]/15 hover:bg-[#00C2E8]/25 border border-[#00C2E8]/30 text-[#00C2E8] font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Или заказать доставку курьером в Wolt</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="text-center">
              <button
                onClick={onClearCart}
                className="text-[11px] text-white/40 hover:text-white/70 underline cursor-pointer"
              >
                Очистить корзину
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
