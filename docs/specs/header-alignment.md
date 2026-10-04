# Header Alignment — Design Spec

Source: `src/components/layout/Header.tsx` (padding on outer `<header>`), vs `MainNav.tsx` and `DashboardPage.tsx` (padding inside `max-w-7xl` container).
Target: top bar left/right edges line up with nav + page sections at every breakpoint.

## Goals

- Move `px-4 lg:px-8` from outer `<header>` to inner `max-w-7xl mx-auto` div, matching the `MainNav` / page-section container pattern.
- No visual change below 1280px viewport; above 1280px header content insets 32px per side like everything else.

## Non-goals

- No `MainNav`, sidebar, or page-section changes (their containers already match).
- No max-width change (stays `max-w-7xl`), no vertical spacing change.

## Verification

- `npm run build` passes.
- `npm run lint` passes.
- `npm run dev` visual check at mobile, desktop, and extra-wide (>1400px) widths: header, nav, and section edges aligned.
