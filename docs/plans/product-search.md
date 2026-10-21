# Product Search Autocomplete — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (repo has no subagent tool; native inline execution). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the header search box to a debounced product-name autocomplete, and make `/san-pham?name=<keyword>` a working filtered listing — backed by the new optional `name` param on `GET /api/products`.

**Architecture:** One optional filter on the existing endpoint (API plan: `trac-dia-thien-phu-api/docs/plans/product_controller.md`, name-search addendum). UI adds `name` to the existing `ProductQuery`, a self-contained `ProductSearch` combobox component, and a `name` URL param in `SanPhamPage`. No new route, dependency, or API helper.

**Tech Stack:** React 19, react-router 8 (`Link`, `useNavigate`, `useLocation`, `useSearchParams`), Tailwind v4, existing `listProducts()` / `productImage()` / `Img`.

**Spec:** `docs/specs/product-search.md` (backend contract: `trac-dia-thien-phu-api/docs/specs/product_controller.md` §7)

## Global Constraints

- UI workdir is `D:\Code\TracDiaThienPhu\trac-dia-thien-phu-ui`; API workdir is `D:\Code\TracDiaThienPhu\trac-dia-thien-phu-api`.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- `verbatimModuleSyntax: true` — type imports must use `import type`; `noUnusedLocals`/`noUnusedParameters` — no unused vars; `erasableSyntaxOnly: true` — no enums/namespaces/parameter properties.
- No test runner in the UI repo — verification is `npm run build` + `npm run lint` + `npm run dev`.
- Debounce 300 ms, minimum 2 trimmed characters, max 6 suggestions. Vietnamese copy verbatim from the spec.
- Do not commit; the human partner commits on request.
- The API half must be implemented first (or at least running) before Task 2 can be verified against live suggestions.

## Review Focus

- A stale response must never overwrite a newer keyword's results → Task 2's `cancelled` cleanup flag.
- Enter with no highlighted option goes to the listing; Enter with a highlighted option opens that product → Task 2 `submit()`.
- Whitespace-only `?name=` must behave as "no search" (normal listing), not an empty result page → Task 1's `|| undefined` plus the backend blank-name rule.
- Changing `name` in the URL must reset pagination to page 1 → Task 1's `paramName` sync.
- The header layout must not shift at either breakpoint → Task 3 visual check.

---

### Task 1: `name` in the API layer + filtered listing page

**Files:**
- Modify: `src/lib/api.ts` (`ProductQuery`, `listProducts`)
- Modify: `src/pages/product/SanPhamPage.tsx` (query state, fetch, heading, empty text)

**Interfaces:**
- Consumes: backend `?name=` from the API plan; existing `Page<ProductResponse>` shape.
- Produces: `listProducts({ page, size, name? })` — consumed by Task 2's autocomplete.

- [ ] **Step 1: Add the query param to the API helper.**

In `src/lib/api.ts`, add `name?: string` to `ProductQuery` after `brand?: string`, and add this block to `listProducts` after the `brand` block:

```typescript
  if (query.name) {
    params.set('name', query.name)
  }
```

- [ ] **Step 2: Carry `name` in the listing page state.**

In `SanPhamPage.tsx`:

1. Read the param next to `paramCategoryId`:

```tsx
  const paramName = searchParams.get('name') ?? ''
```

2. Add `name: string` to `ProductQueryState` and initialize it:

```tsx
  const [query, setQuery] = useState<ProductQueryState>({ page: 0, categoryId: paramCategoryId, brand: null, sort: 'createdAt,desc', name: paramName })
```

3. Mirror the existing `paramCategoryId` sync block for `paramName`:

```tsx
  const [prevParamName, setPrevParamName] = useState(paramName)
  if (paramName !== prevParamName) {
    setPrevParamName(paramName)
    setQuery((current) => ({ ...current, name: paramName, page: 0 }))
    setLoading(true)
    setFailed(false)
  }
```

4. Pass it to the `listProducts` call in the existing fetch effect (the `listProductsByCategoryAlias` call stays unchanged):

