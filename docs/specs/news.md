# News Pages (/tin-tuc + /thue-san-pham) — Design Spec

Source: user screenshot of `Tất cả tin tức` list (cover left, title + `dd/MM/yyyy - author` meta + excerpt right); detail shows full news data with HTML description. Backend added `newsType` (`NEWS` = Tin tức, `HIRING_PRODUCT` = Thuê sản phẩm) with `?newsType=` list filter.
Target: production-ready React pages at `/tin-tuc`, `/tin-tuc/:slug`, `/thue-san-pham`, `/thue-san-pham/:slug` inside existing `SiteLayout`, served with `react-router`, data from `trac-dia-thien-phu-api` backend. Both sections share one list + one detail component configured per route.

## Goals

- Serve `/tin-tuc` list via `react-router`: `/tin-tuc` renders the shared list with `newsType=NEWS`, `/tin-tuc/:slug` renders the shared detail (slug = `seoAlias`), all inside `SiteLayout`.
- Serve `/thue-san-pham` list via `react-router`: `/thue-san-pham` renders the shared list with `newsType=HIRING_PRODUCT` and H1 `Thuê sản phẩm`; `/thue-san-pham/:slug` renders the shared detail with breadcrumb back to `Thuê sản phẩm`.
- Replicate the reference list row with Vietnamese copy: H1 `Tất cả tin tức` (`/tin-tuc`) / `Thuê sản phẩm` (`/thue-san-pham`); each row shows cover image (left), title, `dd/MM/yyyy - author` meta line, `seoDescriptionTag` excerpt (right, truncated ~3 lines).
- Clicking a row navigates to `{basePath}/{seoAlias}` detail page of its own section.
- Detail page shows: breadcrumb (`Trang chủ / {Tất cả tin tức | Thuê sản phẩm} / {title}`), H1 title, meta (`updatedAt` formatted `dd/MM/yyyy` + author), cover image, full `description` HTML rendered, `seoDescriptionTag` as lead paragraph when present.
- Detail with a `newsType` mismatch (e.g. a `NEWS` item opened under `/thue-san-pham/:slug`) renders the missing state, not the article.
- Load list from `GET {VITE_API_URL}/api/news?status=PUBLISHED&newsType={NEWS|HIRING_PRODUCT}&page={n}&size=10&sort=updatedAt,desc` (paginated). Page size 10.
- Load detail from `GET {VITE_API_URL}/api/news/by-alias/{seoAlias}` (exact match on unique `seoAlias`; 404 when unknown).
- Render `description` HTML string as HTML; sanitize with `dompurify` before `dangerouslySetInnerHTML` (user-approved).
- Date from `updatedAt` (`Instant` ISO string) formatted `dd/MM/yyyy` in `Asia/Ho_Chi_Minh` locale `vi-VN`.
- Cover = `images[0]?.imageUrl` (backend already limits to 1); gray placeholder fallback via shared `Img` wrapper when missing.
- Loading state: skeleton rows. Error state: error block with retry button. Empty state: Vietnamese empty text (`Chưa có tin tức nào.` / `Chưa có sản phẩm cho thuê nào.`). Missing (detail 404 or type mismatch): `Tin tức không tồn tại` + back link to the owning list.
- Follow product page patterns: Tailwind, `src/lib/api.ts` typed client, components under ~100 lines.
- API base URL from `VITE_API_URL` env, default `http://localhost:8080` (existing `API_BASE`, reused as-is).

## Non-goals

- No search, category, tag, or author filtering (API list only supports `status` + `Pageable`).
- No related-news section (deferred).
- No document `<head>` SEO wiring (`seoPageTitle` / `seoDescriptionTag` meta tags deferred; fields are displayed, not injected into head).
- No admin create/edit UI.

## API Contract (backend: `trac-dia-thien-phu-api`)

