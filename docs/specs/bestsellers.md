# BestSellers — Design Spec

Source: `src/pages/dashboard/components/BestSellers.tsx` (grid + `ProductCard`), reference image (orange box, 5 white cards, green MOI ribbon, price, grey stars, carousel dots).
Target: same layout adapted — blue box, carousel, keep `Lien he`, single title.

## Goals

- Blue `bg-brand (#22abff) rounded-xl` wrapper with single centered white uppercase title `SAN PHAM BAN CHAY` inside.
- Horizontal carousel: native `overflow-x-auto snap-x`, ~5 cards visible on lg, 2 on mobile, dot buttons scroll to page. Autoplay advances one page every 5s (same as HeroSlider), wraps to first page, pauses on hover/touch.
- `ProductCard`: green ribbon `Moi` badge (clip-path, top-left), static grey `*****` stars row, keep `Lien he` red/brand text, no price field.
- Shared `ProductCard` change applies to `CategorySection` too (consistency over fork).

## Non-goals

- No price/rating fields in `data.ts` (keeps `Product { brand, name, image, badge }`).
- No carousel library (manual scroll + dots only).
- No orange color, no outer black title, no `site.webmanifest` changes.

## Verification

- `npm run build` passes.
- `npm run lint` passes.
- `npm run dev` visual check vs reference image (blue box, ribbon, stars, dots, responsive).
