import React from 'react'
import { Send, Clock, Sparkles, AlertTriangle, ExternalLink } from 'lucide-react'
import { TelegramPost } from '../types'

interface TelegramFeedViewProps {
  posts: TelegramPost[]
}

export const TelegramFeedView: React.FC<TelegramFeedViewProps> = ({ posts }) => {
  return (
    <div className="p-4 space-y-4 pb-28 animate-fade-in">
      
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#0F2B36] to-[#0D1C0F] border border-[#2AABEE]/30 shadow-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#2AABEE]/20 flex items-center justify-center text-[#2AABEE]">
              <Send className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-editorial text-xs font-bold text-white tracking-wider">
                TELEGRAM LIVE BROADCAST
              </h3>
              <p className="text-[10px] text-white/50">
                Канал предпринимательницы @matchapointbaku
              </p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <p className="text-xs text-white/70 leading-relaxed font-light">
          Все самые свежие новости заведения: запуск новых сезонных вкусов, появление Surprise Box в Wolt и статус остатка выпечки.
        </p>

        <a
          href="https://t.me/+tbdweAM1P0ExMWNi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2AABEE] text-black font-bold text-[11px] hover:bg-[#2098D5] transition-colors shadow-md"
        >
          <span>Перейти в Telegram-канал</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Feed list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#A7C09D]">
            Последние сообщения ({posts.length})
          </span>
          <span className="text-[10px] text-white/40">
            Обновляется в реальном времени
          </span>
        </div>

        {posts.map((post) => (
          <div
            key={post.id}
            className={`p-4 rounded-2xl border transition-all ${
              post.isUrgent
                ? 'bg-rose-950/20 border-rose-800/40 shadow-lg shadow-rose-950/20'
                : 'bg-white/[0.03] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#FAF6EE] flex items-center gap-1">
                  MATCHAPOINT | BAKU
                </span>
                {post.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      post.isUrgent
                        ? 'bg-rose-600/30 text-rose-300 border border-rose-500/30'
                        : post.badge.toLowerCase().includes('wolt')
                        ? 'bg-[#00C2E8]/20 text-[#00C2E8] border border-[#00C2E8]/40'
                        : 'bg-[#7E9C72]/20 text-[#A7C09D] border border-[#7E9C72]/40'
                    }`}
                  >
                    {post.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] font-mono text-white/40 flex items-center gap-1 flex-shrink-0">
                <Clock className="w-2.5 h-2.5" />
                {post.timestamp}
              </span>
            </div>

            <p className="text-xs text-white/85 whitespace-pre-line leading-relaxed font-light">
              {post.text}
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}
