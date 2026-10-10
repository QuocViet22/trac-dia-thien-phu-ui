# Product Listing Page (/san-pham) API Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (repo has no subagent tool; native inline execution). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Load the `/san-pham` product grid from `GET /api/products` with working pagination, category filter, and sort.

**Architecture:** New `src/lib/api.ts` owns the HTTP layer (env base URL, `ApiResponse` unwrap, typed DTOs, image/slug helpers); `SanPhamPage` fetches on `[page, categoryId, sort]` state with skeleton/error/empty branches; `FilterSidebar`/`Toolbar` become controlled components; `ProductCard` takes optional `brand`/`badge` (hidden when absent) and links by `seoAlias`.

**Tech Stack:** React 19 (`useEffect`/`useState`), react-router 8, Tailwind v4 (`brand #22abff`), `fetch` + `URLSearchParams`, shared `Img` wrapper.

**Spec:** `docs/specs/product.md` (detail page: `docs/plans/product-detail.md`, consumes `src/lib/api.ts` from Task 1 below — implement this plan first)

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0).
- No test runner — verification is build + lint + `npm run dev` visual check.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- `verbatimModuleSyntax: true` — type imports must use `import type`; `noUnusedLocals` + `noUnusedParameters` — no unused vars; `erasableSyntaxOnly: true` — no enums/namespaces/parameter properties.
- Components ≤ ~100 lines each; Vietnamese copy verbatim from the spec.
- Sort mapping (API has no price field): `Hàng mới` → `createdAt,desc`, `Giá thấp đến cao` → `name,asc`, `Giá cao xuống thấp` → `name,desc`.

## Out of Scope (separate repo: `trac-dia-thien-phu-api`)

- This plan only consumes existing `GET /api/products` and `GET /api/categories`. The new `GET /api/products/by-alias/{alias}` endpoint is a backend sub-project with its own spec/plan in the API repo; the UI detail plan (`docs/plans/product-detail.md`) codes against the contract in `docs/specs/product-detail.md`.

## Review Focus

- API down must show the error block with a working retry, never a blank grid (Task 4 dev check: stop the backend, load `/san-pham`, click retry after restarting).
- Products with zero images must still render a card with the `placehold.co` fallback, never a broken `<img src="">` (Task 4: `productImage` returns `''`, `Img` gets `fallback`; dev check with an imageless product).
- Switching category must reset to page 1 — stale page numbers past `totalPages` must not strand the user on an empty grid (Task 4 code resets page; dev check).
- `VITE_API_URL` trailing slash (e.g. `http://host:8080/`) must not produce `//api/products` double-slash URLs (Task 1 strips trailing slashes; dev check not needed — code inspection).
- Dashboard cards spreading full `Product` objects (required `brand`) must still typecheck against the widened optional props (Task 2 keeps `Product & { slug?: string }`; build check).

---

### Task 1: Create `src/lib/api.ts` (HTTP layer + DTOs + helpers)

**Files:**
- Create: `src/lib/api.ts`
- Create: `.env.example`

**Interfaces:**
- Consumes: `toSlug` from `../utils/slug.ts` (existing).
- Produces: `API_BASE`, `ApiError`, `listProducts`, `listCategories`, `getProductByAlias`, `productImage`, `productImages`, `productSlug`, types `ProductResponse`, `CategoryResponse`, `Page<T>` — consumed by Tasks 2–4 and by `docs/plans/product-detail.md`.

- [ ] **Step 1: Create `src/lib/api.ts` with the exact content below.**

```typescript
import { toSlug } from '../utils/slug.ts'

export interface ImageDto {
  id: string
  name: string
  imageUrl: string
  sortOrder: number
}

export interface ProductResponse {
  id: string
  name: string
  skuCode: string | null
  description: string | null
  shortDescription: string | null
  seoAlias: string | null
  categoryId: string | null
  images: ImageDto[]
}

export interface CategoryResponse {
  id: string
  name: string
  seoAlias: string | null
  parentCategoryId: string | null
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const API_BASE: string = (
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8080'
).replace(/\/+$/, '')

async function fetchData<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    throw new ApiError(response.status, `Request failed: ${response.status}`)
  }
  const body = (await response.json()) as ApiResponse<T>
  if (!body.success) {
    throw new ApiError(response.status, body.message)
  }
  return body.data
}

export interface ProductQuery {
  page: number
  size: number
  categoryId?: string
  sort?: string
}

export function listProducts(query: ProductQuery): Promise<Page<ProductResponse>> {
  const params = new URLSearchParams()
  params.set('page', String(query.page))
  params.set('size', String(query.size))
  if (query.categoryId) {
    params.set('categoryId', query.categoryId)
  }
  if (query.sort) {
    params.set('sort', query.sort)
  }
  return fetchData<Page<ProductResponse>>(`/api/products?${params.toString()}`)
}

export function listCategories(): Promise<CategoryResponse[]> {
  return fetchData<CategoryResponse[]>('/api/categories')
}

export function getProductByAlias(alias: string): Promise<ProductResponse> {
  return fetchData<ProductResponse>(`/api/products/by-alias/${encodeURIComponent(alias)}`)
}

function sortedImages(product: ProductResponse): ImageDto[] {
  return [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function productImage(product: ProductResponse): string {
  const images = sortedImages(product)
  return images.length > 0 ? images[0].imageUrl : ''
}

export function productImages(product: ProductResponse): string[] {
  return sortedImages(product).map((image) => image.imageUrl)
}

export function productSlug(product: ProductResponse): string {
  return product.seoAlias ?? toSlug(product.name)
}
```

