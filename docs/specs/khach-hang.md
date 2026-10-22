# Customer News Page (/khach-hang) — Design Spec

Source: owner request — news of type `CUSTOMER_NEWS` (`Khách hàng`) created
in the admin with a `location`, published on the existing "Khách hàng"
nav destination.
Target: production-ready React pages at `/khach-hang` and
`/khach-hang/:slug` inside the existing `SiteLayout`, reusing the shared
news list + detail components configured for `newsType=CUSTOMER_NEWS`.
Data from `trac-dia-thien-phu-api`.

## Goals

- Serve `/khach-hang` via `react-router`: the shared `NewsPage` with
  `newsType="CUSTOMER_NEWS"`, H1 `Khách hàng`, empty text
  `Chưa có thông tin khách hàng nào.`, `basePath="/khach-hang"`.
- Serve `/khach-hang/:slug` via the shared `NewsDetailPage` with
  `newsType="CUSTOMER_NEWS"`, `listTitle="Khách hàng"`,
  `listPath="/khach-hang"`.
- List row keeps today's layout (cover left; title, `dd/MM/yyyy - author`
  meta, `seoDescriptionTag` excerpt right) and appends the location to
  the meta line: `{dd/MM/yyyy} - {author} - {location}`; the location
  segment is omitted when the field is blank.
- Detail page shows `Địa điểm: {location}` on its own line under the
  `Đăng bởi: ... - Vào lúc ...` meta line; the line is omitted when the
  field is blank.
- Detail with a `newsType` mismatch (e.g. a `NEWS` item opened under
  `/khach-hang/:slug`) renders the missing state, not the article.
- `MainNav` "Khách hàng" item points at `/khach-hang` instead of `#`.
- Load list from `GET {VITE_API_URL}/api/news?status=PUBLISHED&newsType=CUSTOMER_NEWS&page={n}&size=10&sort=updatedAt,desc`.
- Load detail from `GET {VITE_API_URL}/api/news/by-alias/{seoAlias}`.
- Loading, error + retry, empty, missing, pagination, sanitized HTML
  body, cover placeholder, and date formatting stay exactly as the
  existing news pages — no new behaviour.
- `location` is rendered for any news type that carries one; only
  customer news will ever set it, so `/tin-tuc` and `/thue-san-pham`
  are visually unchanged.

## Non-goals

- No new admin UI in this repo (the admin change is in
  `trac-dia-thien-phu-admin`).
- No map, customer logo wall, testimonial schema, or location filter —
  `location` is display-only free text.
- No separate page layout or component for customers; the shared
  `NewsPage` / `NewsDetailPage` are reused as-is apart from the
  location line.
- No document `<head>` SEO wiring (`seoPageTitle` / meta tags remain
  deferred).
- No search or filtering beyond the existing `newsType` + pagination.

## API Contract (backend: `trac-dia-thien-phu-api`)

- `GET /api/news?status=PUBLISHED&newsType=CUSTOMER_NEWS&page={n}&size=10&sort=updatedAt,desc`
  → `ApiResponse<Page<NewsResponse>>`.
- `GET /api/news/by-alias/{seoAlias}` → `ApiResponse<NewsDetailResponse>`;
  404 when unknown.
- `NewsResponse`: `{ id, title, author, status, newsType, location,
  seoAlias, createdAt, updatedAt, seoDescriptionTag, images: ImageDto[] (max 1) }`.
- `NewsDetailResponse`: all `NewsResponse` fields plus `description`
  (HTML string), `seoPageTitle`.
- `location: string | null`, max 256, optional on the API; the admin
  form is the only place that requires it for `CUSTOMER_NEWS`.
- `NewsType` gains `'CUSTOMER_NEWS'`; the existing `?newsType=` filter
  accepts it with no backend change beyond the DTO field.

## Architecture

- `src/lib/api.ts`: extend `NewsType` with `'CUSTOMER_NEWS'`; add
  `location: string | null` to `NewsResponse` and `NewsDetailResponse`.
  `listNews`, `getNewsByAlias`, `newsImage`, `formatNewsDate` unchanged.
- `src/App.tsx`: add `/khach-hang` and `/khach-hang/:slug` routes next to
  the existing news routes, passing the props above.
- `src/pages/news/NewsPage.tsx`: meta line becomes
  `{date} - {author}{location ? ` - ${location}` : ''}`; everything else
  untouched.
- `src/pages/news/NewsDetailPage.tsx`: render
  `{news.location && <p ...>Địa điểm: {news.location}</p>}` directly
  below the existing author/date meta line.
- `src/components/layout/MainNav.tsx`: "Khách hàng" `href="#"` →
  `/khach-hang` (same anchor styling as its neighbours, minimal diff).
- Spec file: `docs/specs/khach-hang.md` (this file); implementation plan
  follows after approval in `docs/plans/khach-hang.md`.
- No new dependencies, no new components, no state library.

## Content

- List breadcrumb `Trang chủ / Khách hàng`, H1 `Khách hàng`.
- Row meta: `{dd/MM/yyyy} - {author} - {location}` (location segment
  omitted when blank), title bold, excerpt `seoDescriptionTag` with
  `line-clamp-3`.
- Detail breadcrumb `Trang chủ / Khách hàng / {title}`, title, meta line,
  `Địa điểm: {location}`, cover image, lead excerpt, sanitized
  `description` HTML.
- Empty: `Chưa có thông tin khách hàng nào.`
- Error: `Không tải được tin tức. Vui lòng thử lại.` + retry button.
- Missing: `Tin tức không tồn tại` + `Quay lại Khách hàng`.

## Assets

- Covers come from API `images[0].imageUrl` (R2 public URLs) with the
  shared `Img` placeholder fallback. No new static assets.

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes (exit 0).
- `npm run dev` visual check at desktop + mobile: `MainNav` "Khách hàng"
  lands on `/khach-hang`; the list shows only `CUSTOMER_NEWS` rows with
  location in the meta line; a row opens `/khach-hang/{seoAlias}` with
  the location line; a `NEWS` alias opened under `/khach-hang/:slug`
  shows the missing state; empty/error/retry states work; `/tin-tuc` and
  `/thue-san-pham` remain unchanged; `/`, `/gioi-thieu`, `/san-pham`,
  `/lien-he` unchanged.
