# Product Listing Page (/san-pham) — Design Spec

Source: https://tracdiathienphu.com/collections/all (breadcrumb, filter sidebar, sort toolbar, product grid, pagination, brand carousel).
Target: production-ready React page at `/san-pham` inside the existing `SiteLayout`, served with `react-router`, data from the `trac-dia-thien-phu-api` backend.

## Goals

- Serve `/san-pham` via `react-router`: `/` renders `DashboardPage`, `/gioi-thieu` renders `IntroductionPage`, `/san-pham` renders `SanPhamPage`, all inside `SiteLayout`.
- Replicate the reference layout with Vietnamese copy: breadcrumb (`Trang chủ / Tất cả sản phẩm`), H1 `Tất cả sản phẩm`, left filter sidebar, sort toolbar, product grid, pagination bar.
- Load grid data from `GET {VITE_API_URL}/api/products` (paginated) instead of mock `data.ts`. Page size 12.
- Wire real pagination (`page`, `totalPages` from the API `Page` payload), category filter (`?categoryId=` with options from `GET /api/categories`), and sort (`?sort=`) through the existing toolbar/sidebar/pagination visuals.
- Sidebar + toolbar keep their current static look; they become functional for category/sort, price ranges stay visual-only (API has no price field).
- Card mapping: name + first image (`images` sorted by `sortOrder`) + `Liên hệ` price. Brand and badge lines are hidden (API products have no brand/badge fields) — `ProductCard` props become optional for those.
- Loading state: skeleton cards. Error state: error block with retry button. Empty state: Vietnamese empty text.
- `MainNav` "Sản phẩm" stays a `Link to="/san-pham"` with active styling.
- Follow dashboard patterns: Tailwind, brand `#22abff`, shared `Img` wrapper with `placehold.co` fallback, components under ~100 lines.
- API base URL from `VITE_API_URL` env, default `http://localhost:8080`. Documented in `.env.example`.

## Non-goals

- No price display, discounts, or price-range filtering (API has no price field).
- No brand-partner carousel (deferred).
- Brand filtering is covered by `docs/specs/brand-filter.md` (single-select
  radios sending `?brand=`; requires the backend list-filter endpoint).
- No cart/wishlist backend.

## API Contract (backend: `trac-dia-thien-phu-api`)

- `GET /api/products?categoryId={uuid}&page={n}&size=12&sort={field},{dir}` → `ApiResponse<Page<ProductResponse>>` (existing endpoint, reused as-is; e.g. `sort=createdAt,desc`).
- `GET /api/categories` → `ApiResponse<List<CategoryResponse>>` (existing endpoint, reused for filter options).
- `GET /api/products/by-alias/{alias}` → `ApiResponse<ProductResponse>` (**new endpoint**, see `docs/specs/product-detail.md`). Exact match on unique `seoAlias`; 404 when unknown.
- Spring `Page` JSON shape: `{ content, totalPages, totalElements, number, size }` inside `ApiResponse.data`.
- CORS already allows `http://localhost:5173`; no auth required while `springdoc.enabled=true`.

## Architecture

- `App.tsx` routes unchanged (`/san-pham` → `SanPhamPage`).
- New `src/lib/api.ts`: `API_BASE` (from `import.meta.env.VITE_API_URL` with localhost default), typed `ApiResponse<T>` / `Page<T>` / `ProductResponse` / `CategoryResponse`, `fetchJson` helper that unwraps `ApiResponse` and throws on `!success` or non-2xx.
- `src/pages/san-pham/`: `SanPhamPage.tsx` fetches list via `useEffect` on `[page, categoryId, sort]` state; `FilterSidebar.tsx` takes category options + selected + callback props; `Toolbar.tsx` takes sort value + callback props; pagination bar renders `totalPages` buttons.
- `src/pages/dashboard/components/ProductCard.tsx`: `brand` and `badge` props optional; brand/badge lines render only when present; `Link` target switches from `toSlug(name)` to `/san-pham/{seoAlias ?? toSlug(name)}`.
- Mock `src/pages/san-pham/data.ts` stays as types/static labels reference (brands/priceRanges/sortOptions labels) but is no longer the grid data source.
- Spec files: `docs/specs/product.md` (this file), `docs/specs/product-detail.md`; implementation plan follows after approval.

## Content

- Breadcrumb (`Trang chủ` links `/`), H1 `Tất cả sản phẩm`.
- Categories come from the API (`CategoryResponse.name`); price ranges and sort labels keep current Vietnamese copy.
- Brand checkbox list is visual-only (no API field) and capped with an internal scroll (`max-h`, `overflow-y-auto`) so ~15 rows are visible and the rest scroll inside the box.
- Loading: skeleton cards matching grid shape. Error: `Không tải được sản phẩm. Vui lòng thử lại.` + retry button. Empty: `Chưa có sản phẩm trong danh mục này.`
- Card shows product name, first image, `Liên hệ` price, star row; no brand/badge lines.

## Assets

- Product images come from API `images[].imageUrl` (R2 public URLs) with `placehold.co` fallback via the shared `Img` wrapper.

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes.
- `npm run dev` visual check against the reference layout at desktop + mobile: grid shows API products; pagination switches pages; category filter narrows the grid; sort changes order; API-down shows error + retry works; empty category shows empty text; `/` and `/gioi-thieu` unchanged.
