# Product Listing Page (/san-pham) — Design Spec

Source: https://tracdiathienphu.com/collections/all (breadcrumb, filter sidebar, sort toolbar, product grid, pagination, brand carousel).
Target: production-ready React page at `/san-pham` inside the existing `SiteLayout`, served with `react-router`, dummy data only.

## Goals

- Serve `/san-pham` via `react-router`: `/` renders `DashboardPage`, `/gioi-thieu` renders `IntroductionPage`, `/san-pham` renders `SanPhamPage`, all inside `SiteLayout`.
- Replicate the reference layout with Vietnamese copy: breadcrumb (`Trang chủ / Tất cả sản phẩm`), H1 `Tất cả sản phẩm`, left filter sidebar, sort toolbar, product grid, pagination bar.
- Sidebar (static visuals, non-functional): `Bộ lọc sản phẩm` heading + `Bỏ hết` link, `Thương hiệu` checkbox list (~8 brands), `Giá bán` (6 ranges verbatim from reference), `Danh mục` tree (~10 category links), all `href="#"`.
- Toolbar (static visuals): `Xếp theo` buttons (`Hàng mới`, `Giá thấp đến cao`, `Giá cao xuống thấp`) + `Xem` Lưới/Cột toggle, non-functional.
- Grid of 12 dummy products reusing the dashboard `ProductCard` (brand, name, `Liên hệ` price, Mới/Hot badge mix).
- Static pagination bar (`« 1 2 3 »`, page 1 active, `href="#"`).
- `MainNav` "Sản phẩm" becomes a `Link to="/san-pham"` with the same active styling as other links.
- Follow dashboard patterns: Tailwind, brand `#22abff`, shared `Img` wrapper with `placehold.co` fallback, components under ~100 lines, typed `data.ts`.

## Non-goals

- No working filters, sort, pagination, or grid/list toggle (static visuals per review; wired when real data lands).
- No prices, discounts, or old-price strikethrough (all dummy cards show `Liên hệ` per review).
- No brand-partner carousel (deferred).
- No API, no store, no cart/wishlist backend.

## Architecture

- `App.tsx` adds `<Route path="/san-pham" element={<SanPhamPage />} />`.
- `src/pages/san-pham/`: `SanPhamPage.tsx` (breadcrumb + H1 + `lg:grid-cols-[240px_1fr]` layout + pagination bar), `data.ts` (typed `brands`, `priceRanges`, `categories`, `products`, `sortOptions`), `components/`: `FilterSidebar.tsx`, `Toolbar.tsx`.
- Grid reuses `src/pages/dashboard/components/ProductCard.tsx` via import (cross-page import accepted; move to shared `src/components/` deferred until a second consumer needs it).
- `MainNav.tsx`: "Sản phẩm" placeholder anchor becomes `Link to="/san-pham"`.
- Spec file: `docs/specs/product.md` (this file); implementation plan follows after approval.

## Content

- Breadcrumb (`Trang chủ` links `/`), H1 `Tất cả sản phẩm`.
- Brands (subset of reference): Hi-Target, Sokkia, Topcon, Garmin, Leica, Nikon, Precise, E-Survey.
- Price ranges verbatim: `Giá dưới 100.000đ`, `100.000đ - 200.000đ`, `200.000đ - 300.000đ`, `300.000đ - 500.000đ`, `500.000đ - 1.000.000đ`, `Giá trên 1.000.000đ`.
- Categories mirror `dashboard/data.ts` labels (Máy GNSS RTK, Máy Thủy Bình, Máy Toàn Đạc Điện Tử, Máy Định Vị GPS Cầm Tay, Phụ Kiện Trắc Địa, Máy Cân Bằng Laser, Máy Bộ Đàm, Máy Đo Khoảng Cách Laser, ...).
- Products: 12 dummy rows reusing dashboard `igeostore.vn` image URLs and Vietnamese names; `badge` Mới/Hot mix; price always `Liên hệ` (no price fields in dummy type).

## Assets

- Images stay hotlinked to `igeostore.vn` (legacy host, kept so images don't break) with `placehold.co` fallback via the shared `Img` wrapper.

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes.
- `npm run dev` visual check of `/` and `/gioi-thieu` (unchanged) plus `/san-pham` against the reference layout, including responsive breakpoints (sidebar stacks above grid on mobile).