```tsx
      ? listProductsByCategoryAlias({ alias, page: query.page, size: PAGE_SIZE, brand: query.brand ?? undefined, sort: query.sort })
      : listProducts({ page: query.page, size: PAGE_SIZE, categoryId: query.categoryId ?? undefined, brand: query.brand ?? undefined, sort: query.sort, name: query.name || undefined })
```

5. Replace the heading derivation:

```tsx
  const heading = query.name
    ? `Kết quả tìm kiếm cho "${query.name}"`
    : activeCategory?.name ?? 'Tất cả sản phẩm'
```

6. Make the empty text search-aware:

```tsx
              <p className="text-gray-600">{query.name ? 'Không tìm thấy sản phẩm phù hợp.' : 'Chưa có sản phẩm trong danh mục này.'}</p>
```

- [ ] **Step 3: Verify.**

Run `npm run build; if ($?) { npm run lint }`. Expected: both exit 0. With the API running, open `/san-pham?name=bình` → heading, filtered grid, pagination; `/san-pham?name=  ` behaves as the normal listing.

---

### Task 2: `ProductSearch` combobox + Header wiring

**Files:**
- Create: `src/components/layout/ProductSearch.tsx`
- Modify: `src/components/layout/Header.tsx` (replace the input block)

**Interfaces:**
- Consumes: `listProducts`, `productImage`, `ProductResponse` from `../../lib/api.ts`; `Img` from `../Img.tsx`; functions from Task 1.
- Produces: `<ProductSearch />` — no props.

- [ ] **Step 1: Create the component.**

Write `src/components/layout/ProductSearch.tsx` with the code below. Each numbered comment marks a spec requirement; keep them only where the code cannot show the why.

