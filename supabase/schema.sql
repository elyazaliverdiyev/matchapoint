-- ==============================================================================
-- MATCHA POINT (MP BAKU) — SUPABASE REALTIME SCHEMA
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jjuiaxxlrtomvdtpmujy/sql/new
-- ==============================================================================

-- 1. ORDERS TABLE (Live KDS & Customer Digital Tickets)
CREATE TABLE IF NOT EXISTS public.mp_orders (
  id TEXT PRIMARY KEY,
  ticket_number INT NOT NULL DEFAULT 1,
  customer_name TEXT NOT NULL DEFAULT 'Гость',
  phone TEXT,
  order_type TEXT NOT NULL DEFAULT 'takeaway',
  payment_method TEXT NOT NULL DEFAULT 'nfc_tap',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  estimated_minutes INT NOT NULL DEFAULT 5,
  created_time TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TELEGRAM POSTS TABLE (Live Feed from Cafe Channel)
CREATE TABLE IF NOT EXISTS public.mp_telegram_posts (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'MATCHAPOINT | BAKU',
  badge TEXT DEFAULT 'Live News',
  is_urgent BOOLEAN NOT NULL DEFAULT false,
  timestamp TEXT DEFAULT 'Только что',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ENABLE REALTIME BROADCAST
ALTER PUBLICATION supabase_realtime ADD TABLE public.mp_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mp_telegram_posts;

-- 4. INSERT INITIAL REAL TELEGRAM ANNOUNCEMENTS
INSERT INTO public.mp_telegram_posts (id, text, author, badge, is_urgent, timestamp) VALUES
('tg-1', 'Everything is in stock! Open till 21:00. Fish bagels and Berry Boba are freshly ready 💚', 'MATCHAPOINT | BAKU', 'In Stock', false, 'Сегодня 18:30'),
('tg-2', 'We have some fresh pastry left, so run and get your Surprise Box on Wolt ✨😊', 'MATCHAPOINT | BAKU', 'Wolt Box', true, 'Вчера 19:13'),
('tg-3', 'Matcha Bon is Available on Wolt! Very rich matcha flavor in every bite! 💚', 'MATCHAPOINT | BAKU', 'New Pastry', false, 'Вчера 14:52'),
('tg-4', '🍁 Pumpkin Cream Matcha is coming very soon 🎃 get ready for our autumn launch!', 'MATCHAPOINT | BAKU', 'Coming Soon', false, '2 дня назад'),
('tg-5', 'Cinnamon rolls are out of stock for today • Only Diavolo pizzas and focaccia left.', 'MATCHAPOINT | BAKU', 'Sold Out Alert', true, '3 дня назад')
ON CONFLICT (id) DO NOTHING;
