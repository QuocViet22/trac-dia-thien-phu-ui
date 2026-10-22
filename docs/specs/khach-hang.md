# Customer News Page (/khach-hang) — Design Spec

Source: owner request — news of type `CUSTOMER_NEWS` (`Khách hàng`) created
in the admin with a `location`, published on the "Khách hàng" nav
destination, using a bespoke card grid design supplied by the owner in
`src/pages/customer/`.
Target: `/khach-hang` renders the branded customer card grid fed by the
news API; `/khach-hang/:slug` keeps the shared news detail page.
Data from `trac-dia-thien-phu-api`.

## Goals

- Serve `/khach-hang` via `react-router` with `CustomerList`
  (`src/pages/customer/CustomerList.tsx`).
- Load 12 published `CUSTOMER_NEWS` items per page, newest first:
  `GET {VITE_API_URL}/api/news?status=PUBLISHED&newsType=CUSTOMER_NEWS&page={n}&size=12&sort=updatedAt,desc`.
- Render a 3-column card grid (2 at ≤991px, 1 at ≤575px) with a
  `« 1 2 3 »` pager below it, using the same markup/classes as `/tin-tuc`.
- Card mapping:
  - Round photo ← `images[0].imageUrl` via the shared `Img` fallback; a
    gradient placeholder when the news has no image.
  - Banner phrase ← `Bàn giao máy RTK tại tỉnh {location}`; when
    `location` is blank → `Bàn giao máy RTK` and the location chip is
    hidden.
  - Banner contact lines are site-wide constants (`0972.819.598`,
    `https://igeostore.vn/`).
  - Location chip ← trimmed `location`.
  - Card title ← news `title`.
  - Whole card links to `/khach-hang/{seoAlias}` via `Link`.
- `/khach-hang/:slug` stays the shared `NewsDetailPage` with
  `newsType="CUSTOMER_NEWS"`, `listTitle="Khách hàng"`,
  `listPath="/khach-hang"`; the location line rule is unchanged.
- States: six skeleton cards while loading; error block
  `Không tải được khách hàng. Vui lòng thử lại.` + `Tải lại`; empty
  `Chưa có khách hàng nào.`; no filter controls.
- `MainNav` "Khách hàng" item points at `/khach-hang` (unchanged from the
  previous phase).

## Non-goals

- No province/location filter or search — removed by owner decision.
- No separate detail page or detail redesign; the shared
  `NewsDetailPage` is reused.
- No per-customer phone/website fields (the API has none); the banner
  uses site-wide constants.
- No map, customer logo wall, or testimonial schema.
- No document `<head>` SEO wiring (`seoPageTitle` / meta tags remain
  deferred).
- No API change; the list endpoint's existing `newsType` filter is enough.

## API Contract (backend: `trac-dia-thien-phu-api`)

- `GET /api/news?status=PUBLISHED&newsType=CUSTOMER_NEWS&page={n}&size=12&sort=updatedAt,desc`
  → `ApiResponse<Page<NewsResponse>>`.
- `GET /api/news/by-alias/{seoAlias}` → `ApiResponse<NewsDetailResponse>`;
  404 when unknown.
- `NewsResponse`: `{ id, title, author, status, newsType, location,
  seoAlias, createdAt, updatedAt, seoDescriptionTag, images: ImageDto[] (max 1) }`.
- `NewsDetailResponse`: all `NewsResponse` fields plus `description`
  (HTML string), `seoPageTitle`.
- `location: string | null`, max 256, optional on the API; the admin
  form is the only place that requires it for `CUSTOMER_NEWS`.
- `NewsType` includes `'CUSTOMER_NEWS'`; no backend change needed for
  this page.

## Architecture

- `src/pages/customer/CustomerList.tsx`: page component; fetches with
  `listNews({ page, size: 12, newsType: 'CUSTOMER_NEWS' })`, owns
  `items/page/totalPages/loading/failed/reloadKey` (same pattern as
  `NewsPage`), cancels stale responses, and maps each `NewsResponse` to a
  card. No `customers` prop or sample data.
- `src/pages/customer/CustomerList.css`: page-scoped styles
  (`.cl`, `.cl__*`, `.cl-card*`, Mulish via Google Fonts) plus skeleton
  and state styles.
- `src/App.tsx`: `/khach-hang` renders `<CustomerList />`; the news
  routes for `NEWS` and `HIRING_PRODUCT` still use `NewsPage`.
- `src/lib/api.ts`: unchanged (`listNews`, `newsImage`, `NewsType`,
  `location` already exist).
- `src/components/Img.tsx`: cover fallback handling.
- No new dependencies.

## Content

- Header: H2 `Khách hàng`; subtitle
  `Hình ảnh bàn giao sản phẩm tới khách hàng trên toàn quốc`.
- Card banner: `Bàn giao máy RTK tại tỉnh {location}` or
  `Bàn giao máy RTK`; hotline `0972.819.598`; site `https://igeostore.vn/`.
- Card body: location chip with map icon; news title.
- Empty: `Chưa có khách hàng nào.`
- Error: `Không tải được khách hàng. Vui lòng thử lại.` + `Tải lại`.
- Detail: unchanged (`Đăng bởi: ... - Vào lúc ...`, `Địa điểm: {location}`,
  sanitized `description` HTML).

## Assets

- Covers come from API `images[0].imageUrl` (R2 public URLs) with the
  shared `Img` placeholder fallback. No new static assets.

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes (exit 0).
- Headless smoke against a live API: 12 cards on page 1 and the remainder
  on page 2, correct current/disabled pager states; card links open
  `/khach-hang/{seoAlias}`; missing `location` shows the short banner and
  no chip; missing image shows the gradient placeholder; empty and
  API-down (`Tải lại`) states render; `/tin-tuc` and `/thue-san-pham`
  remain unchanged.
