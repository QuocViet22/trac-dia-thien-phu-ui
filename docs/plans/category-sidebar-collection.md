# Category Sidebar Collection (storefront) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make both storefront sidebar menus render the admin-curated `CATEGORY_SIDEBAR_COLLECTION` list in `orderIndex` order instead of every category.

**Architecture:** One shared hook joins `listCollections('CATEGORY_SIDEBAR_COLLECTION')` with `listCategories()` by `referenceId`, sorts by `orderIndex`, and drops dangling/duplicate references. `MainNav` (overlay) and `CategorySidebar` (homepage inline) both consume it; name, thumbnail, `seoAlias` and links still come from the live `CategoryResponse`.

**Tech Stack:** Vite + React 19 + TypeScript, Tailwind, react-router. No test runner.

**Spec:** `docs/specs/category-sidebar-collection.md`

## Global Constraints

- No new dependencies, no new API endpoints, no nested category tree.
- `CollectionType` gains exactly one member: `'CATEGORY_SIDEBAR_COLLECTION'`.
- Empty curated list renders the exact copy `Chưa có danh mục nào`.
- Link rules unchanged: `MainNav` → `/san-pham?categoryId=<id>`, `CategorySidebar` → `/danh-muc/<seoAlias>` with the `categoryId` fallback.
- `verbatimModuleSyntax` is on: use `import type` for types. No enums, no unused locals.
- No test runner exists; verification is `npm run build`, `npm run lint`, plus the manual steps in each task.

## Review Focus

- Empty configuration must show `Chưa có danh mục nào`, while a failed request must not: the overlay treats both as empty, the homepage inline sidebar keeps its static fallback only on failure.
- Duplicate `referenceId` rows must render once (first by `orderIndex`), since the API does not enforce uniqueness.
- A `referenceId` whose category was deleted must disappear without leaving an empty row or a placeholder.
- `MainNav` must not fetch the sidebar list before the overlay opens (`enabled` gate), so non-home pages gain no request on load.
- Menu order must follow `orderIndex`, not category name or API order.

---

### Task 1: Add the type and the shared hook

**Files:**
- Modify: `src/lib/api.ts:217-224`
- Create: `src/hooks/useSidebarCategories.ts`

**Interfaces:**
- Consumes: `listCollections(type: CollectionType): Promise<CollectionResponse[]>` and `listCategories(): Promise<CategoryResponse[]>` from `src/lib/api.ts`.
- Produces:

```ts
export interface SidebarCategoriesState {
  categories: CategoryResponse[]
  loading: boolean
  failed: boolean
}
export function useSidebarCategories(enabled?: boolean): SidebarCategoriesState
```

- [ ] **Step 1: Add the union member**

In `src/lib/api.ts`, append to `CollectionType`:

```ts
  | 'CATEGORY_SIDEBAR_COLLECTION'
```

- [ ] **Step 2: Create the hook**

Create `src/hooks/useSidebarCategories.ts`. The join is the only non-obvious part: sort before deduping so "first" means lowest `orderIndex`.

```ts
import { useEffect, useState } from 'react'
import {
  listCategories,
  listCollections,
  type CategoryResponse,
  type CollectionResponse,
} from '../lib/api.ts'

export interface SidebarCategoriesState {
  categories: CategoryResponse[]
  loading: boolean
  failed: boolean
}

function joinSidebar(
  collections: CollectionResponse[],
  categories: CategoryResponse[],
): CategoryResponse[] {
  const byId = new Map(categories.map((category) => [category.id, category]))
  const seen = new Set<string>()
  return [...collections]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .flatMap((collection) => {
      const referenceId = collection.referenceId
      if (!referenceId || seen.has(referenceId)) {
        return []
      }
      const category = byId.get(referenceId)
      if (!category) {
        return []
      }
      seen.add(referenceId)
      return [category]
    })
}

export function useSidebarCategories(enabled = true): SidebarCategoriesState {
  const [state, setState] = useState<SidebarCategoriesState>({
    categories: [],
    loading: true,
    failed: false,
  })

  useEffect(() => {
    if (!enabled) {
      return
    }
    let cancelled = false
    Promise.all([
      listCollections('CATEGORY_SIDEBAR_COLLECTION'),
      listCategories(),
    ])
      .then(([collections, categories]) => {
        if (!cancelled) {
          setState({
            categories: joinSidebar(collections, categories),
            loading: false,
            failed: false,
          })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ categories: [], loading: false, failed: true })
        }
      })
    return () => {
      cancelled = true
    }
  }, [enabled])

  return state
}
```

- [ ] **Step 3: Typecheck and lint**

Run: `npm run build`

Expected: build succeeds.

Run: `npm run lint`

Expected: exit code 0. If `react-hooks/exhaustive-deps` complains, do not add `state` or the imported functions to the dependency array.

- [ ] **Step 4: Commit**

```
git add src/lib/api.ts src/hooks/useSidebarCategories.ts
git commit -m "feat: add shared hook for curated sidebar categories"
```

---

### Task 2: Wire `MainNav` to the hook

**Files:**
- Modify: `src/components/layout/MainNav.tsx` (imports; `categories` state; the `listCategories` effect; the overlay `<ul>`)

**Interfaces:**
- Consumes: `useSidebarCategories(showOverlay)` from Task 1.
- Produces: no new export. Existing `flyoutCategory`, `openFlyout`, `renderFlyout` keep using `CategoryResponse`.

- [ ] **Step 1: Swap the data source**

In the import from `../../lib/api.ts`, drop `listCategories` but keep `categoryImage`, `listProducts`, `type CategoryResponse`, `type ProductResponse`. Add:

