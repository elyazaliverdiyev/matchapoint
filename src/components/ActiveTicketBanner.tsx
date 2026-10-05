import React from 'react'
import { Sparkles, ArrowRight, Clock, CheckCircle2 } from 'lucide-react'
import { Order } from '../types'
import { playTapSound } from '../lib/audio'

interface ActiveTicketBannerProps {
  order: Order
  onClick: () => void
}

export const ActiveTicketBanner: React.FC<ActiveTicketBannerProps> = ({ order, onClick }) => {
  const isReady = order.status === 'ready'
  const isPreparing = order.status === 'preparing'

  const getStatusText = () => {
    switch (order.status) {
      case 'pending_payment':
        return order.paymentMethod === 'nfc_tap'
          ? 'Ожидает NFC касания 📱'
          : order.paymentMethod === 'qr_m10'
          ? 'Ожидает QR оплаты m10 📲'
          : 'Ожидает оплаты на кассе'
      case 'paid':
        return 'Оплачен · В очереди бара'
      case 'preparing':
        return `Взбивается бариста 🍵 (~${order.estimatedMinutes} мин)`
      case 'ready':
        return '✨ ГОТОВ К ВЫДАЧЕ НА СТОЙКЕ!'
      case 'completed':
        return 'Выдан · Приятного аппетита!'
      default:
        return 'Заказ оформлен'
    }
  }

  const handleClick = () => {
    playTapSound()
    onClick()
  }

  return (
    <div className="fixed bottom-[74px] left-0 right-0 z-40 pointer-events-auto animate-fade-in">
      <div className="w-full max-w-[440px] mx-auto px-3">
        <button
          onClick={handleClick}
          className={`w-full p-2.5 sm:p-3 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 transition-all cursor-pointer text-left active:scale-[0.98] ${
            isReady
              ? 'bg-[#D4AF37] text-black border-white shadow-[#D4AF37]/40 animate-pulse'
              : isPreparing
              ? 'bg-[#142614]/95 text-white border-[#7E9C72]/60 shadow-black/80'
              : 'bg-[#101E11]/95 text-white border-white/20 shadow-black/80'
          }`}
        >
          {/* Left badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm shadow ${
                isReady
                  ? 'bg-black text-[#D4AF37]'
                  : 'bg-[#7E9C72]/20 text-[#A7C09D] border border-[#7E9C72]/40'
              }`}
            >
              {isReady ? (
                <Sparkles className="w-5 h-5 text-[#D4AF37] animate-spin" style={{ animationDuration: '6s' }} />
              ) : isPreparing ? (
                <Clock className="w-4 h-4 text-[#7E9C72] animate-pulse" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-white/70" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-wider">
                  Талон {order.id}
                </span>
                <span className="text-[10px] opacity-70 truncate">
                  · {order.customerName}
                </span>
              </div>
              <p
                className={`text-[11px] font-medium leading-tight truncate mt-0.5 ${
                  isReady ? 'font-bold text-black' : 'text-[#A7C09D]'
                }`}
              >
                {getStatusText()}
              </p>
            </div>
          </div>

          {/* Right action indicator */}
          <div
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 flex-shrink-0 ${
              isReady
                ? 'bg-black text-white'
                : 'bg-white/10 text-white/90 border border-white/15'
            }`}
          >
            <span>Открыть</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </button>
      </div>
    </div>
  )
}
