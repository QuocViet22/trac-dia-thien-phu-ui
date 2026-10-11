# News Pages (/tin-tuc) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (repo has no subagent tool; native inline execution). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve `/tin-tuc` news list (rows like screenshot) and `/tin-tuc/:slug` detail (full sanitized HTML) from `GET /api/news`.

**Architecture:** Extend `src/lib/api.ts` with news DTOs + `listNews`/`getNewsByAlias`/`newsImage`/`formatNewsDate`; `NewsPage.tsx` fetches `status=PUBLISHED` paginated list with skeleton/error/empty + pagination copied from `SanPhamPage`; `NewsDetailPage.tsx` fetches by `seoAlias`, sanitizes `description` with `dompurify`, renders via `dangerouslySetInnerHTML`; `App.tsx` adds the two routes.

**Tech Stack:** React 19 (`useEffect`/`useState`), react-router 8, Tailwind v4, `fetch` + `URLSearchParams`, shared `Img` wrapper, `dompurify` + `@types/dompurify`.

**Spec:** `docs/specs/news.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0).
- No test runner — verification is build + lint + `npm run dev` visual check.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- `verbatimModuleSyntax: true` — type imports must use `import type`; `noUnusedLocals` + `noUnusedParameters` — no unused vars; `erasableSyntaxOnly: true` — no enums/namespaces/parameter properties.
- Components ≤ ~100 lines each; Vietnamese copy verbatim from the spec.
- List query fixed: `status=PUBLISHED`, `sort=updatedAt,desc`, `size=10`.

## Review Focus

- API down must show the error block with a working retry, never a blank list (Task 2/3 dev check: stop backend, load page, click retry after restart).
- News with zero images must still render with the placeholder fallback, never a broken `<img src="">` (Task 2/3: `newsImage` returns `''`, `Img` gets fallback; dev check with an imageless item).
- Unknown slug must show the missing state with a back link, not the error state (Task 3: 404 from `getNewsByAlias` maps to `missing`; dev check `/tin-tuc/unknown-alias`).
- Malicious HTML in `description` (e.g. `<script>`, `onerror=`) must not execute (Task 3: `DOMPurify.sanitize` before `dangerouslySetInnerHTML`; dev check with script-bearing fixture).
- `VITE_API_URL` trailing slash must not produce `//api/news` double-slash URLs (Task 1 reuses existing `API_BASE` stripping; code inspection only).

---

### Task 1: Extend `src/lib/api.ts` (news DTOs + client + helpers)

**Files:**
- Modify: `src/lib/api.ts`

**Interfaces:**
- Consumes: existing `API_BASE`, `fetchData`, `ImageDto`, `Page<T>` (same file, reused as-is).
- Produces: types `NewsResponse`, `NewsDetailResponse`, `listNews`, `getNewsByAlias`, `newsImage`, `formatNewsDate` — consumed by Tasks 2–3.

- [ ] **Step 1: Append the news block to `src/lib/api.ts`.** Add the exact content below at the end of the file (nothing existing is changed).

```typescript
export interface NewsResponse {
  id: string
  title: string
  author: string
  status: string
  seoAlias: string
  createdAt: string
  updatedAt: string
  seoDescriptionTag: string | null
  images: ImageDto[]
}

export interface NewsDetailResponse {
  id: string
  title: string
  description: string | null
  author: string
  status: string
  seoPageTitle: string | null
  seoDescriptionTag: string | null
  seoAlias: string
  createdAt: string
  updatedAt: string
  images: ImageDto[]
}

export interface NewsQuery {
  page: number
  size: number
}

export function listNews(query: NewsQuery): Promise<Page<NewsResponse>> {
  const params = new URLSearchParams()
  params.set('status', 'PUBLISHED')
  params.set('page', String(query.page))
  params.set('size', String(query.size))
  params.set('sort', 'updatedAt,desc')
  return fetchData<Page<NewsResponse>>(`/api/news?${params.toString()}`)
}

export function getNewsByAlias(alias: string): Promise<NewsDetailResponse> {
  return fetchData<NewsDetailResponse>(`/api/news/by-alias/${encodeURIComponent(alias)}`)
}

export function newsImage(item: NewsResponse | NewsDetailResponse): string {
  return item.images.length > 0 ? item.images[0].imageUrl : ''
}

export function formatNewsDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}
```

