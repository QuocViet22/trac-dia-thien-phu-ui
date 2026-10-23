# Homepage API Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render all 7 dashboard sections from `GET /api/collections?collectionType=` with entity references resolved, dropping hardcoded `data.ts` content.

**Architecture:** Extend `src/lib/api.ts` additively with collection + by-id clients; add a `useHomepage` hook that fetches the 7 types in parallel and resolves references; convert the 7 components to presentational props (markup unchanged); hide failed/empty sections.

**Tech Stack:** React 19 + TS + Vite, existing `fetchData` envelope, cancelled-flag effects.

**Spec:** `trac-dia-thien-phu-ui/docs/specs/homepage.md`

## Global Constraints

- `verbatimModuleSyntax: true` — type imports must use `import type`.
- `erasableSyntaxOnly: true` — no enums, namespaces, or parameter properties (use string unions + const objects).
- `noUnusedLocals` + `noUnusedParameters: true` — build fails on unused vars; check with `npm run build` (this IS the typecheck).
- `jsx: react-jsx`, `moduleResolution: bundler`; lint with `npm run lint`.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- No test runner configured — verification is `npm run build` + `npm run lint` + manual checklist per task.
- Server `CollectionResponse`: `(id, name, orderIndex, collectionType, referenceId: UUID | null, images: [{id, name, imageUrl, sortOrder}])`, ordered by `orderIndex` ASC; max counts slider 5, promo 3, featured 6, best-seller 10, category-display 4, service 3, news 3.

## Review Focus

