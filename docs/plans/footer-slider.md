# Partner Slider Implementation Plan

**Goal:** Add a site-wide `ĐỐI TÁC` partner band above the footer that pages through the 8 bundled logos with dots and autoplay.

**Architecture:** One new presentational component `src/components/layout/PartnerSlider.tsx` holding the static `partners` array, the paging state, and the autoplay timer (pattern copied from `src/pages/dashboard/components/HeroSlider.tsx`). `SiteLayout.tsx` renders it between `<main>` and `<Footer />` — no props, no state lifted.

**Tech Stack:** React 19 (`useState`, `useEffect`), Tailwind v4 (`grid-cols-2 md:grid-cols-4`, `hidden`), Vite static asset imports.

**Spec:** `docs/specs/footer-slider.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0).
- No test runner in this repo — verification is build + lint + visual check. Do not add a test framework.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- `verbatimModuleSyntax` — type-only imports use `import type`; `noUnusedLocals`/`noUnusedParameters` — no unused vars.
- `CHUNK = 4`; autoplay `5000` ms; heading text exactly `ĐỐI TÁC`; logo order exactly CHCNAV, FOIF, GEOMAX, Hi-Target, Leica, Meridian, Nikon, Sokkia.

## Review Focus

- A page change while a dot is mid-click: `active` derived from `current` must never point past the last page (`current < totalPages ? current : 0`), so paging stays in range.
- Reduced motion (`prefers-reduced-motion: reduce`): the band must not move on its own.
- Hover/focus on the band: autoplay stops, and leaving restarts the full 5s rather than advancing immediately.
- Mobile width: 2 logos per page, no horizontal overflow, dots reachable by tap.
- Failed/renamed asset import: build fails loudly (bundled import), so no silent empty band.

---

### Task 1: PartnerSlider component + layout placement

**Files:**
- Create: `src/components/layout/PartnerSlider.tsx`
- Modify: `src/components/layout/SiteLayout.tsx` (import + one `<PartnerSlider />` line between `<main>` and `<Footer />`)

**Interfaces:**
- Consumes: nothing from other tasks. `src/components/layout/Footer.tsx`'s plain-`<img>` logo usage is the styling precedent.
- Produces: `default export function PartnerSlider(): JSX.Element` — no props. `SiteLayout` is the only caller.

- [ ] **Step 1: Write `src/components/layout/PartnerSlider.tsx`**

Imports: the 8 webp files from `../assets/footer_slider/` (names above), plus `useEffect, useState` from `react`.

Module constants:

```tsx
const partners = [
  { name: 'CHCNAV', src: chcnav },
  // …FOIF, GEOMAX, Hi-Target, Leica, Meridian, Nikon, Sokkia
]

const CHUNK = 4
const AUTOPLAY_MS = 5000
const TOTAL_PAGES = Math.ceil(partners.length / CHUNK)

const ACTIVE_DOT = 'block w-2.5 h-2.5 bg-sky-500 rounded-sm shadow-[0_0_0_1px_white]'
const INACTIVE_DOT =
  'block w-2.5 h-2.5 bg-sky-600 rounded-sm opacity-50 group-hover:opacity-100 transition-opacity border border-white'
```

Component body:
1. `const [current, setCurrent] = useState(0)`, `const [paused, setPaused] = useState(false)`.
2. `const active = current < TOTAL_PAGES ? current : 0` (same guard as `HeroSlider`'s `active`).
3. `useEffect`: return early when `TOTAL_PAGES < 2 || paused` or
   `window.matchMedia('(prefers-reduced-motion: reduce)').matches`; otherwise `setTimeout(() => setCurrent((active + 1) % TOTAL_PAGES), AUTOPLAY_MS)` and clear it in the cleanup, deps `[paused, active]`.
4. JSX: `<section aria-roledescription="carousel" aria-label="Đối tác" className="bg-white py-8" onMouseEnter/onFocus={() => setPaused(true)} onMouseLeave/onBlur={() => setPaused(false)}>` containing
   - `<h2 className="text-center text-base font-bold uppercase tracking-widest text-gray-700 mb-6">ĐỐI TÁC</h2>`
   - `<div className="max-w-7xl mx-auto px-4 lg:px-8">` wrapping `partners.map((partner, i) => …)` sliced per page: render every chunk as
     `<div key={page} role="group" aria-roledescription="slide" aria-label={`${page + 1} / ${TOTAL_PAGES}`} className={`grid grid-cols-2 md:grid-cols-4 gap-6 items-center ${page === active ? '' : 'hidden'}`}>` and inside it each logo as
     `<img src={partner.src} alt={partner.name} loading="lazy" className="h-10 md:h-12 w-auto object-contain mx-auto" />` (plain `<img>`, matching `Footer.tsx` — no `Img` fallback for bundled assets). Use `partners.slice(page * CHUNK, page * CHUNK + CHUNK)` with the chunk index as `key` on the inner `<img>` (partner name is also fine).
   - dots rendered only when `TOTAL_PAGES > 1`, copied from `HeroSlider`: `<div className="flex justify-center mt-6">` with one `<button type="button" aria-label={`Đối tác ${i + 1}`} aria-current={i === active ? 'true' : undefined} onClick={() => setCurrent(i)} className="group p-1.5 cursor-pointer">` per page wrapping `<span className={i === active ? ACTIVE_DOT : INACTIVE_DOT} />`.

`export default PartnerSlider`.

- [ ] **Step 2: Render it in `src/components/layout/SiteLayout.tsx`**

Add `import PartnerSlider from './PartnerSlider.tsx'` (keep imports alphabetical: FloatingButtons, Footer, Header, MainNav, PartnerSlider) and insert `<PartnerSlider />` on its own line between `<main className="flex-1">{children}</main>` and `<Footer />`.

- [ ] **Step 3: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

Then `npm run dev` and check, comparing against the screenshot:
- Band appears above the footer on `/`, `/san-pham`, `/tin-tuc`, `/lien-he`, `/gioi-thieu`; heading `ĐỐI TÁC` centered; footer's blue top border still separates the two white bands.
- Desktop: 4 logos in one row, 2 dots; page 2 shows the remaining 4 logos (Leica, Meridian, Nikon, Sokkia) with no empty cells; clicking dot 2 switches immediately and leaves it there for a full 5s.
- Mobile width (~375px): 2 logos per row, 4 dots, no horizontal scrollbar.
- Hovering the band stops the rotation; moving the mouse away resumes after 5s.
- With OS reduced-motion enabled, no auto-advance.

- [ ] **Step 4: Commit**

```powershell
git add src/components/layout/PartnerSlider.tsx src/components/layout/SiteLayout.tsx
git commit -m "feat: partner logo slider above the footer"
```