```ts
import { useSidebarCategories } from '../../hooks/useSidebarCategories.ts'
```

Delete `const [categories, setCategories] = useState<CategoryResponse[]>([])` and the `useEffect` block that calls `listCategories()` (the one guarded by `if (!showOverlay) return`, ending with `}, [showOverlay])`). Replace them with, placed after `showOverlay` is defined:

```ts
  const { categories, loading: categoriesLoading } = useSidebarCategories(showOverlay)
```

`useState` and `useEffect` stay imported for the other state and effects.

- [ ] **Step 2: Add the empty state to the overlay list**

In the overlay `<ul className="text-[13px] text-gray-600 font-medium">`, replace the opening `{categories.map((cat, i) => {` with:

```tsx
                {categoriesLoading ? null : categories.length === 0 ? (
                  <li className="px-4 py-2.5 text-gray-500">Chưa có danh mục nào</li>
                ) : categories.map((cat, i) => {
```

The false branch is the existing `categories.map(...)` expression, so the existing closing `})}` stays exactly as it is. Do not change the row markup, the flyout or the click handlers.

- [ ] **Step 3: Typecheck and lint**

Run: `npm run build`

Expected: build succeeds with no unused-import errors.

Run: `npm run lint`

Expected: exit code 0.

- [ ] **Step 4: Verify in the browser**

With the API running and no sidebar rows configured (`GET /api/collections?collectionType=CATEGORY_SIDEBAR_COLLECTION` returns `[]`), run `npm run dev`, open `/gioi-thieu`, click `TẤT CẢ SẢN PHẨM`.

Expected: `Chưa có danh mục nào` inside the overlay. On the same page, DevTools Network shows no `collections` request until the click. Then add two categories in admin (`Danh mục sidebar`) with names whose alphabetical order differs from their order (e.g. add `Zeta` at index 0, `Alpha` at index 1), reload the storefront and reopen the overlay: rows appear as `Zeta`, `Alpha`. Hovering either row still opens the product flyout.

- [ ] **Step 5: Commit**

```
git add src/components/layout/MainNav.tsx
git commit -m "feat: render storefront nav from curated sidebar collection"
```

---

### Task 3: Wire `CategorySidebar` to the hook

**Files:**
- Modify: `src/pages/dashboard/components/CategorySidebar.tsx` (imports; `apiCategories`/`failed` state; `listCategories` effect; render states)

**Interfaces:**
- Consumes: `useSidebarCategories()` from Task 1.
- Produces: no new export.

- [ ] **Step 1: Swap the data source**

Remove the `useEffect`/`useState` imports and the `listCategories`/`CategoryResponse` imports. Keep `categoryImage`. Add:

```ts
import { useSidebarCategories } from '../../../hooks/useSidebarCategories.ts'
```

Replace the two state declarations and the effect with:

```ts
  const { categories, loading, failed } = useSidebarCategories()
```

- [ ] **Step 2: Rework the render precedence**

Inside the `<ul>`, the order is: skeletons while `loading`, static fallback when `failed`, empty copy when settled and empty, then rows. Concretely:

```tsx
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              /* existing skeleton markup, unchanged */
            ))
          ) : failed ? (
            /* existing `fallbackCategories.map(...)` block, unchanged */
          ) : categories.length === 0 ? (
            <li className="px-4 py-2.5 text-gray-500">Chưa có danh mục nào</li>
          ) : (
            categories.map((cat, i) => {
              /* existing row markup, with apiCategories replaced by categories */
            })
          )}
```

Replace every remaining `apiCategories` reference in the row block with `categories` (including `i < categories.length - 1`). With the false branch wrapped in parentheses, the block that previously ended `})}` now ends:

```tsx
            })
          )}
```

- [ ] **Step 3: Typecheck and lint**

Run: `npm run build`

Expected: build succeeds with no unused-import errors.

Run: `npm run lint`

Expected: exit code 0.

- [ ] **Step 4: Verify in the browser**

Run `npm run dev` and open `/`.

Expected with the two rows from Task 2: the inline sidebar lists `Zeta` then `Alpha` (curated order), with category thumbnails where they exist. With every row deleted in admin and a reload: `Chưa có danh mục nào`. Stop the API and reload: the hard-coded fallback list still renders, and the rest of the homepage shows its usual empty sections.

- [ ] **Step 5: Commit**

```
git add src/pages/dashboard/components/CategorySidebar.tsx
git commit -m "feat: use curated sidebar collection on the homepage"
```

---

### Task 4: Cross-page edge cases

**Files:** none (verification only).

**Interfaces:**
- Consumes: Tasks 1–3 plus the admin section from `trac-dia-thien-phu-admin/docs/plans/sidebar_collection.md`.

- [ ] **Step 1: Duplicate referenceId**

Add the same category twice through the API (admin blocks it in the picker), e.g. two `POST /api/collections` bodies with the same `referenceId`, then reload both the overlay and the homepage sidebar.

Expected: each menu shows that category once.

- [ ] **Step 2: Dangling referenceId**

Delete one of the curated categories in admin (Danh mục), then reload the storefront.

Expected: that row is gone from both menus; remaining rows keep their order; no placeholder text.

- [ ] **Step 3: Failure isolation**

Stop the API and reload `/` and `/gioi-thieu`.

Expected: header, nav bar and page content still render; the overlay shows `Chưa có danh mục nào` when opened; the homepage inline sidebar shows the static fallback; no unhandled error in the console.

- [ ] **Step 4: Full checks**

Run: `npm run build`, then `npm run lint`.

Expected: both pass. No commit for this task.
