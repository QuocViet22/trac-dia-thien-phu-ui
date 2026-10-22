# All Products Dropdown Implementation Plan

**Goal:** Clicking TẤT CẢ SẢN PHẨM shows live API categories with cover images on every page — floating dropdown off-home and on Trang chủ when scrolled down, inline sidebar on Trang chủ at top; picking a category lands on `/san-pham` pre-filtered.

**Architecture:** Overlay owned by `MainNav.tsx` (route-aware, API-fed, reuses sidebar row markup); `SanPhamPage.tsx` seeds its filter from URL search params; `CategorySidebar.tsx` (Trang chủ) renders the same live API list inline; thumbnails come from one `categoryImage()` helper in `src/lib/api.ts` (first image by `sortOrder`, `''` when empty). No new components, no new deps.

**Tech Stack:** React 19, react-router (`Link`, `useLocation`, `useSearchParams`), Tailwind, existing `listCategories()` in `src/lib/api.ts`.

**Spec:** `docs/specs/all-products-dropdown.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0).
- No test runner — verification is build + lint + visual check.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- `import type` for type-only imports (`verbatimModuleSyntax`); no unused vars (`noUnusedLocals`/`noUnusedParameters`).
- Vietnamese copy unchanged.

---

### Task 1: Non-home dropdown overlay in MainNav

**Files:**
- Modify: `src/components/layout/MainNav.tsx`

- [ ] **Step 1: Fetch API categories + render overlay when open and off-home.**

In `MainNav.tsx`: add `useState<CategoryResponse[]>` + `useEffect` calling `listCategories()` (empty array on failure). Wrap the button + panel in a `relative` container with a `menuRef`. When `sidebarOpen && location.pathname !== '/'`, render absolute panel (`absolute left-0 lg:left-auto top-full w-full lg:w-72 bg-white border border-gray-200 rounded-b-md shadow-sm z-50`) listing categories as `Link to={/san-pham?categoryId=${cat.id}}` rows (thumbnail + name + caret, same classes as `CategorySidebar` rows) each with `onClick={onToggleSidebar}`. Add `useEffect` closing on route change (`[location.pathname]` → call `onToggleSidebar` only if open — needs an `onClose` prop or reuse toggle guarded), `onKeyDown` Escape handler, and `pointerdown` outside-click handler (closes when the event target is outside `menuRef`).

- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` — from `/gioi-thieu`, click TẤT CẢ SẢN PHẨM → overlay appears; second click / outside click / `Escape` / navigation closes; on `/` inline sidebar still works.

### Task 2: Seed SanPhamPage filter from URL

**Files:**
- Modify: `src/pages/product/SanPhamPage.tsx`

- [ ] **Step 1: Read `categoryId` search param into initial query state.**

In `SanPhamPage.tsx`: import `useSearchParams`, read `searchParams.get('categoryId')` for the `useState` initializer (`categoryId: searchParams.get('categoryId') ?? null`). Keep the rest of the fetch/filter/sort/pagination logic untouched.

- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` — open `/san-pham?categoryId=<uuid>` directly → grid pre-filtered; open `/san-pham` → all products; dropdown click from Task 1 lands filtered.

---

### Task 3: categoryImage helper in lib/api.ts (replaces categoryIcon)

**Files:**
- Modify: `src/lib/api.ts`
- Modify: `src/pages/dashboard/data.ts` (icon set removed; static label list stays as the API-down fallback)

- [ ] **Step 1: Export `categoryImage(category)` + drop the icon set.**

In `src/lib/api.ts`, next to `productImage()` add:

```ts
export function categoryImage(category: CategoryResponse): string {
  const images = [...category.images].sort((a, b) => a.sortOrder - b.sortOrder)
  return images.length > 0 ? images[0].imageUrl : ''
}
```

In `src/pages/dashboard/data.ts`: shrink `Category` to `{ label }`, strip all `icon:` strings, delete `FALLBACK_CATEGORY_ICON` + `categoryIcon()`.

- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0 (no behavior change yet — helper unused).

### Task 4: Trang chủ sidebar shows live API categories

**Files:**
- Modify: `src/pages/dashboard/components/CategorySidebar.tsx`

- [ ] **Step 1: Fetch `listCategories()` and render Link rows with cover thumbnails.**

In `CategorySidebar.tsx`: replace the `categories` static import with `import { Link } from 'react-router'`, `import { categories as fallbackCategories } from '../data.ts'`, `import { listCategories, categoryImage, type CategoryResponse } from '../../../lib/api.ts'`. Add `useState<CategoryResponse[] | null>(null)` (`null` = loading) + `useState(false)` for `failed` + `useEffect` calling `listCategories()` (on success set data, on failure set `failed` true). Render:
  - loading (`null`): 6 skeleton pulse rows (`animate-pulse`, same padding as rows).
  - failed: today's static rows verbatim minus icons (text-only `li`, no links).
  - success: `Link to={/san-pham?categoryId=${cat.id}}` rows with `<img src={categoryImage(cat)}>` thumbnail (rendered only when non-empty) + name + caret, keeping all existing row classes.

- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` on `/` — sidebar shows API names with cover thumbnails; click a row → lands on `/san-pham` filtered; toggle still works; API-down → static text-only list as today.