- `GET /api/news?status=PUBLISHED&newsType={NEWS|HIRING_PRODUCT}&page={n}&size=10&sort=updatedAt,desc` → `ApiResponse<Page<NewsResponse>>` (existing endpoint with the new `newsType` filter, reused as-is).
- `GET /api/news/by-alias/{seoAlias}` → `ApiResponse<NewsDetailResponse>` (existing endpoint, reused as-is). 404/unsuccessful when unknown alias.
- `NewsResponse`: `{ id, title, author, status: PUBLISHED | DRAFT, newsType: NEWS | HIRING_PRODUCT, seoAlias, createdAt, updatedAt, seoDescriptionTag, images: ImageDto[] (max 1) }`.
- `NewsDetailResponse`: `{ id, title, description (HTML string), author, status, newsType, seoPageTitle, seoDescriptionTag, seoAlias, createdAt, updatedAt, images: ImageDto[] (max 1) }`.
- Spring `Page` JSON shape: `{ content, totalPages, totalElements, number, size }` inside `ApiResponse.data`.
- No auth required; CORS same as products.

## Architecture

- `App.tsx`: `/tin-tuc` + `/tin-tuc/:slug` render the shared components with `newsType='NEWS'`; add `<Route path="/thue-san-pham" />` + `<Route path="/thue-san-pham/:slug" />` rendering them with `newsType='HIRING_PRODUCT'`. `MainNav` "Thuê sản phẩm" links to `/thue-san-pham`.
- `src/lib/api.ts`: add `NewsType = 'NEWS' | 'HIRING_PRODUCT'`, `newsType` field on `NewsResponse` / `NewsDetailResponse`, `NewsQuery { page, size, newsType }`; `listNews(query)` sets `status=PUBLISHED`, `newsType`, `sort=updatedAt,desc`.
- `src/pages/news/NewsPage.tsx` → shared list component with props `{ newsType, title, basePath }`: fetches list via `useEffect` on `[page, newsType]` state (same cancelled-flag pattern as `SanPhamPage`); renders breadcrumb + H1 + row list (rows link to `{basePath}/{seoAlias}`) + pagination bar (copied pagination visuals from `SanPhamPage`).
- `src/pages/news/NewsDetailPage.tsx` → shared detail component with props `{ newsType, listTitle, listPath }`: resolves by `useParams().slug` via `getNewsByAlias` (same snapshot `loading | missing | error | ready` pattern as `ProductDetailPage`); `missing` covers 404 and `newsType` mismatch; sanitizes `description` with shared `sanitizeHtml` (`src/lib/sanitize.ts`, `dompurify`) then renders via `dangerouslySetInnerHTML` with Tailwind typography-ish utility classes (`[&_ul]:list-disc [&_ul]:pl-5`, same as `ProductDetailPage` short description).
- `src/pages/news/components/NewsRow.tsx` (optional if page exceeds ~100 lines): pure row component (`title`, `meta`, `excerpt`, `image`, `seoAlias` link).
- New dependency: `dompurify` + `@types/dompurify` (sanitize-first requirement; only addition).
- Spec file: `docs/specs/news.md` (this file); implementation plan follows after approval in `docs/plans/news.md`.

## Content

- List breadcrumb (`Trang chủ` links `/`), H1 per section (`Tất cả tin tức` / `Thuê sản phẩm`).
- Row meta: `{dd/MM/yyyy} - {author}` (date from `updatedAt`); title bold; excerpt = `seoDescriptionTag` with `line-clamp-3`.
- Detail: breadcrumb (`Trang chủ / {section} / {title}`), title, meta line, cover image, lead excerpt (`seoDescriptionTag`), horizontal rule, full sanitized `description` HTML.
- Loading: skeleton rows matching list shape. Error: `Không tải được tin tức. Vui lòng thử lại.` + retry button. Empty: per-section empty text. Missing: `Tin tức không tồn tại` + back link to the owning list.

## Assets

- News covers come from API `images[0].imageUrl` (R2 public URLs) with placeholder fallback via shared `Img` wrapper (`src/components/Img.tsx`).

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes.
- `npm run dev` visual check at desktop + mobile: `/tin-tuc` shows only `NEWS` rows, `/thue-san-pham` only `HIRING_PRODUCT` rows (image + title + date-author + excerpt); each row navigates to its own section detail; detail renders formatted HTML; type-mismatched slug shows missing state; API-down shows error + retry works; empty shows per-section empty text; unknown slug shows missing state; `/`, `/gioi-thieu`, `/san-pham`, `/lien-he` unchanged.
