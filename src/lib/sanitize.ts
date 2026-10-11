import DOMPurify from 'dompurify'

export function sanitizeHtml(html: string | null): string {
  return DOMPurify.sanitize(html ?? '')
}
