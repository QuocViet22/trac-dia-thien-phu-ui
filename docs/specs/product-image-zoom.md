# Product Image Hover Zoom — Design Spec

Source: `src/pages/dashboard/components/ProductCard.tsx` (grid card, root already `group` + `overflow-hidden`, image via shared `Img`), `src/pages/product/components/ProductGallery.tsx` (detail main image + thumbnails via shared `Img`).
Target: product images gently scale up when hovered, clipped inside their frame, on every product card and the detail-page main image.

## Goals

- `ProductCard` image zooms on card hover (home BestSellers/sections, `/san-pham` grid) via `group-hover:scale-110` with a `transition-transform duration-300`; already-clipped by the card's `overflow-hidden`, no layout shift (transform-only).
- `ProductGallery` main image zooms on hover the same way; its wrapper gains `overflow-hidden` + `group` to clip the scaled image.
- `motion-safe:` prefix on the zoom so reduced-motion users get no animation; touch devices never trigger hover (no-op, no harm).

## Non-goals

- No thumbnail zoom in the gallery (small buttons; zoom would look noisy).
- No click-to-lightbox, no JS-driven magnifier lens, no new dependencies.
- No change to banner/category/news images (product images only).

## Architecture

- `ProductCard.tsx`: append zoom classes to the existing `Img className` (`w-full h-40 object-contain transition-transform duration-300 motion-safe:group-hover:scale-110`). No structural change — root `Link` already carries `group` + `overflow-hidden`.
- `ProductGallery.tsx`: main-image wrapper `div.relative` becomes `div.relative overflow-hidden group rounded-lg`; main `Img` gains the same zoom classes. Thumbnail buttons untouched.

## Content

- No copy or asset changes; pure Tailwind classes.

## Verification

- `npm run build` passes.
- `npm run lint` passes.
- `npm run dev` hover check: home grid, `/san-pham` grid, and a product detail page — image scales ~110% inside its frame and snaps back on leave; thumbnails don't zoom.
