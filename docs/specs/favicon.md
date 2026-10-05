# Favicon — Design Spec

Source: `src/assets/logo.jpg` (circular TP logo with "TRAC DIA THIEN PHU" text).
Target: use full logo as-is for the browser tab icon, replacing stock `public/favicon.svg`.

## Goals

- Copy `src/assets/logo.jpg` → `public/favicon.jpg` (public/ served as-is).
- Update `index.html`: `<link rel="icon" type="image/jpeg" href="/favicon.jpg" />` + apple-touch-icon to same file.
- Delete `public/favicon.svg` to avoid two icons.

## Non-goals

- No PNG/ICO multi-size conversion, no `site.webmanifest`.
- No crop/resize of logo text for small-size readability (accepted as-is per review).
- No title change in this spec (title now "Trắc Địa Thiên Phú", updated during dashboard rebrand).

## Verification

- `npm run build` passes.
- `npm run dev` visual check: tab shows TP logo.
