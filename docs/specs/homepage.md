# Homepage API Data (dashboard) — Design Spec

## 1. Outcome & scope

- `DashboardPage` and its 7 sections (`HeroSlider`, `PromoCards`, `FeaturedCategories`,
  `BestSellers`, `CategorySection`, `ServiceBanners`, `NewsSection`) render data from
  `GET /api/collections?collectionType=` (admin-managed `Collection` rows with `referenceId`,
  `name` snapshot, `images`) instead of hardcoded `data.ts`.
- Reuse current UI components and styles — props change, markup stays. `CategorySidebar`
  keeps its API-with-static-fallback behavior, but its category source is now the curated
  sidebar collection — see `docs/specs/category-sidebar-collection.md` (2026-10-23).

## 2. Data layer (`src/lib/api.ts`, additive only)

- New `CollectionType` string union (7 values: `HERO_SLIDER_COLLECTION`,
  `PROMO_CARD_COLLECTION`, `FEATURED_CATEGORY_COLLECTION`, `BEST_SELLER_COLLECTION`,
  `CATEGORY_COLLECTION`, `SERVICE_BANNER_COLLECTION`, `NEWS_COLLECTION`).
- New `CollectionResponse` (`id`, `name`, `orderIndex`, `collectionType`,
  `referenceId: string | null`, `images: ImageDto[]`) and
  `listCollections(type)` via the existing `fetchData` envelope.
- New `getProduct(id)`, `getCategory(id)`, `getNews(id)` clients for the existing
  `GET /api/{products,categories,news}/{id}` endpoints (UI currently only has by-alias
  for product/news and list-all for categories).
- Extend UI `CategoryResponse` with `images: ImageDto[]` (server already returns them;
  required for featured-category thumbnails).
- Existing clients untouched. `data.ts` homepage arrays removed after migration
  (`categories` + `categoryIcon` stay for the sidebar).

## 3. Orchestration (`useHomepage` + `DashboardPage`)

- New `src/pages/dashboard/useHomepage.ts`: on mount, `Promise.all` the 7
  `listCollections(type)` calls (cancelled-flag pattern from `SanPhamPage`), then resolve
  in parallel: best-sellers via `getProduct` per `referenceId` (order preserved, 404 skips
  the item); featured/categories by matching `referenceId`s against one `listCategories()`;
  news via `getNews` per id (404 skips); CategorySection auto-fill via
  `listProducts({ categoryId, size: 5 })` per picked category with `brands` derived from
  the returned products' `brand` values.
- `DashboardPage.tsx` calls the hook and passes plain props; per-section `{ data, loading,
  failed }` drives render decisions. One type's failure never blanks the rest.

## 4. Component changes & dropped content

- Props only: `HeroSlider` takes `slides: { image, alt }[]` (slider image uses
  `object-contain` on a neutral `bg-gray-100` frame so the full banner is always
  visible); `PromoCards`/`ServiceBanners`
  take image lists; `FeaturedCategories` takes resolved `{ name, imageUrl }`; `BestSellers`
  takes resolved products with the `ProductCard` badge prop made optional and omitted;
  `CategorySection` takes `{ title, brands, products }` per picked category (banners row
  removed); `NewsSection` takes resolved `{ title, date, imageUrl, seoAlias }` linking to
  news detail.
- Dropped with no API source: gradient hero slide 1 (slider becomes image-only), promo text
  overlays (pure image cards), Mowi-style badges, per-section banners.

## 5. States, errors, testing

- Loading: per-section skeletons reusing existing shapes (pulse rows, product-card pulse
  grid). Failed or empty: section renders `null` (hide-empty rule — no error cards, no
  retry buttons, no static fallback).
- Dangling `referenceId` (entity deleted after admin picked it): item skipped silently,
  survivors keep collection order.
- No test runner in the UI repo: verify with `npm run build` + `npm run lint` and a manual
  pass (populated sections render, empty types hidden, API-down homepage shows only sidebar
  and header).

## 6. Success criteria

- Zero hardcoded homepage content: every section renders purely from its `CollectionType`
  query with admin edits visible on storefront refresh.
- `npm run build` and `npm run lint` pass; per-section failures stay isolated.

## 7. Category section "Xem tất cả" link (2026-10-23)

- The `Xem tất cả →` control in `CategorySection` is a router `<Link>` (replacing the
  current `href="#"`) to the product listing page of that section's category:
  `/danh-muc/<seoAlias>`, falling back to `/san-pham?categoryId=<id>` when the category has
  no `seoAlias` (same rule as `CategorySidebar`).
- Target category is the collection row's `referenceId`, not the collection id and not the
  collection `name` snapshot: renaming the collection in admin changes the section title but
  does not change the link.
- `CategorySectionData` gains `categoryId: string` and `seoAlias: string | null`, filled in
  `useHomepage` from the already-fetched `listCategories()` map (`byId`). No extra request.
  When the categories call failed, `seoAlias` is `null` and the `categoryId` fallback keeps
  the link working.
- Rows with a null/unresolvable `referenceId` stay skipped (section not rendered), as today.
- Out of scope: `FeaturedCategories` and `MainNav` links keep
  `/san-pham?categoryId=<id>`; no change to `SanPhamPage`, routes, or the product fetch.
- Verification: `npm run build` + `npm run lint`; with the API up, click the link on a
  category with an alias (product page heading shows the category name) and on a category
  without one (fallback URL, filtered by `categoryId`).