- [ ] **Step 2: Verify typecheck passes.**

Run: `npm run build`
Expected: exit 0 (nothing imports the new exports yet; proves they compile).

---

### Task 2: Create `NewsPage` list + wire `/tin-tuc` route

**Files:**
- Create: `src/pages/news/NewsPage.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `listNews`, `newsImage`, `formatNewsDate` + types `NewsResponse` from `../../lib/api.ts` (Task 1); `Img` from `../../components/Img.tsx` (existing).
- Produces: `NewsPage` default export; `/tin-tuc` route — consumed by nothing downstream (Task 3 links here for breadcrumbs).

- [ ] **Step 1: Create `src/pages/news/NewsPage.tsx` with the exact content below.**

```tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { formatNewsDate, listNews, newsImage, type NewsResponse } from '../../lib/api.ts'
import Img from '../../components/Img.tsx'

const PAGE_SIZE = 10

function NewsPage() {
  const [items, setItems] = useState<NewsResponse[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setFailed(false)
    listNews({ page, size: PAGE_SIZE })
      .then((data) => {
        if (cancelled) return
        setItems(data.content)
        setTotalPages(Math.max(1, data.totalPages))
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setFailed(true)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [page, reloadKey])

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Tất cả tin tức</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Tất cả tin tức</h1>
      {loading ? (
        <div className="flex flex-col gap-4" aria-label="Đang tải tin tức">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div key={index} className="grid gap-4 md:grid-cols-[320px_1fr] animate-pulse">
              <div className="w-full h-48 bg-gray-100 rounded" />
              <div>
                <div className="h-5 bg-gray-100 rounded w-2/3" />
                <div className="h-4 bg-gray-100 rounded w-1/3 mt-2" />
                <div className="h-4 bg-gray-100 rounded mt-2" />
                <div className="h-4 bg-gray-100 rounded w-5/6 mt-1" />
              </div>
            </div>
          ))}
        </div>
      ) : failed ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="font-bold text-gray-900 mb-1">Không tải được tin tức. Vui lòng thử lại.</p>
          <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-3 text-sm font-bold text-white bg-brand px-5 py-2 rounded-lg hover:opacity-90">Tải lại</button>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Chưa có tin tức nào.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {items.map((item) => (
            <Link key={item.id} to={`/tin-tuc/${item.seoAlias}`} className="grid gap-4 md:grid-cols-[320px_1fr] items-start group">
              <Img src={newsImage(item)} fallback="https://placehold.co/640x360?text=No+Image" alt={item.title} loading="lazy" className="w-full h-48 object-cover rounded" />
              <div>
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-brand">{item.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{formatNewsDate(item.updatedAt)} - {item.author}</p>
                {item.seoDescriptionTag && <p className="text-sm text-gray-600 mt-2 line-clamp-3">{item.seoDescriptionTag}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
      <nav aria-label="Phân trang" className="flex justify-center gap-1.5 mt-6">
        <button type="button" aria-label="Trang trước" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-brand hover:text-brand disabled:opacity-40">«</button>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Trang ${index + 1}`}
            aria-current={index === page ? 'page' : undefined}
            onClick={() => setPage(index)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm ${index === page ? 'border-brand text-brand font-bold' : 'border-gray-200 text-gray-600 hover:border-brand hover:text-brand'}`}
          >
            {index + 1}
          </button>
        ))}
        <button type="button" aria-label="Trang tiếp" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-brand hover:text-brand disabled:opacity-40">»</button>
      </nav>
    </div>
  )
}

export default NewsPage
```

- [ ] **Step 2: Install sanitize deps.**

Run: `npm install dompurify; if ($?) { npm install -D @types/dompurify }`
Expected: exit 0; `dompurify` appears in `dependencies`, `@types/dompurify` in `devDependencies`.

- [ ] **Step 3: Wire the `/tin-tuc` route in `src/App.tsx`.** Add the import `import NewsPage from './pages/news/NewsPage.tsx'` alongside the other page imports, and add `<Route path="/tin-tuc" element={<NewsPage />} />` alongside the other routes (exact placement next to `/san-pham` routes, order irrelevant).

- [ ] **Step 4: Verify.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev`: `/tin-tuc` rows match the screenshot (cover left, title + `dd/MM/yyyy - author` + excerpt); pagination switches pages; stop the API → error block appears and retry recovers.

---

### Task 3: Create `NewsDetailPage` + wire `/tin-tuc/:slug` route and verify

**Files:**
- Create: `src/pages/news/NewsDetailPage.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `getNewsByAlias`, `newsImage`, `formatNewsDate` + type `NewsDetailResponse` from `../../lib/api.ts` (Task 1); `ApiError` from `../../lib/api.ts` for 404 mapping; `Img` (existing); `DOMPurify` from `dompurify` (Task 2).
- Produces: working `/tin-tuc/:slug` page. Nothing downstream.

- [ ] **Step 1: Create `src/pages/news/NewsDetailPage.tsx` with the exact content below.**

```tsx
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import DOMPurify from 'dompurify'
import { ApiError, formatNewsDate, getNewsByAlias, newsImage, type NewsDetailResponse } from '../../lib/api.ts'
import Img from '../../components/Img.tsx'

type LoadStatus = 'loading' | 'missing' | 'error' | 'ready'

function NewsDetailPage() {
  const { slug = '' } = useParams()
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [news, setNews] = useState<NewsDetailResponse | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    getNewsByAlias(slug)
      .then((data) => {
        if (cancelled) return
        setNews(data)
        setStatus('ready')
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setNews(null)
        setStatus(error instanceof ApiError && error.status === 404 ? 'missing' : 'error')
      })
    return () => {
      cancelled = true
    }
  }, [slug, reloadKey])

  const safeHtml = useMemo(() => DOMPurify.sanitize(news?.description ?? ''), [news])

  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4 animate-pulse" aria-label="Đang tải tin tức">
        <div className="h-4 w-1/3 bg-gray-100 rounded mb-3" />
        <div className="h-7 w-2/3 bg-gray-100 rounded mb-2" />
        <div className="h-4 w-1/4 bg-gray-100 rounded mb-4" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    )
  }

  if (status === 'missing') {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-xl font-bold text-gray-900 mb-2">Tin tức không tồn tại</p>
        <Link to="/tin-tuc" className="text-brand hover:underline">Quay lại Tất cả tin tức</Link>
      </div>
    )
  }

  if (status === 'error' || !news) {
    return (
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-xl font-bold text-gray-900 mb-2">Không tải được tin tức. Vui lòng thử lại.</p>
        <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-3 text-sm font-bold text-white bg-brand px-5 py-2 rounded-lg hover:opacity-90">Tải lại</button>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to="/tin-tuc" className="hover:text-brand">Tất cả tin tức</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{news.title}</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{news.title}</h1>
      <p className="text-sm text-gray-500 mt-2">{formatNewsDate(news.updatedAt)} - {news.author}</p>
      <Img src={newsImage(news)} fallback="https://placehold.co/1024x576?text=No+Image" alt={news.title} loading="eager" className="w-full rounded-xl mt-4 object-cover" />
      {news.seoDescriptionTag && <p className="text-base text-gray-700 font-medium mt-4">{news.seoDescriptionTag}</p>}
      {safeHtml && (
        <div
          className="text-base text-gray-800 mt-4 space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:rounded-xl [&_img]:max-w-full"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      )}
    </article>
  )
}

export default NewsDetailPage
```

- [ ] **Step 2: Wire the `/tin-tuc/:slug` route in `src/App.tsx`.** Add the import `import NewsDetailPage from './pages/news/NewsDetailPage.tsx'` and add `<Route path="/tin-tuc/:slug" element={<NewsDetailPage />} />` directly below the `/tin-tuc` route from Task 2.

- [ ] **Step 3: Verify.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` with the API running: click a `/tin-tuc` row → lands on `/tin-tuc/{seoAlias}` showing title, meta, cover, lead excerpt, and formatted HTML body (headings/lists/images render); view-source check that a `<script>` in the API description does not execute; `/tin-tuc/unknown-alias` shows the missing state; API-down shows error + retry works; `/`, `/gioi-thieu`, `/san-pham` unchanged; mobile stacks cover above text.
