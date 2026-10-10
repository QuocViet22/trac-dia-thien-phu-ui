# Product Detail Page (/san-pham/:slug) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (repo has no subagent tool; native inline execution). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/san-pham/:slug` product detail page matching the reference structure with dummy data.

**Architecture:** Shared `toSlug()` helper derives slugs from product names (no data churn); `detail.ts` looks up products across all dummy lists; new `ProductDetailPage` + `ProductGallery` + `ProductArticle` components under `src/pages/san-pham/`; `ProductCard` root becomes a `Link`; one new route in `App.tsx`.

**Tech Stack:** React 19, react-router 8 (`useParams`, `Link`), Tailwind v4 (`brand #22abff`), FontAwesome CDN icons, shared `Img` wrapper with `placehold.co` fallback.

**Spec:** `docs/specs/product-detail.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0).
- No test runner — verification is build + lint + `npm run dev` visual/click-through check.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- `verbatimModuleSyntax: true` — type imports must use `import type` (inline `type` qualifiers allowed); `noUnusedLocals` + `noUnusedParameters` — no unused vars.
- Components ≤ ~100 lines each; Vietnamese copy verbatim from the spec.

## Review Focus

- Duplicate product names across dummy lists share one slug (first match wins) — every same-named card must land on the same detail page (Task 3 dev check: open the same product from `/` and `/san-pham`).
- Vietnamese names with Đ/đ and punctuation must slugify without empty segments or leading/trailing dashes, e.g. `Máy Thủy Bình Sokkia B20` → `may-thuy-binh-sokkia-b20` (Task 1 dev check: build passes + spot-check slugs below).
- Unknown slug must show the notice, never a blank page or crash (Task 3 dev check: visit `/san-pham/khong-ton-tai`).
- Gallery thumbnails must be unique images with the main image first and never duplicate it (Task 1 code filters `product.image` out of siblings; Task 3 dev check).
- Nested-link HTML: `ProductCard` becomes a `Link`, so the related grid must not wrap cards in another anchor (Task 3 renders cards directly in a `div` grid — dev check: related cards navigate).

---

### Task 1: Create `src/utils/slug.ts` and `src/pages/san-pham/detail.ts`

**Files:**
- Create: `src/utils/slug.ts`
- Create: `src/pages/san-pham/detail.ts`

**Interfaces:**
- Consumes: `Product` type + `bestSellers`, `categorySections` from `../dashboard/data.ts`; `products` from `./data.ts` (both existing).
- Produces: `toSlug(name: string): string`; `getProductBySlug(slug: string): Product | undefined`; `getRelated(product: Product, count: number): Product[]`; `getGalleryImages(product: Product): string[]` — consumed by Task 2/3.

- [ ] **Step 1: Create `src/utils/slug.ts` with the exact content below.**

```typescript
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

(If the editor mangles the `/[̀-ͯ]/g` range, use `/[\u0300-\u036f]/g` instead — same combining-marks range.)

- [ ] **Step 2: Create `src/pages/san-pham/detail.ts` with the exact content below.**

```typescript
import { bestSellers, categorySections, type Product } from '../dashboard/data.ts'
import { toSlug } from '../../utils/slug.ts'
import { products } from './data.ts'

const allProducts: Product[] = [
  ...products,
  ...bestSellers,
  ...categorySections.flatMap((section) => section.products),
]

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((product) => toSlug(product.name) === slug)
}

export function getRelated(product: Product, count: number): Product[] {
  const slug = toSlug(product.name)
  const others = allProducts.filter((item) => toSlug(item.name) !== slug)
  const sameBrand = others.filter((item) => item.brand === product.brand)
  const rest = others.filter((item) => item.brand !== product.brand)
  const deduped = [...sameBrand, ...rest].filter(
    (item, index, list) => list.findIndex((other) => toSlug(other.name) === toSlug(item.name)) === index,
  )
  return deduped.slice(0, count)
}

export function getGalleryImages(product: Product): string[] {
  const siblings = allProducts
    .filter((item) => item.image !== product.image)
    .map((item) => item.image)
    .filter((image, index, list) => list.indexOf(image) === index)
  return [product.image, ...siblings].slice(0, 5)
}
```