- A deleted product/category/news referenced by a collection must skip silently, never blank its section (most likely).
- One failed collection type must never blank the other six sections.
- CategorySection with zero surviving products still renders its title row rather than crashing on empty arrays.
- `orderIndex` gaps (e.g. after admin deletes item 1 of 3) must not break ordering or carousel dots.
- Stale fetch resolving after unmount must not set state (cancelled-flag on every effect; verified by code inspection in each task's lint step).

---

### Task 1: Data layer (`src/lib/api.ts`, additive only)

**Files:**
- Modify: `trac-dia-thien-phu-ui/src/lib/api.ts`
- Test: `npm run build`, `npm run lint` (no runner configured)

**Interfaces:**
- Consumes: existing `fetchData<T>(path)`, `ImageDto`, `ProductResponse`, `NewsResponse`, `Page<T>`.
- Produces for Tasks 2-4: `CollectionType` (string union of the 7 values), `CollectionResponse`, `listCollections(type: CollectionType) => Promise<CollectionResponse[]>`, `getProduct(id) => Promise<ProductResponse>`, `getCategory(id) => Promise<CategoryResponse>`, `getNews(id) => Promise<NewsResponse>`; extended `CategoryResponse` with `images: ImageDto[]`.

- [ ] **Step 1: Implement the additions in `src/lib/api.ts`**

Add `export type CollectionType = 'HERO_SLIDER_COLLECTION' | 'PROMO_CARD_COLLECTION' | 'FEATURED_CATEGORY_COLLECTION' | 'BEST_SELLER_COLLECTION' | 'CATEGORY_COLLECTION' | 'SERVICE_BANNER_COLLECTION' | 'NEWS_COLLECTION'`; `export interface CollectionResponse { id: string; name: string; orderIndex: number; collectionType: CollectionType; referenceId: string | null; images: ImageDto[] }`; `export function listCollections(type: CollectionType): Promise<CollectionResponse[]>` calling `fetchData` with `/api/collections?collectionType=${type}`; `getProduct`/`getCategory`/`getNews` calling `fetchData` with `/api/products/${id}`, `/api/categories/${id}`, `/api/news/${id}`; add `images: ImageDto[]` to `CategoryResponse`. Touch nothing existing.

- [ ] **Step 2: Run build to verify it passes**

Run: `npm run build` (workdir `trac-dia-thien-phu-ui`)
Expected: PASS (new exports unused — no unused-export rule — tree still renders hardcoded data).

- [ ] **Step 3: Run lint to verify it passes**

Run: `npm run lint`
Expected: PASS, 0 errors.

- [ ] **Step 4: Commit**

```bash
git add trac-dia-thien-phu-ui/src/lib/api.ts
git commit -m "feat: add collection and entity by-id clients"
```

### Task 2: Orchestration hook + DashboardPage wiring

**Files:**
- Create: `trac-dia-thien-phu-ui/src/pages/dashboard/useHomepage.ts`
- Modify: `trac-dia-thien-phu-ui/src/pages/dashboard/DashboardPage.tsx`
- Test: `npm run build`, `npm run lint` + manual checklist below

**Interfaces:**
- Consumes: Task 1 clients + `listProducts`, `listCategories`, `productImage`, `newsImage`, `formatNewsDate`.
- Produces for Tasks 3-4: `useHomepage(): HomepageData` where `HomepageData` has per-section `{ data, loading, failed }` with shapes: `slides: { image, alt }[]`; `promoImages: string[]`; `serviceImages: { image, alt }[]`; `featured: { id, name, imageUrl }[]`; `bestSellers: ProductResponse[]`; `categorySections: { id, title, brands: string[], products: ProductResponse[] }[]`; `news: NewsResponse[]`.

- [ ] **Step 1: Implement `useHomepage` in `src/pages/dashboard/useHomepage.ts`**

Fetch the 7 `listCollections(type)` via one `Promise.all` with a cancelled flag; resolve best-sellers with `Promise.all(collections.map(c => c.referenceId ? getProduct(c.referenceId).catch(() => null) : null))` filtering nulls (order preserved); featured/categories by matching `referenceId`s against one `listCategories()` (extend match with category `images[0]` thumbnail, `''` fallback); news with `getNews` per id, 404 → skip; CategorySection auto-fill with `listProducts({ page: 0, size: 5, categoryId })` per picked category and `brands` from ` [...new Set(products.map(p => p.brand).filter(Boolean))]`; per-type try/catch so one failure sets only its `failed` flag. DashboardPage keeps rendering hardcoded props in this task (hook unused until Tasks 3-4 wire it).

- [ ] **Step 2: Run build to verify it passes**

Run: `npm run build`
Expected: PASS (hook unreferenced — homepage visually unchanged).

- [ ] **Step 3: Run lint to verify it passes**

Run: `npm run lint`
Expected: PASS, 0 errors.

- [ ] **Step 4: Commit**

```bash
git add trac-dia-thien-phu-ui/src/pages/dashboard/useHomepage.ts
git commit -m "feat: add homepage data orchestration hook"
```

### Task 3: Image sections (HeroSlider, PromoCards, ServiceBanners)

**Files:**
- Modify: `.../dashboard/components/HeroSlider.tsx`, `.../dashboard/components/PromoCards.tsx`, `.../dashboard/components/ServiceBanners.tsx`, `.../dashboard/DashboardPage.tsx`
- Test: `npm run build`, `npm run lint` + manual checklist below

**Interfaces:**
- Consumes: Task 2 `useHomepage` (`slides`, `promoImages`, `serviceImages` + flags).
- Produces: image sections fully API-driven; `slides` export removed from `data.ts` when done.

- [ ] **Step 1: Migrate the three components to props**

`HeroSlider({ slides }: { slides: { image: string; alt: string }[] })` rendering one image slide per entry (delete the hardcoded gradient slide 1; dots derive from `slides.length`); `PromoCards({ images }: { images: string[] })` rendering one pure-image card per entry (delete text overlays); `ServiceBanners({ banners }: { banners: { image: string; alt: string }[] })` unchanged shape, fed by API. Each keeps a named skeleton export for loading (pulse blocks matching current dimensions). DashboardPage: `const home = useHomepage()`; loading → skeleton, failed/empty (`length === 0`) → `null`, else render with data.

- [ ] **Step 2: Run build to verify it passes**

Run: `npm run build`
Expected: PASS with no `data.ts` imports for `slides` remaining.

- [ ] **Step 3: Run lint to verify it passes**

Run: `npm run lint`
Expected: PASS, 0 errors.

- [ ] **Step 4: Manual checklist**

With API running and slider/promo/service populated: images render in collection order; autoplay/dots follow item count; with a type emptied in admin: section disappears; with API stopped: the three sections vanish, rest of page intact.

- [ ] **Step 5: Commit**

```bash
git add trac-dia-thien-phu-ui/src/pages/dashboard/components/HeroSlider.tsx trac-dia-thien-phu-ui/src/pages/dashboard/components/PromoCards.tsx trac-dia-thien-phu-ui/src/pages/dashboard/components/ServiceBanners.tsx trac-dia-thien-phu-ui/src/pages/dashboard/DashboardPage.tsx
git commit -m "feat: drive slider promo and service banners from collections API"
```

### Task 4: Entity sections + data.ts cleanup

**Files:**
- Modify: `.../dashboard/components/FeaturedCategories.tsx`, `.../dashboard/components/BestSellers.tsx`, `.../dashboard/components/CategorySection.tsx`, `.../dashboard/components/NewsSection.tsx`, `.../dashboard/DashboardPage.tsx`, `.../dashboard/data.ts`
- Test: `npm run build`, `npm run lint` + manual checklist below

**Interfaces:**
- Consumes: Task 2 `useHomepage` (`featured`, `bestSellers`, `categorySections`, `news` + flags); `productImage`, `newsImage`, `formatNewsDate`; existing dashboard `ProductCard` (badge already optional — omit it).

- [ ] **Step 1: Migrate the four components to props**

`FeaturedCategories({ items }: { items: { id: string; name: string; imageUrl: string }[] })` linking to `/san-pham?categoryId=${id}`; `BestSellers({ products }: { products: ProductResponse[] })` mapping to `ProductCard` with `brand ?? undefined`, `image = productImage(product)`, `seoAlias ?? undefined`, no badge; `CategorySection({ id, title, brands, products }: { id: string; title: string; brands: string[]; products: ProductResponse[] })` with the banners row deleted; `NewsSection({ items }: { items: NewsResponse[] })` mapping to image/title/`formatNewsDate(updatedAt)` cards linking to `/${item.newsType === 'HIRING_PRODUCT' ? 'thue-san-pham' : 'tin-tuc'}/${item.seoAlias}`. DashboardPage wires all four with skeleton-on-loading and null-on-failed/empty. Delete `slides`, `featuredCats`, `bestSellers`, `categorySections`, `serviceBanners`, `news` (and now-unused `Product`/`CategorySectionData`/`NewsItem`/`FeaturedCat`/`Slide` interfaces) from `data.ts`, keeping `categories` + `categoryIcon` for the sidebar.

- [ ] **Step 2: Run build to verify it passes**

Run: `npm run build`
Expected: PASS with zero references to deleted `data.ts` exports.

- [ ] **Step 3: Run lint to verify it passes**

Run: `npm run lint`
Expected: PASS, 0 errors.

- [ ] **Step 4: Manual checklist (spec success criteria)**

Admin edits (reorder/add/remove in any section) visible on storefront refresh; empty type hidden; dangling reference (delete a picked product) skips silently with survivors in order; API stopped → all 7 sections hidden, sidebar + header intact; `rg "from '../data` in dashboard shows only `categoryIcon`/`categories` imports.

- [ ] **Step 5: Commit**

```bash
git add trac-dia-thien-phu-ui/src/pages/dashboard
git commit -m "feat: drive homepage entity sections from collections API"
```

### Task 5: Category section "Xem tất cả" link

**Files:**
- Modify: `trac-dia-thien-phu-ui/src/pages/dashboard/useHomepage.ts`, `trac-dia-thien-phu-ui/src/pages/dashboard/components/CategorySection.tsx`
- Test: `npm run build`, `npm run lint` (no runner configured) + manual checklist below
- Spec: `docs/specs/homepage.md` §7

**Interfaces:**
- Consumes: existing `byId` map in `useHomepage` (built from the single `listCategories()` call), `CategoryResponse.seoAlias`.
- Produces: `CategorySectionData` gains `categoryId: string` and `seoAlias: string | null`; `CategorySection` renders a `<Link>` instead of `href="#"`. `DashboardPage` needs no change (`{...section}` already forwards every field).

- [ ] **Step 1: Extend `CategorySectionData` and fill it in `useHomepage.ts`**

Add `categoryId: string` and `seoAlias: string | null` to the `CategorySectionData` interface. In the `CATEGORY_COLLECTION` loop, keep `if (!c.referenceId) continue`, look up `const cat = byId.get(c.referenceId)`, and push `{ id: c.id, categoryId: c.referenceId, seoAlias: cat?.seoAlias ?? null, title: c.name, brands, products: page.content }`. No new request; a failed `listCategories()` leaves `seoAlias` null and the fallback URL still works.

- [ ] **Step 2: Replace the placeholder anchor in `CategorySection.tsx`**

Import `Link` from `react-router` (same as `CategorySidebar.tsx`) and add `categoryId`/`seoAlias` to `CategorySectionProps`. Replace `<a href="#" className="ml-auto ...">Xem tất cả →</a>` with:

```tsx
<Link
  to={seoAlias ? `/danh-muc/${seoAlias}` : `/san-pham?categoryId=${encodeURIComponent(categoryId)}`}
  className="ml-auto text-[12px] text-brand font-medium whitespace-nowrap"
>
  Xem tất cả →
</Link>
```

- [ ] **Step 3: Run build to verify it passes**

Run: `npm run build` (workdir `trac-dia-thien-phu-ui`)
Expected: PASS (new fields are required in `CategorySectionData`, and `DashboardPage` passes them via spread, so no missing-prop error).

- [ ] **Step 4: Run lint to verify it passes**

Run: `npm run lint`
Expected: PASS, 0 errors.

- [ ] **Step 5: Manual checklist**

With the API running: click `Xem tất cả →` on a section whose category has a `seoAlias` → lands on `/danh-muc/<alias>`, heading shows the category name, sidebar shows that category selected; on a category with a null alias → lands on `/san-pham?categoryId=<id>` with the same products; stopping the API still leaves a working `categoryId` fallback link; section title (collection name) unchanged.

- [ ] **Step 6: Commit**

```bash
git add trac-dia-thien-phu-ui/src/pages/dashboard/useHomepage.ts trac-dia-thien-phu-ui/src/pages/dashboard/components/CategorySection.tsx trac-dia-thien-phu-ui/docs/specs/homepage.md trac-dia-thien-phu-ui/docs/plans/homepage.md
git commit -m "feat: link category section Xem tat ca to its category page"
```
