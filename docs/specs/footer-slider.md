# Partner Slider (above footer) — Design Spec

Source: user-supplied screenshot of a partner band (`ĐỐI TÁC` heading, row of partner logos,
dot indicator underneath) plus 8 logo files in `src/assets/footer_slider/`.
Target: a site-wide partner band rendered above the footer on every page.

## Goals

- New `src/components/layout/PartnerSlider.tsx`: white band (`bg-white py-8`), centered heading
  `ĐỐI TÁC` (`text-center text-base font-bold uppercase tracking-widest text-gray-700`), one row
  of 4 partner logos, dots below.
- Rendered in `SiteLayout.tsx` between `<main>` and `<Footer />`, so it appears on every route.
  No props; the layout keeps no state.
- Logos: the 8 bundled files under `src/assets/footer_slider/` (`CHCNAV.webp`, `FOIF.webp`,
  `GEOMAX.webp`, `Hi-Target.webp`, `Leica.webp`, `Meridian.webp`, `Nikon.webp`, `Sokkia.webp`)
  imported as a static array of `{ name, src }`, in that order. `alt` is the brand name
  (`CHCNAV`, `FOIF`, `GEOMAX`, `Hi-Target`, `Leica`, `Meridian`, `Nikon`, `Sokkia`).
- Logos are plain `<img>` (`h-10 md:h-12 w-auto object-contain`, `loading="lazy"`), matching the
  existing `Footer.tsx` logo usage — bundled assets cannot 404, so `Img`'s remote fallback is not
  needed. Logos are **not** clickable (no dead `#` anchors, and only Sokkia/Hi-Target exist as
  product brands in the API).
- Paging: `CHUNK = 4` logos per page, `grid grid-cols-2 md:grid-cols-4` inside
  `max-w-7xl mx-auto px-4 lg:px-8` → 2 pages of 4 on desktop, 2 per page on mobile. Pages advance
  over the sliced array, so the last page is never padded with holes.
- Autoplay every 5s (`setTimeout` re-armed when the active page changes, so a dot click restarts
  the countdown), skipped when there is a single page or when
  `prefers-reduced-motion: reduce` matches. Paused while the band is hovered or focused.
- Dots: one `<button>` per page with `aria-label="Đối tác {n}"` and `aria-current`, styled with
  `HeroSlider`'s active/inactive classes; rendered only when there is more than one page.
- Accessibility: `<section aria-roledescription="carousel" aria-label="Đối tác">`, each page is a
  `role="group"` `aria-roledescription="slide"` with `aria-label="{i} / {total}"`, inactive pages
  `hidden`, logo images `alt`-ed. No focusable elements beyond the dots.
- No top border on the band: the footer keeps its `border-t-[3px] border-brand` separator, so the
  two white bands don't merge into one.

## Non-goals

- No API/collection call — partner logos are static imports; no `CollectionType` added.
- No marquee/continuous scroll, no grayscale or hover-zoom effect, no link per logo.
- No change to `Footer.tsx` content, no new dependency, no new route or page.
- Not homepage-only: no per-page props or visibility flags.

## Verification

- `npm run build` passes; `npm run lint` passes.
- `npm run dev` — band sits above the footer on home, `/san-pham`, `/tin-tuc`, `/lien-he`,
  `/gioi-thieu`; desktop shows 4 logos per page over 2 pages and mobile 2 per page; dot click
  switches immediately; hovering pauses; with reduced motion enabled it stays on page 1.
