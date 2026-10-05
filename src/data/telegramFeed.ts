import { TelegramPost } from '../types'

export const TELEGRAM_POSTS: TelegramPost[] = [
  {
    id: 'tg-1',
    timestamp: 'Сегодня 18:30',
    author: 'MATCHAPOINT | BAKU',
    text: 'Everything is in stock! Open till 21:00. Fish bagels and Berry Boba are freshly ready 💚',
    badge: 'In Stock',
  },
  {
    id: 'tg-2',
    timestamp: 'Вчера 19:13',
    author: 'MATCHAPOINT | BAKU',
    text: 'We have some fresh pastry left, so run and get your Surprise Box on Wolt ✨😊',
    badge: 'Wolt Box',
    isUrgent: true,
  },
  {
    id: 'tg-3',
    timestamp: 'Вчера 14:52',
    author: 'MATCHAPOINT | BAKU',
    text: 'Matcha Bon is Available on Wolt! Very rich matcha flavor in every bite! 💚',
    badge: 'New Pastry',
  },
  {
    id: 'tg-4',
    timestamp: '2 дня назад',
    author: 'MATCHAPOINT | BAKU',
    text: '🍁 Pumpkin Cream Matcha is coming very soon 🎃 get ready for our autumn launch!',
    badge: 'Coming Soon',
  },
  {
    id: 'tg-5',
    timestamp: '3 дня назад',
    author: 'MATCHAPOINT | BAKU',
    text: 'Cinnamon rolls are out of stock for today • Only Diavolo pizzas and focaccia left.',
    badge: 'Sold Out Alert',
  },
]
