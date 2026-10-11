# Product Detail Page (/san-pham/:slug) API Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (repo has no subagent tool; native inline execution). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Load `/san-pham/:slug` from `GET /api/products/by-alias/{alias}` with gallery, article, related grid, and loading/error states.

**Architecture:** `detail.ts` becomes async API helpers (`resolveProduct` tries the by-alias endpoint, falls back to a first-page slug scan for legacy rows; `getRelated` queries same-`categoryId`); `ProductArticle` renders API `description` or the generic template; `ProductDetailPage` fetches on `[slug]` with skeleton/missing/error branches. Reuses `src/lib/api.ts` from `docs/plans/product.md` (implement that plan first).

**Tech Stack:** React 19 (`useEffect`/`useState`), react-router 8 (`useParams`), Tailwind v4 (`brand #22abff`), shared `Img` wrapper.

**Spec:** `docs/specs/product-detail.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0).
- No test runner — verification is build + lint + `npm run dev` visual/click-through check.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- `verbatimModuleSyntax: true` — type imports must use `import type`; `noUnusedLocals` + `noUnusedParameters` — no unused vars; `erasableSyntaxOnly: true` — no enums/namespaces/parameter properties.
- Components ≤ ~100 lines each; Vietnamese copy verbatim from the spec.
- Requires the backend `GET /api/products/by-alias/{alias}` endpoint (separate API-repo sub-project); the Task 1 fallback scan covers rows whose `seoAlias` is not backfilled yet.

## Review Focus

- Unknown slug must show the `Sản phẩm không tồn tại` notice, never a blank page (Task 3 dev check: `/san-pham/khong-ton-tai`).
- API down on detail must show the error block with a working retry (Task 3 dev check: stop backend, reload, restart, retry).
- Legacy `toSlug(name)` URLs must still resolve when `seoAlias` differs or is missing, via the first-100 fallback scan (Task 1 code; dev check with an un-backfilled row).
- API `description` renders as plain text (`whitespace-pre-line`); embedded HTML tags show literally — rich-text rendering deferred (Task 2 code; dev check a product with a description).
- Products with zero images show the `placehold.co` gallery, never an empty frame (Task 1 `getGalleryImages` fallback; dev check imageless product).

---

### Task 1: Rewrite `src/pages/san-pham/detail.ts` (API-backed helpers)

**Files:**
- Modify: `src/pages/san-pham/detail.ts` (full replace)

**Interfaces:**
- Consumes: `getProductByAlias`, `listProducts`, `productImages`, `productSlug`, `ApiError`, type `ProductResponse` (all from `../../lib/api.ts`, built in `docs/plans/product.md` Task 1); `toSlug` (existing).
- Produces: `resolveProduct(slug): Promise<ProductResponse | null>` (null = 404/missing, throws otherwise), `getRelated(product, count): Promise<ProductResponse[]>`, `getGalleryImages(product): string[]` — consumed by Task 3.

- [ ] **Step 1: Replace `detail.ts` with the exact content below.**

```typescript
import {
  ApiError,
  getProductByAlias,
  listProducts,
  productImages,
  productSlug,
  type ProductResponse,
} from '../../lib/api.ts'
import { toSlug } from '../../utils/slug.ts'

export async function resolveProduct(slug: string): Promise<ProductResponse | null> {
  try {
    return await getProductByAlias(slug)
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 404) {
      throw error
    }
  }
  const firstPage = await listProducts({ page: 0, size: 100 })
  return (
    firstPage.content.find((product) => productSlug(product) === slug || toSlug(product.name) === slug) ?? null
  )
}

export async function getRelated(product: ProductResponse, count: number): Promise<ProductResponse[]> {
  if (!product.categoryId) {
    return []
  }
  const page = await listProducts({ page: 0, size: count + 1, categoryId: product.categoryId })
  return page.content.filter((item) => item.id !== product.id).slice(0, count)
}

