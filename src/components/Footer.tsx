import React from 'react'
import { Send, ExternalLink, Heart } from 'lucide-react'

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#080F07] pt-14 pb-12 px-4 text-[#FAF6EE]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-2xl tracking-tight">
                mp.
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-[#7E9C72] font-semibold">
                Matcha Bar Baku
              </span>
            </div>
            <p className="text-xs text-white/50 max-w-sm font-light">
              Specialty matcha & fresh daily pastries. First authentic layered boba matcha concept in Baku.
            </p>
          </div>

          {/* Social and delivery links */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/matchapointbaku/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 transition-colors"
            >
              <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
              <span>@matchapointbaku</span>
            </a>

            <a
              href="https://t.me/+tbdweAM1P0ExMWNi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 transition-colors"
            >
              <Send className="w-4 h-4 text-[#2AABEE]" />
              <span>Telegram Channel</span>
            </a>

            <a
              href="https://wolt.com/az/aze/baku/restaurant/matchapoint"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00C2E8]/10 hover:bg-[#00C2E8]/20 border border-[#00C2E8]/30 text-xs font-semibold text-[#00C2E8] transition-colors"
            >
              <span>Wolt Baku</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Editorial Big Statement */}
        <div className="py-6 border-y border-white/5 text-center">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-widest text-white/20 select-none">
            ALWAYS DRINK MATCHA
          </h2>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <p>© 2023–2026 MATCHA BAR | MP BAKU. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Baku, Azerbaijan</span>
            <span>·</span>
            <span>Uji & Kyoto Ceremonial Grade</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
