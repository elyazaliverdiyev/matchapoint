import React from 'react'
import { ExternalLink, Sparkles, Clock, ShieldCheck, Gift, Bike } from 'lucide-react'

export const WoltView: React.FC = () => {
  return (
    <div className="p-4 space-y-4 pb-28 animate-fade-in">
      
      {/* Wolt Hero Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#003B46]/70 via-[#0A2211] to-[#0B1509] border border-[#00C2E8]/40 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C2E8]/20 border border-[#00C2E8]/30 text-[#00C2E8] text-[11px] font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5" />
            <span>Wolt Baku Delivery</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800/40">
            25–40 мин
          </span>
        </div>

        <h2 className="text-xl font-bold tracking-tight text-[#FAF6EE] leading-tight">
          Доставка прямо к вашей двери
        </h2>

        <p className="text-xs text-white/70 leading-relaxed font-light">
          Все слоеные напитки упаковываются в герметичные бокалы с сохранением температурных слоев. Свежие синнабоны, бейглы и пицца выпекаются в день заказа.
        </p>

        {/* Surprise Box Callout */}
        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E3D7B1] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E3D7B1]" />
              Хит: Surprise Box (12 ₼)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 font-bold">
              Скидка ~40%
            </span>
          </div>
          <p className="text-xs text-white/70 italic">
            «We have some fresh pastry left, so run and get your surprise Box on Wolt ✨😊»
          </p>
          <p className="text-[11px] text-white/40">
            Появляется в Wolt за 1-2 часа до закрытия, когда на витрине остается свежая выпечка.
          </p>
        </div>

        {/* CTA Button */}
        <a
          href="https://wolt.com/az/aze/baku/restaurant/matchapoint"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-2xl bg-[#00C2E8] hover:bg-[#00A8C9] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00C2E8]/20 cursor-pointer active:scale-95"
        >
          <Bike className="w-4 h-4" />
          <span>Открыть в Wolt Baku</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <Clock className="w-4 h-4 text-[#00C2E8]" />
          <h4 className="text-xs font-bold text-white">Быстрая доставка</h4>
          <p className="text-[10px] text-white/50">В среднем 30 мин по центру Баку</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <ShieldCheck className="w-4 h-4 text-[#7E9C72]" />
          <h4 className="text-xs font-bold text-white">Термоупаковка</h4>
          <p className="text-[10px] text-white/50">Сохраняет слои льда и свежей пенки</p>
        </div>
      </div>

    </div>
  )
}
