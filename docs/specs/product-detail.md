# Product Detail Page (/san-pham/:slug) — Design Spec

Source: https://tracdiathienphu.com/may-toan-dac-sokkia-im-60 (breadcrumb, gallery + info, full article, related grid).
Target: production-ready React detail page at `/san-pham/:slug` inside the existing `SiteLayout`, data from the `trac-dia-thien-phu-api` backend, following the current theme (brand `#22abff`, Inter, `ProductCard` style).

## Goals

- Serve `/san-pham/:slug` via `react-router`: `/san-pham` renders `SanPhamPage`, `/san-pham/:slug` renders `ProductDetailPage`, both inside `SiteLayout`; the `*` fallback stays last and untouched.
- `:slug` is the product's `seoAlias`. Legacy/mock names still resolve via the shared `toSlug()` helper (NFD normalize, strip diacritics, `đ→d`, lowercase, non-alphanumerics → `-`) as a fallback match.
- Detail data from new backend endpoint `GET /api/products/by-alias/{alias}` (exact match on unique `seoAlias`); unknown slug renders a `Sản phẩm không tồn tại` notice with a link back to `/san-pham` (API 404 maps to this branch).
- Breadcrumb (`Trang chủ / Tất cả sản phẩm / {name}`) + gallery/info grid: gallery (main image + thumbnail row, `useState` selected index; images from `ProductResponse.images` sorted by `sortOrder`), info (H1 name, `shortDescription` HTML block rendered via `dangerouslySetInnerHTML` when present). No quantity stepper, no `MUA NGAY` button (deferred — see Non-goals).
- Article: renders API `description` HTML via `dangerouslySetInnerHTML` when present; long content collapses to ~300px with a fade + `Xem thêm` button (`Thu gọn` to collapse back); short content shows fully with no button; renders an empty section when absent (generic fallback template deferred).
- `Sản phẩm gợi ý` grid: same-`categoryId` products (via `GET /api/products?categoryId=`) first, up to 8, reusing `ProductCard`.
- Loading state: detail skeleton. Error state (non-404): error block with retry.
- Follow existing patterns: Tailwind, shared `Img` wrapper with `placehold.co` fallback, components under ~100 lines, typed data.

## Non-goals

- No cart, checkout, wishlist, review, or account backend; no quantity stepper or `MUA NGAY` button (deferred).
- No tab interface for the article (stacked sections, simpler).
- No video embed (no placeholder player).
- No brand-partner carousel.

## API Contract (backend: `trac-dia-thien-phu-api`)

- **New:** `GET /api/products/by-alias/{alias}` → `ApiResponse<ProductResponse>`; exact match on `Product.seoAlias` (unique column); 404 when no match. Implemented via `ProductRepository.findBySeoAlias` + service passthrough + controller mapping with the existing `toResponse` (includes `images` sorted by `sortOrder`).
- Reused: `GET /api/products?categoryId=&size=8` for related products.
- Backend must backfill `seoAlias` for existing rows (slugified names) so old products resolve.

## Architecture

- `App.tsx` route unchanged (`/san-pham/:slug` between `/san-pham` and `*`).
- `src/utils/slug.ts`: `toSlug` kept for fallback matching and legacy card links.
- `src/pages/san-pham/`: `ProductDetailPage.tsx` (fetch by alias via `src/lib/api.ts`, breadcrumb, gallery/info grid, article, related grid, not-found branch, loading/error branches), `detail.ts` (article fallback template + related-ranking helpers over API types), `components/ProductGallery.tsx` (unchanged, takes `images: string[]`).
- `src/lib/api.ts` (shared with listing spec): adds `getProductByAlias(alias)` and `listProducts(params)` helpers.
- Spec file: `docs/specs/product-detail.md` (this file); implementation plan follows after approval.

## Content

- Info panel: product name + `shortDescription` only (supplier/SKU/stock/hotline/`MUA NGAY` labels deferred).
- Article fallback: empty section (generic template with `Tổng quan`/`Ưu điểm`/`Thông số`/`Ứng dụng`/`Liên hệ` sections deferred).

## Assets

- Gallery images from API `images[].imageUrl` with `placehold.co` fallback via the shared `Img` wrapper.

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes.
- `npm run dev` visual check: `/san-pham` card click-through lands on detail; detail matches reference structure at desktop + mobile (gallery stacks above info); unknown slug shows the notice; API-down shows error + retry; `/` and `/gioi-thieu` unchanged.
- Backend: `mvn test` passes, including new endpoint tests (found by alias / 404 on unknown).
