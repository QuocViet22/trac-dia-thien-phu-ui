# Category Products Page (/danh-muc/:alias) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the dashboard `CategorySidebar` links work: `/danh-muc/{seoAlias}` renders the existing product listing for that category, using the new `GET /api/products/by-category-alias/{seoAlias}` endpoint.

**Architecture:** Reuse `SanPhamPage` at a second route. It already holds page/brand/sort state, pagination, loading/error/empty states and the filter sidebar; the only new logic is choosing the request (alias vs `categoryId`) and letting a category click navigate instead of setting state. No new page component, no new UI dependency.

**Tech Stack:** Vite 8 + React 19 + TypeScript, `react-router`, Tailwind. Typecheck is part of `npm run build` (`tsc -b`); there is no test runner in this repo (per `AGENTS.md` — do not invent one).

**Spec:** `docs/specs/danh-muc.md` — the plan argues from the spec; executors read both.

**Depends on:** `trac-dia-thien-phu-api` `GET /api/products/by-category-alias/{seoAlias}` (`docs/plans/product_controller.md`, addendum Tasks 5–8). The UI compiles without it, but nothing can be verified in the browser until it is deployed or running locally.

## Global Constraints

- Keep the file layout and conventions above: components under `src/pages/product/`, shared helpers in `src/lib/api.ts`, Tailwind, shared `Img` fallback — no new dependency, no state library, no new CSS.
- `verbatimModuleSyntax: true` — type-only imports must use `import type`.
- `noUnusedLocals` + `noUnusedParameters: true` — the build fails on unused variables; do not leave scaffolding.
- Environment is PowerShell 5.1: chain commands with `; if ($?) { ... }`, never `&&`.
- Copy stays Vietnamese and matches the existing page (`Tất cả sản phẩm`, `Chưa có sản phẩm trong danh mục này.`, `Không tải được sản phẩm. Vui lòng thử lại.`).
- Verification per task is `npm run build` (includes the typecheck) + `npm run lint`; the browser pass lives in Task 3.

## Review Focus

1. An alias the API does not know (`/danh-muc/khong-ton-tai`) → the existing error block with a working `Tải lại`, not an endless skeleton and not a blank page. → Task 2 Step 5.
2. A category with a blank `seoAlias` → the sidebar must link to `/san-pham?categoryId={id}`, never `/danh-muc/null` or `/danh-muc/`. → Task 1 Step 5.
3. An alias containing characters that need encoding (Vietnamese diacritics, spaces) → the request path must be encoded and still resolve. → Task 1 Step 5.
4. Switching category while on a `/danh-muc/` page → page resets to 1 and refetches; the previous category's products must not sit under the new title. → Task 2 Step 5.
5. A category with no products (or a parent whose children have none) → `Chưa có sản phẩm trong danh mục này.` with a single pagination page, no error. → Task 3 Step 2.

---

### Task 1: API helper, route, and sidebar link fallback

**Files:**
- Modify: `src/lib/api.ts` (add after `listProducts`)
- Modify: `src/App.tsx:21` (add a route beside `/san-pham`)
- Modify: `src/pages/dashboard/components/CategorySidebar.tsx:63`
- Test: none (no runner) — `npm run build` + `npm run lint`, browser check in Task 3.

**Interfaces:**
- Consumes: existing `fetchData<T>`, `Page<T>`, `ProductResponse`, `API_BASE`.
- Produces: `listProductsByCategoryAlias(query: CategoryAliasProductQuery): Promise<Page<ProductResponse>>` and the exported interface `CategoryAliasProductQuery { alias: string; page: number; size: number; brand?: string; sort?: string }` — Task 2 calls it.

- [ ] **Step 1: Add the request helper to `src/lib/api.ts`**

Place it immediately after `listProducts`. Same shape and same brace style as `listProducts`, so a reader can diff the two:

```ts
export interface CategoryAliasProductQuery {
  alias: string
  page: number
  size: number
  brand?: string
  sort?: string
}

export function listProductsByCategoryAlias(query: CategoryAliasProductQuery): Promise<Page<ProductResponse>> {
  const params = new URLSearchParams()
  params.set('page', String(query.page))
  params.set('size', String(query.size))
  if (query.brand) {
    params.set('brand', query.brand)
  }
  if (query.sort) {
    params.set('sort', query.sort)
  }
  return fetchData<Page<ProductResponse>>(`/api/products/by-category-alias/${encodeURIComponent(query.alias)}?${params.toString()}`)
}
```

