# Footer Implementation Plan

**Goal:** Replace placeholder dark footer with light 4-column themed footer per screenshot content.

**Architecture:** One-file rewrite of `src/components/layout/Footer.tsx`; static JSX + typed link arrays, no state, no new components.

**Tech Stack:** React 19, Tailwind v4 (`border-brand`, `bg-brand`), FontAwesome CDN icons, `logo.jpg` Vite import.

**Spec:** `docs/specs/footer.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0).
- No test runner — verification is build + lint + visual check.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- `verbatimModuleSyntax`, `noUnusedLocals/Parameters` — type-only imports, no unused vars.

---

### Task 1: Rewrite Footer.tsx

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Company column — logo import, name, MST, tel: hotlines, 4 addresses with location icon.**
- [ ] **Step 2: Link columns — `aboutLinks` (7) + `infoLinks` (5) string arrays mapped to `href="#"` anchors.**
- [ ] **Step 3: Social column — payment label, FB/TikTok external circle buttons (`target="_blank" rel="noreferrer"`, `aria-label`).**
- [ ] **Step 4: Bottom bar — `bg-brand text-white` copyright line.**
- [ ] **Step 5: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` — footer matches screenshot content at desktop + mobile, headings uppercase bold, links hover brand, social opens new tab.
### Task 2: Sticky footer (viewport bottom on short pages)

**Files:**
- Modify: `src/components/layout/SiteLayout.tsx` (flex column + growing main)
- Modify: `src/components/layout/Footer.tsx` (drop `mt-8`)

- [ ] **Step 1: Wrapper `min-h-screen flex flex-col`, `<main className="flex-1">`.**
- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` — short page shows footer at viewport bottom, long page scrolls normally.