- [ ] **Step 3: Verify typecheck passes.**

Run: `npm run build`
Expected: exit 0 (nothing imports the new files yet; proves they compile). Spot-check slugs mentally: `Máy Thủy Bình Sokkia B20` → `may-thuy-binh-sokkia-b20`; `Máy GNSS RTK Hi-Target V600L` → `may-gnss-rtk-hi-target-v600l`.

---

### Task 2: Create `ProductGallery.tsx`, `ProductArticle.tsx`, link `ProductCard`

**Files:**
- Create: `src/pages/san-pham/components/ProductGallery.tsx`
- Create: `src/pages/san-pham/components/ProductArticle.tsx`
- Modify: `src/pages/dashboard/components/ProductCard.tsx` (root `div` → `Link`)

**Interfaces:**
- Consumes: `Img` wrapper (`../../../components/Img.tsx`); `Product` type; `toSlug` (`../../../utils/slug.ts` from `ProductCard`).
- Produces: default-export `ProductGallery({ images, name })` and `ProductArticle({ product })`, used by Task 3; `ProductCard` now navigates to `/san-pham/{slug}` with unchanged visuals.

- [ ] **Step 1: Create `ProductGallery.tsx` with the exact content below.**

```tsx
import { useState } from 'react'
import Img from '../../../components/Img.tsx'

interface ProductGalleryProps {
  images: string[]
  name: string
}

function ProductGallery({ images, name }: ProductGalleryProps) {
  const [index, setIndex] = useState(0)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="relative">
        <Img src={images[index]} fallback="https://placehold.co/600x600?text=No+Image" alt={name} className="w-full h-80 object-contain" />
        <button type="button" aria-label="Yêu thích" className="absolute top-2 right-2 w-9 h-9 rounded-full border border-gray-200 text-gray-400 hover:text-red-500 bg-white">
          <i className="fa-regular fa-heart"></i>
        </button>
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto">
        {images.map((image, thumbIndex) => (
          <button
            key={image}
            type="button"
            onClick={() => setIndex(thumbIndex)}
            aria-label={`Xem ảnh ${thumbIndex + 1}`}
            className={`shrink-0 rounded-lg border p-1 transition-colors ${thumbIndex === index ? 'border-brand' : 'border-gray-200 hover:border-brand'}`}
          >
            <Img src={image} fallback="https://placehold.co/100x100?text=No+Image" alt="" className="w-16 h-16 object-contain" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductGallery
```

- [ ] **Step 2: Create `ProductArticle.tsx` with the exact content below.**

