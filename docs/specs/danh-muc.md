# Category Products Page (/danh-muc/:alias) — Design Spec

Source: the dashboard `CategorySidebar` link `/danh-muc/{seoAlias}`, which currently has no
route and falls through to `/` via the catch-all.
Target: render the existing product listing at `/danh-muc/{seoAlias}`, driven by the new
`trac-dia-thien-phu-api` endpoint (`docs/specs/product_controller.md` §6).

## Goals

- `/danh-muc/:alias` renders the existing `SanPhamPage` — no new page component — so
  `CategorySidebar` starts working with no change to its links.
- Products come from
  `GET {VITE_API_URL}/api/products/by-category-alias/{alias}?page=&size=&brand=&sort=`
  (page size 12), returning the same `Page<ProductResponse>` shape `/san-pham` already consumes.
- Breadcrumb (`Trang chủ / {category name}`) and H1 show the category name, read from the
  `GET /api/categories` list the page already fetches for its filter sidebar. Until that
  resolves, and for an unknown alias, both fall back to `Tất cả sản phẩm`.
- Unknown alias: the API `404` lands in the existing error block
  (`Không tải được sản phẩm. Vui lòng thử lại.` + `Tải lại`).
- Parent-category pages include their children's products — decided by the API; the page
  renders whatever it returns.
- Category selection inside the page navigates: `/danh-muc/{alias}` when the clicked category
  has a `seoAlias`, otherwise `/san-pham?categoryId={id}`.
- Brand filter, sort toolbar, pagination, card mapping, loading skeletons and empty state are
  unchanged from `/san-pham`.
- `CategorySidebar` entries whose `seoAlias` is blank link to `/san-pham?categoryId={id}`. The
  column is `NOT NULL` + `UNIQUE` in the API, but the storefront types it `string | null` and
  the category request validates its length only, so a blank alias is reachable; today such an
  entry links to `/danh-muc/null` (or `/danh-muc/`), both of which land back on the homepage.

## Non-goals

- No price/stock/cart; no sitemap, canonical URL, or SEO meta tags.
- No change to `MainNav` / `FeaturedCategories` links (they keep `/san-pham?categoryId=`).
- No new page component, no new grid/card component, no client-side grouping or
  multi-request fetching for descendants.
- No caching change in either app.

## API Contract

- `GET /api/products/by-category-alias/{seoAlias}?page={n}&size=12&brand={b}&sort={field},{dir}`
  → `ApiResponse<Page<ProductResponse>>` (new endpoint, `trac-dia-thien-phu-api`). `404` when
  the alias is unknown. `brand` is omitted when unset.
- `GET /api/categories` → `ApiResponse<List<CategoryResponse>>` (existing; reused for the
  filter sidebar and the name lookup by `seoAlias`).

## Architecture

- `src/lib/api.ts`: add `listProductsByCategoryAlias({ alias, page, size, brand, sort })`,
  reusing the existing `ProductQuery` / `fetchData` helpers.
- `src/App.tsx`: add `<Route path="/danh-muc/:alias" element={<SanPhamPage />} />` beside `/san-pham`.
- `src/pages/product/SanPhamPage.tsx`: read `useParams().alias`; when set, fetch through the
  alias helper and use `useNavigate` for category selection. Page/brand/sort state, the
  pagination block and all rendering stay as they are.
- `src/pages/dashboard/components/CategorySidebar.tsx`: alias-present ternary in the `Link` target.

## Content

- H1 and breadcrumb show the bare category name, matching the `/san-pham` layout.
- Empty state text unchanged: `Chưa có sản phẩm trong danh mục này.`

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes.
- `npm run dev` against a running API: each sidebar category opens `/danh-muc/{alias}` with its
  products and the right H1; a parent category lists its children's products; brand, sort and
  pagination still work and keep the alias URL; `/danh-muc/khong-ton-tai` shows the error block;
  `/san-pham` and `/` unchanged.
