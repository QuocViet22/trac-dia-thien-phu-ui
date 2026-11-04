# All Products Dropdown — Design Spec

Source: `src/components/layout/MainNav.tsx` (TẤT CẢ SẢN PHẨM button only toggles `sidebarOpen` state), `src/pages/dashboard/components/CategorySidebar.tsx` (inline sidebar rendered only inside `DashboardPage.tsx`, fed by 12 hard-coded rows in `src/pages/dashboard/data.ts`), `src/pages/product/SanPhamPage.tsx` (reads filter from local state only, no URL params).
Target: the TẤT CẢ SẢN PHẨM list shows live API categories with cover images on every page — floating dropdown overlay off-home, inline sidebar on Trang chủ; picking a category lands on `/san-pham` pre-filtered. Each dropdown row also reveals a second-level panel with that category's child categories, so a subcategory is one click away.

## Goals

- On routes other than `/`, when `sidebarOpen` is true, render the category list as an absolute overlay anchored under the TẤT CẢ SẢN PHẨM button (stays on current page, no navigation until a category is picked).
- On `/` (Trang chủ) at the top of the page, keep the current inline sidebar toggle behavior unchanged.
- On `/` (Trang chủ) when scrolled down past the inline sidebar, clicking TẤT CẢ SẢN PHẨM renders the same absolute overlay as off-home (stays on page, rows link filtered, closes on second click / outside / Escape / route change).
- Dropdown rows are real API categories (`GET /api/categories` via existing `listCategories()`), each row links to `/danh-muc/<seoAlias>` (or `/san-pham?categoryId=<uuid>` when the category has no alias) and closes the menu on click.
- `SanPhamPage` reads `categoryId` from the URL search params on mount and pre-sets its filter state; unknown/empty param shows all products (current behavior).
- On `/` (Trang chủ) the inline `CategorySidebar` shows the same live API categories (not the hard-coded `data.ts` rows); each row links to `/danh-muc/<seoAlias>` (or `/san-pham?categoryId=<uuid>` when the category has no alias). Toggle behavior and layout unchanged.
- Every row on every page shows the category cover image: first entry of `CategoryResponse.images` sorted by `sortOrder` (via `categoryImage()` in `src/lib/api.ts`); no thumbnail when the category has no images.
- Close behaviors: second button click toggles shut, click outside collapses, route change closes, `Escape` key closes.
- Category child panel: hovering (or focusing) a row in the dropdown overlay opens a panel listing that category's direct child categories (`parentCategoryId === row.id`) from the full `listCategories()` result; a chevron button on the row toggles the same panel for touch/keyboard. Panel footer row `Xem tất cả {category name}` links to the row's category page. No product request is made.

## Non-goals

- No nested tree deeper than one level: rows are the curated top-level categories and the panel lists their direct children.
- No product list in the child panel; products are reached by picking a child or `Xem tất cả`.
- No extra request for children; the full category list is already fetched by `useSidebarCategories`.
- No Trang chủ toggle/layout changes.
- No price/brand filtering changes (covered by `docs/specs/product.md` + `docs/specs/brand-filter.md`).
- No cart/search backend, no new dependencies.

## Architecture