export function getGalleryImages(product: ProductResponse): string[] {
  const images = productImages(product)
  return images.length > 0 ? images : ['https://placehold.co/600x600?text=No+Image']
}
```

- [ ] **Step 2: Verify typecheck passes.**

Run: `npm run build`
Expected: exit 0 (nothing imports the new signatures yet — `ProductDetailPage` still uses the old sync helpers and will fail only in Task 3, which rewrites it; if build fails now, the failure must be inside `detail.ts` itself).

---

### Task 2: Rewrite `ProductArticle.tsx` (API description + generic fallback)

**Files:**
- Modify: `src/pages/san-pham/components/ProductArticle.tsx` (full replace)

**Interfaces:**
- Consumes: nothing (props only).
- Produces: default-export `ProductArticle({ name, description, categoryName })` — consumed by Task 3.

- [ ] **Step 1: Replace `ProductArticle.tsx` with the exact content below.**

```tsx
interface ProductArticleProps {
  name: string
  description: string | null
  categoryName: string | null
}

const applications: string[] = [
  'Khảo sát địa hình: đo vẽ hiện trạng, thu thập dữ liệu bản đồ số.',
  'Hạ tầng giao thông: triển khai tim tuyến, kiểm tra cao độ.',
  'Xây dựng dân dụng: định vị trục công trình, kiểm tra hoàn công.',
  'Công nghiệp: bố trí kết cấu, thiết bị yêu cầu độ chính xác cao.',
]

