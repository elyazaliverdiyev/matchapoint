import { supabase } from './supabase'
import { Order, OrderStatus, Product, TelegramPost } from '../types'
import { TELEGRAM_POSTS } from '../data/telegramFeed'

// ── 1. ORDERS CLOUD SYNC ──

export async function fetchCloudOrders(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('mp_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error || !data) {
      return null
    }

    return data.map((row: any) => ({
      id: row.id,
      ticketNumber: row.ticket_number || parseInt(row.id.replace('#MP-', '')) || 1,
      createdAt: row.created_time || 'Сегодня',
      customerName: row.customer_name || 'Гость',
      phone: row.phone,
      orderType: row.order_type || 'takeaway',
      paymentMethod: row.payment_method || 'nfc_tap',
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items || [],
      totalAmount: Number(row.total_amount) || 0,
      status: row.status as OrderStatus,
      estimatedMinutes: Number(row.estimated_minutes) || 5,
      notes: row.notes,
    }))
  } catch (e) {
    console.warn('Supabase fetchOrders fallback to local storage', e)
    return null
  }
}

export async function saveCloudOrder(order: Order): Promise<boolean> {
  try {
    const { error } = await supabase.from('mp_orders').upsert({
      id: order.id,
      ticket_number: order.ticketNumber,
      customer_name: order.customerName,
      phone: order.phone,
      order_type: order.orderType,
      payment_method: order.paymentMethod,
      items: JSON.stringify(order.items),
      total_amount: order.totalAmount,
      status: order.status,
      estimated_minutes: order.estimatedMinutes,
      created_time: order.createdAt,
    })
    return !error
  } catch (e) {
    return false
  }
}

export async function updateCloudOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('mp_orders')
      .update({ status })
      .eq('id', orderId)
    return !error
  } catch (e) {
    return false
  }
}

// ── 2. TELEGRAM FEED CLOUD SYNC ──

export async function fetchCloudTelegramPosts(): Promise<TelegramPost[] | null> {
  try {
    const { data, error } = await supabase
      .from('mp_telegram_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error || !data || data.length === 0) {
      return null
    }

    return data.map((row: any) => ({
      id: row.id,
      timestamp: row.timestamp || 'Только что',
      author: row.author || 'MATCHAPOINT | BAKU',
      text: row.text,
      badge: row.badge,
      isUrgent: row.is_urgent,
    }))
  } catch {
    return null
  }
}

export async function publishCloudTelegramPost(post: {
  text: string
  badge?: string
  isUrgent?: boolean
}): Promise<TelegramPost | null> {
  const newPost: TelegramPost = {
    id: `tg-${Date.now()}`,
    timestamp: 'Только что',
    author: 'MATCHAPOINT | BAKU',
    text: post.text,
    badge: post.badge || 'Live News',
    isUrgent: post.isUrgent || false,
  }

  try {
    await supabase.from('mp_telegram_posts').insert({
      id: newPost.id,
      text: newPost.text,
      author: newPost.author,
      badge: newPost.badge,
      is_urgent: newPost.isUrgent,
      timestamp: 'Только что',
    })
  } catch (e) {
    console.warn('Failed to insert post in cloud', e)
  }

  return newPost
}

// ── 3. REALTIME SUBSCRIPTION ──

export function subscribeToMatchaUpdates(onUpdate: () => void) {
  try {
    const channel = supabase
      .channel('matchapoint-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mp_orders' }, () => {
        onUpdate()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mp_telegram_posts' }, () => {
        onUpdate()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  } catch {
    return () => {}
  }
}
