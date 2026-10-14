# All Products Dropdown Implementation Plan

**Goal:** Clicking TẤT CẢ SẢN PHẨM shows live API categories with icons on every page — floating dropdown off-home and on Trang chủ when scrolled down, inline sidebar on Trang chủ at top; picking a category lands on `/san-pham` pre-filtered.

**Architecture:** Overlay owned by `MainNav.tsx` (route-aware, API-fed, reuses sidebar row markup); `SanPhamPage.tsx` seeds its filter from URL search params; `CategorySidebar.tsx` (Trang chủ) renders the same live API list inline; icons come from one `categoryIcon()` helper in `dashboard/data.ts` (name-matched, generic fallback). No new components, no new deps.

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

In `MainNav.tsx`: add `useState<CategoryResponse[]>` + `useEffect` calling `listCategories()` (empty array on failure). Wrap the button + panel in a `relative` container with a `menuRef`. When `sidebarOpen && location.pathname !== '/'`, render absolute panel (`absolute left-0 lg:left-auto top-full w-full lg:w-72 bg-white border border-gray-200 rounded-b-md shadow-sm z-50`) listing categories as `Link to={/san-pham?categoryId=${cat.id}}` rows (icon + name + caret, same classes as `CategorySidebar` rows) each with `onClick={onToggleSidebar}`. Add `useEffect` closing on route change (`[location.pathname]` → call `onToggleSidebar` only if open — needs an `onClose` prop or reuse toggle guarded), `onKeyDown` Escape handler, and `pointerdown` outside-click handler (closes when the event target is outside `menuRef`).

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

### Task 3: Shared categoryIcon helper in data.ts

**Files:**
- Modify: `src/pages/dashboard/data.ts`

- [ ] **Step 1: Export `categoryIcon(name)` with normalized match + generic fallback.**

In `src/pages/dashboard/data.ts`, after the `categories` array add:

```ts
const FALLBACK_CATEGORY_ICON = 'fa-solid fa-cube'

export function categoryIcon(name: string): string {
  const key = name.trim().toLowerCase()
  return categories.find((cat) => cat.label.toLowerCase() === key)?.icon ?? FALLBACK_CATEGORY_ICON
}
```

No other changes to the file (static list stays as the API-down fallback).

- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0 (no behavior change yet — helper unused).

### Task 4: Trang chủ sidebar shows live API categories

**Files:**
- Modify: `src/pages/dashboard/components/CategorySidebar.tsx`

- [ ] **Step 1: Fetch `listCategories()` and render Link rows with icons.**

In `CategorySidebar.tsx`: replace the `categories` static import with `import { Link } from 'react-router'`, `import { categories as fallbackCategories, categoryIcon } from '../data.ts'`, `import { listCategories, type CategoryResponse } from '../../../lib/api.ts'`. Add `useState<CategoryResponse[] | null>(null)` (`null` = loading) + `useState(false)` for `failed` + `useEffect` calling `listCategories()` (on success set data, on failure set `failed` true). Render:
  - loading (`null`): 6 skeleton pulse rows (`animate-pulse`, same padding as rows).
  - failed: today's static rows verbatim (visual-only `li`, no links).
  - success: `Link to={/san-pham?categoryId=${cat.id}}` rows with `<i className={categoryIcon(cat.name)}>` + name + caret, keeping all existing row classes.

- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` on `/` — sidebar shows API names with icons; click a row → lands on `/san-pham` filtered; toggle still works; API-down → static list as today.

### Task 5: Show matched icons in the off-home overlay

**Files:**
- Modify: `src/components/layout/MainNav.tsx`

- [ ] **Step 1: Add `categoryIcon(cat.name)` to overlay rows.**

In the overlay row markup, import `categoryIcon` from `../../pages/dashboard/data.ts` and change the row `Link` to include the icon element before the name (same pattern as Task 4: `<i className={`${categoryIcon(cat.name)} w-4 text-center text-gray-400`}></i>` inside a `flex items-center gap-3` wrapper). Nothing else changes (fetch, close behaviors untouched).

- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` — from `/gioi-thieu`, overlay rows show icons matching Trang chủ; unmatched names show the generic cube icon.

### Task 6: Scrolled-home overlay on Trang chủ

**Files:**
- Modify: `src/components/layout/MainNav.tsx`

- [ ] **Step 1: Show the same overlay on `/` when scrolled down.**

In `MainNav.tsx`: add `scrolledDown` state via a passive `scroll` listener (`window.scrollY > 150`, cleanup on unmount). Change `showOverlay` from `sidebarOpen && pathname !== '/'` to `sidebarOpen && (pathname !== '/' || scrolledDown)`. Fetch/close/row markup unchanged (existing `listCategories()` effect and outside/Escape/route-change handlers already key off `showOverlay`).

- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` on `/` — at top, button toggles inline sidebar only (no overlay); scrolled down, button shows overlay with icons; category click lands on `/san-pham` filtered; second click / outside / `Escape` closes.
