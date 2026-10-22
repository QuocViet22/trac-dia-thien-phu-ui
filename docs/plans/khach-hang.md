# Khách Hàng News Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `CUSTOMER_NEWS` items at `/khach-hang` and `/khach-hang/:slug`, showing the stored `location` in the list row and the detail page.

**Architecture:** Reuse the existing shared `NewsPage` / `NewsDetailPage` configured with `newsType="CUSTOMER_NEWS"`; add the type and `location` field to the API client types, append the location to the row meta, add one location line to the detail, and point the existing `MainNav` "Khách hàng" item at the new route.

**Tech Stack:** React 19 (`useEffect`/`useState`), react-router 8, Tailwind v4, `fetch` + `URLSearchParams`, shared `Img` wrapper. No new dependencies.

**Spec:** `docs/specs/khach-hang.md` — the plan argues from the spec; executors read both.

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0). No test runner — verification is build + lint + `npm run dev` visual check.
- `verbatimModuleSyntax: true` — type imports must use `import type`; `noUnusedLocals` + `noUnusedParameters` — no unused vars; `erasableSyntaxOnly: true` — no enums/namespaces/parameter properties.
- `location` is rendered as plain React text (`{news.location}`), never `dangerouslySetInnerHTML`.
- Vietnamese copy: title/breadcrumb `Khách hàng`, empty `Chưa có thông tin khách hàng nào.`, detail label `Địa điểm:`.
- Do not change `/tin-tuc` or `/thue-san-pham` routes or their copy.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.

## Review Focus

1. News without a location must not render a dangling ` - ` in the row meta. → Task 1 Step 2 dev check with a location-less item.
2. A `NEWS` alias opened under `/khach-hang/:slug` must show the missing state, not the article. → Task 2 Step 3 dev check.
3. Location text is admin-entered free text and must render as text, not markup. → Task 1 Step 2/3 code check (`{news.location}`, no HTML injection).
4. API down on `/khach-hang` must show the error block with a working retry, not a blank page. → Task 2 Step 3 dev check.
5. `/tin-tuc` and `/thue-san-pham` must remain visually unchanged for items without a location. → Task 2 Step 3 dev check.

---

## File structure

- `src/lib/api.ts` (modify) — `NewsType` gains `CUSTOMER_NEWS`; `location` added to `NewsResponse` and `NewsDetailResponse`.
- `src/pages/news/NewsPage.tsx` (modify) — append location to the row meta line.
- `src/pages/news/NewsDetailPage.tsx` (modify) — add the `Địa điểm:` line.
- `src/App.tsx` (modify) — add `/khach-hang` and `/khach-hang/:slug`.
- `src/components/layout/MainNav.tsx` (modify) — link "Khách hàng" to `/khach-hang`.

---

### Task 1: API types + location rendering in the shared pages

**Files:**
- Modify: `src/lib/api.ts`
- Modify: `src/pages/news/NewsPage.tsx`
- Modify: `src/pages/news/NewsDetailPage.tsx`

**Interfaces:**
- Consumes: existing `listNews`, `getNewsByAlias`, `newsImage`, `formatNewsDate`, `Img`, and the `NewsPage` / `NewsDetailPage` props (`newsType`, `title`, `emptyText`, `basePath`; `newsType`, `listTitle`, `listPath`).
- Produces: `NewsType = 'NEWS' | 'HIRING_PRODUCT' | 'CUSTOMER_NEWS'`; `location: string | null` on both DTOs; row meta includes location; detail renders the location line — consumed by Task 2 routes.

- [ ] **Step 1: Extend `src/lib/api.ts`.**

Change the union:

```ts
export type NewsType = 'NEWS' | 'HIRING_PRODUCT' | 'CUSTOMER_NEWS'
```

Add `location: string | null` directly after `newsType: NewsType` in both `NewsResponse` and `NewsDetailResponse`.

- [ ] **Step 2: Append the location to the list row meta in `NewsPage.tsx`.**

Replace the meta paragraph inside the `items.map` with:

```tsx
<p className="text-sm text-gray-500 mt-1">{formatNewsDate(item.updatedAt)} - {item.author}{item.location ? ` - ${item.location}` : ''}</p>
```

The conditional keeps the separator out when `location` is null/blank.

- [ ] **Step 3: Add the location line in `NewsDetailPage.tsx`.**

Directly below the existing `Đăng bởi: ...` paragraph, add:

```tsx
{news.location && <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">Địa điểm: {news.location}</p>}
```

- [ ] **Step 4: Verify build + lint.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/lib/api.ts src/pages/news/NewsPage.tsx src/pages/news/NewsDetailPage.tsx
git commit -m "feat: show news location in list and detail"
```

---

### Task 2: Routes, nav link, and end-to-end check

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/layout/MainNav.tsx`