```tsx
import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import Img from '../Img.tsx'
import { listProducts, productImage, type ProductResponse } from '../../lib/api.ts'

const MAX_SUGGESTIONS = 6
const MIN_CHARS = 2
const DEBOUNCE_MS = 300
const FALLBACK_IMAGE = 'https://placehold.co/80x80?text=No+Image'

function ProductSearch() {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ProductResponse[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    const keyword = query.trim()
    setActiveIndex(-1)
    if (keyword.length < MIN_CHARS) {
      setResults([])
      setOpen(false)
      setLoading(false)
      setFailed(false)
      return
    }
    let cancelled = false
    const timer = setTimeout(() => {
      setLoading(true)
      setFailed(false)
      listProducts({ page: 0, size: MAX_SUGGESTIONS, name: keyword, sort: 'name,asc' })
        .then((data) => {
          if (!cancelled) {
            setResults(data.content)
            setLoading(false)
            setOpen(true)
          }
        })
        .catch(() => {
          if (!cancelled) {
            setResults([])
            setLoading(false)
            setFailed(true)
            setOpen(true)
          }
        })
    }, DEBOUNCE_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!open) {
      return
    }
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  useEffect(() => {
    if (activeIndex >= 0) {
      document.getElementById(`${listId}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex, listId])

  const openProduct = (product: ProductResponse) => {
    setOpen(false)
    navigate(product.seoAlias ? `/san-pham/${product.seoAlias}` : '/san-pham')
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const keyword = query.trim()
    const active = results[activeIndex]
    if (active) {
      openProduct(active)
      return
    }
    if (!keyword) {
      return
    }
    setOpen(false)
    navigate(`/san-pham?name=${encodeURIComponent(keyword)}`)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
      return
    }
    if (!open || results.length === 0) {
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1))
    }
  }

  return (
    <div ref={containerRef} className="w-full lg:w-1/2 order-3 lg:order-none relative">
      <form onSubmit={submit} role="search">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => {
            if (query.trim().length >= MIN_CHARS && (results.length > 0 || failed)) {
              setOpen(true)
            }
          }}
          placeholder="Tìm kiếm sản phẩm..."
          aria-label="Tìm kiếm sản phẩm"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined}
          className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:border-brand text-sm shadow-sm transition-colors"
        />
        <button type="submit" aria-label="Tìm kiếm" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand">
          <i className="fa-solid fa-search"></i>
        </button>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <p className="px-4 py-3 text-sm text-gray-500">Đang tìm sản phẩm...</p>
          ) : failed ? (
            <p className="px-4 py-3 text-sm text-gray-500">Không tìm được sản phẩm. Vui lòng thử lại.</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
          ) : (
            <ul id={listId} role="listbox" className="max-h-80 overflow-y-auto">
              {results.map((product, index) => {
                const image = productImage(product)
                return (
                  <li key={product.id} role="presentation">
                    <Link
                      to={product.seoAlias ? `/san-pham/${product.seoAlias}` : '/san-pham'}
                      role="option"
                      id={`${listId}-option-${index}`}
                      aria-selected={index === activeIndex}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 text-sm ${index === activeIndex ? 'bg-sky-50 text-brand' : 'text-gray-700'}`}
                    >
                      <Img src={image} fallback={FALLBACK_IMAGE} alt="" loading="lazy" className="w-10 h-10 object-contain flex-shrink-0" />
                      <span className="min-w-0">
                        <span className="block font-medium line-clamp-2">{product.name}</span>
                        {product.brand && <span className="block text-[11px] uppercase text-gray-500">{product.brand}</span>}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductSearch
```

`FormEvent` / `KeyboardEvent` are imported as types because `verbatimModuleSyntax` is on; do not use the `React.` namespace without importing it.

- [ ] **Step 2: Wire it into the header.**

In `Header.tsx`, import the component and replace the whole `<div className="w-full lg:w-1/2 order-3 lg:order-none relative">…</div>` block with:

```tsx
        <ProductSearch />
```

Remove the now-unused `useState` import and `query` state (`import { useState } from 'react'` must go — `noUnusedLocals` fails the build).

```tsx
import { Link } from 'react-router'
import logo from '../../assets/logo.jpg'
import ProductSearch from './ProductSearch.tsx'
```

- [ ] **Step 3: Verify.**

Run `npm run build; if ($?) { npm run lint }`. Expected: both exit 0. With the API running, `npm run dev`:
- 1 character → nothing; 2+ → results after ~300 ms.
- Fast typing → only the latest keyword's rows render.
- Click a row → product detail; ↑/↓ + Enter → highlighted product; Enter with none highlighted → `/san-pham?name=…`.
- Esc, outside click, and navigating away all close the dropdown.
- Mobile width: dropdown matches the input width; no horizontal scroll.

---

### Task 3: Full verification

**Files:** none (manual checks with both servers running).

- [ ] **Step 1: Build and lint.** `npm run build; if ($?) { npm run lint }` → both exit 0.
- [ ] **Step 2: Autocomplete checklist.** As Task 2 Step 3, plus: image fallback renders for a product with no image, and API-down shows the error row without breaking typing.
- [ ] **Step 3: Listing checklist.** `/san-pham?name=bình` direct load → heading, results, pagination; sort still works; brand filter narrows the search; zero-match keyword → `Không tìm thấy sản phẩm phù hợp.`; `/san-pham` unchanged.
- [ ] **Step 4: Regression.** `/`, `/gioi-thieu`, `/san-pham/{slug}`, `/lien-he` unchanged; header logo/phone/account block still aligned at both breakpoints.

## Self-Review

**1. Spec coverage:** autocomplete behaviour → Task 2 (debounce, min chars, max 6, states, close paths, keyboard, ARIA); results page → Task 1 (URL param, heading, empty text, page reset); API surface → Task 1 (`name` on `listProducts`); non-goals untouched (no new route/dependency, no client-side filtering). Verification → Task 3.

**2. Step scan:** every step names one artifact and one checkable result. Code is included where the spec does not determine the exact shape (combobox handlers) or where copy is fixed. No TBD.

**3. Type consistency:** `ProductQuery.name?: string` ↔ `listProducts` param ↔ `SanPhamPage` `query.name: string` (`|| undefined` at the call). `ProductResponse` fields used (`id`, `name`, `brand`, `seoAlias`, `images`) all exist in `src/lib/api.ts`.

**4. Review Focus:** five lines map to Task 2's `cancelled` flag, Task 2's `submit`, Task 1's `|| undefined` + backend blank rule, Task 1's `paramName` sync, Task 3's layout check.

**5. Proportion:** three tasks for one endpoint plus two UI surfaces; the component is the only new file, and `Header.tsx` shrinks.
