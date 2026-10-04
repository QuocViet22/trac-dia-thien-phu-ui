# Favicon Implementation Plan

**Goal:** Use `src/assets/logo.jpg` as the browser tab icon.

**Architecture:** Static file in `public/` + one `index.html` link change. No code, no bundling.

**Tech Stack:** Vite 8 static public dir, JPEG favicon.

**Spec:** `docs/specs/favicon.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- No test runner — verification is build + visual tab check.

---

### Task 1: Swap favicon to logo.jpg

**Files:**
- Create: `public/favicon.jpg` (copy of `src/assets/logo.jpg`)
- Modify: `index.html`
- Delete: `public/favicon.svg`

- [ ] **Step 1: Copy logo to public**

Run copy of `src/assets/logo.jpg` to `public/favicon.jpg` (binary copy, keep original).

- [ ] **Step 2: Update `index.html` — replace `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` with `<link rel="icon" type="image/jpeg" href="/favicon.jpg" />` and add `<link rel="apple-touch-icon" href="/favicon.jpg" />`.**

- [ ] **Step 3: Delete `public/favicon.svg`.**

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: exit 0. Then `npm run dev` — tab shows TP logo.
