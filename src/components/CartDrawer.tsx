import React, { useState } from 'react'
import { CartItem, PaymentMethod } from '../types'
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Smartphone, 
  QrCode, 
  CreditCard, 
  ExternalLink, 
  ArrowRight,
  Sparkles,
  User
} from 'lucide-react'
import { playTapSound } from '../lib/audio'

interface CartDrawerProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, delta: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
  onCheckout: (
    customerName: string, 
    orderType: 'takeaway' | 'dinein', 
    paymentMethod: PaymentMethod
  ) => void
  onClose: () => void
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onClose,
}) => {
  const [orderType, setOrderType] = useState<'takeaway' | 'dinein'>('takeaway')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('nfc_tap')
  const [customerName, setCustomerName] = useState('')

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleCreateOrder = () => {
    if (items.length === 0) return
    playTapSound()
    const finalName = customerName.trim() || 'Гость бара'
    onCheckout(finalName, orderType, paymentMethod)
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
              <h3 className="font-editorial font-bold text-lg">
                Ваш Заказ
              </h3>
              <p className="text-xs text-white/50">
                {totalCount > 0 ? `${totalCount} поз. в корзине` : 'Корзина пуста'}
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
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 no-scrollbar">
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
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3"
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

        {/* Checkout Flow Form */}
        {items.length > 0 && (
          <div className="pt-3 border-t border-white/10 space-y-3.5">
            
            {/* Guest Name input */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold flex items-center gap-1.5 px-1">
                <User className="w-3 h-3 text-[#7E9C72]" />
                Имя для стаканчика:
              </label>
              <input
                type="text"
                placeholder="Например: Лейла, Рауф..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-[#FAF6EE] placeholder:text-white/30 focus:outline-none focus:border-[#7E9C72]"
              />
            </div>

            {/* Takeaway / Dine-in Selector */}
            <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl border border-white/5 text-xs font-bold">
              <button
                onClick={() => setOrderType('takeaway')}
                className={`py-1.5 rounded-lg transition-all ${
                  orderType === 'takeaway'
                    ? 'bg-[#7E9C72] text-[#0B1509] shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                С собой (To-Go)
              </button>
              <button
                onClick={() => setOrderType('dinein')}
                className={`py-1.5 rounded-lg transition-all ${
                  orderType === 'dinein'
                    ? 'bg-[#7E9C72] text-[#0B1509] shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                В баре (Dine-in)
              </button>
            </div>

            {/* PAYMENT METHOD SELECTOR */}
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-white/50 font-semibold px-1">
                Способ оплаты в заведении:
              </label>

              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                
                {/* 1. NFC TAP TO PHONE */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nfc_tap')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'nfc_tap'
                      ? 'bg-emerald-950/40 border-[#7E9C72] text-[#FAF6EE] ring-1 ring-[#7E9C72]'
                      : 'bg-black/30 border-white/10 text-white/60 hover:bg-black/50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#7E9C72]" />
                  <span className="font-bold leading-tight">NFC Телефон</span>
                  <span className="text-[9px] text-white/40">Tap to Phone</span>
                </button>

                {/* 2. QR M10 / BIRBANK */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qr_m10')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'qr_m10'
                      ? 'bg-sky-950/40 border-[#2AABEE] text-[#FAF6EE] ring-1 ring-[#2AABEE]'
                      : 'bg-black/30 border-white/10 text-white/60 hover:bg-black/50'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#2AABEE]" />
                  <span className="font-bold leading-tight">m10 / QR</span>
                  <span className="text-[9px] text-white/40">Кэшбэк до 10%</span>
                </button>

                {/* 3. POS КАССА */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pos_cash')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'pos_cash'
                      ? 'bg-amber-950/40 border-amber-400 text-[#FAF6EE] ring-1 ring-amber-400'
                      : 'bg-black/30 border-white/10 text-white/60 hover:bg-black/50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span className="font-bold leading-tight">Касса / POS</span>
                  <span className="text-[9px] text-white/40">Карта / Нал</span>
                </button>

              </div>
            </div>

            {/* Total calculation */}
            <div className="flex items-baseline justify-between px-1 pt-1">
              <span className="text-xs uppercase tracking-widest text-white/50">
                Итого к оплате
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-serif font-bold text-[#FAF6EE]">
                  {totalAmount}
                </span>
                <span className="text-xs font-bold text-[#7E9C72]">₼ AZN</span>
              </div>
            </div>

            {/* Benchmark Action: Get Live Ticket */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleCreateOrder}
                className="w-full py-3.5 rounded-2xl bg-[#FAF6EE] hover:bg-white text-[#0B1509] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#0B1509]" />
                <span>Оформить заказ · Получить Талон</span>
                <ArrowRight className="w-4 h-4 text-[#0B1509]" />
              </button>

              <a
                href="https://wolt.com/az/aze/baku/restaurant/matchapoint"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl bg-[#00C2E8]/10 hover:bg-[#00C2E8]/20 border border-[#00C2E8]/25 text-[#00C2E8] font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Или заказать доставку курьером в Wolt</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="text-center pt-0.5">
              <button
                onClick={onClearCart}
                className="text-[10px] text-white/40 hover:text-white/70 underline cursor-pointer"
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
