import React from 'react'
import { Order, OrderStatus } from '../types'
import { 
  Sparkles, 
  Clock, 
  Smartphone, 
  QrCode, 
  CreditCard, 
  CheckCircle2, 
  Coffee, 
  ArrowRight,
  Flame,
  Volume2
} from 'lucide-react'
import { playOrderReadySound, playTapSound } from '../lib/audio'

interface TicketTabContentProps {
  order: Order | null
  onGoToMenu: () => void
  onCreateDemoOrder: () => void
}

export const TicketTabContent: React.FC<TicketTabContentProps> = ({
  order,
  onGoToMenu,
  onCreateDemoOrder,
}) => {
  if (!order) {
    return (
      <div className="p-4 space-y-6 pb-28 animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
        
        <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-2xl relative">
          <Coffee className="w-10 h-10 text-[#7E9C72]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#7E9C72] animate-ping" />
        </div>

        <div className="space-y-2 max-w-xs">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#7E9C72]">
            Цифровой талон очереди
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#FAF6EE]">
            Нет активного талона
          </h2>
          <p className="text-xs text-white/60 leading-relaxed font-light">
            Оформите заказ в меню бара. После отправки вы получите персональный номер талона, статус готовности и звуковой гонг при выдаче напитка.
          </p>
        </div>

        <div className="w-full max-w-xs space-y-2.5 pt-2">
          <button
            onClick={() => {
              playTapSound()
              onGoToMenu()
            }}
            className="w-full py-3.5 rounded-2xl bg-[#7E9C72] hover:bg-[#6A895F] text-[#0B1509] font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#7E9C72]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Coffee className="w-4 h-4" />
            <span>Выбрать в меню</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              playTapSound()
              onCreateDemoOrder()
            }}
            className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium text-xs border border-white/10 transition-colors cursor-pointer"
          >
            🧪 Тестовый заказ (Демо талон)
          </button>
        </div>

      </div>
    )
  }

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { 
      key: 'pending_payment', 
      label: 'Принят', 
      desc: order.paymentMethod === 'nfc_tap' 
        ? 'Ожидает NFC' 
        : order.paymentMethod === 'qr_m10'
        ? 'Ожидает m10 QR' 
        : 'Ожидает кассы' 
    },
    { key: 'paid', label: 'Оплачен', desc: 'В очереди' },
    { key: 'preparing', label: 'Готовится', desc: 'Взбивание' },
    { key: 'ready', label: 'Готов!', desc: 'Выдача' },
  ]

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'pending_payment': return 0
      case 'paid': return 1
      case 'preparing': return 2
      case 'ready':
      case 'completed': return 3
      default: return 0
    }
  }

  const currentStepIdx = getStepIndex(order.status)
  const isReady = order.status === 'ready'

  return (
    <div className="p-4 space-y-4 pb-28 animate-fade-in">
      
      {/* Talon Header Hero Card */}
      <div
        className={`p-5 rounded-3xl border transition-all duration-700 shadow-2xl relative overflow-hidden ${
          isReady
            ? 'bg-gradient-to-br from-[#D4AF37]/30 via-[#2E2408] to-[#0E1A0C] border-[#D4AF37] shadow-[#D4AF37]/20 animate-pulse'
            : 'bg-gradient-to-br from-[#162B15] to-[#0A1609] border-[#7E9C72]/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A7C09D]">
            Live Digital Ticket
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${
              isReady
                ? 'bg-[#D4AF37] text-black animate-bounce'
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            {isReady ? 'Готов к выдаче!' : 'В обработке'}
          </span>
        </div>

        <div className="my-4 flex items-baseline justify-between">
          <div>
            <h1 className="text-4xl font-editorial font-black tracking-wider text-[#FAF6EE]">
              {order.id}
            </h1>
            <p className="text-xs text-white/70 mt-1 flex items-center gap-1.5">
              <span>Имя на стаканчике:</span>
              <strong className="text-white font-bold">{order.customerName}</strong>
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-white/50 block">Сумма заказа</span>
            <span className="text-2xl font-mono font-bold text-[#E3D7B1]">
              {order.totalAmount.toFixed(0)} ₼
            </span>
          </div>
        </div>

        {/* Stepper */}
        <div className="pt-3 border-t border-white/10">
          <div className="grid grid-cols-4 gap-1.5">
            {steps.map((st, idx) => {
              const isPast = idx < currentStepIdx
              const isCurrent = idx === currentStepIdx
              return (
                <div key={st.key} className="text-center space-y-1">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      isPast
                        ? 'bg-emerald-400'
                        : isCurrent
                        ? isReady ? 'bg-[#D4AF37] animate-pulse' : 'bg-[#7E9C72]'
                        : 'bg-white/10'
                    }`}
                  />
                  <span
                    className={`text-[10px] block leading-none font-bold ${
                      isCurrent ? 'text-white' : isPast ? 'text-emerald-400/80' : 'text-white/40'
                    }`}
                  >
                    {st.label}
                  </span>
                  <span className="text-[8px] text-white/40 block leading-tight hidden xs:block">
                    {st.desc}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* Payment instructions (if pending) */}
      {order.status === 'pending_payment' && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40 text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Smartphone className="w-4 h-4" />
            <span>Оплата через {order.paymentMethod === 'nfc_tap' ? 'NFC Tap to Phone' : order.paymentMethod === 'qr_m10' ? 'm10 QR' : 'Кассу'}</span>
          </div>
          <p className="text-white/70 text-[11px] leading-relaxed">
            {order.paymentMethod === 'nfc_tap' && (
              <>Приложите банковскую карту или смартфон с Apple Pay к телефону бариста (SoftPOS терминал ABB / Kapital Bank).</>
            )}
            {order.paymentMethod === 'qr_m10' && (
              <>Откройте приложение m10 или Birbank и отсканируйте QR-код на кассе бара.</>
            )}
            {order.paymentMethod === 'cash' && (
              <>Оплатите заказ наличными или на физическом POS-терминале у стойки.</>
            )}
          </p>
        </div>
      )}

      {/* Items in ticket */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
        <span className="text-[10px] uppercase tracking-wider font-bold text-white/50 block">
          Состав заказа ({order.items.length} поз.)
        </span>
        <div className="divide-y divide-white/5 space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white">{item.name}</span>
                <span className="text-[10px] text-white/50 ml-1.5">
                  ({item.size} × {item.quantity})
                </span>
              </div>
              <span className="font-mono font-bold text-[#E3D7B1]">
                {(item.price * item.quantity).toFixed(0)} ₼
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Audio test button */}
      <button
        onClick={() => playOrderReadySound()}
        className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-white/60 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Проверить звук гонга готовности</span>
      </button>

    </div>
  )
}
