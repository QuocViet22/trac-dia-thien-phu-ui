# News Pages (/tin-tuc) — Design Spec

Source: user screenshot of `Tất cả tin tức` list (cover left, title + `dd/MM/yyyy - author` meta + excerpt right); detail shows full news data with HTML description.
Target: production-ready React pages at `/tin-tuc` and `/tin-tuc/:slug` inside existing `SiteLayout`, served with `react-router`, data from `trac-dia-thien-phu-api` backend.

## Goals

- Serve `/tin-tuc` list via `react-router`: `/tin-tuc` renders `NewsPage`, `/tin-tuc/:slug` renders `NewsDetailPage` (slug = `seoAlias`), all inside `SiteLayout`.
- Replicate the reference list row with Vietnamese copy: H1 `Tất cả tin tức`; each row shows cover image (left), title, `dd/MM/yyyy - author` meta line, `seoDescriptionTag` excerpt (right, truncated ~3 lines).
- Clicking a row navigates to `/tin-tuc/{seoAlias}` detail page.
- Detail page shows: breadcrumb (`Trang chủ / Tất cả tin tức / {title}`), H1 title, meta (`updatedAt` formatted `dd/MM/yyyy` + author), cover image, full `description` HTML rendered, `seoDescriptionTag` as lead paragraph when present.
- Load list from `GET {VITE_API_URL}/api/news?status=PUBLISHED&page={n}&size=10&sort=updatedAt,desc` (paginated). Page size 10.
- Load detail from `GET {VITE_API_URL}/api/news/by-alias/{seoAlias}` (exact match on unique `seoAlias`; 404 when unknown).
- Render `description` HTML string as HTML; sanitize with `dompurify` before `dangerouslySetInnerHTML` (user-approved).
- Date from `updatedAt` (`Instant` ISO string) formatted `dd/MM/yyyy` in `Asia/Ho_Chi_Minh` locale `vi-VN`.
- Cover = `images[0]?.imageUrl` (backend already limits to 1); gray placeholder fallback via shared `Img` wrapper when missing.
- Loading state: skeleton rows. Error state: error block with retry button. Empty state: Vietnamese empty text. Missing (detail 404): `Tin tức không tồn tại` + back link.
- Follow product page patterns: Tailwind, `src/lib/api.ts` typed client, components under ~100 lines.
- API base URL from `VITE_API_URL` env, default `http://localhost:8080` (existing `API_BASE`, reused as-is).

## Non-goals

- No search, category, tag, or author filtering (API list only supports `status` + `Pageable`).
- No related-news section (deferred).
- No document `<head>` SEO wiring (`seoPageTitle` / `seoDescriptionTag` meta tags deferred; fields are displayed, not injected into head).
- No admin create/edit UI.

## API Contract (backend: `trac-dia-thien-phu-api`)

- `GET /api/news?status=PUBLISHED&page={n}&size=10&sort=updatedAt,desc` → `ApiResponse<Page<NewsResponse>>` (existing endpoint, reused as-is).
- `GET /api/news/by-alias/{seoAlias}` → `ApiResponse<NewsDetailResponse>` (existing endpoint, reused as-is). 404/unsuccessful when unknown alias.
- `NewsResponse`: `{ id, title, author, status: PUBLISHED | DRAFT, seoAlias, createdAt, updatedAt, seoDescriptionTag, images: ImageDto[] (max 1) }`.
- `NewsDetailResponse`: `{ id, title, description (HTML string), author, status, seoPageTitle, seoDescriptionTag, seoAlias, createdAt, updatedAt, images: ImageDto[] (max 1) }`.
- Spring `Page` JSON shape: `{ content, totalPages, totalElements, number, size }` inside `ApiResponse.data`.
- No auth required; CORS same as products.

## Architecture

- `App.tsx`: add `<Route path="/tin-tuc" element={<NewsPage />} />` and `<Route path="/tin-tuc/:slug" element={<NewsDetailPage />} />`.
- `src/lib/api.ts`: add `NewsResponse` / `NewsDetailResponse` interfaces, `NewsQuery { page, size }`, `listNews(query)` (sets `status=PUBLISHED`, `sort=updatedAt,desc`), `getNewsByAlias(alias)`, `newsImage(item)` helper returning `images[0]?.imageUrl ?? ''`. Reuse existing `fetchData`, `ApiResponse<T>`, `Page<T>`, `ImageDto`.
- `src/pages/news/NewsPage.tsx`: fetches list via `useEffect` on `[page]` state (same cancelled-flag pattern as `SanPhamPage`); renders breadcrumb + H1 + row list + pagination bar (copied pagination visuals from `SanPhamPage`).
- `src/pages/news/NewsDetailPage.tsx`: resolves by `useParams().slug` via `getNewsByAlias` (same snapshot `loading | missing | error | ready` pattern as `ProductDetailPage`); sanitizes `description` with shared `sanitizeHtml` (`src/lib/sanitize.ts`, `dompurify`) then renders via `dangerouslySetInnerHTML` with Tailwind typography-ish utility classes (`[&_ul]:list-disc [&_ul]:pl-5`, same as `ProductDetailPage` short description).
- `src/pages/news/components/NewsRow.tsx` (optional if page exceeds ~100 lines): pure row component (`title`, `meta`, `excerpt`, `image`, `seoAlias` link).
- New dependency: `dompurify` + `@types/dompurify` (sanitize-first requirement; only addition).
- Spec file: `docs/specs/news.md` (this file); implementation plan follows after approval in `docs/plans/news.md`.

## Content

- List breadcrumb (`Trang chủ` links `/`), H1 `Tất cả tin tức`.
- Row meta: `{dd/MM/yyyy} - {author}` (date from `updatedAt`); title bold; excerpt = `seoDescriptionTag` with `line-clamp-3`.
- Detail: breadcrumb, title, meta line, cover image, lead excerpt (`seoDescriptionTag`), horizontal rule, full sanitized `description` HTML.
- Loading: skeleton rows matching list shape. Error: `Không tải được tin tức. Vui lòng thử lại.` + retry button. Empty: `Chưa có tin tức nào.` Missing: `Tin tức không tồn tại` + `Quay lại Tất cả tin tức` link.

## Assets

- News covers come from API `images[0].imageUrl` (R2 public URLs) with placeholder fallback via shared `Img` wrapper (`src/components/Img.tsx`).

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes.
- `npm run dev` visual check at desktop + mobile: `/tin-tuc` rows match screenshot (image + title + date-author + excerpt); click navigates to `/tin-tuc/:slug`; detail renders formatted HTML (lists, images, headings); API-down shows error + retry works; empty shows empty text; unknown slug shows missing state; `/`, `/gioi-thieu`, `/san-pham` unchanged.
