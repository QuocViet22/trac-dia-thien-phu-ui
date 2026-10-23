# News Pages (/tin-tuc + /thue-san-pham + /sua-chua-va-kiem-dinh) — Design Spec

Source: user screenshot of `Tất cả tin tức` list (cover left, title + `dd/MM/yyyy - author` meta + excerpt right); detail shows full news data with HTML description. Backend exposes `newsType` (`NEWS` = Tin tức, `HIRING_PRODUCT` = Thuê sản phẩm, `CUSTOMER_NEWS` = Khách hàng, `REPAIR_AND_INSPECTION_NEWS` = Sửa chữa & Kiểm định) with a `?newsType=` list filter.
Target: production-ready React pages at `/tin-tuc`, `/tin-tuc/:slug`, `/thue-san-pham`, `/thue-san-pham/:slug`, `/sua-chua-va-kiem-dinh`, `/sua-chua-va-kiem-dinh/:slug` inside existing `SiteLayout`, served with `react-router`, data from `trac-dia-thien-phu-api` backend. All sections share one list + one detail component configured per route.

## Goals

- Serve `/tin-tuc` list via `react-router`: `/tin-tuc` renders the shared list with `newsType=NEWS`, `/tin-tuc/:slug` renders the shared detail (slug = `seoAlias`), all inside `SiteLayout`.
- Serve `/thue-san-pham` list via `react-router`: `/thue-san-pham` renders the shared list with `newsType=HIRING_PRODUCT` and H1 `Thuê sản phẩm`; `/thue-san-pham/:slug` renders the shared detail with breadcrumb back to `Thuê sản phẩm`.
- Serve `/sua-chua-va-kiem-dinh` list via `react-router`: `/sua-chua-va-kiem-dinh` renders the shared list with `newsType=REPAIR_AND_INSPECTION_NEWS` and H1 `Sửa chữa & Kiểm định`; `/sua-chua-va-kiem-dinh/:slug` renders the shared detail with breadcrumb back to `Sửa chữa & Kiểm định`.
- Replicate the reference list row with Vietnamese copy: H1 `Tất cả tin tức` (`/tin-tuc`) / `Thuê sản phẩm` (`/thue-san-pham`) / `Sửa chữa & Kiểm định` (`/sua-chua-va-kiem-dinh`); each row shows cover image (left), title, `dd/MM/yyyy - author` meta line (plus ` - location` when present), `seoDescriptionTag` excerpt (right, truncated ~3 lines).
- Clicking a row navigates to `{basePath}/{seoAlias}` detail page of its own section.
- Detail page shows: breadcrumb (`Trang chủ / {Tất cả tin tức | Thuê sản phẩm | Sửa chữa & Kiểm định} / {title}`), H1 title, meta (`Đăng bởi: {author} - Vào lúc {dd/MM/yyyy}`), a `Địa điểm: {location}` line when present, cover image, full `description` HTML rendered, `seoDescriptionTag` as lead paragraph when present.
- Detail with a `newsType` mismatch (e.g. a `NEWS` item opened under `/thue-san-pham/:slug`) renders the missing state, not the article.
- Load list from `GET {VITE_API_URL}/api/news?status=PUBLISHED&newsType={NEWS|HIRING_PRODUCT|REPAIR_AND_INSPECTION_NEWS}&page={n}&size=10&sort=updatedAt,desc` (paginated). Page size 10.
- Load detail from `GET {VITE_API_URL}/api/news/by-alias/{seoAlias}` (exact match on unique `seoAlias`; 404 when unknown).
- Render `description` HTML string as HTML; sanitize with `dompurify` before `dangerouslySetInnerHTML` (user-approved).
- Date from `updatedAt` (`Instant` ISO string) formatted `dd/MM/yyyy` in `Asia/Ho_Chi_Minh` locale `vi-VN`.
- Cover = `images[0]?.imageUrl` (backend already limits to 1); gray placeholder fallback via shared `Img` wrapper when missing.
- Loading state: skeleton rows. Error state: error block with retry button. Empty state: Vietnamese empty text (`Chưa có tin tức nào.` / `Chưa có sản phẩm cho thuê nào.` / `Chưa có tin tức sửa chữa & kiểm định nào.`). Missing (detail 404 or type mismatch): `Tin tức không tồn tại` + back link to the owning list.
- Follow product page patterns: Tailwind, `src/lib/api.ts` typed client, components under ~100 lines.
- API base URL from `VITE_API_URL` env, default `http://localhost:8080` (existing `API_BASE`, reused as-is).

## Non-goals

- No search, category, tag, or author filtering (API list only supports `status` + `Pageable`).
- No related-news section (deferred).
- No document `<head>` SEO wiring (`seoPageTitle` / `seoDescriptionTag` meta tags deferred; fields are displayed, not injected into head).
- No admin create/edit UI.

## API Contract (backend: `trac-dia-thien-phu-api`)

