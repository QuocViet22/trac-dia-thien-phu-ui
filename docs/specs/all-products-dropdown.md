# All Products Dropdown — Design Spec

Source: `src/components/layout/MainNav.tsx` (TẤT CẢ SẢN PHẨM button only toggles `sidebarOpen` state), `src/pages/dashboard/components/CategorySidebar.tsx` (inline sidebar rendered only inside `DashboardPage.tsx`, fed by 12 hard-coded rows in `src/pages/dashboard/data.ts`), `src/pages/product/SanPhamPage.tsx` (reads filter from local state only, no URL params).
Target: the TẤT CẢ SẢN PHẨM list shows live API categories with cover images on every page — floating dropdown overlay off-home, inline sidebar on Trang chủ; picking a category lands on `/san-pham` pre-filtered. Each dropdown row also reveals a second-level panel with that category's products, so a single product is one click away.

## Goals

- On routes other than `/`, when `sidebarOpen` is true, render the category list as an absolute overlay anchored under the TẤT CẢ SẢN PHẨM button (stays on current page, no navigation until a category is picked).
- On `/` (Trang chủ) at the top of the page, keep the current inline sidebar toggle behavior unchanged.
- On `/` (Trang chủ) when scrolled down past the inline sidebar, clicking TẤT CẢ SẢN PHẨM renders the same absolute overlay as off-home (stays on page, rows link filtered, closes on second click / outside / Escape / route change).
- Dropdown rows are real API categories (`GET /api/categories` via existing `listCategories()`), each row links to `/san-pham?categoryId=<uuid>` and closes the menu on click.
- `SanPhamPage` reads `categoryId` from the URL search params on mount and pre-sets its filter state; unknown/empty param shows all products (current behavior).
- On `/` (Trang chủ) the inline `CategorySidebar` shows the same live API categories (not the hard-coded `data.ts` rows); each row links to `/san-pham?categoryId=<uuid>`. Toggle behavior and layout unchanged.
- Every row on every page shows the category cover image: first entry of `CategoryResponse.images` sorted by `sortOrder` (via `categoryImage()` in `src/lib/api.ts`); no thumbnail when the category has no images.
- Close behaviors: second button click toggles shut, click outside collapses, route change closes, `Escape` key closes.
- Category product flyout: hovering (or focusing) a row in the dropdown overlay opens a panel listing up to 10 products of that category, fetched with the existing `listProducts({ page: 0, size: 10, categoryId, sort: 'createdAt,desc' })`; a chevron button on the row toggles the same panel for touch/keyboard. Panel footer row `Xem tất cả {category name}` links to the row's category page.

## Non-goals

- No nested/sub-category tree (`parentCategoryId` ignored, flat list like today). The flyout lists products, not child categories.
- No infinite scroll or "load more" inside the flyout; products past the first 10 are reached through `Xem tất cả`.
- No prefetch of every category's products when the dropdown opens; each category is fetched on first reveal and cached for the session.
- No Trang chủ toggle/layout changes.
- No price/brand filtering changes (covered by `docs/specs/product.md` + `docs/specs/brand-filter.md`).
- No cart/search backend, no new dependencies.

## Architecture

