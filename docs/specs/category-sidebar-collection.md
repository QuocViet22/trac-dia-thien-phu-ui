# Category Sidebar Collection — Design Spec

Source: `src/components/layout/MainNav.tsx` (TẤT CẢ SẢN PHẨM overlay, fed by
`listCategories()`), `src/pages/dashboard/components/CategorySidebar.tsx` (homepage inline
sidebar, also fed by `listCategories()`), `src/lib/api.ts` (`CollectionType`,
`listCollections`).

Target: both storefront sidebar menus render the admin-curated, ordered
`CATEGORY_SIDEBAR_COLLECTION` list instead of every category in API order. The collection
row supplies order and the category reference; name, thumbnail, `seoAlias` and links keep
coming from the live `CategoryResponse`.

## 1. Goals

- `src/lib/api.ts`: add `'CATEGORY_SIDEBAR_COLLECTION'` to the `CollectionType` union
  (eight values). No other API client change.
- New `src/hooks/useSidebarCategories.ts` returns the joined, ordered list:
  `{ categories: CategoryResponse[], loading: boolean, failed: boolean }`.
- `MainNav.tsx` consumes the hook instead of calling `listCategories()` directly; all
  existing overlay, flyout, Escape, outside-click, route-change and mobile behavior stays
  unchanged.
- `CategorySidebar.tsx` consumes the same hook, so the homepage inline menu shows the same
  items and order.
- When the list is configured but empty, both components show the copy
  `Chưa có danh mục nào` instead of a blank menu.
- Rows whose `referenceId` no longer resolves to a category are skipped silently; duplicate
  `referenceId` rows keep only the first occurrence in `orderIndex` order.

## 2. Non-goals

- No nested/sub-category tree (`parentCategoryId` ignored, flat list as today).
- No custom links, banners, images or per-row visibility flags; `Collection.images` is not
  used by the sidebar.
- No change to the flyout (products per category, first 10, cached per session) or to
  `Xem tất cả {name}`.
- No change to the two components' link rules: `MainNav` keeps
  `/san-pham?categoryId=<id>`, `CategorySidebar` keeps
  `/danh-muc/<seoAlias>` with the `categoryId` fallback.
- No new dependencies, no test runner.

## 3. Data layer

`useSidebarCategories(enabled = true)`:

- Runs `Promise.all([listCollections('CATEGORY_SIDEBAR_COLLECTION'), listCategories()])`.
  The existing categories call is reused rather than adding an endpoint; this mirrors
  `useHomepage.ts`.
- Joins on `referenceId -> CategoryResponse` with a `Map` built from the categories result.
- Sorts collections by `orderIndex`, skips entries with a null or unresolved `referenceId`,
  and drops repeated `referenceId` values (first wins).
- `failed = true` when either request rejects, with `categories = []`.
- `loading` is true until both settle; the cancelled-flag pattern prevents state updates
  after unmount.
- `enabled = false` skips fetching entirely and reports `loading = true`, so `MainNav` keeps
  its lazy fetch until the overlay opens.

## 4. Component changes

`MainNav.tsx`:

- Replace the `categories` state plus `listCategories()` effect with
  `useSidebarCategories(showOverlay)`; remove the now-unused `listCategories` import
  (`CategoryResponse` and `categoryImage` stay — `renderFlyout` and thumbnails still use
  them).
- Render rules inside the existing `<ul>`:
  - `loading` -> no rows (no message flash);
  - settled with zero rows -> one non-interactive `<li>` with `Chưa có danh mục nào`,
    styled like the flyout empty state (`text-gray-500`, same padding);
  - otherwise the curated rows, markup unchanged.
- A failed request renders the same empty state; the nav keeps its convention of no error
  block.
- `flyoutCategory`, `openFlyout`, `renderFlyout` and `flyoutData` continue to key off
  `CategoryResponse.id` and need no changes.

`CategorySidebar.tsx`:

- Replace its `apiCategories`/`failed` state and `listCategories()` effect with the hook.
- State precedence:
  1. `loading` -> existing six skeleton pulse rows;
  2. `failed` -> existing hard-coded `data.ts` fallback list (homepage only);
  3. settled and empty -> `Chưa có danh mục nào`;
  4. otherwise the curated rows with cover thumbnails, markup unchanged.
- The static fallback therefore covers request failure, not an intentionally empty
  configuration.

## 5. Content

Vietnamese copy unchanged except the new empty state:

- `TẤT CẢ SẢN PHẨM` button, row labels (`CategoryResponse.name`), flyout states
  (`Đang tải sản phẩm` skeletons, `Không tải được sản phẩm.`, `Chưa có sản phẩm.`,
  `Xem tất cả {name}`).
- New: `Chưa có danh mục nào` in both menus when the curated list is empty.

## 6. Requests and caching

- Non-home routes: no sidebar request until the overlay opens (`enabled` gate).
- Homepage: one categories call plus one collections call on mount, replacing the single
  categories call; both are cached server-side per type.
- Flyout product requests are unchanged and still cached per category for the session.

## 7. Verification

- `npm run build` and `npm run lint` pass.
- Manual with the API running:
  - no configured rows -> overlay and homepage inline sidebar show `Chưa có danh mục nào`;
  - three configured rows -> both menus show them in `orderIndex` order, not alphabetical
    or API order;
  - renaming a category updates both labels after reload;
  - reordering in admin changes the menu order after reload;
  - flyout still lists up to 10 products and `Xem tất cả` still filters correctly;
  - deleting a curated category leaves the remaining rows intact with no placeholder;
  - duplicate `referenceId` rows render once;
  - API down -> overlay shows the empty state, homepage inline sidebar shows the static
    fallback, header and page content still render.

## 8. Out of scope

- Admin editing surface (see `trac-dia-thien-phu-admin/docs/specs/homepage.md`).
- API validation of the new type (see
  `trac-dia-thien-phu-api/docs/specs/category_sidebar_collection.md`).
- Prefetching the sidebar list during app boot.
