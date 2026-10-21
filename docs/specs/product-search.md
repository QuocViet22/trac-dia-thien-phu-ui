# Product Search Autocomplete — Design Spec

Source: request to wire the existing header search box (`src/components/layout/Header.tsx`) into a product-name autocomplete, backed by the `trac-dia-thien-phu-api` catalogue.

Target: the header search box shows live product suggestions; Enter opens a filtered `/san-pham` listing. No new route, no new dependency.

## Goals

- Typing **2 or more characters** (after trim) in the header search shows up to **6** product suggestions after a **300 ms** debounce.
- Each suggestion shows thumbnail, name and brand. Click → `/san-pham/{seoAlias}`.
- Enter in the input, or the search-icon button, → `/san-pham?name=<keyword>` — the existing listing grid with pagination and sort.
- The listing shows `Kết quả tìm kiếm cho "…"` as its heading and `Không tìm thấy sản phẩm phù hợp.` when empty.
- Keyboard and screen-reader usable: ↑/↓ to move, Enter to open, Esc to close.
- Reuse `listProducts()`; no new endpoint, no client-side filtering of a preloaded list.

## API Contract

Existing endpoint, one optional parameter added in `trac-dia-thien-phu-api` (see `docs/specs/product_controller.md` §7):

```
GET {VITE_API_URL}/api/products?name={keyword}&page=0&size=6&sort=name,asc
```

- `name` is optional. Present and non-blank → **case-insensitive substring** match on product name.
- Combines with `categoryId` and `brand`; paging/sorting and the `ApiResponse<Page<ProductResponse>>` shape are unchanged.
- Absent or blank `name` behaves exactly like today.
- Accent matching is whatever the MySQL column collation does (`utf8mb4_*_ai_ci` in MySQL 8 matches unaccented input; a binary/accent-sensitive collation does not). No accent-normalization work is added.

## UI Behaviour

- **Idle:** fewer than 2 trimmed characters → dropdown hidden, no request, previous results cleared.
- **Loading:** after the debounce fires, the dropdown stays open showing a loading row.
- **Results:** max 6 rows; thumbnail via the shared `Img` wrapper (fallback image), name (`line-clamp-2`), brand when present.
- **Empty:** `Không tìm thấy sản phẩm phù hợp.`
- **Error:** `Không tìm được sản phẩm. Vui lòng thử lại.` — the input stays usable.
- **Stale responses:** a response for an older keyword is discarded (effect cleanup flag, same pattern as `SanPhamPage`).
- **Close:** Escape, pointer-down outside the search container, or a route change. Selecting a suggestion closes it.
- **Keyboard:** ArrowDown/ArrowUp move the active option (wrapping), Enter opens the active option, or goes to `/san-pham?name=` when none is active, Escape closes. Active option scrolls into view.
- **Pointer:** `onMouseDown` on a row is prevented so the input keeps focus until the click navigates.
- **After navigation:** the typed text stays in the input; the dropdown closes.
- **Mobile:** dropdown is the full width of the input, `max-h-80` with internal scroll.

## Accessibility

- Input: `type="search"`, `aria-label="Tìm kiếm sản phẩm"` (the placeholder is not a label), `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`, `aria-activedescendant` when an option is active.
- Dropdown: `role="listbox"`; each row is a `Link` with `role="option"`, a stable `id`, and `aria-selected`.
- Search icon is a submit button inside the same `<form>`, with `aria-label="Tìm kiếm"`.

## Architecture / Files

- `src/lib/api.ts` — `ProductQuery` gains `name?: string`; `listProducts()` sets the `name` param when present. No other API helper changes.
- `src/components/layout/ProductSearch.tsx` (new) — owns query state, debounce/fetch effect, open/active state, close handlers, dropdown markup, form submit. Header stays small.
- `src/components/layout/Header.tsx` — replace the current input + icon block with `<ProductSearch />`; the surrounding layout classes stay unchanged.
- `src/pages/product/SanPhamPage.tsx` — read `name` from `useSearchParams` into query state (same pattern as `paramCategoryId`), pass it to `listProducts`, reset to page 0 when it changes, derive the heading and empty text from it.
- `docs/plans/product-search.md` — implementation plan, written after this spec is approved.
- API repo: `controller/ProductController.java`, `service/ProductService.java`, `service/impl/ProductServiceImpl.java`, `repository/ProductRepository.java`, plus tests.

## Non-goals

- Search by SKU, barcode, brand, category or description.
- Relevance ranking, prefix boosting, typo tolerance, fuzzy or accent-insensitive matching.
- Search history, recent/popular suggestions, analytics, voice search.
- Searching news, rentals or categories.
- Caching search results.
- Any new route or dependency.
- Automated UI tests (the repo has no test runner); verification is build + lint + manual dev-server checks.

## Verification

- `npm run build` (includes `tsc -b`) and `npm run lint` exit 0.
- `npm run dev` on desktop and mobile widths:
  - 1 character → no dropdown; 2+ → suggestions after ~300 ms.
  - Fast typing → no stale result flash; only the latest keyword's results render.
  - Click a suggestion → correct `/san-pham/{seoAlias}` page.
  - Enter → `/san-pham?name=…` with heading, grid, pagination and sort working; direct load of that URL works.
  - No match, API down, Escape, outside click, route change all behave as specified.
  - Header layout unchanged at mobile and desktop breakpoints.
- API: repository test for substring/combination, controller test for `?name=`, and a live `curl` against the running API.

## Risks / Known Limits

- `LIKE '%keyword%'` cannot use an index; fine at the current catalogue size, revisit (index or full-text search) when the product count grows.
- A keyword containing `LIKE` wildcards (`%`, `_`) is matched as a wildcard rather than literally, because the JPQL has no `ESCAPE` clause. Negligible for product names; fix with an `escape` clause if it ever matters.
- Accent-insensitive matching depends on the database collation, not on application code.
- Header results are capped at 6; the full set is only reachable through `/san-pham?name=`.