- `MainNav.tsx` owns the overlay: uses `useLocation()` (already imported) to detect non-`/` routes; when `sidebarOpen && pathname !== '/'`, renders an absolutely-positioned panel reusing `CategorySidebar` row markup, fed by `listCategories()` fetched in a `useEffect`. Rows are `Link to={/san-pham?categoryId=...}` with `onClick={onToggleSidebar}` to close. On `/`, the overlay also renders when `sidebarOpen && scrolledDown` (`scrolledDown` = `window.scrollY` past the inline sidebar, passive scroll listener); at the top of `/` only the inline sidebar toggles.
- `CategorySidebar.tsx` (Trang chủ) fetches `listCategories()` on mount and renders the same `Link` rows with the same cover thumbnails; loading shows skeleton pulse rows; API-down falls back to the static `data.ts` label list (text-only, so the homepage never looks empty).
- `src/lib/api.ts` exports a `categoryImage(category): string` helper: first image sorted by `sortOrder`, `''` when empty. Shared by both `CategorySidebar` and the `MainNav` overlay. `src/pages/dashboard/data.ts` keeps only the static label list for the API-down fallback (no icon set).
- `SanPhamPage.tsx` uses `useSearchParams` from `react-router` to seed `query.categoryId` initial state.
- Overlay styling: Tailwind only, matches existing sidebar (`bg-white border rounded-b-md shadow-sm`, `w-full lg:w-72`, `z-50`), positioned relative to the nav container.
- Category child panel: `MainNav.tsx` keeps a local `flyoutId`; the panel body is the shared `CategoryFlyout`, given `allCategories.filter(c => c.parentCategoryId === cat.id)`. Row markup becomes a flex `div` holding the existing `Link` row (thumbnail + name, `onClick={onToggleSidebar}`) and a chevron `<button>` (`aria-expanded`, `aria-controls`, `onClick` opens the panel, never navigates). `onPointerEnter` on the row (ignored for `pointerType === 'touch'`) and `onFocus` open it; `onPointerLeave` on the whole menu container closes it, so crossing from a row into the panel keeps it open. Opening or closing the menu clears the open panel.
- Panel placement: the overlay's `overflow-y-auto` clips absolutely positioned children below `lg`, so the same body renders inline under its row (`lg:hidden`). From `lg` up it renders as a sibling of the overlay inside the `menuRef` container: `absolute left-full top-full w-64 bg-white border border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto`.
- Panel rows are `Link to={seoAlias ? /danh-muc/<seoAlias> : '/san-pham?categoryId=<id>'}` with `onClick={onToggleSidebar}`. Footer `Xem tất cả {category name}` uses the same rule.
- From `lg` up the overlay drops its inner scroll (`lg:max-h-none lg:overflow-visible`), so every row is visible without scrolling. Below `lg` it keeps `max-h-96 overflow-y-auto` because the inline child list can exceed the viewport.

## Content

- Vietnamese copy unchanged: button `TẤT CẢ SẢN PHẨM`, rows show `CategoryResponse.name` with a cover thumbnail.
- Child panel rows show `CategoryResponse.name`, truncated to one line; a category with no children shows only the `Xem tất cả {name}` footer. There is no loading/failure/empty state because the category list is already loaded with the menu.
- API-down in dropdown: render empty list (no error block inside nav); API-down on Trang chủ: static `data.ts` fallback list; `/san-pham` keeps its own loading/error/empty states.

## Verification

- `npm run build` passes.
- `npm run lint` passes.
- `npm run dev` visual check: from `/gioi-thieu` click button → overlay appears over content with cover thumbnails; click category → lands on `/san-pham` filtered; on `/` the inline sidebar shows the same API names with cover thumbnails and its rows navigate filtered; `Escape` / second click / outside click / navigation closes overlay; API-down home still shows the static list.
- `npm run dev` visual check on `/` scrolled down: click button → overlay appears anchored under the button with cover thumbnails; click category → lands on `/san-pham` filtered; at top of `/` click button → only the inline sidebar toggles (no overlay).
- `npm run dev` visual check of the child panel: hover a dropdown row → panel opens beside the list with its child categories and `Xem tất cả {name}` at the bottom; click a child → lands on that category page and the menu closes; click `Xem tất cả` → lands on the parent category page; at a narrow viewport the chevron expands the child list inline; the panel does not run off the right edge at desktop width; a category with no children shows only the footer; the desktop menu shows every row without an inner scrollbar.

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

## Update: child categories instead of products (2026-11-04)

- The dropdown panel now lists the hovered category's direct child categories instead of
  its products; `useCategoryFlyout` and the product cache were removed.
- Parent and child rows both use `/danh-muc/<seoAlias>` (fallback `?categoryId=`), so a
  parent opens its children's products through the API's alias endpoint.
- From `lg` up the overlay no longer scrolls internally; below `lg` it keeps its scroll
  because the inline child list can exceed the viewport.
- The panel body is the shared `CategoryFlyout`, also used by the homepage inline sidebar.
