# Partner Slider (above footer) — Design Spec

Source: user-supplied screenshot of a partner band (`ĐỐI TÁC` heading, row of partner logos,
dot indicator underneath) plus 8 logo files in `src/assets/footer_slider/`.
Target: a site-wide partner band rendered above the footer on every page.

## Goals

- New `src/components/layout/PartnerSlider.tsx`: white band (`bg-white py-8`), centered heading
  `ĐỐI TÁC` (`text-center text-base font-bold uppercase tracking-widest text-gray-700`), the
  partner logos in one row, dots below.
- Rendered in `SiteLayout.tsx` between `<main>` and `<Footer />`, so it appears on every route.
  No props; the layout keeps no state.
- Logos: the files bundled under `src/assets/footer_slider/` — currently 5
  (`Sokkia.jpg`, `Hi-Target.jpg`, `Precise.png`, `Garmin.jpg`, `Cem.png`) imported as a static
  array of `{ name, src }` in the source screenshot's order: Sokkia, Hi-Target, Precise, Garmin,
  CEM. `alt` is the brand name. (An earlier revision bundled 8 different `.webp` files; the user
  replaced the folder with the 5 logos from the screenshot during implementation, and those 8
  were removed from the tree.)
- Logos are plain `<img>` (`h-10 md:h-12 w-auto max-w-full object-contain`, `loading="lazy"`),
  matching the existing `Footer.tsx` logo usage — bundled assets cannot 404, so `Img`'s remote
  fallback is not needed. Logos are **not** clickable (no dead `#` anchors, and not every partner
  is a product brand in the API).
- Paging: `CHUNK = 5` logos per page, `grid grid-cols-2 md:grid-cols-5` inside
  `max-w-7xl mx-auto px-4 lg:px-8` → one full row of 5 on desktop, 2 per row on mobile. Pages
  advance over the sliced array, so a page is never padded with holes.
- With 5 logos there is a single page, so the band is effectively static: the dots, the autoplay
  timer and the pause control only render when a further logo makes `TOTAL_PAGES > 1`. Paging,
  autoplay (5s, `setTimeout` re-armed when the active page changes so a dot click restarts the
  countdown) and reduced-motion handling are already in place for that case.
- Pause control: a small play/pause `<button>` sits after the dots
  (`aria-label="Tạm dừng logo đối tác"` / `"Chạy tiếp logo đối tác"`, `aria-pressed`) so keyboard
  and assistive-technology users can stop the rotation (WCAG 2.2.2, level A); hovering or
  focusing the band pauses it too. Hover/focus state is separate from the user's stop toggle, so
  moving the mouse away cannot un-stop it.
- Dots: one `<button>` per page with `aria-label="Đối tác {n}"` and `aria-current`, styled with
  `HeroSlider`'s active/inactive classes.
- Accessibility: `<section aria-roledescription="carousel" aria-label="Đối tác">`, each page is a
  `role="group"` `aria-roledescription="slide"` with `aria-label="{i} / {total}"`, inactive pages
  `hidden`, logo images `alt`-ed. `focus-visible:outline-brand` (not `HeroSlider`'s
  `outline-white`, which would be invisible on the white band).
- No top border on the band: the footer keeps its `border-t-[3px] border-brand` separator, so the
  two white bands don't merge into one.

## Non-goals

- No API/collection call — partner logos are static imports; no `CollectionType` added.
- No marquee/continuous scroll, no grayscale or hover-zoom effect, no link per logo.
- No change to `Footer.tsx` content, no new dependency, no new route or page.
- Not homepage-only: no per-page props or visibility flags.

## Verification

- `npm run build` passes; `npm run lint` passes. Each logo is emitted as its own asset file
  (all 5 exceed Vite's 4KB inline limit), so `loading="lazy"` is meaningful.
- `npm run dev` — band sits above the footer on home, `/san-pham`, `/tin-tuc`, `/lien-he`,
  `/gioi-thieu`; desktop shows the 5 logos in one row and mobile 2 per row with no horizontal
  scrollbar; no dots are rendered while there are only 5 logos; hovering pauses the band when
  paging is active; with reduced motion enabled it stays on page 1.
- A 6th logo file plus its entry in `partners` must show dots, a pause button and 5s rotation
  without further code changes.

## Known limits (accepted at review)

- The autoplay timer arms at mount, so on a page where the band starts below the fold the first
  view can be page 2 — no `IntersectionObserver` gating. Same as `HeroSlider`; the pause control
  covers WCAG 2.2.2.
- Dot tap targets are 22×22px, under WCAG 2.5.8 AA's 24px minimum (`p-1.5` + 10px dot).
- Clicking the dot of the page already shown does not restart the countdown; it resumes from the
  running timer. Same as `HeroSlider`.
- `prefers-reduced-motion` is sampled when the effect runs, not subscribed to changes.
- Auto-advance is not announced (`aria-live`), so a screen-reader user reaches later pages via
  the dots rather than being told about them.
