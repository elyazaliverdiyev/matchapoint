import { useEffect, useRef } from 'react'

export function useEscape(onClose: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose, enabled])
}

export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [locked])
}

export function useFocusTrap(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!enabled || !ref.current) return
    const root = ref.current
    const sel = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const getNodes = (): HTMLElement[] => Array.from(root.querySelectorAll(sel) as NodeListOf<HTMLElement>).filter((n) => !n.hasAttribute('disabled'))
    // focus first
    const first = getNodes()[0]
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const nodes = getNodes()
      if (nodes.length === 0) return
      const firstEl = nodes[0]
      const lastEl = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }
    root.addEventListener('keydown', onKey as any)
    return () => root.removeEventListener('keydown', onKey as any)
  }, [enabled])
  return ref
}
