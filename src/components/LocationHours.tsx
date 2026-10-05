import React from 'react'
import { MapPin, Clock, Navigation, ExternalLink, Calendar } from 'lucide-react'

export const LocationHours: React.FC = () => {
  const googleMapsUrl = 'https://maps.google.com/?q=40.3626614,49.9528522'

  return (
    <section id="location" className="py-16 sm:py-24 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Left: Schedule & Concept */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 flex flex-col justify-between border border-white/10 shadow-2xl space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#7E9C72] font-semibold tracking-wider uppercase">
              <Clock className="w-3.5 h-3.5" />
              <span>График Работы Бара</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#FAF6EE]">
              Мы открыты по Средам и Выходным
            </h2>

            <p className="text-xs sm:text-sm text-[#FAF6EE]/60 font-light leading-relaxed">
              Мы выпекаем выпечку и завариваем матчу ограниченными свежими партиями. Чтобы гарантировать максимальную свежесть, бар принимает гостей по фиксированному графику:
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#7E9C72]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#FAF6EE]">
                      Среда (Wednesday)
                    </h4>
                    <p className="text-[11px] text-white/50">
                      Midweek Matcha & Fresh Bakes
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#FAF6EE] px-2.5 py-1 rounded-lg bg-black/40">
                  14:00 – 21:00
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#7E9C72]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#FAF6EE]">
                      Суббота – Воскресенье (Sat–Sun)
                    </h4>
                    <p className="text-[11px] text-white/50">
                      Weekend Specialty & Boba Bar
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#FAF6EE] px-2.5 py-1 rounded-lg bg-black/40">
                  14:00 – 21:00
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-white/40 pt-4 border-t border-white/10">
            * Прием заказов на доставку через Wolt прекращается за 20 минут до закрытия (в 20:40).
          </div>
        </div>

        {/* Right: Location & Map Access */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 flex flex-col justify-between border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#A7C09D] font-semibold tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5" />
              <span>Baku, Azerbaijan</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF6EE]">
              Уютная локация в Баку
            </h3>

            <p className="text-xs sm:text-sm text-[#FAF6EE]/60 font-light leading-relaxed">
              Тихий японский уголок среди города. Минималистичный интерьер, живая зелень, аромат свежемолотой матчи и теплой корицы.
            </p>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-white/40 font-semibold block">
                Точные координаты GPS:
              </span>
              <p className="font-mono text-sm text-[#7E9C72] font-semibold">
                40.3626614, 49.9528522
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#FAF6EE] hover:bg-white text-[#0B1509] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
            >
              <Navigation className="w-4 h-4 text-[#0B1509]" />
              <span>Проложить маршрут в Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>

            <div className="flex items-center justify-between text-xs text-white/50 px-1">
              <span>Доступна парковка рядом</span>
              <span>Wi-Fi & Takeaway bar</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