```tsx
import type { Product } from '../../dashboard/data.ts'

const applications: string[] = [
  'Khảo sát địa hình: đo vẽ hiện trạng, thu thập dữ liệu bản đồ số.',
  'Hạ tầng giao thông: triển khai tim tuyến, kiểm tra cao độ.',
  'Xây dựng dân dụng: định vị trục công trình, kiểm tra hoàn công.',
  'Công nghiệp: bố trí kết cấu, thiết bị yêu cầu độ chính xác cao.',
]

function ProductArticle({ product }: { product: Product }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mt-4">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin sản phẩm</h2>
      <h3 className="font-bold text-gray-900 mb-2">Tổng quan</h3>
      <p className="text-gray-600 text-sm mb-4">
        {product.name} là thiết bị chính hãng do TRẮC ĐỊA THIÊN PHÚ phân phối, phù hợp cho các đơn vị khảo sát,
        xây dựng và thi công hạ tầng cần độ chính xác và độ bền cao.
      </p>
      <h3 className="font-bold text-gray-900 mb-2">Ưu điểm nổi bật</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mb-4">
        <li>Thương hiệu {product.brand} uy tín, hàng chính hãng.</li>
        <li>Hoạt động ổn định trong điều kiện công trường khắc nghiệt.</li>
        <li>Kết nối và quản lý dữ liệu thuận tiện giữa hiện trường và văn phòng.</li>
        <li>Tiết kiệm thời gian thi công, độ chính xác đáp ứng yêu cầu khắt khe.</li>
      </ul>
      <h3 className="font-bold text-gray-900 mb-2">Thông số kỹ thuật</h3>
      <table className="w-full text-sm mb-4">
        <tbody>
          {[
            ['Thương hiệu', product.brand],
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

- [ ] **Step 3: Link `ProductCard`.** In `src/pages/dashboard/components/ProductCard.tsx`: add `import { Link } from 'react-router'` and `import { toSlug } from '../../../utils/slug.ts'`; change the root `<div className="product-card ...">` to `<Link to={`/san-pham/${toSlug(name)}`} className="product-card ...">` and the closing `</div>` to `</Link>`. Keep all inner markup and classes identical (add `block` to the class list so layout is unchanged).

- [ ] **Step 4: Verify typecheck passes.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0 (detail page doesn't exist yet; dashboard + listing cards now render as links with identical visuals — confirm in `dev` that `/` still looks the same).

---

### Task 3: Create `ProductDetailPage.tsx`, wire route, verify

**Files:**
- Create: `src/pages/san-pham/ProductDetailPage.tsx`
- Modify: `src/App.tsx` (add import + `<Route path="/san-pham/:slug" ... />`)

**Interfaces:**
- Consumes: `getProductBySlug`, `getRelated`, `getGalleryImages` (Task 1); `ProductGallery`, `ProductArticle` (Task 2); `ProductCard` (Task 2, now a link); `useParams` from `react-router`.
- Produces: default-export `ProductDetailPage()`; route `/san-pham/:slug` renders it inside `SiteLayout`.

- [ ] **Step 1: Create `ProductDetailPage.tsx` with the exact content below.**

```tsx
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import ProductCard from '../dashboard/components/ProductCard.tsx'
import { getGalleryImages, getProductBySlug, getRelated } from './detail.ts'
import ProductArticle from './components/ProductArticle.tsx'
import ProductGallery from './components/ProductGallery.tsx'

const highlights: string[] = [
  'Hàng chính hãng, đầy đủ CO/CQ.',
  'Bảo hành 12 tháng, hỗ trợ kỹ thuật trọn đời máy.',
  'Giao hàng toàn quốc, chuyển giao công nghệ tận nơi.',
  'Giá tốt nhất cho dự án và đại lý.',
]

function ProductDetailPage() {
  const { slug = '' } = useParams()
  const [quantity, setQuantity] = useState(1)
  const product = getProductBySlug(slug)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-xl font-bold text-gray-900 mb-2">Sản phẩm không tồn tại</p>
        <Link to="/san-pham" className="text-brand hover:underline">Quay lại Tất cả sản phẩm</Link>
      </div>
    )
  }

  const related = getRelated(product, 8)

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
          <p className="text-sm text-gray-600 mt-1">Mã sản phẩm: (Đang cập nhật...)</p>
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
      <ProductArticle product={product} />
      <section className="mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Sản phẩm gợi ý</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {related.map((item) => (
            <ProductCard key={item.name} {...item} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductDetailPage
```

- [ ] **Step 2: Wire the route in `App.tsx`.** Add `import ProductDetailPage from './pages/san-pham/ProductDetailPage.tsx'` and insert `<Route path="/san-pham/:slug" element={<ProductDetailPage />} />` between the `/san-pham` route and the `*` fallback (fallback stays last).

- [ ] **Step 3: Verify.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` click-through: `/san-pham` card → detail with gallery + info + article + related; same product from `/` lands on the same URL; `/san-pham/khong-ton-tai` shows the notice; `MUA NGAY` dials; layout stacks on mobile; `/` and `/gioi-thieu` unchanged.
