# All Products Dropdown — Design Spec

Source: `src/components/layout/MainNav.tsx` (TẤT CẢ SẢN PHẨM button only toggles `sidebarOpen` state), `src/pages/dashboard/components/CategorySidebar.tsx` (inline sidebar rendered only inside `DashboardPage.tsx`, fed by 12 hard-coded rows in `src/pages/dashboard/data.ts`), `src/pages/product/SanPhamPage.tsx` (reads filter from local state only, no URL params).
Target: the TẤT CẢ SẢN PHẨM list shows live API categories with icons on every page — floating dropdown overlay off-home, inline sidebar on Trang chủ; picking a category lands on `/san-pham` pre-filtered.

## Goals

- On routes other than `/`, when `sidebarOpen` is true, render the category list as an absolute overlay anchored under the TẤT CẢ SẢN PHẨM button (stays on current page, no navigation until a category is picked).
- Dropdown rows are real API categories (`GET /api/categories` via existing `listCategories()`), each row links to `/san-pham?categoryId=<uuid>` and closes the menu on click.
- `SanPhamPage` reads `categoryId` from the URL search params on mount and pre-sets its filter state; unknown/empty param shows all products (current behavior).
- On `/` (Trang chủ) the inline `CategorySidebar` shows the same live API categories (not the hard-coded `data.ts` rows); each row links to `/san-pham?categoryId=<uuid>`. Toggle behavior and layout unchanged.
- Every row on every page shows an icon: matched by category name against the existing `data.ts` icon set (normalized trim + lowercase), generic fallback icon when no match.
- Close behaviors: second button click toggles shut, click outside collapses, route change closes, `Escape` key closes.

## Non-goals

- No nested/sub-category tree (`parentCategoryId` ignored, flat list like today).
- No Trang chủ toggle/layout changes.
- No price/brand filtering changes (covered by `docs/specs/product.md` + `docs/specs/brand-filter.md`).
- No cart/search backend, no new dependencies.

## Architecture

- `MainNav.tsx` owns the overlay: uses `useLocation()` (already imported) to detect non-`/` routes; when `sidebarOpen && pathname !== '/'`, renders an absolutely-positioned panel reusing `CategorySidebar` row markup, fed by `listCategories()` fetched in a `useEffect`. Rows are `Link to={/san-pham?categoryId=...}` with `onClick={onToggleSidebar}` to close.
- `CategorySidebar.tsx` (Trang chủ) fetches `listCategories()` on mount and renders the same `Link` rows with the same icons; loading shows skeleton pulse rows; API-down falls back to the static `data.ts` list (visual-only, so the homepage never looks empty).
- `src/pages/dashboard/data.ts` exports a `categoryIcon(name: string): string` helper: normalized (trim + lowercase) match against the 12 static labels, generic `fa-solid fa-cube` fallback. Single source of truth used by both `CategorySidebar` and the `MainNav` overlay.
- `SanPhamPage.tsx` uses `useSearchParams` from `react-router` to seed `query.categoryId` initial state.
- Overlay styling: Tailwind only, matches existing sidebar (`bg-white border rounded-b-md shadow-sm`, `w-full lg:w-72`, `z-50`), positioned relative to the nav container.

## Content

- Vietnamese copy unchanged: button `TẤT CẢ SẢN PHẨM`, rows show `CategoryResponse.name` with a matched icon.
- API-down in dropdown: render empty list (no error block inside nav); API-down on Trang chủ: static `data.ts` fallback list; `/san-pham` keeps its own loading/error/empty states.
- API-down in dropdown: render empty list (no error block inside nav); `/san-pham` keeps its own loading/error/empty states.

## Verification

- `npm run build` passes.
- `npm run lint` passes.
- `npm run dev` visual check: from `/gioi-thieu` click button → overlay appears over content with icons; click category → lands on `/san-pham` filtered; on `/` the inline sidebar shows the same API names with icons and its rows navigate filtered; `Escape` / second click / outside click / navigation closes overlay; API-down home still shows the static list.