- `GET /api/news?status=PUBLISHED&newsType={NEWS|HIRING_PRODUCT|REPAIR_AND_INSPECTION_NEWS}&page={n}&size=10&sort=updatedAt,desc` → `ApiResponse<Page<NewsResponse>>` (existing endpoint with the new `newsType` filter, reused as-is).
- `GET /api/news/by-alias/{seoAlias}` → `ApiResponse<NewsDetailResponse>` (existing endpoint, reused as-is). 404/unsuccessful when unknown alias.
- `NewsResponse`: `{ id, title, author, status: PUBLISHED | DRAFT, newsType: NEWS | HIRING_PRODUCT | CUSTOMER_NEWS | REPAIR_AND_INSPECTION_NEWS, location, seoAlias, createdAt, updatedAt, seoDescriptionTag, images: ImageDto[] (max 1) }`.
- `NewsDetailResponse`: `{ id, title, description (HTML string), author, status, newsType, location, seoPageTitle, seoDescriptionTag, seoAlias, createdAt, updatedAt, images: ImageDto[] (max 1) }`.
- Spring `Page` JSON shape: `{ content, totalPages, totalElements, number, size }` inside `ApiResponse.data`.
- No auth required; CORS same as products.

## Architecture

- `App.tsx`: `/tin-tuc` + `/tin-tuc/:slug` render the shared components with `newsType='NEWS'`; `/thue-san-pham` + `/thue-san-pham/:slug` with `newsType='HIRING_PRODUCT'`; `/sua-chua-va-kiem-dinh` + `/sua-chua-va-kiem-dinh/:slug` with `newsType='REPAIR_AND_INSPECTION_NEWS'`. `MainNav` links "Thuê sản phẩm" and "Sửa chữa & Kiểm định" to their list routes.
- `src/lib/api.ts`: `NewsType = 'NEWS' | 'HIRING_PRODUCT' | 'CUSTOMER_NEWS' | 'REPAIR_AND_INSPECTION_NEWS'`, `newsType` + `location` fields on `NewsResponse` / `NewsDetailResponse`, `NewsQuery { page, size, newsType }`; `listNews(query)` sets `status=PUBLISHED`, `newsType`, `sort=updatedAt,desc`.
- `src/pages/news/NewsPage.tsx` → shared list component with props `{ newsType, title, emptyText, basePath }`: fetches list via `useEffect` on `[page, newsType]` state (same cancelled-flag pattern as `SanPhamPage`); renders breadcrumb + H1 + row list (rows link to `{basePath}/{seoAlias}`) + pagination bar (copied pagination visuals from `SanPhamPage`). Row meta appends ` - {location}` when present.
- `src/pages/news/NewsDetailPage.tsx` → shared detail component with props `{ newsType, listTitle, listPath }`: resolves by `useParams().slug` via `getNewsByAlias` (same snapshot `loading | missing | error | ready` pattern as `ProductDetailPage`); `missing` covers 404 and `newsType` mismatch; sanitizes `description` with shared `sanitizeHtml` (`src/lib/sanitize.ts`, `dompurify`) then renders via `dangerouslySetInnerHTML` with Tailwind typography-ish utility classes (`[&_ul]:list-disc [&_ul]:pl-5`, same as `ProductDetailPage` short description). Renders a `Địa điểm: {location}` line when present.
- `src/pages/dashboard/components/NewsSection.tsx`: `basePath()` maps `REPAIR_AND_INSPECTION_NEWS` to `/sua-chua-va-kiem-dinh` so featured cards open the owning detail page.
- `src/pages/news/components/NewsRow.tsx` (optional if page exceeds ~100 lines): pure row component (`title`, `meta`, `excerpt`, `image`, `seoAlias` link).
- New dependency: `dompurify` + `@types/dompurify` (sanitize-first requirement; only addition).
- Spec file: `docs/specs/news.md` (this file); implementation plan follows after approval in `docs/plans/news.md`.

## Content

- List breadcrumb (`Trang chủ` links `/`), H1 per section (`Tất cả tin tức` / `Thuê sản phẩm` / `Sửa chữa & Kiểm định`).
- Row meta: `{dd/MM/yyyy} - {author}` (date from `updatedAt`), plus ` - {location}` when present; title bold; excerpt = `seoDescriptionTag` with `line-clamp-3`.
- Detail: breadcrumb (`Trang chủ / {section} / {title}`), title, meta line (`Đăng bởi: {author} - Vào lúc {dd/MM/yyyy}`), `Địa điểm: {location}` when present, cover image, lead excerpt (`seoDescriptionTag`), horizontal rule, full sanitized `description` HTML.
- Loading: skeleton rows matching list shape. Error: `Không tải được tin tức. Vui lòng thử lại.` + retry button. Empty: per-section empty text. Missing: `Tin tức không tồn tại` + back link to the owning list.

## Assets

- News covers come from API `images[0].imageUrl` (R2 public URLs) with placeholder fallback via shared `Img` wrapper (`src/components/Img.tsx`).

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes.
- `npm run dev` visual check at desktop + mobile: `/tin-tuc` shows only `NEWS` rows, `/thue-san-pham` only `HIRING_PRODUCT` rows, `/sua-chua-va-kiem-dinh` only `REPAIR_AND_INSPECTION_NEWS` rows (image + title + date-author + location when present + excerpt); each row navigates to its own section detail; detail renders formatted HTML and the location line; type-mismatched slug shows missing state; API-down shows error + retry works; empty shows per-section empty text (`Chưa có tin tức sửa chữa & kiểm định nào.` for the new section); unknown slug shows missing state; `/`, `/gioi-thieu`, `/san-pham`, `/lien-he` unchanged. A homepage featured repair item opens `/sua-chua-va-kiem-dinh/{seoAlias}`.