- [ ] **Step 2: Create `.env.example` with the exact content below.**

```
VITE_API_URL=http://localhost:8080
```

- [ ] **Step 3: Verify typecheck passes.**

Run: `npm run build`
Expected: exit 0 (nothing imports the new module yet; proves it compiles).

---

### Task 2: Widen `ProductCard` props (optional brand/badge, alias link)

**Files:**
- Modify: `src/pages/dashboard/components/ProductCard.tsx`

**Interfaces:**
- Consumes: `toSlug` (existing import), `src/lib/api.ts` (Task 1 — not imported here, only the slug convention).
- Produces: `ProductCard` accepting `Product & { slug?: string }`, hiding brand/badge lines when absent — consumed by Tasks 4 and the detail plan.

- [ ] **Step 1: Replace the props + root of `ProductCard.tsx`.** Change the import line `import type { Product } from '../data.ts'` (keep it) and replace the component signature and inner brand/badge lines with the exact content below (rest of the file unchanged).

```tsx
function ProductCard({ brand, name, image, badge, slug }: Product & { slug?: string }) {
  return (
    <Link to={`/san-pham/${slug ?? toSlug(name)}`} className="product-card block relative group bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-brand p-3 pt-8 transition-colors">
      {badge && (
        <span className={`absolute top-0 left-0 text-white text-[10px] font-bold pl-2 pr-3 py-1 ${badge === 'Mới' ? 'bg-emerald-700' : 'bg-red-600'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}>{badge.toUpperCase()}</span>
      )}
      <Img src={image} fallback="https://placehold.co/276x276?text=No+Image" alt={name} loading="lazy" className="w-full h-40 object-contain" />
      {brand && <p className="text-[11px] uppercase text-gray-500 mt-2">{brand}</p>}
      <p className="text-[13px] font-medium line-clamp-2 h-10">{name}</p>
      <p className="font-bold text-brand text-[15px] mt-1">Liên hệ</p>
      <p className="text-gray-300 text-xs tracking-widest">★★★★★</p>
    </Link>
  )
}
```

- [ ] **Step 2: Verify.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0 (dashboard spread of full `Product` still satisfies the widened props; visuals unchanged — confirm in `dev` that `/` looks identical).

---

### Task 3: Controlled `FilterSidebar` + `Toolbar`

**Files:**
- Modify: `src/pages/san-pham/components/FilterSidebar.tsx`
- Modify: `src/pages/san-pham/components/Toolbar.tsx`
- Modify: `src/pages/san-pham/data.ts` (append sort mapping)

**Interfaces:**
- Consumes: `CategoryResponse` type from `../../../lib/api.ts`; `brands`, `priceRanges` stay imported from `../data.ts` for the static sections.
- Produces: `FilterSidebar({ categories, selectedCategoryId, onSelectCategory })`, `Toolbar({ sort, onSelectSort })` — consumed by Task 4.

- [ ] **Step 1: Append the sort mapping to `src/pages/san-pham/data.ts`.**

```typescript
export const sortParams: Record<string, string> = {
  'Hàng mới': 'createdAt,desc',
  'Giá thấp đến cao': 'name,asc',
  'Giá cao xuống thấp': 'name,desc',
}
```

- [ ] **Step 2: Replace `FilterSidebar.tsx` with the exact content below.** (Brand + price sections byte-identical; `Bỏ hết` becomes a reset button; `Danh mục` renders API categories with an active state.)

```tsx
import type { CategoryResponse } from '../../../lib/api.ts'
import { brands, priceRanges } from '../data.ts'

interface FilterSidebarProps {
  categories: CategoryResponse[]
  selectedCategoryId: string | null
  onSelectCategory: (id: string | null) => void
}