### Task 5: Show cover thumbnails in the off-home overlay

**Files:**
- Modify: `src/components/layout/MainNav.tsx`

- [ ] **Step 1: Add `categoryImage(cat)` to overlay rows.**

In the overlay row markup, import `categoryImage` from `../../lib/api.ts` and change the row `Link` to include the thumbnail before the name (same pattern as Task 4: `{img && <img src={img} ... className="w-6 h-6 object-cover rounded-sm flex-shrink-0" />}` inside a `flex items-center gap-3` wrapper, single `categoryImage()` call per row). Nothing else changes (fetch, close behaviors untouched).

- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` — from `/gioi-thieu`, overlay rows show cover thumbnails matching Trang chủ; imageless names show text-only.

### Task 6: Scrolled-home overlay on Trang chủ

**Files:**
- Modify: `src/components/layout/MainNav.tsx`

- [ ] **Step 1: Show the same overlay on `/` when scrolled down.**

In `MainNav.tsx`: add `scrolledDown` state via a passive `scroll` listener (`window.scrollY > 150`, cleanup on unmount). Change `showOverlay` from `sidebarOpen && pathname !== '/'` to `sidebarOpen && (pathname !== '/' || scrolledDown)`. Fetch/close/row markup unchanged (existing `listCategories()` effect and outside/Escape/route-change handlers already key off `showOverlay`).

- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` on `/` — at top, button toggles inline sidebar only (no overlay); scrolled down, button shows overlay with cover thumbnails; category click lands on `/san-pham` filtered; second click / outside / `Escape` closes.

---

### Task 7: Per-category product flyout in the dropdown

**Files:**
- Modify: `src/components/layout/MainNav.tsx`

- [x] **Step 1: Add flyout state + cached fetch.**

Import `listProducts` and `type ProductResponse` from `../../lib/api.ts` (keep the existing imports). Add:

```tsx
const [flyoutId, setFlyoutId] = useState<string | null>(null)
const [flyoutData, setFlyoutData] = useState<Record<string, ProductResponse[] | 'failed'>>({})

const openFlyout = (id: string) => {
  setFlyoutId(id)
  if (flyoutData[id] !== undefined) {
    return
  }
  listProducts({ page: 0, size: 10, categoryId: id, sort: 'createdAt,desc' })
    .then((data) => {
      setFlyoutData((current) => ({ ...current, [id]: data.content }))
    })
    .catch(() => {
      setFlyoutData((current) => ({ ...current, [id]: 'failed' }))
    })
}

const closeFlyout = () => {
  setFlyoutId(null)
}

const [prevShowOverlay, setPrevShowOverlay] = useState(showOverlay)
if (prevShowOverlay !== showOverlay) {
  setPrevShowOverlay(showOverlay)
  setFlyoutId(null)
}
```

`flyoutData` doubles as the cache and the per-category state: absent = loading, `'failed'` = request failed, array = loaded (empty array = category has no products). The render-phase reset (the same "adjust state when a prop changes" pattern `SanPhamPage` uses) clears the open panel whenever the menu opens or closes — a `useEffect` reset is rejected by the `react-hooks/set-state-in-effect` lint rule.

- [x] **Step 2: Split the row into link + chevron and render the panel.**

Inside the existing `.map`, on the `<li>` add `relative` plus `onPointerEnter` (skipped when `event.pointerType === 'touch'`, so a tap does not open then immediately toggle). Replace the row `Link` markup with:

