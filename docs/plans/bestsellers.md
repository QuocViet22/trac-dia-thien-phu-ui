# BestSellers Implementation Plan

**Goal:** Restyle `BestSellers` to blue carousel box like reference image, keep `Lien he`.

**Architecture:** `BestSellers.tsx` owns blue wrapper + scroll carousel + dots state; `ProductCard.tsx` gains ribbon badge + stars (shared with `CategorySection`).

**Tech Stack:** React 19, Tailwind v4 (`bg-brand`), scroll-snap, `useRef` + `useState`, existing `Img` wrapper.

**Spec:** `docs/specs/bestsellers.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0).
- Type imports use `import type`; no enums/namespaces; no unused vars.
- No test runner — verification is build + lint + visual check.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.

---

### Task 1: Ribbon badge + stars on ProductCard

**Files:**
- Modify: `src/pages/dashboard/components/ProductCard.tsx`

- [ ] **Step 1: Restyle `Moi`/`Hot` badge to ribbon (absolute top-left, green for `Moi`, red for `Hot`, `clip-path` slant) and add static grey `*****` stars row under price line. Keep `Lien he` text.**
- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

### Task 2: Blue carousel box in BestSellers

**Files:**
- Modify: `src/pages/dashboard/components/BestSellers.tsx`

- [ ] **Step 1: Replace section/grid with `bg-brand rounded-xl p-4` wrapper, white centered title inside, `overflow-x-auto snap-x` flex row (`basis-1/2 md:basis-1/3 lg:basis-1/5`), `useRef` + `useState` active page, dot buttons calling `scrollTo`.**
- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` visual vs reference (blue box, 5-up on desktop, dots work, mobile 2-up).

### Task 3: Autoplay with pause on hover/touch

**Files:**
- Modify: `src/pages/dashboard/components/BestSellers.tsx`

- [ ] **Step 1: Add `paused` state (section `onMouseEnter`/`onMouseLeave` + `onTouchStart`/`onTouchEnd`) and a 5s `setInterval` effect (HeroSlider pattern) advancing `goTo((page + 1) % pages)` when not paused, with cleanup.**
- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` — carousel advances every 5s, pauses on hover/touch, dots still jump.
