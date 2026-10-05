import React, { useState } from 'react'
import { TelegramPost } from '../types'
import { Send, Bell, ChevronRight, X, ExternalLink } from 'lucide-react'

interface TelegramLiveTickerProps {
  posts: TelegramPost[]
}

export const TelegramLiveTicker: React.FC<TelegramLiveTickerProps> = ({ posts }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const latestPost = posts[0]

  return (
    <>
      {/* ── TICKER STRIP ── */}
      <section id="telegram" className="relative z-20 bg-[#142310] border-y border-white/10 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#2AABEE]/20 border border-[#2AABEE]/30 text-[#2AABEE] text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2AABEE] animate-pulse" />
              <span>TG Live</span>
            </div>

            <div className="flex items-center gap-2 overflow-hidden text-xs text-[#FAF6EE]/90">
              <span className="font-semibold text-[#A7C09D] hidden sm:inline">
                {latestPost.author}:
              </span>
              <p className="truncate font-medium">
                {latestPost.text}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setModalOpen(true)}
              className="text-xs text-[#A7C09D] hover:text-white flex items-center gap-1 underline underline-offset-4 cursor-pointer"
            >
              <span className="hidden xs:inline">Все сводки</span> ({posts.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <a
              href="https://t.me/+tbdweAM1P0ExMWNi"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-full bg-[#2AABEE] hover:bg-[#2299d6] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Send className="w-3 h-3" />
              <span className="hidden sm:inline">Канал</span>
            </a>
          </div>

        </div>
      </section>

      {/* ── TELEGRAM FEED MODAL ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel rounded-3xl p-5 sm:p-6 border border-white/15 max-h-[85vh] flex flex-col shadow-2xl animate-fade-in">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#2AABEE]/20 text-[#2AABEE] flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#FAF6EE]">
                    MATCHAPOINT | BAKU LIVE
                  </h3>
                  <p className="text-xs text-[#FAF6EE]/50">
                    Оперативные сводки наличия десертов, пиццы и Wolt
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Posts stream */}
            <div className="flex-1 overflow-y-auto space-y-3 py-4 no-scrollbar">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    post.isUrgent
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-[#A7C09D]">
                      {post.author}
                    </span>
                    <span className="text-[10px] text-white/40">
                      {post.timestamp}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#FAF6EE]/90 leading-relaxed">
                    {post.text}
                  </p>
                  {post.badge && (
                    <div className="mt-2 flex">
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#7E9C72] text-[10px] font-bold">
                        {post.badge}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer action */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/50">
                Официальный чат-канал MP
              </span>
              <a
                href="https://t.me/+tbdweAM1P0ExMWNi"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#2AABEE] hover:bg-[#2299d6] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <span>Подписаться в Telegram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
