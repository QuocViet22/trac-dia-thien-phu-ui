# Product Listing Page (/san-pham) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (repo has no subagent tool; native inline execution). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/san-pham` product listing page matching the reference layout with dummy data.

**Architecture:** New `src/pages/san-pham/` folder (`SanPhamPage.tsx` + `data.ts` + two small components) following dashboard page patterns; grid reuses the dashboard `ProductCard`; one new route in `App.tsx`; one link change in `MainNav.tsx`.

**Tech Stack:** React 19, react-router 8, Tailwind v4 (`brand #22abff`), FontAwesome CDN icons, shared `Img` wrapper (used inside `ProductCard`).

**Spec:** `docs/specs/product.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0).
- No test runner — verification is build + lint + `npm run dev` visual check.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- `verbatimModuleSyntax: true` — type imports must use `import type`; `noUnusedLocals` + `noUnusedParameters` — no unused vars.
- Components ≤ ~100 lines each, props-only, no data fetching; Vietnamese copy verbatim from the spec.

## Review Focus

- Mobile stacking: sidebar must stack above the grid below `lg` (no horizontal overflow at 360px) — verify in `dev` visual check.
- Broken hotlinked images must fall back to `placehold.co` via `Img` (already handled inside `ProductCard`; no new image code).
- Active nav state: `/san-pham` must highlight the `MainNav` "Sản phẩm" link exactly like other links.
- Unknown route fallback (`* → /`) must keep working after adding the new route.
- Static controls (`Bỏ hết`, checkboxes, sort buttons, pagination, view toggle) are anchors/buttons with `href="#"` or `type="button"` — they must not navigate away or submit anything.

---

### Task 1: Create `src/pages/san-pham/data.ts`

**Files:**
- Create: `src/pages/san-pham/data.ts`

**Interfaces:**
- Consumes: nothing (reuses image URLs already present in `src/pages/dashboard/data.ts`).
- Produces: `brands: string[]`, `priceRanges: string[]`, `categories: string[]`, `sortOptions: string[]`, `products: Product[]` (imports `type { Product }` from `../dashboard/data.ts`).

- [ ] **Step 1: Create `data.ts` with the exact content below.**

```typescript
import type { Product } from '../dashboard/data.ts'

export const brands: string[] = [
  'Hi-Target',
  'Sokkia',
  'Topcon',
  'Garmin',
  'Leica',
  'Nikon',
  'Precise',
  'E-Survey',
]

export const priceRanges: string[] = [
  'Giá dưới 100.000đ',
  '100.000đ - 200.000đ',
  '200.000đ - 300.000đ',
  '300.000đ - 500.000đ',
  '500.000đ - 1.000.000đ',
  'Giá trên 1.000.000đ',
]

export const categories: string[] = [
  'Máy GNSS RTK',
  'Máy Thủy Bình',
  'Máy Toàn Đạc Điện Tử',
  'Máy Định Vị GPS Cầm Tay',
  'Phụ Kiện Trắc Địa',
  'Máy Cân Bằng Laser',
  'Máy Bộ Đàm',
  'Máy Đo Khoảng Cách Laser',
  'Thiết Bị Đo Điện',
  'Máy Quét Laser Scan',
]

export const sortOptions: string[] = [
  'Hàng mới',
  'Giá thấp đến cao',
  'Giá cao xuống thấp',
]

