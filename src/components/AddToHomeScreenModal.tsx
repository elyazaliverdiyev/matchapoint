import React from 'react'
import { X, Smartphone, Share, PlusSquare, ArrowDown } from 'lucide-react'

interface AddToHomeScreenModalProps {
  onClose: () => void
}

export const AddToHomeScreenModal: React.FC<AddToHomeScreenModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-white/20 shadow-2xl space-y-5 animate-fade-in text-[#FAF6EE]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center p-1.5 shadow">
              <img src="/assets/mp-logo.png" alt="mp." className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm">
                MATCHA BAR | MP BAKU
              </h3>
              <p className="text-[11px] text-white/50">
                PWA Мобильное приложение
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-white/70 leading-relaxed">
          Установите приложение MP Baku прямо на домашний экран смартфона для мгновенного доступа к меню, стоп-листу и быстрой доставке:
        </p>

        {/* Step-by-step for iOS & Android */}
        <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/80 font-bold text-[11px] flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <span className="font-bold text-white">В браузере Safari или Chrome:</span>
              <p className="text-[11px] text-white/50 mt-0.5">
                Нажмите кнопку «Поделиться» <Share className="w-3 h-3 inline text-[#2AABEE]" /> внизу экрана (iOS) или меню ⋮ (Android).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/80 font-bold text-[11px] flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <span className="font-bold text-white">Выберите пункт:</span>
              <p className="text-[11px] text-[#7E9C72] font-semibold mt-0.5 flex items-center gap-1">
                <PlusSquare className="w-3 h-3" /> «На экран "Домой"» / «Add to Home Screen»
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#FAF6EE] text-[#0B1509] font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
        >
          Понятно
        </button>

      </div>
    </div>
  )
}
