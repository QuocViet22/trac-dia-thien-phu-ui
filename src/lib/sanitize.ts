import DOMPurify from 'dompurify'

const ALLOWED_IFRAME_HOSTS = new Set([
  'www.youtube.com',
  'www.youtube-nocookie.com',
])

let hookRegistered = false

function registerHook() {
  if (hookRegistered) return
  hookRegistered = true

  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName !== 'iframe') return

    const src = (node as Element).getAttribute('src') ?? ''
    try {
      const url = new URL(src, window.location.origin)
      if (url.protocol !== 'https:' || !ALLOWED_IFRAME_HOSTS.has(url.hostname)) {
        node.parentNode?.removeChild(node)
      }
    } catch {
      node.parentNode?.removeChild(node)
    }
  })
}

export function sanitizeHtml(html: string | null): string {
  registerHook()
  return DOMPurify.sanitize(html ?? '', {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'referrerpolicy'],
  })
}