**Interfaces:**
- Consumes: `NewsPage` / `NewsDetailPage` props and `NewsType.CUSTOMER_NEWS` (Task 1); `activeLink` / `idleLink` and `location.pathname` already in `MainNav`.
- Produces: working `/khach-hang` + `/khach-hang/:slug` routes and a wired nav item. Nothing downstream.

- [ ] **Step 1: Add the two routes in `src/App.tsx`.**

Place them directly after the `/thue-san-pham/:slug` route:

```tsx
<Route path="/khach-hang" element={<NewsPage newsType="CUSTOMER_NEWS" title="Khách hàng" emptyText="Chưa có thông tin khách hàng nào." basePath="/khach-hang" />} />
<Route path="/khach-hang/:slug" element={<NewsDetailPage newsType="CUSTOMER_NEWS" listTitle="Khách hàng" listPath="/khach-hang" />} />
```

- [ ] **Step 2: Point the existing nav item at the route in `MainNav.tsx`.**

Replace the `href="#"` item with:

```tsx
<li className="whitespace-nowrap"><Link to="/khach-hang" className={location.pathname === "/khach-hang" ? activeLink : idleLink}>Khách hàng</Link></li>
```

- [ ] **Step 3: Verify build, lint, and the manual flow.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

Then `npm run dev` with the API seeded with customer news:
- nav "Khách hàng" → `/khach-hang`, active styling applied;
- list shows only `CUSTOMER_NEWS` rows; rows with a location end in ` - {location}`, rows without end at the author with no trailing separator;
- a row opens `/khach-hang/{seoAlias}` with `Địa điểm: ...` under the author/date line;
- cross-opening a `NEWS` alias under `/khach-hang/:slug` shows `Tin tức không tồn tại` + `Quay lại Khách hàng`;
- empty/error/retry states work; `/tin-tuc` and `/thue-san-pham` unchanged; mobile stacks cleanly.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/components/layout/MainNav.tsx docs/specs/khach-hang.md docs/plans/khach-hang.md
git commit -m "feat: add khach-hang news page and nav link"
```

---

## Phase 3 — Bespoke customer card grid (owner-supplied design)

### Task 3: Integrate `CUSTOMER_NEWS` into `CustomerList`

**Files:**
- Modify: `src/pages/customer/CustomerList.tsx`
- Modify: `src/pages/customer/CustomerList.css`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `listNews`, `newsImage`, `NewsResponse` from `src/lib/api.ts`; shared `Img`.
- Produces: a `/khach-hang` list backed by the news API; the detail route is unchanged.

- [x] **Step 1: Replace the sample data with live data.**

- Remove `SAMPLE` and the `customers` prop. Page state mirrors `NewsPage`
  (`items`, `page`, `totalPages`, `loading`, `failed`, `reloadKey`) with
  `PAGE_SIZE = 12`, and fetches
  `listNews({ page, size: PAGE_SIZE, newsType: 'CUSTOMER_NEWS' })`,
  cancelling stale responses.
- Map each `NewsResponse`: banner
  `Bàn giao máy RTK tại tỉnh {location}` (or `Bàn giao máy RTK`), round
  photo `newsImage(item)` through `Img` (gradient placeholder when there
  is no image), location chip hidden when blank, real `title` below the
  banner, card links to `/khach-hang/{seoAlias}`.
- Banner contact lines are site-wide constants
  (`0972.819.598`, `https://igeostore.vn/`).

- [x] **Step 2: Remove the province filter and add states + pager.**

- Delete the filter dropdown and its CSS. Subtitle becomes
  `Hình ảnh bàn giao sản phẩm tới khách hàng trên toàn quốc`.
- Six skeleton cards while loading; error block
  `Không tải được khách hàng. Vui lòng thử lại.` + `Tải lại`; empty
  `Chưa có khách hàng nào.`
- Pager under the grid: same `« 1 2 3 »` markup/classes as `/tin-tuc`.

- [x] **Step 3: Route and styles.**

- `src/App.tsx`: `/khach-hang` renders `<CustomerList />`.
- Rename `.card*` → `.cl-card*`; drop the unused `.cl__filter`,
  `.cl__select`, and `.cl-card__banner-img` rules.

- [x] **Step 4: Verify.**

- `npm run build` and `npm run lint` exit 0.
- Headless smoke against the live API: 12 cards on page 1 and 2 on page 2
  with correct current/disabled pager states; a card opens
  `/khach-hang/{seoAlias}`; missing-`location` and missing-image
  fallbacks render; empty and API-down (`Tải lại`) states render.

- [ ] **Step 5: Commit**

```bash
git add src/pages/customer src/App.tsx docs/specs/khach-hang.md docs/plans/khach-hang.md
git commit -m "feat: drive the customer page from customer news"
```

