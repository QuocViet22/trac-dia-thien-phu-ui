# Introduction Page - Design Spec

Source: https://tracdia247.vn/gioi-thieu (static Vietnamese Gioi thieu article, 7 content sections, 3 inline photos).
Target: production-ready React page at /gioi-thieu inside the existing SiteLayout, served with react-router.

## Goals

- Serve /gioi-thieu via react-router: / renders DashboardPage, /gioi-thieu renders IntroductionPage.
- Replicate the live article verbatim in Vietnamese: breadcrumb, H1, 7 sections, contact block, closing line.
- Bundle the 3 article photos locally under src/assets/introduction/ via Vite imports.
- Follow dashboard patterns: Tailwind, shared Img wrapper with fallback, components under ~100 lines, typed data.ts.

## Non-goals

- No API, no store, no cart or search backend changes.
- No brand-partner carousel, no consult form, no footer duplication beyond the contact block.
- No FontAwesome to lucide swap in this step.

## Architecture

- App.tsx wraps routes in BrowserRouter: / to DashboardPage, /gioi-thieu to IntroductionPage, both inside SiteLayout.
- src/pages/introduction/: IntroductionPage.tsx plus data.ts; a components/ subfolder only if the page exceeds ~100 lines.
- src/assets/introduction/: slider-1.webp, cong-ty-trac-dia-ban-do.jpg, gioi-thieu-dich-vu.jpg.
- Spec file: docs/specs/introduction.md (this file); implementation plan follows after approval.

## Content

- Breadcrumb (Trang chu / Gioi thieu), H1 Gioi thieu, then sections 1 to 7 from the live page.
- Sections: tong quan, su menh and tam nhin, gia tri cot loi (5 items), san pham (5) and dich vu (3), khach hang and doi tac, cam ket (4 items), lien he (4 addresses, hotlines, website) plus ket luan line.
- Vietnamese copy stays 1:1 with the source; visible brand is Trac Dia Thien Phu, display domain tracdiathienphu.vn.

## Assets

- Images are static Vite imports, not hotlinks; Img onError falls back to placehold.co once.
- If a download fails at implementation time, keep the live hotlink temporarily and note it in the plan.

## Verification

- npm run build (includes tsc -b typecheck) passes.
- npm run lint passes.
- npm run dev visual check of / (unchanged) and /gioi-thieu against the live page, including responsive breakpoints.

