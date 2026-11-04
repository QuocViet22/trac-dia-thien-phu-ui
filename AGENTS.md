# AGENTS.md — trac-dia-thien-phu-ui

React 19 SPA for Trắc Địa Thiên Phú (surveying equipment shop): Vite 8 + TypeScript, `react-router` 8, Tailwind CSS v4, backed by a Spring REST API. No test runner, no CI.

## Commands (verified)

- `npm run dev` — Vite dev server with HMR
- `npm run build` — `tsc -b && vite build`; this IS the typecheck, there is no separate typecheck script
- `npm run build:prod` — same command; a production build throws if `VITE_TURNSTILE_SITE_KEY` is unset (`vite.config.ts`)
- `npm run lint` — `eslint .` (exit 0 on clean tree)
- `npm run preview` — serve `dist/` after build

No tests configured — do not invent a test command. No formatter script.

## Project structure

```
index.html               Vite entry: /src/main.tsx, favicon, Turnstile script, Font Awesome + Inter CDN
src/main.tsx             React root (StrictMode)
src/App.tsx              BrowserRouter, ScrollToTop, every route
src/components/layout/   Shared chrome: Header, MainNav, PartnerSlider, Footer, FloatingButtons, SiteLayout
src/components/          ContentArticle, Img (falls back on error), TurnstileWidget
src/pages/<feature>/     One folder per page; page-local parts in <feature>/components/
src/lib/api.ts           Typed API client, DTOs, ApiError, API_BASE
src/lib/sanitize.ts      sanitizeHtml() for backend HTML
src/hooks/               Shared hooks (useSidebarCategories)
src/assets/              Imported images (logo, introduction, footer_slider, floating_icon)
src/index.css            Tailwind import, @theme tokens, custom scrollbar
public/                  Served as-is (favicon.jpg, icons.svg)
docs/specs/, docs/plans/ Feature specs and implementation plans
```

Every route lives in `src/App.tsx`; there is no per-feature router.

| Path | Page |
| --- | --- |
| `/` | `pages/dashboard/DashboardPage` |
| `/gioi-thieu` | `pages/introduction/IntroductionPage` |
| `/san-pham`, `/danh-muc/:alias` | `pages/product/ProductPage` |
| `/san-pham/:slug` | `pages/product/ProductDetailPage` |
| `/tin-tuc`, `/thue-san-pham`, `/sua-chua-va-kiem-dinh` | `pages/news/NewsPage`, selected by `newsType` |
| the same paths + `/:slug` | `pages/news/NewsDetailPage` |
| `/khach-hang` | `pages/customer/CustomerList` |
| `/khach-hang/:slug` | `NewsDetailPage` with `newsType="CUSTOMER_NEWS"` |
| `/lien-he` | `pages/contact/ContactPage` |
| `/chinh-sach-bao-mat` | `pages/privacy_policy/PrivacyPolicy` |
| `/dieu-khoan-su-dung` | `pages/terms_of_use/TermsOfUse` |
| `/huong-dan-mua-hang` | `pages/purchase_guide/PurchaseGuide` |
| `*` | redirect to `/` |

Conventions: route slugs are Vietnamese; multi-word page folders are `snake_case`; imports keep explicit `.tsx`/`.ts` extensions; page components are default exports.

## Data and environment

- `VITE_API_URL` and `VITE_TURNSTILE_SITE_KEY` live in `.env.development` / `.env.production`; `.env.example` is a template Vite never loads.
- `src/lib/api.ts` reads `VITE_API_URL` into `API_BASE`; its fallback is malformed (`http:/:8080`), so always set the variable.
- Responses are wrapped as `{ success, message, data }`; lists are Spring `Page<T>`; failures throw `ApiError` with the HTTP status.
- Product and news images come from `images[]` sorted by `sortOrder` (`productImage`, `productImages`, `newsImage`); render through `Img` to get the error fallback.
- Backend HTML (news/product descriptions) must go through `sanitizeHtml()`; iframes are limited to YouTube/YouTube-nocookie over HTTPS.
- The contact form needs the Turnstile widget and posts `turnstileToken` to `/api/customer-contacts`.

## TypeScript gotchas (enforced, will fail build)

- Project references: root `tsconfig.json` has `files: []` and references `tsconfig.app.json` (`src/`) + `tsconfig.node.json` (`vite.config.ts`). Edit the right file for the right scope.
- `verbatimModuleSyntax: true` — type imports must use `import type`.
- `erasableSyntaxOnly: true` — no enums, namespaces, or parameter properties.
- `noUnusedLocals` + `noUnusedParameters: true` — build fails on unused vars.
- `jsx: react-jsx`, `moduleDetection: force`, `moduleResolution: bundler`.

## ESLint

Flat config in `eslint.config.js`: `dist` ignored, only `**/*.{ts,tsx}` linted (recommended + `react-hooks` + `react-refresh` + `typescript-eslint`). No type-aware rules enabled.

## Shell

PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.

## Workflow rules (Superpowers)

Skills are loaded with the `skill` tool, not slash commands. If a named skill
isn't found, use the `skill` tool to list available skills and pick the closest
match. Do not skip a step because the skill is missing; tell the user instead.

Always check `docs/` first. Existing feature → update its file. New feature →
create `docs/specs/<page_name>.md` (English, e.g. warehouse.md).

For any non-trivial task, follow these steps in order and stop at each gate:

1. Spec: load the `brainstorming` skill. Write or update
   `docs/specs/<page_name>.md`. STOP and wait for user approval.
2. Plan: load the `writing-plans` skill. Write or update
   `docs/plans/<page_name>.md` with checkbox steps. The final step must be
   "update the spec if behavior changed." STOP and wait for user approval.
3. Implement: load the `executing-plans` skill. Work test-first, tick plan
   checkboxes as you go, and run the test/lint commands after each batch.
4. Before finishing: load the code-review skill
   (`requesting-code-review`) and the `verification-before-completion` skill,
   then confirm all checkboxes are ticked.

Save all outputs to the paths above, not to any default location.
Skip this workflow only for trivial fixes (typos, one-line changes).

## Code minimalism (Ponytail)

- Before step 3, load the `ponytail` skill and keep it active at `full` level
  for the whole implementation. Before writing new code, check for existing
  code, the stdlib, native platform features, or already-installed dependencies.
- In plans, prefer reusing existing modules over creating new ones, and
  list what existing code each step reuses.
- Never trade away validation, security, or accessibility to write less code.
- Before finishing, load the `ponytail-review` skill to check for
  over-engineering, in addition to the normal code-review skill.
- If Ponytail and the approved spec/plan conflict, the spec and plan win.
  Ask the user instead of silently dropping requirements.
- Required tests are never "dead code." Do not delete them for minimalism.