// MP Baku Service Worker — cache-first for assets, network-first for navigations
const CACHE_NAME = 'matchapoint-v2'
const PRECACHE = [
  '/',
  '/index.html',
  '/assets/mp-logo.png',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE).catch(() => {}))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : undefined)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  const isNavigate = req.mode === 'navigate'
  const isAsset = url.pathname.startsWith('/assets/') || url.pathname.startsWith('/drinks/') || url.pathname.includes('/assets/')

  if (isNavigate) {
    // Network-first for HTML
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((c) => c.put(req, clone)).catch(() => {})
          return res
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('/index.html')).then((r) => r || fetch(req)))
    )
    return
  }

  if (isAsset) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached
        return fetch(req).then((res) => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE_NAME).then((c) => c.put(req, clone)).catch(() => {})
          }
          return res
        })
      })
    )
    return
  }

  // default: cache-first with network fallback
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).catch(() => caches.match('/')))
  )
})