- [ ] **Step 2: Add the route to `src/App.tsx`**

Directly after the `/san-pham` route line:

```tsx
          <Route path="/danh-muc/:alias" element={<SanPhamPage />} />
```

- [ ] **Step 3: Add the sidebar link fallback in `src/pages/dashboard/components/CategorySidebar.tsx`**

Replace the `to` value on the existing `Link` (currently `` to={`/danh-muc/${cat.seoAlias}`} ``) with:

```tsx
                  to={cat.seoAlias ? `/danh-muc/${cat.seoAlias}` : `/san-pham?categoryId=${encodeURIComponent(cat.id)}`}
```

This mirrors how `MainNav.tsx` already links a category by id.

- [ ] **Step 4: Verify the build and lint**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both pass. A `tsc` error about an unused import means a step 1–3 edit was left half-applied.

- [ ] **Step 5: Commit**

```bash
git add src/lib/api.ts src/App.tsx src/pages/dashboard/components/CategorySidebar.tsx
git commit -m "feat: route /danh-muc/:alias and category-alias product request"
```

### Task 2: Alias mode in `SanPhamPage`

**Files:**
- Modify: `src/pages/product/SanPhamPage.tsx`
- Test: none (no runner) — `npm run build` + `npm run lint`, browser check in Task 3.

**Interfaces:**
- Consumes: Task 1's `listProductsByCategoryAlias`; the `categories: CategoryResponse[]` state the page already loads for its filter sidebar; `useParams` / `useNavigate` from `react-router`.
- Produces: nothing other tasks consume.

- [ ] **Step 1: Read the alias and add the navigation hook**

Change the imports:

```tsx
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
```

Add `listProductsByCategoryAlias` to the existing `../../lib/api.ts` import list. Then, as the first two lines inside `SanPhamPage`:

```tsx
  const { alias } = useParams()
  const navigate = useNavigate()
```

- [ ] **Step 2: Reset to page 1 when the alias changes**

The page already syncs `?categoryId=` changes into its own state (the `paramCategoryId !== prevParamCategoryId` block). Extend it with the same pattern for the alias, so navigating between two `/danh-muc/` pages refetches from page 1:

```tsx
  const [prevAlias, setPrevAlias] = useState(alias)
```

and, inside that same render-time block (after the existing `if (paramCategoryId !== prevParamCategoryId) { ... }`):

```tsx
  if (alias !== prevAlias) {
    setPrevAlias(alias)
    setQuery((current) => ({ ...current, page: 0 }))
    setLoading(true)
    setFailed(false)
  }
```

- [ ] **Step 3: Pick the request and derive the heading**

Below the state declarations (after `categories` is declared), add:

```tsx
  const activeCategory = alias ? categories.find((category) => category.seoAlias === alias) ?? null : null
  const heading = activeCategory?.name ?? 'Tất cả sản phẩm'
```

In the products `useEffect`, keep the same `.then`/`.catch`/`cancelled` body and swap only the request — plus `alias` in the dependency array:

```tsx
    const request = alias
      ? listProductsByCategoryAlias({ alias, page: query.page, size: PAGE_SIZE, brand: query.brand ?? undefined, sort: query.sort })
      : listProducts({ page: query.page, size: PAGE_SIZE, categoryId: query.categoryId ?? undefined, brand: query.brand ?? undefined, sort: query.sort })
```

then call `request.then(...)` where the effect currently calls `listProducts(...).then(...)`, and change the dependency list to `[query, reloadKey, alias]`.

- [ ] **Step 4: Use the heading, and navigate on category selection**

Replace the two breadcrumb/H1 literals `Tất cả sản phẩm` with `{heading}` (`<span className="text-gray-800 font-medium">{heading}</span>` and `<h1 ...>{heading}</h1>`).

Pass to `FilterSidebar` instead of the current two props:

```tsx
          selectedCategoryId={alias ? activeCategory?.id ?? null : query.categoryId}
          onSelectCategory={(id) => {
            if (!alias) {
              updateQuery({ categoryId: id, page: 0 })
              return
            }
            const target = id ? categories.find((category) => category.id === id) ?? null : null
            if (target?.seoAlias) {
              navigate(`/danh-muc/${target.seoAlias}`)
            } else {
              navigate(id ? `/san-pham?categoryId=${id}` : '/san-pham')
            }
          }}
```