```tsx
<div className="flex items-center" onFocus={() => openFlyout(cat.id)}>
  <Link to={...existing target...} onClick={onToggleSidebar} className="flex-1 min-w-0 flex items-center justify-between px-4 py-2.5 hover:text-brand hover:bg-sky-50 group transition-colors">
    {/* unchanged thumbnail + name block */}
    <i className="fa-solid fa-caret-right text-gray-300 group-hover:text-brand"></i>
  </Link>
  <button
    type="button"
    aria-expanded={flyoutId === cat.id}
    aria-controls={`flyout-${cat.id} flyout-desktop`}
    aria-label={`Sản phẩm của ${cat.name}`}
    onClick={() => openFlyout(cat.id)}
    className="px-3 py-2.5 text-gray-300 hover:text-brand cursor-pointer"
  >
    <i className={`fa-solid fa-caret-right transition-transform ${flyoutId === cat.id ? 'rotate-90 lg:rotate-0' : ''}`}></i>
  </button>
</div>
{flyoutId === cat.id && renderFlyout(cat, 'lg:hidden border-t border-gray-100 bg-gray-50 pl-4', `flyout-${cat.id}`)}
```

The chevron stays `open`-only (never toggles shut): on desktop hover has usually opened the panel already, so a toggle would close it under the pointer. Touch users close it by closing the menu (tap outside / `Escape`).

- [x] **Step 3: Fill the panel states, product rows and footer.**

The desktop panel cannot live inside the scrolling overlay (the overlay's `overflow-y-auto` clips it), so it is a sibling of the overlay, inside the `menuRef` container:

```tsx
{showOverlay && flyoutCategory && renderFlyout(flyoutCategory, 'hidden lg:block absolute left-full top-full w-64 z-50 bg-white border border-gray-200 shadow-lg max-h-96 overflow-y-auto text-[13px] text-gray-600 font-medium', 'flyout-desktop')}
```

with `const flyoutCategory = categories.find((cat) => cat.id === flyoutId) ?? null` and `renderFlyout(cat, className, id)` returning the panel body. The inline panel under the row is the `lg:hidden` one from Step 2; closing the flyout is driven by `onPointerLeave` on the `menuRef` container (again skipping touch pointers), which keeps the panel open while the pointer crosses from a row into it.

Inside `renderFlyout`, render in order:

- `flyoutData[cat.id] === undefined` (loading): 3 skeleton rows (`animate-pulse` bar, same padding as product rows).
- `flyoutData[cat.id] === 'failed'`: `<p className="px-4 py-2.5 text-gray-500">Không tải được sản phẩm.</p>`.
- loaded, zero products: `<p className="px-4 py-2.5 text-gray-500">Chưa có sản phẩm.</p>`.
- loaded, products: `<ul>` of products, each `<li key={product.id}>` containing `<Link to={product.seoAlias ? `/san-pham/${product.seoAlias}` : '/san-pham'} onClick={onToggleSidebar} className="block px-4 py-2 text-[13px] text-gray-700 hover:text-brand hover:bg-sky-50 transition-colors truncate">{product.name}</Link>`.
- Always last: `<Link to={`/san-pham?categoryId=${encodeURIComponent(cat.id)}`} onClick={onToggleSidebar} className="block px-4 py-2.5 border-t border-gray-100 text-[13px] font-medium text-brand hover:bg-sky-50">Xem tất cả {cat.name}</Link>`.

- [x] **Step 4: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

Then `npm run dev`:
- Hover a dropdown row → panel opens to the right listing up to 10 product names with `Xem tất cả {name}` at the bottom; moving into the panel keeps it open; moving to another row swaps the list.
- Click a product → `/san-pham/{seoAlias}` opens and the menu closes; a product without an alias lands on `/san-pham`.
- Click `Xem tất cả` → `/san-pham?categoryId={id}` filtered; menu closes.
- Re-hover the same category → panel appears without a new request (Network tab shows one call per category).
- Narrow viewport (below `lg`): the chevron expands the panel inline under the row, indented, no horizontal overflow.
- Desktop right edge: the panel stays on screen.
- Close the menu (button, outside click, `Escape`, route change) → next open shows no panel.
- Category with no products → `Chưa có sản phẩm.`; API down → `Không tải được sản phẩm.` and the rest of the dropdown still works.