export const products: Product[] = [
  { brand: 'Sokkia', name: 'Máy toàn đạc điện tử Sokkia IM-65', image: 'https://igeostore.vn/storage/sokkia-im-62-7-276x276.jpg', badge: 'Mới' },
  { brand: 'Sokkia', name: 'Máy toàn đạc điện tử Sokkia IM-62', image: 'https://igeostore.vn/storage/sokkia-im-62-7-276x276.jpg', badge: 'Mới' },
  { brand: 'Topcon', name: 'Máy cân bằng laser xoay Topcon RL-H5A', image: 'https://igeostore.vn/storage/topcon-rl-h5a-34714-276x276.jpg', badge: 'Mới' },
  { brand: 'Garmin', name: 'Máy định vị GPS cầm tay Garmin Montana 710', image: 'https://igeostore.vn/storage/may-gps-garmin-montana-710-276x276.jpg', badge: 'Mới' },
  { brand: 'Hi-Target', name: 'Máy GNSS RTK Hi-Target V600L', image: 'https://igeostore.vn/storage/hi-target-v600l-276x276.jpg', badge: 'Mới' },
  { brand: 'Garmin', name: 'Máy định vị cầm tay Garmin GPSMap H1', image: 'https://igeostore.vn/storage/garmin-gpsmap-h1-1-276x276.jpg', badge: 'Mới' },
  { brand: 'Sokkia', name: 'Máy Thủy Bình Sokkia B20', image: 'https://igeostore.vn/storage/may-thuy-binh-sokkia-b20-2-276x276.jpg' },
  { brand: 'Garmin', name: 'Máy định vị GPS cầm tay Garmin 65S', image: 'https://igeostore.vn/storage/garmin-65s-276x276.jpg', badge: 'Hot' },
  { brand: 'Sokkia', name: 'Máy Thủy Bình Sokkia B30A', image: 'https://igeostore.vn/storage/sokkia-b30a-276x276.jpg', badge: 'Hot' },
  { brand: 'Sokkia', name: 'Máy Thủy Bình Sokkia B40A (4)', image: 'https://igeostore.vn/storage/sokkia-b40a-276x276.jpg', badge: 'Hot' },
  { brand: 'Hi-Target', name: 'Máy GNSS RTK Hi-Target V500 (1)', image: 'https://igeostore.vn/storage/gnss-rtk-v500-4-276x276.jpg', badge: 'Hot' },
  { brand: 'Sokkia', name: 'Máy toàn đạc điện tử Sokkia IM105', image: 'https://igeostore.vn/storage/im105-276x276.jpg', badge: 'Hot' },
]
```

- [ ] **Step 2: Verify typecheck passes for the new file.**

Run: `npm run build`
Expected: exit 0 (page components don't exist yet — build succeeds because nothing imports `data.ts`; this only proves the file itself typechecks).

---

### Task 2: Create `FilterSidebar.tsx` and `Toolbar.tsx`

**Files:**
- Create: `src/pages/san-pham/components/FilterSidebar.tsx`
- Create: `src/pages/san-pham/components/Toolbar.tsx`

**Interfaces:**
- Consumes: `brands`, `priceRanges`, `categories`, `sortOptions` from `../data.ts` (imported directly, no props).
- Produces: default-export `FilterSidebar()` and `Toolbar()` components taking no props, used by Task 3.

- [ ] **Step 1: Create `FilterSidebar.tsx` with the exact content below.**

```tsx
import { brands, categories, priceRanges } from '../data.ts'