Everything else — `Toolbar`, skeletons, `ProductCard`, pagination, `retry` — is untouched. `updateQuery` stays in use for brand/sort/page.

- [ ] **Step 5: Verify the build, lint, and the two failure paths**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both pass. Then with the API running (Task 3 covers the full list) check only these two:
1. `http://localhost:5173/danh-muc/khong-ton-tai` → the `Không tải được sản phẩm. Vui lòng thử lại.` block with a `Tải lại` button (API `404`).
2. Open a real `/danh-muc/{alias}`, then click a different category in the filter sidebar → the URL changes, the products change, and pagination is back on page 1.

- [ ] **Step 6: Commit**

```bash
git add src/pages/product/SanPhamPage.tsx
git commit -m "feat: render category products from the alias route"
```

### Task 3: Manual verification pass

**Files:** none (verification only).

- [ ] **Step 1: Confirm the API side is reachable**

Run: `npm run dev` with `trac-dia-thien-phu-api` running on `http://localhost:8080` (or `VITE_API_URL` pointing at it).
Expected: the dashboard sidebar lists categories with images (it already did) and each entry is now a working link.

- [ ] **Step 2: Walk the spec's checklist**

For each item, expected result:

1. Every sidebar category opens `/danh-muc/{seoAlias}` with a populated grid and the category name as breadcrumb + H1.
2. A parent category (e.g. the GNSS RTK one) lists its children's products too.
3. Brand filter, sort toolbar and pagination still work, and the URL stays on `/danh-muc/{alias}`.
4. `/danh-muc/khong-ton-tai` shows the error block; `Tải lại` retries.
5. A category with no products shows `Chưa có sản phẩm trong danh mục này.` and one pagination page.
6. `/`, `/san-pham`, `/san-pham/{slug}` unchanged, including the `/san-pham?categoryId=` links from `MainNav` and `FeaturedCategories`.

- [ ] **Step 3: Confirm the worktree contains only intended changes**

Run: `git status --short`
Expected: only the three files from Task 1 and `SanPhamPage.tsx` from Task 2, plus this plan and `docs/specs/danh-muc.md`. `dist/` must not appear.

## Self-Review

**1. Spec coverage:** spec Goals → Task 1 (route, sidebar fallback), Task 2 (alias request, name in breadcrumb/H1, navigate-on-select), unchanged-and-reused items named in Task 3 Step 2. Non-goals → nothing in the plan adds price/SEO/MainNav changes, a page component, or client-side descendant merging. API Contract → Task 1 Step 1 (param set and encoded path). Architecture → the four exact files. Content → Task 2 Step 4 (`heading`) and Task 3 Step 2 (Vietnamese strings). Verification → each task's build/lint plus Task 3's checklist.

**2. Step scan:** each step is one edit with a checkable result. Bodies are given only where the signature plus surrounding code would leave a real choice (the request ternary, the navigate branch, the sidebar ternary); the effect's `.then`/`.catch` body is referenced, not transcribed, because Task 2 says to keep it. No TBD, no "add appropriate" steps.

**3. Type consistency:** `CategoryAliasProductQuery` (`alias, page, size, brand?, sort?`) is defined once in Task 1 and called with exactly those keys in Task 2; `activeCategory` is `CategoryResponse | null` and read as `.id`/`.name`/`.seoAlias`, all of which exist on the exported `CategoryResponse`; `heading` is always `string`. Function name `listProductsByCategoryAlias` is identical in both tasks.

**4. Review Focus:** line 1 → Task 2 Step 5.1; line 2 → Task 1 Step 3. `seoAlias` is typed `string | null` in `src/lib/api.ts`, so the falsy check covers both `null` and `''`. Line 3 → Task 1 Step 1 (`encodeURIComponent`) + Task 3 Step 2.1. Line 4 → Task 2 Step 2. Line 5 → Task 3 Step 2.5.

**5. Proportion:** three tasks, three files plus one component edit, no new dependency and no new page. Both spec-level failure paths get an explicit manual step because this repo has no test runner to pin them.
