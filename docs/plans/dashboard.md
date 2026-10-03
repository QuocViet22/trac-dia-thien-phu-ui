# Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port `src/pages/dashboard/dashboard.html` to a production-ready React homepage with shared site layout.

**Architecture:** `App.tsx` renders `SiteLayout` wrapping `DashboardPage`; layout components live in `src/components/layout/`, dashboard sections + `data.ts` in `src/pages/dashboard/`. Static typed data, local UI state only.

**Tech Stack:** React 19, Vite 8, TypeScript (~6.0.2, project references + `verbatimModuleSyntax` + `erasableSyntaxOnly` + `noUnusedLocals/Parameters`), Tailwind CSS v4 (`tailwindcss` + `@tailwindcss/vite`), FontAwesome via CDN link (kept).

**Spec:** `docs/specs/dashboard.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) IS the typecheck — it must pass; no separate typecheck script exists.
- `npm run lint` (`eslint .`, flat config, only `**/*.{ts,tsx}`) must pass (exit 0).
- Type imports must use `import type` (`verbatimModuleSyntax`); no enums/namespaces/parameter properties (`erasableSyntaxOnly`); no unused vars (`noUnusedLocals/Parameters`).
- No test runner in repo — verification per task is build + lint (+ visual check where noted). Do not invent a test command.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&` (inside npm scripts `&&` is fine — that's npm, not the shell).
- Keep `igeostore.vn` image URLs and `placehold.co` fallbacks verbatim from the HTML.

## Review Focus

- Remote `igeostore.vn` image dead → `Img` must swap to `placehold.co` fallback exactly once (no error loop) — pinned in Task 3.
- Hero slider autoplay `setInterval` must clean up on unmount and wrap index modulo slide count — pinned in Task 5.
- Sidebar default state must match HTML (`hidden` on mobile, `lg:block` on desktop) — pinned in Task 5.
- Tailwind v4 (not CDN) must render arbitrary values from the HTML (`bg-[#f37021]`, `text-[13px]`, `h-[300px]`) identically — pinned in Task 1 visual check.
- Empty-string/whitespace search submit must not break `Header` (stays local no-op state) — pinned in Task 4.

---

### Task 1: Tailwind v4 setup + base styles

**Files:**
- Modify: `package.json` (deps via install command), `vite.config.ts`, `src/index.css`, `index.html`

**Interfaces:**
- Consumes: nothing
- Produces: Tailwind utilities available app-wide; `index.css` exports theme tokens (brand `#f37021`, `Inter` font, sidebar scrollbar); `index.html` provides fonts + FA + title `iGeo System`

- [ ] **Step 1: Install Tailwind**

Run: `npm install tailwindcss @tailwindcss/vite`
Expected: both packages appear in `package.json` dependencies.

- [ ] **Step 2: Register the Vite plugin in `vite.config.ts`**

```ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [react(), tailwindcss()] })
```

- [ ] **Step 3: Rewrite `src/index.css` — replace template styles with `@import "tailwindcss";` plus the 3 ported bits: brand `#f37021` theme token, `Inter` font-family on `body`, `.sidebar-scroll` scrollbar rules (copied verbatim from the HTML `<style>` block).**

- [ ] **Step 4: Update `index.html` — set `lang="vi"`, title `iGeo System`, add Google Fonts (`Inter`) + FontAwesome 6.4.0 `<link>` tags (URLs verbatim from the HTML).**

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vite.config.ts src/index.css index.html
git commit -m "feat: set up Tailwind v4 and base styles"
```

### Task 2: Dashboard data file

**Files:**
- Create: `src/pages/dashboard/data.ts`

**Interfaces:**
- Consumes: nothing
- Produces: exported typed arrays — `categories` (12 `{icon, label}`), `slides` (3 `{image, alt}`), `promoCards`, `featuredCats` (6 `{image, label}`), `bestSellers` (10 `{brand, name, price, image, badge?}`), `categorySections` (3 `{id, title, brands[], banners[3], products[5]}`), `serviceBanners` (3 image URLs), `news` (3 `{image, date, title}`) — all values verbatim from the HTML

- [ ] **Step 1: Create `src/pages/dashboard/data.ts` with the types + arrays above, values copied verbatim from `dashboard.html` (product names, prices with `₫`, image URLs).**

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: exit 0 (types check; unused exports are fine — `noUnusedLocals` only flags locals, but keep every export consumed by Task 6–8 components).

- [ ] **Step 3: Commit**

```bash
git add src/pages/dashboard/data.ts
git commit -m "feat: add dashboard content data"
```

### Task 3: Shared `Img` wrapper

**Files:**
- Create: `src/components/Img.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `Img({ src, fallback, alt, className, loading }: { src: string; fallback: string; alt: string; className?: string; loading?: "lazy" | "eager" })` — renders `<img>`, on error swaps to `fallback` exactly once (guard flag so a dead fallback can't loop)

- [ ] **Step 1: Implement `Img` per the signature above.**

- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/Img.tsx
git commit -m "feat: add Img with fallback"
```

### Task 4: Site layout (Header, MainNav, Footer, FloatingButtons)

**Files:**
- Create: `src/components/layout/SiteLayout.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/MainNav.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/FloatingButtons.tsx`

**Interfaces:**
- Consumes: `Img` (Task 3) for the VN flag image
- Produces: `SiteLayout({ children, onToggleSidebar }: { children: React.ReactNode; onToggleSidebar: () => void })` — renders `Header`, `MainNav` (forwarding `onToggleSidebar`), `<main>{children}</main>`, `Footer`, `FloatingButtons`

- [ ] **Step 1: Implement `Header` (logo block, search input with local `useState`, phone link `tel:0972819598`, account icon, VI language, cart badge prop default `0`) — markup/classes verbatim from the HTML `<header>`.**

- [ ] **Step 2: Implement `MainNav({ onToggleSidebar }: { onToggleSidebar: () => void })` — orange `TẤT CẢ SẢN PHẨM` toggle button + 6 nav links verbatim.**

- [ ] **Step 3: Implement `Footer`, `FloatingButtons` (tel + chat links), and `SiteLayout` per the signature above.**

- [ ] **Step 4: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add site layout components"
```

### Task 5: Sidebar + hero slider (the two interactive pieces)

**Files:**
- Create: `src/pages/dashboard/components/CategorySidebar.tsx`, `src/pages/dashboard/components/HeroSlider.tsx`

**Interfaces:**
- Consumes: `categories` / `slides` from `data.ts` (Task 2), `Img` (Task 3)
- Produces: `CategorySidebar({ open }: { open: boolean })` (visible when `open`; desktop default `true`); `HeroSlider({ slides }: { slides: Slide[] })` (autoplay 5s with cleanup, dot navigation, index wraps modulo length)

- [ ] **Step 1: Implement `CategorySidebar` — 12 rows verbatim (icon + label + caret), `hidden` on mobile / `lg:block` on desktop preserved, `open` prop controls visibility.**

- [ ] **Step 2: Implement `HeroSlider` — slide 1 gradient promo markup verbatim, slides 2–3 images, dots with `aria-label`/`data-slide`, `useEffect` interval with cleanup.**

- [ ] **Step 3: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/pages/dashboard/components/CategorySidebar.tsx src/pages/dashboard/components/HeroSlider.tsx
git commit -m "feat: add sidebar and hero slider"
```

### Task 6: ProductCard + promo/featured sections

**Files:**
- Create: `src/pages/dashboard/components/ProductCard.tsx`, `src/pages/dashboard/components/PromoCards.tsx`, `src/pages/dashboard/components/FeaturedCategories.tsx`

**Interfaces:**
- Consumes: `bestSellers`, `featuredCats` from `data.ts` (Task 2), `Img` (Task 3)
- Produces: `ProductCard({ brand, name, price, image, badge }: Product)` (`badge?: "Mới" | "Hot"` with green/red styling verbatim); `PromoCards()`, `FeaturedCategories()` render their data arrays

- [ ] **Step 1: Implement `ProductCard` — badge, image, brand, 2-line clamped name, orange price — classes verbatim from the HTML `.product-card`.**

- [ ] **Step 2: Implement `PromoCards` (3 cards verbatim) and `FeaturedCategories` (6 tiles mapping `featuredCats`).**

- [ ] **Step 3: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/pages/dashboard/components/ProductCard.tsx src/pages/dashboard/components/PromoCards.tsx src/pages/dashboard/components/FeaturedCategories.tsx
git commit -m "feat: add product card and promo sections"
```

### Task 7: CategorySection + ServiceBanners + NewsSection

**Files:**
- Create: `src/pages/dashboard/components/CategorySection.tsx`, `src/pages/dashboard/components/ServiceBanners.tsx`, `src/pages/dashboard/components/NewsSection.tsx`

**Interfaces:**
- Consumes: `ProductCard` (Task 6), `categorySections`, `serviceBanners`, `news` from `data.ts` (Task 2), `Img` (Task 3)
- Produces: `CategorySection({ title, brands, banners, products }: CategorySectionData)` (header row + 3 banner images + product grid via `ProductCard`); `ServiceBanners()`; `NewsSection()`

- [ ] **Step 1: Implement `CategorySection` — orange-bordered header with brand tags + "Xem tất cả →", banner row, product grid.**

- [ ] **Step 2: Implement `ServiceBanners` (3 images) and `NewsSection` (3 cards with date + title) verbatim.**

- [ ] **Step 3: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/pages/dashboard/components/CategorySection.tsx src/pages/dashboard/components/ServiceBanners.tsx src/pages/dashboard/components/NewsSection.tsx
git commit -m "feat: add category, banner and news sections"
```

### Task 8: Page composition + App wiring + cleanup

**Files:**
- Create: `src/pages/dashboard/DashboardPage.tsx`
- Modify: `src/App.tsx`, `src/main.tsx` (only if template CSS imports need removing)
- Delete: `src/pages/dashboard/dashboard.html`, `src/App.css` (if unreferenced after rewrite)

**Interfaces:**
- Consumes: everything from Tasks 2–7; `SiteLayout`, `MainNav` (Task 4)
- Produces: `DashboardPage({ sidebarOpen }: { sidebarOpen: boolean })` — passes it to `CategorySidebar`, composes sidebar + slider + all sections in HTML order. `App()` owns `sidebarOpen` state (default `true`) and renders `<SiteLayout onToggleSidebar={...}><DashboardPage sidebarOpen={...} /></SiteLayout>`

- [ ] **Step 1: Implement `DashboardPage` composing all sections in the HTML's order, taking `sidebarOpen` as a prop.**

- [ ] **Step 2: Rewrite `App.tsx` to own `sidebarOpen` state and render the layout + page; remove template demo content.**

- [ ] **Step 3: Delete `dashboard.html` and any CSS files left unreferenced.**

- [ ] **Step 4: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then run `npm run dev` and visually compare against `dashboard.html` (git show it if deleted): header, slider autoplay, sidebar toggle, all sections, mobile + desktop widths.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: dashboard homepage in React"
```
