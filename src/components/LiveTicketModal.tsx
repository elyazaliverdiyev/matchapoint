import React, { useEffect, useState } from 'react'
import { Order, OrderStatus } from '../types'
import { 
  X, 
  Smartphone, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  QrCode, 
  Minimize2, 
  Maximize2, 
  Flame, 
  Share2, 
  Volume2,
  Check
} from 'lucide-react'
import { playOrderReadySound } from '../lib/audio'

interface LiveTicketModalProps {
  order: Order
  onClose: () => void
  onMinimize?: () => void
}

export const LiveTicketModal: React.FC<LiveTicketModalProps> = ({
  order,
  onClose,
  onMinimize,
}) => {
  const [copied, setCopied] = useState(false)
  const [playedAudio, setPlayedAudio] = useState(false)

  // Play audio chime when status becomes ready
  useEffect(() => {
    if (order.status === 'ready' && !playedAudio) {
      playOrderReadySound()
      setPlayedAudio(true)
      // trigger vibration if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 400])
      }
    }
  }, [order.status, playedAudio])

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(order.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Stepper definition
  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { 
      key: 'pending_payment', 
      label: 'Принят', 
      desc: order.paymentMethod === 'nfc_tap' 
        ? 'Ожидает касания NFC' 
        : order.paymentMethod === 'qr_m10'
        ? 'Ожидает m10 QR' 
        : 'Ожидает кассы' 
    },
    { key: 'paid', label: 'Оплачен', desc: 'В очереди бара' },
    { key: 'preparing', label: 'Готовится', desc: 'Взбивание матчи' },
    { key: 'ready', label: 'Готов!', desc: 'На стойке выдачи' },
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
  const isCompleted = order.status === 'completed'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl bg-[#0D180E] border border-white/20 shadow-2xl text-[#FAF6EE] flex flex-col relative">
        
        {/* Ambient Top Glow */}
        <div className={`absolute top-0 left-0 right-0 h-40 pointer-events-none rounded-t-3xl transition-all duration-700 ${
          isReady 
            ? 'bg-gradient-to-b from-[#D4AF37]/30 to-transparent' 
            : 'bg-gradient-to-b from-[#7E9C72]/20 to-transparent'
        }`} />

        {/* Modal Header controls */}
        <div className="relative z-10 p-5 pb-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7E9C72] animate-pulse" />
            <span className="font-editorial text-xs uppercase tracking-[0.25em] text-[#A7C09D] font-bold">
              MP BAKU · LIVE TALON
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onMinimize && (
              <button
                onClick={onMinimize}
                title="Свернуть в мини-трекер"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              title="Закрыть"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Ticket Card Content */}
        <div className="relative z-10 p-5 sm:p-6 space-y-6">

          {/* 1. TICKET NUMBER & GUEST BRANDING */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
              <span className="text-[#A7C09D] font-medium">Статус заказа:</span>
              <span className={`font-bold ${
                isReady 
                  ? 'text-[#E6C65A] animate-pulse' 
                  : order.status === 'preparing'
                  ? 'text-[#A7C09D]'
                  : 'text-white'
              }`}>
                {order.status === 'pending_payment' && 'Ожидает оплаты'}
                {order.status === 'paid' && 'Оплачено · В очереди'}
                {order.status === 'preparing' && 'Взбивается бариста 🍵'}
                {order.status === 'ready' && '✨ ГОТОВ К ВЫДАЧЕ!'}
                {order.status === 'completed' && '✓ Заказ выдан'}
              </span>
            </div>

            {/* Giant Monumental Ticket Code */}
            <div 
              onClick={handleCopyCode}
              className="cursor-pointer group flex items-center justify-center gap-2 pt-1"
              title="Нажмите чтобы скопировать номер"
            >
              <h1 className="text-5xl sm:text-6xl font-editorial font-black tracking-tight text-[#FAF6EE] group-hover:scale-105 transition-transform">
                {order.id}
              </h1>
            </div>
            
            <p className="text-xs text-white/40 flex items-center justify-center gap-1.5">
              <span>{copied ? 'Скопировано!' : 'Нажмите на номер, чтобы скопировать'}</span>
            </p>

            {/* Barista handwritten cup label */}
            <div className="pt-1">
              <span className="inline-block px-4 py-1.5 rounded-xl bg-black/40 border border-white/10 font-serif italic text-sm text-[#E3D7B1]">
                Для: {order.customerName || 'Любителя матчи'} · {order.orderType === 'takeaway' ? 'С собой (To-Go)' : 'В баре'}
              </span>
            </div>
          </div>

          {/* 2. ORDER READY HERO BANNER (When status = ready) */}
          {isReady && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37]/20 via-[#FAF6EE]/15 to-[#D4AF37]/20 border-2 border-[#D4AF37] shadow-xl text-center space-y-2 animate-bounce" style={{ animationIterationCount: 3 }}>
              <div className="flex items-center justify-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <span>ВАШ ЗАКАЗ ГОТОВ!</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-white">
                Пожалуйста, подойдите к барной стойке и назовите номер:
              </p>
              <div className="text-2xl font-editorial font-black text-[#FAF6EE]">
                {order.id}
              </div>
            </div>
          )}

          {/* 3. LIVE STEPPER PROGRESSION BAR */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-white/60 mb-2">
              <span className="font-semibold text-[#A7C09D]">
                Прогресс приготовления
              </span>
              <span className="flex items-center gap-1 font-mono text-white/80">
                <Clock className="w-3.5 h-3.5 text-[#7E9C72]" />
                {isReady ? '0 мин' : `~${order.estimatedMinutes} мин`}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 relative">
              {steps.map((step, idx) => {
                const isPassed = currentStepIdx >= idx
                const isCurrent = currentStepIdx === idx

                return (
                  <div key={step.key} className="flex flex-col items-center text-center">
                    <div className={`w-full h-1.5 rounded-full mb-2 transition-all duration-500 ${
                      isPassed 
                        ? 'bg-[#7E9C72] shadow-sm shadow-[#7E9C72]' 
                        : 'bg-white/10'
                    }`} />
                    <span className={`text-[10px] font-bold tracking-tight ${
                      isCurrent 
                        ? 'text-white' 
                        : isPassed 
                        ? 'text-[#A7C09D]' 
                        : 'text-white/30'
                    }`}>
                      {step.label}
                    </span>
                    <span className="text-[8px] text-white/40 hidden sm:inline truncate max-w-full">
                      {step.desc}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 4. PAYMENT METHOD INSTRUCTIONS & NFC GUIDE */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                Способ оплаты
              </span>
              <span className="text-xs font-bold text-[#A7C09D]">
                {order.paymentMethod === 'nfc_tap' && 'NFC Tap to Phone (Телефон бариста)'}
                {order.paymentMethod === 'qr_m10' && 'm10 / Birbank QR'}
                {order.paymentMethod === 'pos_cash' && 'Касса / Терминал'}
              </span>
            </div>

            {order.paymentMethod === 'nfc_tap' && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-white/80">
                <Smartphone className="w-5 h-5 text-[#7E9C72] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-white">Как оплатить на кассе:</span>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    Подойдите к стойке и приложите карту / Apple Pay к задней крышке смартфона предпринимательницы (ABB Mobile POS). Бариста мгновенно отметит оплату в системе.
                  </p>
                </div>
              </div>
            )}

            {order.paymentMethod === 'qr_m10' && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-white/80">
                <QrCode className="w-5 h-5 text-[#2AABEE] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-white">Оплата через QR m10:</span>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    Откройте приложение m10 или Birbank, нажмите «QR ödəniş» и отсканируйте фирменный код точки на стойке бара.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 5. ITEMIZED ORDER RECEIPT */}
          <div className="space-y-2 pt-1 border-t border-white/10">
            <span className="text-xs uppercase tracking-wider text-white/50 font-semibold block px-1">
              Состав заказа ({order.items.length} поз.)
            </span>

            <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
              {order.items.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7E9C72]" />
                    <span className="font-medium text-white/90">
                      {item.name} ({item.size})
                    </span>
                    <span className="text-white/40">×{item.quantity}</span>
                  </div>
                  <span className="font-serif font-bold text-white">
                    {item.price * item.quantity} ₼
                  </span>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="flex items-baseline justify-between p-3 rounded-xl bg-black/50 border border-white/10">
              <span className="text-xs uppercase tracking-widest text-white/60 font-bold">
                Сумма к оплате
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-serif font-bold text-[#FAF6EE]">
                  {order.totalAmount}
                </span>
                <span className="text-xs font-bold text-[#7E9C72]">₼ AZN</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Action Bar */}
        <div className="relative z-10 p-5 pt-3 border-t border-white/10 flex items-center justify-between gap-3 bg-[#081009] rounded-b-3xl">
          <button
            onClick={handleCopyCode}
            className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Номер скопирован' : 'Показать бариста'}</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl bg-[#FAF6EE] hover:bg-white text-[#0B1509] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            В меню
          </button>
        </div>

      </div>
    </div>
  )
}
