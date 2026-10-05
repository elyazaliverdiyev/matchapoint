import React from 'react'
import { ExternalLink, Sparkles, Clock, ShieldCheck, Gift } from 'lucide-react'

export const WoltHighlight: React.FC = () => {
  return (
    <section id="wolt" className="py-12 sm:py-20 px-4 max-w-7xl mx-auto">
      <div className="relative rounded-3xl p-6 sm:p-12 overflow-hidden bg-gradient-to-br from-[#003B46]/40 via-[#102A14]/70 to-[#0B1509] border border-[#00C2E8]/30 shadow-2xl">
        
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#00C2E8]/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#7E9C72]/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Wolt & Surprise Box description */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2E8]/15 border border-[#00C2E8]/30 text-[#00C2E8] text-xs font-bold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              <span>Официальная экспресс-доставка Wolt Baku</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#FAF6EE] leading-tight">
              Заказывайте Матчу и Выпечку прямо к двери
            </h2>

            <p className="text-xs sm:text-sm text-[#FAF6EE]/70 leading-relaxed font-light">
              Все слоеные напитки упаковываются в герметичные бокалы с сохранением температурных слоев. Свежие синнабоны, бейглы и пицца выпекаются в день заказа.
            </p>

            {/* Surprise Box Special Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E3D7B1] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E3D7B1]" />
                  Хит вечера: Surprise Box (12 ₼)
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 font-bold">
                  Скидка ~40%
                </span>
              </div>
              <p className="text-xs text-white/60 italic">
                «We have some fresh pastry left, so run and get your surprise Box on Wolt ✨😊»
              </p>
              <p className="text-[11px] text-white/40">
                Появляется за 1-2 часа до закрытия, когда на витрине остается свежая выпечка. Раскупается за считанные минуты!
              </p>
            </div>

            {/* Delivery highlights */}
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00C2E8]" />
                <span>Доставка 25–40 мин по Баку</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#7E9C72]" />
                <span>Термо-упаковка для слоев льда и пенки</span>
              </div>
            </div>
          </div>

          {/* Right: Wolt Action Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-black/50 border border-white/10 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#00C2E8] flex items-center justify-center shadow-lg shadow-[#00C2E8]/30">
              <span className="text-white font-black text-2xl tracking-tighter">
                wolt
              </span>
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl text-[#FAF6EE]">
                MATCHA POINT | BAKU
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Рейтинг 4.8 ★ · Быстрая курьерская доставка
              </p>
            </div>

            <a
              href="https://wolt.com/az/aze/baku/restaurant/matchapoint"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#00C2E8] hover:bg-[#00a9cb] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#00C2E8]/20 hover:scale-[1.02] active:scale-95"
            >
              <span>Открыть в приложении Wolt</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <span className="text-[11px] text-white/40">
              Прием заказов до 20:40 в дни работы бара
            </span>
          </div>

        </div>

      </div>
    </section>
  )
}
