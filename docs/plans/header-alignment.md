# Header Alignment Implementation Plan

**Goal:** Align top-bar edges with nav + page sections by moving container padding inside.

**Architecture:** One-file class change in `Header.tsx`; no logic, no new components.

**Tech Stack:** React 19, Tailwind v4 (`max-w-7xl mx-auto px-4 lg:px-8`).

**Spec:** `docs/specs/header-alignment.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0).
- No test runner — verification is build + lint + visual check.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.

---

### Task 1: Move padding inside header container

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Outer `<header>` drops `px-4 lg:px-8` (keeps `bg-white py-3 border-b border-gray-100`); inner div becomes `max-w-7xl mx-auto px-4 lg:px-8 flex flex-wrap items-center justify-between gap-4`.**
- [ ] **Step 2: Verify**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev` — header/nav/section edges aligned at mobile, desktop, extra-wide.
