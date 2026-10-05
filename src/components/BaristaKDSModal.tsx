import React, { useState } from 'react'
import { Order, OrderStatus, Product } from '../types'
import { 
  X, 
  Search, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Coffee, 
  Sparkles, 
  Sliders, 
  Volume2, 
  PlusCircle,
  QrCode
} from 'lucide-react'
import { playOrderReadySound, playTapSound } from '../lib/audio'

interface BaristaKDSModalProps {
  orders: Order[]
  products: Product[]
  soldOutIds: string[]
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void
  onToggleSoldOut: (productId: string) => void
  onResetStopList: () => void
  onCreateDemoOrder?: () => void
  onClose: () => void
}

export const BaristaKDSModal: React.FC<BaristaKDSModalProps> = ({
  orders,
  products,
  soldOutIds,
  onUpdateOrderStatus,
  onToggleSoldOut,
  onResetStopList,
  onCreateDemoOrder,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'kds' | 'stoplist'>('kds')
  const [searchTerm, setSearchTerm] = useState('')

  // Orders filtered
  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled')

  const pendingPaymentOrders = activeOrders.filter((o) => o.status === 'pending_payment')
  const preparingOrders = activeOrders.filter((o) => o.status === 'paid' || o.status === 'preparing')
  const readyOrders = activeOrders.filter((o) => o.status === 'ready')

  // Stoplist products filter
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    playTapSound()
    if (status === 'ready') {
      playOrderReadySound()
    }
    onUpdateOrderStatus(orderId, status)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#0A140B] border border-white/20 rounded-3xl flex flex-col shadow-2xl text-[#FAF6EE] overflow-hidden">
        
        {/* Top Navbar of the KDS Modal */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#7E9C72]/20 flex items-center justify-center text-[#7E9C72] font-bold">
              mp.
            </div>
            <div>
              <h2 className="font-editorial text-base sm:text-lg font-bold">
                Панель Управления Бариста · MP KDS
              </h2>
              <p className="text-[11px] text-white/50">
                Живая очередь заказов, подтверждение NFC и стоп-лист
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Test */}
            <button
              onClick={() => playOrderReadySound()}
              title="Тест звукового колокольчика готовности"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-[#7E9C72]" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 border-b border-white/10 flex items-center justify-between bg-black/20">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('kds')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'kds'
                  ? 'border-[#7E9C72] text-[#FAF6EE]'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Очередь заказов ({activeOrders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('stoplist')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'stoplist'
                  ? 'border-[#7E9C72] text-[#FAF6EE]'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Стоп-лист ({soldOutIds.length})</span>
            </button>
          </div>

          {activeTab === 'kds' && onCreateDemoOrder && (
            <button
              onClick={onCreateDemoOrder}
              className="mb-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-[#A7C09D] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Тестовый заказ</span>
            </button>
          )}
        </div>

        {/* TAB 1: KITCHEN DISPLAY SYSTEM (ORDERS) */}
        {activeTab === 'kds' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar space-y-6">
            
            {activeOrders.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <span className="text-4xl block">🍃</span>
                <h3 className="font-serif font-bold text-lg text-white/80">
                  Очередь заказов пуста
                </h3>
                <p className="text-xs text-white/40 max-w-sm mx-auto">
                  Сделайте заказ в приложении гостя или нажмите кнопку «Тестовый заказ» выше, чтобы проверить работу системы.
                </p>
                {onCreateDemoOrder && (
                  <button
                    onClick={onCreateDemoOrder}
                    className="mt-3 px-4 py-2 rounded-xl bg-[#7E9C72] text-[#0B1509] font-bold text-xs uppercase cursor-pointer"
                  >
                    Создать заказ гостя
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* COLUMN 1: PENDING PAYMENT (NFC / QR / CASH) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      1. Ожидают Оплаты ({pendingPaymentOrders.length})
                    </span>
                  </div>

                  <div className="space-y-3">
                    {pendingPaymentOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-amber-950/15 border border-amber-500/30 space-y-3 shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-editorial font-black text-amber-200">
                            {ord.id}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-900/40 text-amber-300">
                            {ord.paymentMethod === 'nfc_tap' ? 'NFC SoftPOS' : ord.paymentMethod === 'qr_m10' ? 'm10 QR' : 'Касса'}
                          </span>
                        </div>

                        <div>
                          <span className="text-xs font-bold text-white">
                            Для: {ord.customerName}
                          </span>
                          <span className="text-[10px] text-white/50 block">
                            {ord.orderType === 'takeaway' ? 'С собой (To-Go)' : 'В зале'} · {ord.createdAt}
                          </span>
                        </div>

                        {/* Order items */}
                        <div className="text-xs space-y-1 py-1 border-t border-white/5 text-white/80">
                          {ord.items.map((it) => (
                            <div key={it.id} className="flex justify-between text-[11px]">
                              <span>{it.name} ({it.size}) ×{it.quantity}</span>
                              <span className="font-bold">{it.price * it.quantity} ₼</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-white/10">
                          <span className="text-xs font-bold text-amber-300">
                            Сумма: {ord.totalAmount} ₼
                          </span>
                          <button
                            onClick={() => handleStatusChange(ord.id, 'preparing')}
                            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow"
                          >
                            <Smartphone className="w-3 h-3" />
                            <span>Оплачено (NFC ✓)</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN 2: PREPARING (WHISKING / BAKING) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#A7C09D] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#7E9C72] animate-pulse" />
                      2. Взбивание / Готовка ({preparingOrders.length})
                    </span>
                  </div>

                  <div className="space-y-3">
                    {preparingOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-white/[0.04] border border-[#7E9C72]/40 space-y-3 shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-editorial font-black text-[#FAF6EE]">
                            {ord.id}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#7E9C72]/20 text-[#A7C09D] font-bold">
                            Оплачен ✓
                          </span>
                        </div>

                        <div>
                          <span className="text-xs font-bold text-white">
                            Для: {ord.customerName}
                          </span>
                          <span className="text-[10px] text-white/50 block">
                            {ord.orderType === 'takeaway' ? 'С собой' : 'В зале'}
                          </span>
                        </div>

                        <div className="text-xs space-y-1 py-1 border-t border-white/5 text-white/80">
                          {ord.items.map((it) => (
                            <div key={it.id} className="flex justify-between text-[11px]">
                              <span>{it.name} ({it.size}) ×{it.quantity}</span>
                              <span className="font-bold">{it.price * it.quantity} ₼</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-white/10">
                          <button
                            onClick={() => handleStatusChange(ord.id, 'ready')}
                            className="w-full py-2 rounded-xl bg-[#7E9C72] hover:bg-[#6c8c60] text-[#0B1509] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Готов к выдаче! ✨</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN 3: READY FOR PICKUP */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                      3. На стойке выдачи ({readyOrders.length})
                    </span>
                  </div>

                  <div className="space-y-3">
                    {readyOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-black/40 border-2 border-[#D4AF37] space-y-3 shadow-xl"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-editorial font-black text-[#FAF6EE]">
                            {ord.id}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37] text-black font-black uppercase">
                            Зовёт гостя
                          </span>
                        </div>

                        <div>
                          <span className="text-xs font-bold text-white">
                            Гость: {ord.customerName}
                          </span>
                          <p className="text-[11px] text-white/70 mt-0.5">
                            {ord.items.map((i) => `${i.name} (${i.size})`).join(', ')}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex gap-2">
                          <button
                            onClick={() => playOrderReadySound()}
                            title="Повторно позвать звуком"
                            className="px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white transition-colors cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleStatusChange(ord.id, 'completed')}
                            className="flex-1 py-2 rounded-xl bg-white hover:bg-white/90 text-black font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow"
                          >
                            <span>✓ Выдан гостю</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 2: STOP LIST PANEL */}
        {activeTab === 'stoplist' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Поиск по меню..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#7E9C72]"
                />
              </div>

              {soldOutIds.length > 0 && (
                <button
                  onClick={onResetStopList}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-xs text-[#A7C09D] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Сбросить всё ({soldOutIds.length})</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {filteredProducts.map((p) => {
                const isOut = soldOutIds.includes(p.id)

                return (
                  <div
                    key={p.id}
                    onClick={() => onToggleSoldOut(p.id)}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${
                      isOut
                        ? 'bg-rose-950/25 border-rose-700/50'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white truncate block">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-white/40 truncate block">
                        {p.subtitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isOut ? 'bg-rose-900/60 text-rose-300' : 'bg-emerald-950/60 text-emerald-300'
                      }`}>
                        {isOut ? 'Sold Out' : 'В наличии'}
                      </span>
                      <div className={`w-10 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                        isOut ? 'bg-rose-700 justify-end' : 'bg-zinc-700 justify-start'
                      }`}>
                        <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-black/40 text-xs text-white/40">
          <span>Синхронизация заказов: Активна</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs uppercase cursor-pointer hover:bg-white/90"
          >
            Закрыть консоль
          </button>
        </div>

      </div>
    </div>
  )
}