function ProductArticle({ name, description, categoryName }: ProductArticleProps) {
  if (description) {
    return (
      <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mt-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin sản phẩm</h2>
        <p className="text-gray-600 text-sm whitespace-pre-line">{description}</p>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mt-4">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin sản phẩm</h2>
      <h3 className="font-bold text-gray-900 mb-2">Tổng quan</h3>
      <p className="text-gray-600 text-sm mb-4">
        {name} là thiết bị chính hãng do TRẮC ĐỊA THIÊN PHÚ phân phối, phù hợp cho các đơn vị khảo sát,
        xây dựng và thi công hạ tầng cần độ chính xác và độ bền cao.
      </p>
      <h3 className="font-bold text-gray-900 mb-2">Ưu điểm nổi bật</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mb-4">
        <li>Hàng chính hãng, đầy đủ CO/CQ.</li>
        <li>Hoạt động ổn định trong điều kiện công trường khắc nghiệt.</li>
        <li>Kết nối và quản lý dữ liệu thuận tiện giữa hiện trường và văn phòng.</li>
        <li>Tiết kiệm thời gian thi công, độ chính xác đáp ứng yêu cầu khắt khe.</li>
      </ul>
      <h3 className="font-bold text-gray-900 mb-2">Thông số kỹ thuật</h3>
      <table className="w-full text-sm mb-4">
        <tbody>
          {[
            ['Danh mục', categoryName ?? 'Đang cập nhật...'],
            ['Tình trạng', 'Còn hàng'],
            ['Bảo hành', '12 tháng chính hãng'],
            ['Giao hàng', 'Toàn quốc, hướng dẫn sử dụng tận nơi'],
          ].map(([label, value]) => (
            <tr key={label} className="border-t border-gray-100">
              <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">{label}</td>
              <td className="py-2 text-gray-600">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="font-bold text-gray-900 mb-2">Ứng dụng thực tiễn</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mb-4">
        {applications.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h3 className="font-bold text-gray-900 mb-2">Liên hệ tư vấn và báo giá</h3>
      <p className="text-sm text-gray-600">
        Hỗ trợ tư vấn kỹ thuật <a href="tel:0983927945" className="font-bold text-gray-900 hover:text-brand">0983.927.945</a>
        {' '}— Báo giá dự án <a href="tel:0979778945" className="font-bold text-gray-900 hover:text-brand">0979.778.945</a>.
      </p>
    </section>
  )
}

export default ProductArticle
```

- [ ] **Step 2: Verify typecheck passes.**

Run: `npm run build`
Expected: exit 0 (old `ProductDetailPage` still passes old-shaped props? No — it passes `product={product}` which no longer matches; build FAILS here by design. Confirm the only errors mention `ProductDetailPage.tsx`, then proceed to Task 3.)

---

### Task 3: Rewrite `ProductDetailPage.tsx` (fetch, states, related) and verify

**Files:**
- Modify: `src/pages/san-pham/ProductDetailPage.tsx` (full replace)

**Interfaces:**
- Consumes: `resolveProduct`, `getRelated`, `getGalleryImages` (Task 1); `ProductArticle` (Task 2); `ProductGallery` (existing, unchanged); `listCategories`, `productImage`, `productSlug` + types (listing plan Task 1); `ProductCard` (listing plan Task 2).
- Produces: working `/san-pham/:slug` page. Route in `App.tsx` unchanged.

- [ ] **Step 1: Replace `ProductDetailPage.tsx` with the exact content below.**

```tsx
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  listCategories,
  productImage,
  productSlug,
  type CategoryResponse,
  type ProductResponse,
} from '../../lib/api.ts'
import ProductCard from '../dashboard/components/ProductCard.tsx'
import { getGalleryImages, getRelated, resolveProduct } from './detail.ts'
import ProductArticle from './components/ProductArticle.tsx'
import ProductGallery from './components/ProductGallery.tsx'

const highlights: string[] = [
  'Hàng chính hãng, đầy đủ CO/CQ.',
  'Bảo hành 12 tháng, hỗ trợ kỹ thuật trọn đời máy.',
  'Giao hàng toàn quốc, chuyển giao công nghệ tận nơi.',
  'Giá tốt nhất cho dự án và đại lý.',
]

type LoadState = 'loading' | 'missing' | 'error' | 'ready'

function ProductDetailPage() {
  const { slug = '' } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<ProductResponse | null>(null)
  const [related, setRelated] = useState<ProductResponse[]>([])
  const [categoryName, setCategoryName] = useState<string | null>(null)
  const [state, setState] = useState<LoadState>('loading')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState('loading')
    resolveProduct(slug)
      .then((found) => {
        if (cancelled) {
          return
        }
        if (!found) {
          setState('missing')
          return
        }
        setProduct(found)
        setState('ready')
        getRelated(found, 8)
          .then((items) => {
            if (!cancelled) {
              setRelated(items)
            }
          })
          .catch(() => {
            if (!cancelled) {
              setRelated([])
            }
          })
        if (found.categoryId) {
          const categoryId = found.categoryId
          listCategories()
            .then((categories: CategoryResponse[]) => {
              if (!cancelled) {
                setCategoryName(categories.find((category) => category.id === categoryId)?.name ?? null)
              }
            })
            .catch(() => {
              if (!cancelled) {
                setCategoryName(null)
              }
            })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState('error')
        }
      })
    return () => {
      cancelled = true
    }
  }, [slug, reloadKey])

  if (state === 'loading') {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 animate-pulse" aria-label="Đang tải sản phẩm">
        <div className="h-4 w-1/3 bg-gray-100 rounded mb-3" />
        <div className="grid gap-4 lg:grid-cols-2 items-start">
          <div className="h-80 bg-gray-100 rounded-xl" />
          <div className="h-80 bg-gray-100 rounded-xl" />
        </div>
      </div>
    )
  }

  if (state === 'missing') {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-xl font-bold text-gray-900 mb-2">Sản phẩm không tồn tại</p>
        <Link to="/san-pham" className="text-brand hover:underline">Quay lại Tất cả sản phẩm</Link>
      </div>
    )
  }

  if (state === 'error' || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-xl font-bold text-gray-900 mb-2">Không tải được sản phẩm. Vui lòng thử lại.</p>
        <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-3 text-sm font-bold text-white bg-brand px-5 py-2 rounded-lg hover:opacity-90">Tải lại</button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to="/san-pham" className="hover:text-brand">Tất cả sản phẩm</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>
      <div className="grid gap-4 lg:grid-cols-2 items-start">
        <ProductGallery images={getGalleryImages(product)} name={product.name} />
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-600 mt-2">Nhà cung cấp: <span className="font-medium text-gray-900">TRẮC ĐỊA THIÊN PHÚ</span></p>
          <p className="text-sm text-gray-600 mt-1">Mã sản phẩm: {product.skuCode ?? '(Đang cập nhật...)'}</p>
          <p className="text-sm mt-1">Tình trạng: <span className="font-medium text-emerald-700">Còn hàng</span></p>
          <p className="font-bold text-brand text-2xl mt-3">Liên hệ</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mt-3">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 mt-3">
            Hotline: <a href="tel:0983927945" className="font-bold text-gray-900 hover:text-brand">0983.927.945</a>
            {' - '}<a href="tel:0979778945" className="font-bold text-gray-900 hover:text-brand">0979.778.945</a>
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button type="button" aria-label="Giảm số lượng" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-9 text-gray-600 hover:text-brand">−</button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button type="button" aria-label="Tăng số lượng" onClick={() => setQuantity((q) => q + 1)} className="w-9 h-9 text-gray-600 hover:text-brand">+</button>
            </div>
            <a href="tel:0983927945" className="bg-brand text-white font-bold text-sm px-6 py-2.5 rounded-lg hover:opacity-90">MUA NGAY</a>
          </div>
        </div>
      </div>
      <ProductArticle name={product.name} description={product.description} categoryName={categoryName} />
      <section className="mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Sản phẩm gợi ý</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {related.map((item) => (
            <ProductCard key={item.id} name={item.name} image={productImage(item)} slug={productSlug(item)} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductDetailPage
```

- [ ] **Step 2: Verify.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` with the API running: `/san-pham` card click-through lands on detail with gallery + info + article + related; unknown slug `/san-pham/khong-ton-tai` shows the notice; stop the API → error block appears and retry recovers; layout stacks on mobile; `/` and `/gioi-thieu` unchanged.

---

### Task 4: Remove unused bindings (build fix, spec-deferred UI)

**Context:** `npm run build` fails at `tsc -b` with 4x TS6133 (`noUnusedLocals`): `ProductArticle.tsx:7` (`name`, `categoryName`) and `ProductDetailPage.tsx:24` (`quantity`, `setQuantity`). The quantity stepper / `MUA NGAY` / generic article fallback UIs are deferred per `docs/specs/product-detail.md`, so the fix is delete-only, no behavior change. No test runner exists — verification is build + lint.

**Files:**
- Modify: `src/pages/san-pham/components/ProductArticle.tsx` (1 line)
- Modify: `src/pages/san-pham/ProductDetailPage.tsx` (1 line)

- [ ] **Step 1: Change the `ProductArticle` destructure to `{ description }`.**

Keep the `ProductArticleProps` interface and the `ProductDetailPage` call site untouched (unused interface members don't trigger TS6133; the call site still passes `name`/`description`/`categoryName`, which remain valid props).

- [ ] **Step 2: Delete the `quantity` state line in `ProductDetailPage`.**

Remove `const [quantity, setQuantity] = useState(1)`. The `useState` import stays (used by `snapshot`/`related`/`categoryName`/`reloadKey`).

- [ ] **Step 3: Verify.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

---

### Task 5: Collapsible `ProductArticle` (`Xem thêm` / `Thu gọn`)

**Files:**
- Modify: `src/pages/product/components/ProductArticle.tsx` (only file)

**Behavior:**
- Collapsed (default): description block `max-h-[300px] overflow-hidden` + bottom fade gradient; button `Xem thêm` below.
- Expanded: full height, button becomes `Thu gọn`.
- Button renders only when content overflows (`scrollHeight > 300`, re-checked when `description` changes); short content shows fully with no button. Empty-description branch unchanged.

**Notes:**
- CSS height clamp only (no text truncation — `description` is raw HTML).
- `useState` for `expanded` + overflow flag, `useRef` + `useEffect` for measuring. Reset `expanded` when `description` changes.

- [ ] **Step 1: Implement collapsed/expanded toggle in `ProductArticle.tsx`.**

- [ ] **Step 2: Verify.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` visual check: long description clamps with fade → `Xem thêm` expands → `Thu gọn` collapses; short description shows no button.