function FilterSidebar() {
  return (
    <aside className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-gray-900">Bộ lọc sản phẩm</p>
        <a href="#" className="text-sm text-gray-500 hover:text-brand">Bỏ hết</a>
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
      <p className="font-bold text-sm text-gray-900 mb-2">Giá bán</p>
      <ul className="space-y-1.5 mb-4">
        {priceRanges.map((range) => (
          <li key={range}>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="accent-[#22abff]" />
              {range}
            </label>
          </li>
        ))}
      </ul>
      <p className="font-bold text-sm text-gray-900 mb-2">Danh mục</p>
      <ul className="space-y-1.5">
        {categories.map((category) => (
          <li key={category}>
            <a href="#" className="text-sm text-gray-600 hover:text-brand">{category}</a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default FilterSidebar
```

- [ ] **Step 2: Create `Toolbar.tsx` with the exact content below.**

```tsx
import { sortOptions } from '../data.ts'

function Toolbar() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="font-bold text-sm text-gray-900">Xếp theo:</span>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option, index) => (
          <button
            key={option}
            type="button"
            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${index === 0 ? 'border-brand text-brand font-medium' : 'border-gray-200 text-gray-600 hover:border-brand hover:text-brand'}`}
          >
            {option}
          </button>
        ))}
      </div>
      <span className="ml-auto flex items-center gap-2 text-sm text-gray-600">
        Xem:
        <button type="button" aria-label="Xem dạng lưới" className="text-brand"><i className="fa-solid fa-table-cells-large"></i></button>
        <button type="button" aria-label="Xem dạng cột" className="text-gray-400 hover:text-brand"><i className="fa-solid fa-list"></i></button>
      </span>
    </div>
  )
}

export default Toolbar
```

- [ ] **Step 3: Verify typecheck passes.**

Run: `npm run build`
Expected: exit 0 (components unreferenced so far; proves the files compile).

---

### Task 3: Create `SanPhamPage.tsx`, wire route + nav

**Files:**
- Create: `src/pages/san-pham/SanPhamPage.tsx`
- Modify: `src/App.tsx` (add import + `<Route path="/san-pham" ... />`)
- Modify: `src/components/layout/MainNav.tsx` (Sản phẩm anchor → `Link to="/san-pham"`)

**Interfaces:**
- Consumes: `FilterSidebar`, `Toolbar` (Task 2), `products` (Task 1), `ProductCard` from `../dashboard/components/ProductCard.tsx`.
- Produces: default-export `SanPhamPage()`; route `/san-pham` renders it inside `SiteLayout`.

- [ ] **Step 1: Create `SanPhamPage.tsx` with the exact content below.**

```tsx
import { Link } from 'react-router'
import ProductCard from '../dashboard/components/ProductCard.tsx'
import FilterSidebar from './components/FilterSidebar.tsx'
import Toolbar from './components/Toolbar.tsx'
import { products } from './data.ts'

function SanPhamPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Tất cả sản phẩm</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Tất cả sản phẩm</h1>
      <div className="grid gap-4 lg:grid-cols-[240px_1fr] items-start">
        <FilterSidebar />
        <div className="flex flex-col gap-4">
          <Toolbar />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {products.map((product) => (
              <ProductCard key={product.name} {...product} />
            ))}
          </div>
          <nav aria-label="Phân trang" className="flex justify-center gap-1.5">
            <a href="#" aria-label="Trang trước" className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-brand hover:text-brand">«</a>
            {[1, 2, 3].map((page) => (
              <a
                key={page}
                href="#"
                aria-label={`Trang ${page}`}
                aria-current={page === 1 ? 'page' : undefined}
                className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm ${page === 1 ? 'border-brand text-brand font-bold' : 'border-gray-200 text-gray-600 hover:border-brand hover:text-brand'}`}
              >
                {page}
              </a>
            ))}
            <a href="#" aria-label="Trang tiếp" className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-brand hover:text-brand">»</a>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default SanPhamPage
```

- [ ] **Step 2: Wire the route in `App.tsx`.** Add `import SanPhamPage from './pages/san-pham/SanPhamPage.tsx'` and insert `<Route path="/san-pham" element={<SanPhamPage />} />` between the `/gioi-thieu` route and the `*` fallback (order matters: fallback stays last).

- [ ] **Step 3: Link `MainNav` to the page.** In `src/components/layout/MainNav.tsx`, replace the `Sản phẩm` placeholder anchor with `<Link to="/san-pham" className={location.pathname === "/san-pham" ? activeLink : idleLink}>Sản phẩm</Link>` (drop the angle-down icon; it is now a real link).

- [ ] **Step 4: Verify.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` — `/` and `/gioi-thieu` unchanged; `/san-pham` shows breadcrumb + H1 + sidebar + toolbar + 12-card grid + pagination; nav highlights `Sản phẩm`; sidebar stacks above grid on mobile with no overflow.
