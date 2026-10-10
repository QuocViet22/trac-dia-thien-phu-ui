# Product Detail Page (/san-pham/:slug) — Design Spec

Source: https://tracdiathienphu.com/may-toan-dac-sokkia-im-60 (breadcrumb, gallery + info, full article, related grid).
Target: production-ready React detail page at `/san-pham/:slug` inside the existing `SiteLayout`, dummy data only, following the current theme (brand `#22abff`, Inter, `ProductCard` style).

## Goals

- Serve `/san-pham/:slug` via `react-router`: `/san-pham` renders `SanPhamPage`, `/san-pham/:slug` renders `ProductDetailPage`, both inside `SiteLayout`; the `*` fallback stays last and untouched.
- Slug derived from product name via a shared `toSlug()` helper (NFD normalize, strip diacritics, `đ→d`, lowercase, non-alphanumerics → `-`), e.g. `Máy toàn đạc điện tử Sokkia IM-65` → `may-toan-dac-dien-tu-sokkia-im-65`. No slug field added to dummy data.
- Lookup searches all dummy lists (san-pham `products`, dashboard `bestSellers`, all `categorySections` products), deduped by slug, first match wins. Unknown slug renders a `Sản phẩm không tồn tại` notice with a link back to `/san-pham`.
- Breadcrumb (`Trang chủ / Tất cả sản phẩm / {name}`) + gallery/info grid: gallery (main image + thumbnail row, `useState` selected index; thumbs filled from sibling product images), info (H1 name, `Nhà cung cấp: TRẮC ĐỊA THIÊN PHÚ`, `Mã sản phẩm: Đang cập nhật`, `Còn hàng` badge, `Liên hệ` price, highlight bullets, hotline, quantity stepper local `useState`, `MUA NGAY` button as `tel:` link, static wishlist heart).
- Full article (single parameterized template interpolated with product name/brand, identical structure for every dummy product): overview, ưu điểm nổi bật, spec table (generic rows: Thương hiệu, Tình trạng, Bảo hành 12 tháng, Giao hàng toàn quốc), ứng dụng thực tiễn, liên hệ tư vấn block with both hotlines.
- `Sản phẩm gợi ý` grid: same-brand other dummy products first, then others, up to 8, reusing `ProductCard`.
- Every `ProductCard` (dashboard + listing) navigates to its detail page: card root becomes a `Link to={/san-pham/${toSlug(name)}}` keeping current styling.
- Follow existing patterns: Tailwind, shared `Img` wrapper with `placehold.co` fallback, components under ~100 lines, typed data, no API/store.

## Non-goals

- No cart, checkout, wishlist, review, or account backend (quantity stepper is local state only; `MUA NGAY` dials the hotline).
- No tab interface for the article (stacked sections, simpler).
- No video embed (no placeholder player).
- No per-product real descriptions/specs (generic dummy template per review; real content replaces it later).
- No brand-partner carousel.

## Architecture

- `App.tsx` adds `<Route path="/san-pham/:slug" element={<ProductDetailPage />} />` between `/san-pham` and `*`.
- `src/utils/slug.ts`: `toSlug(name: string): string`.
- `src/pages/san-pham/`: `ProductDetailPage.tsx` (params lookup, breadcrumb, gallery/info grid, article, related grid, not-found branch), `detail.ts` (`getProductBySlug(slug): Product | undefined` + `getRelated(product, count)` + generic article content builders), `components/ProductGallery.tsx`.
- Modify: `src/pages/dashboard/components/ProductCard.tsx` (root `div` → `Link`, adds `toSlug` import; visual output unchanged).
- Spec file: `docs/specs/product-detail.md` (this file); implementation plan follows after approval.

## Content

- Info labels verbatim from reference: `Nhà cung cấp`, `Mã sản phẩm: (Đang cập nhật...)`, `Tình trạng: Còn hàng`, `Liên hệ`, `Hotline: 0983.927.945 - 0979.778.945`, `MUA NGAY`, `Thông tin sản phẩm`, `Sản phẩm gợi ý`.
- Article template sections: `Tổng quan`, `Ưu điểm nổi bật` (tư vấn/brands generic bullets + product name), `Thông số kỹ thuật` table, `Ứng dụng thực tiễn` (khảo sát, giao thông, xây dựng, công nghiệp), `Liên hệ tư vấn và báo giá` (both hotlines, `tel:` links, service bullets: tư vấn miễn phí, báo giá dự án, giao hàng toàn quốc, bảo hành chính hãng).

## Assets

- Images stay hotlinked (`igeostore.vn` dummy URLs already in data) with `placehold.co` fallback via the shared `Img` wrapper; gallery thumbs reuse sibling dummy images (accepted as dummy-stage filler).

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes.
- `npm run dev` visual check: `/san-pham` card click-through lands on detail; detail matches reference structure at desktop + mobile (gallery stacks above info); unknown slug shows the notice; dashboard cards also navigate; `/` and `/gioi-thieu` unchanged.
