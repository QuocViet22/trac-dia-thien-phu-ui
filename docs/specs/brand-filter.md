# Brand Filter (single-select) for /san-pham — Design Spec

Parent spec: `docs/specs/product.md` (product listing page).
Related backend spec: `trac-dia-thien-phu-api/docs/specs/product_controller.md`.

## Goals

- On `/san-pham`, the "Thương hiệu" sidebar section becomes a working
  single-select filter: picking one brand narrows the product grid to
  that brand; clearing restores the full list.
- Brand combines with the existing category filter (AND) and resets
  pagination to page 0 on change, mirroring category behavior.
- Keep the current look: radio list inside the existing scroll-capped
  box (`max-h-[420px]`, `overflow-y-auto`), same 28 static brand labels
  from `src/pages/san-pham/data.ts`.

## Non-goals

- No multi-select (checkboxes are replaced, not supplemented).
- No brand list derived from the API; the static 28-name list stays.
- No brand data cleanup or normalization (no Brand entity/FK table).
- No admin UI changes; no changes to product detail or dashboard pages.

## API Contract (backend: `trac-dia-thien-phu-api`)

- `GET /api/products` gains an optional `brand` query param.
- When `brand` is present and non-blank, the paged query ANDs a
  case-insensitive exact predicate (`lower(brand) = lower(:brand)`)
  with the existing `categoryId` filter. No `LIKE`/contains matching.
- Blank `brand` is treated as absent (no filtering).
- Response shape is unchanged: `ApiResponse<Page<ProductResponse>>`;
  `ProductResponse` already carries `brand` (required free-text,
  max 256, non-unique).

## Backend Design (`trac-dia-thien-phu-api`)

- Controller: add `@RequestParam(required = false) String brand` to
  the product list endpoint; pass through to the service layer.
- Service/repository: apply the `LOWER()` equality predicate only when
  the param is non-blank; reuse the existing paged-query construction.
- Tests in the existing `ProductControllerTest` style: `?brand=` narrows
  results, matching is case-insensitive, unknown brand returns an empty
  (not error) page, blank `brand` returns unfiltered results.

## Frontend Design (`trac-dia-thien-phu-ui`)

- `src/lib/api.ts`: `ProductResponse` gains `brand: string | null`;
  `ProductQuery` gains optional `brand?: string`; `listProducts` sets
  the `brand` param only when a non-null value is provided.
- `SanPhamPage.tsx`: page query state gains `brand: string | null`
  (initial `null`); the existing fetch effect already keys on the whole
  query object, so no new plumbing. Brand change resets `page` to 0.
- `FilterSidebar.tsx`: brand checkboxes become
  `type="radio" name="brand-filter"`, controlled via new
  `selectedBrand: string | null` + `onSelectBrand: (brand: string | null) => void`
  props (same pattern as the category section). Clicking the active
  radio clears the selection; `Bỏ hết` clears brand and category together.
- `FilterSidebar.tsx`: a `type="search"` input (`Tìm thương hiệu...`)
  sits below the "Thương hiệu" heading and live-filters the 28 static
  labels client-side (case-insensitive `includes`, trimmed). Zero
  matches show `Không tìm thấy thương hiệu`. Filtering never touches
  selection or the `?brand=` request; a hidden selected brand stays selected.
- Components stay under ~100 lines; Vietnamese copy unchanged.

## Data Flow

1. User clicks a brand radio → `SanPhamPage` sets
   `{ brand, page: 0 }` → `listProducts` requests
   `/api/products?brand={...}&page=0&size=12&...`.
2. Grid shows the loading skeletons, then the filtered page;
   pagination buttons reflect the filtered `totalPages`.
3. User clicks the active radio again (or `Bỏ hết`) → `brand` returns
   to `null` → unfiltered request.

## Edge Cases

- Brand + category combination with zero matches reuses the existing
  Vietnamese empty block (`Chưa có sản phẩm trong danh mục này.`).
- Free-text spelling drift (e.g. product stored as `Sokkia` vs UI label
  `SOKKIA`) is absorbed by case-insensitive matching; anything beyond
  case differences still returns empty by design (exact match, no LIKE).
- API-down behavior (error block + retry) is unchanged.
- Unknown/removed `brand` param value degrades to an empty page, never
  an error.

## Verification

- Backend: new controller tests pass; existing suite stays green.
- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes.
- `npm run dev` visual check: select brand → grid narrows and paginates;
  combine with a category → AND narrowing; clear → full list back;
  sidebar scroll box and mobile layout unchanged.