- `MainNav.tsx` owns the overlay: uses `useLocation()` (already imported) to detect non-`/` routes; when `sidebarOpen && pathname !== '/'`, renders an absolutely-positioned panel reusing `CategorySidebar` row markup, fed by `listCategories()` fetched in a `useEffect`. Rows are `Link to={/san-pham?categoryId=...}` with `onClick={onToggleSidebar}` to close. On `/`, the overlay also renders when `sidebarOpen && scrolledDown` (`scrolledDown` = `window.scrollY` past the inline sidebar, passive scroll listener); at the top of `/` only the inline sidebar toggles.
- `CategorySidebar.tsx` (Trang chủ) fetches `listCategories()` on mount and renders the same `Link` rows with the same cover thumbnails; loading shows skeleton pulse rows; API-down falls back to the static `data.ts` label list (text-only, so the homepage never looks empty).
- `src/lib/api.ts` exports a `categoryImage(category): string` helper: first image sorted by `sortOrder`, `''` when empty. Shared by both `CategorySidebar` and the `MainNav` overlay. `src/pages/dashboard/data.ts` keeps only the static label list for the API-down fallback (no icon set).
- `SanPhamPage.tsx` uses `useSearchParams` from `react-router` to seed `query.categoryId` initial state.
- Overlay styling: Tailwind only, matches existing sidebar (`bg-white border rounded-b-md shadow-sm`, `w-full lg:w-72`, `z-50`), positioned relative to the nav container.
- Category product flyout (dropdown overlay only, not the Trang chủ inline sidebar): `MainNav.tsx` keeps `flyoutId` plus `flyoutData: Record<categoryId, ProductResponse[] | 'failed'>`, which doubles as the per-category cache (`undefined` = loading, `'failed'` = request failed, empty array = no products). Row markup becomes a flex `div` holding the existing `Link` row (thumbnail + name, `onClick={onToggleSidebar}`) and a chevron `<button>` (`aria-expanded`, `aria-controls`, `onClick` opens the flyout, never navigates). `onPointerEnter` on the row (ignored for `pointerType === 'touch'`) and `onFocus` open the flyout; `onPointerLeave` on the whole menu container closes it, so crossing from a row into the panel keeps it open. First reveal fetches `listProducts({ page: 0, size: 10, categoryId, sort: 'createdAt,desc' })`; later reveals read the cache. Opening or closing the menu clears the open panel; the cache survives.
- Flyout placement: the overlay's `overflow-y-auto` clips absolutely positioned children, so there are two render sites for the same body (`renderFlyout`). Below `lg` the panel renders inline under its row with left indent (`lg:hidden`). From `lg` up it renders as a sibling of the overlay inside the `menuRef` container: `absolute left-full top-full w-64 bg-white border border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto`.
- Flyout rows are `Link to={seoAlias ? /san-pham/${seoAlias} : '/san-pham'}` with `onClick={onToggleSidebar}` (same target rule as `ProductCard`). Footer `Xem tất cả {category name}` uses the row's category target, i.e. `/san-pham?categoryId={id}` — the same link the row already had.

## Content

- Vietnamese copy unchanged: button `TẤT CẢ SẢN PHẨM`, rows show `CategoryResponse.name` with a cover thumbnail.
- Flyout states: loading → 3 skeleton pulse rows; failure → `Không tải được sản phẩm.`; empty → `Chưa có sản phẩm.`. The `Xem tất cả {category name}` footer row renders in all three states. Flyout product rows show only `ProductResponse.name`, truncated to one line.
- API-down in dropdown: render empty list (no error block inside nav); API-down on Trang chủ: static `data.ts` fallback list; `/san-pham` keeps its own loading/error/empty states.
- API-down in dropdown: render empty list (no error block inside nav); `/san-pham` keeps its own loading/error/empty states.

## Verification

- `npm run build` passes.
- `npm run lint` passes.
- `npm run dev` visual check: from `/gioi-thieu` click button → overlay appears over content with cover thumbnails; click category → lands on `/san-pham` filtered; on `/` the inline sidebar shows the same API names with cover thumbnails and its rows navigate filtered; `Escape` / second click / outside click / navigation closes overlay; API-down home still shows the static list.
- `npm run dev` visual check on `/` scrolled down: click button → overlay appears anchored under the button with cover thumbnails; click category → lands on `/san-pham` filtered; at top of `/` click button → only the inline sidebar toggles (no overlay).
- `npm run dev` visual check of the flyout: hover a dropdown row → product panel opens beside the list with up to 10 names, `Xem tất cả {name}` at the bottom; click a product → lands on its `/san-pham/{seoAlias}` page and the menu closes; click `Xem tất cả` → lands on the category page; re-hovering the same category shows the panel instantly (cached); at a narrow viewport the chevron expands the panel inline; the panel does not run off the right edge at desktop width; a category with no products shows `Chưa có sản phẩm.`; with the API down it shows `Không tải được sản phẩm.` while the rest of the menu still works.

## Update: curated category source (2026-10-23)

- The dropdown rows no longer come from `listCategories()` directly. They come from the
  admin-curated `CATEGORY_SIDEBAR_COLLECTION` list joined with `listCategories()`, in
  `orderIndex` order, shared with the homepage inline sidebar via
  `src/hooks/useSidebarCategories.ts`.
- Everything else in this spec (overlay behavior, flyout, links, close rules, thumbnails)
  is unchanged.
- Empty configuration now renders `Chưa có danh mục nào` instead of every category; the
  homepage inline sidebar keeps its static fallback only for request failure.
- Full design: `docs/specs/category-sidebar-collection.md`.
