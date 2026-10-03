# Dashboard Page — Design Spec

Source: `src/pages/dashboard/dashboard.html` (378 lines, static Vietnamese iGeo store homepage).
Target: production-ready React homepage + shared site layout. No routing in this step.

## Goals

- Render the dashboard as the app main page (`App.tsx` → dashboard).
- Extract reusable `SiteLayout` (header, nav, footer, floating buttons) for future pages
  (`contact/`, `customer/`, `introduction/`, `news/`, `product/`, `product-hiring/` are empty stubs).
- Proper Tailwind install (remove Tailwind CDN script); keep visual fidelity 1:1.
- Convert the inline `<script>` (hero slider + sidebar toggle) to React hooks.

## Non-goals

- No routing (`react-router` deferred until a second page lands).
- No API, no global store, no cart/search backend (search input is local state, cart badge defaults to 0).
- No FontAwesome → lucide swap in this step (keep FA CDN link in `index.html`).

## Architecture

- `App.tsx` renders `SiteLayout` wrapping `DashboardPage`.
- `src/components/layout/`: `SiteLayout.tsx`, `Header.tsx`, `MainNav.tsx`, `Footer.tsx`,
  `FloatingButtons.tsx`.
- `src/pages/dashboard/`: `DashboardPage.tsx`, `data.ts`, `components/`:
  `CategorySidebar.tsx`, `HeroSlider.tsx`, `PromoCards.tsx`, `FeaturedCategories.tsx`,
  `ProductCard.tsx`, `CategorySection.tsx`, `ServiceBanners.tsx`, `NewsSection.tsx`.
- Each component ≤ ~100 lines, props-only, no data fetching.

## Styling

- Install `tailwindcss` + `@tailwindcss/vite`, register the Vite plugin, remove the
  `cdn.tailwindcss.com` script and the inline `<style>` block.
- Port the 3 custom bits into CSS/theme: brand color `#f37021`, `.sidebar-scroll`
  scrollbar styling, `Inter` font family.
- `index.html` keeps the Google Fonts + FontAwesome `<link>` tags only.

## Data

- `src/pages/dashboard/data.ts` exports typed arrays mirroring the HTML verbatim:
  `categories` (12 rows), `slides` (3), `promoCards` (3), `featuredCats` (6),
  `bestSellers` (10), `categorySections` (GNSS RTK / total-station+GPS / level, 5 each),
  `serviceBanners` (3), `news` (3).
- Images stay hotlinked to `igeostore.vn` with `placehold.co` fallback via a small shared
  `Img` wrapper (`onError` swaps to fallback once).

## Interactivity

- `HeroSlider`: `useState` index + `useEffect` 5s autoplay, dot buttons, index wraps
  modulo slide count.
- `MainNav` ↔ sidebar: `onToggleCategories` flips a boolean controlling
  `CategorySidebar` visibility (desktop default visible, per HTML `hidden lg:block`).

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes.
- `npm run dev` visual check against `dashboard.html` (layout, slider, sidebar toggle,
  responsive breakpoints).