function FilterSidebar({ categories, selectedCategoryId, onSelectCategory }: FilterSidebarProps) {
  return (
    <aside className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-gray-900">Bộ lọc sản phẩm</p>
        <button type="button" onClick={() => onSelectCategory(null)} className="text-sm text-gray-500 hover:text-brand">Bỏ hết</button>
      </div>
      <p className="font-bold text-sm text-gray-900 mb-2">Thương hiệu</p>
      <ul className="space-y-1.5 mb-4">
        {brands.map((brand) => (
          <li key={brand}>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="accent-[#22abff]" />
              {brand}
            </label>
          </li>
        ))}
      </ul>
      <p className="font-bold text-sm text-gray-900 mb-2">Danh mục</p>
      <ul className="space-y-1.5">
        {categories.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              onClick={() => onSelectCategory(category.id === selectedCategoryId ? null : category.id)}
              className={`text-sm hover:text-brand ${category.id === selectedCategoryId ? 'text-brand font-bold' : 'text-gray-600'}`}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default FilterSidebar
```

- [ ] **Step 3: Replace `Toolbar.tsx` with the exact content below.** (Same visuals; active pill follows the `sort` prop; view toggle untouched.)

```tsx
import { sortOptions, sortParams } from '../data.ts'

interface ToolbarProps {
  sort: string
  onSelectSort: (sort: string) => void
}

function Toolbar({ sort, onSelectSort }: ToolbarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="font-bold text-sm text-gray-900">Xếp theo:</span>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelectSort(sortParams[option])}
            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${sortParams[option] === sort ? 'border-brand text-brand font-medium' : 'border-gray-200 text-gray-600 hover:border-brand hover:text-brand'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Toolbar
```

- [ ] **Step 4: Verify typecheck passes.**

Run: `npm run build`
Expected: exit 0 (nothing renders the new props yet; proves they compile).

---

### Task 4: Rewrite `SanPhamPage` (fetch, states, pagination) and verify

**Files:**
- Modify: `src/pages/san-pham/SanPhamPage.tsx`

**Interfaces:**
- Consumes: `listCategories`, `listProducts`, `productImage`, `productSlug` + types (Task 1); `FilterSidebar`, `Toolbar` props (Task 3); `ProductCard` (Task 2).
- Produces: working `/san-pham` page. Nothing downstream except the detail plan's card links.

- [ ] **Step 1: Replace `SanPhamPage.tsx` with the exact content below.**

```tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  listCategories,
  listProducts,
  productImage,
  productSlug,
  type CategoryResponse,
  type ProductResponse,
} from '../../lib/api.ts'
import ProductCard from '../dashboard/components/ProductCard.tsx'
import FilterSidebar from './components/FilterSidebar.tsx'
import Toolbar from './components/Toolbar.tsx'

const PAGE_SIZE = 12

function SanPhamPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(0)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [sort, setSort] = useState('createdAt,desc')
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    listCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    setFailed(false)
    listProducts({ page, size: PAGE_SIZE, categoryId: categoryId ?? undefined, sort })
      .then((data) => {
        setProducts(data.content)
        setTotalPages(Math.max(1, data.totalPages))
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [page, categoryId, sort, reloadKey])

  const selectCategory = (id: string | null) => {
    setCategoryId(id)
    setPage(0)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Tất cả sản phẩm</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Tất cả sản phẩm</h1>
      <div className="grid gap-4 lg:grid-cols-[240px_1fr] items-start">
        <FilterSidebar categories={categories} selectedCategoryId={categoryId} onSelectCategory={selectCategory} />
        <div className="flex flex-col gap-4">
          <Toolbar sort={sort} onSelectSort={(value) => { setSort(value); setPage(0) }} />
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3" aria-label="Đang tải sản phẩm">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-3 pt-8 animate-pulse">
                  <div className="w-full h-40 bg-gray-100 rounded" />
                  <div className="h-4 bg-gray-100 rounded mt-2" />
                  <div className="h-4 w-2/3 bg-gray-100 rounded mt-1" />
                </div>
              ))}
            </div>
          ) : failed ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="font-bold text-gray-900 mb-1">Không tải được sản phẩm. Vui lòng thử lại.</p>
              <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-3 text-sm font-bold text-white bg-brand px-5 py-2 rounded-lg hover:opacity-90">Tải lại</button>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Chưa có sản phẩm trong danh mục này.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} name={product.name} image={productImage(product)} slug={productSlug(product)} />
              ))}
            </div>
          )}
          <nav aria-label="Phân trang" className="flex justify-center gap-1.5">
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
      </div>
    </div>
  )
}

export default SanPhamPage
```

- [ ] **Step 2: Verify.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` with the API running: grid shows API products without brand/badge lines; pagination switches pages; category filter narrows + resets to page 1; sort changes order; stop the API → error block appears and retry recovers; `/` and `/gioi-thieu` unchanged; mobile stacks sidebar above grid.
