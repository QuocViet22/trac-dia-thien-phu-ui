# Product Image Hover Zoom Implementation Plan

**Goal:** Product images scale to ~110% inside their frame on hover, on every product card and the detail-page main image.

**Architecture:** Pure Tailwind classes, no JS. `ProductCard` root already has `group` + `overflow-hidden`, so its image only needs zoom classes; `ProductGallery` main wrapper gains `group` + `overflow-hidden` for the same effect.

**Tech Stack:** React 19, Tailwind (`transition-transform duration-300 motion-safe:group-hover:scale-110`).

**Spec:** `docs/specs/product-image-zoom.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0).
- No test runner — verification is build + lint + visual check.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.

---

### Task 1: Zoom on ProductCard image

**Files:**
- Modify: `src/pages/dashboard/components/ProductCard.tsx`

- [ ] **Step 1: Add zoom classes to the card image.**

Change the `Img` className from `w-full h-40 object-contain` to `w-full h-40 object-contain transition-transform duration-300 motion-safe:group-hover:scale-110`. No other change (root `Link` already has `group` + `overflow-hidden` + `product-card`).

- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` — hover any product card on `/` or `/san-pham` → image scales inside the card, snaps back on leave.

### Task 2: Zoom on detail gallery main image

**Files:**
- Modify: `src/pages/product/components/ProductGallery.tsx`

- [ ] **Step 1: Clip wrapper + zoom classes on main image.**

Change the main-image wrapper from `<div className="relative">` to `<div className="relative overflow-hidden group rounded-lg">`, and the main `Img` className from `w-full h-80 object-contain` to `w-full h-80 object-contain transition-transform duration-300 motion-safe:group-hover:scale-110`. Thumbnail buttons untouched.

- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` — open any `/san-pham/:slug` page → main image zooms on hover, thumbnails don't.
