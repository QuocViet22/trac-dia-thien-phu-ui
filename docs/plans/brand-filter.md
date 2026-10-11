# Brand Filter (single-select) for /san-pham — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (repo has no subagent tool; native inline execution). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the "Thương hiệu" sidebar on `/san-pham` a working single-select filter backed by a new `?brand=` param on `GET /api/products`.

**Architecture:** Backend adds derived `IgnoreCase` repository queries and an optional `brand` request param, AND-combined with `categoryId` in the existing paged query. Frontend adds `brand` to the page query state and swaps the sidebar checkboxes for a controlled radio group. One plan spans two repos because the feature is one vertical slice; each task is independently testable in its own repo.

**Tech Stack:** Spring Boot (`@RequestParam`, Spring Data derived queries, MockMvc/`@DataJpaTest`), React 19 (`useEffect`/`useState`), react-router 8, Tailwind v4 (`brand #22abff`), `fetch` + `URLSearchParams`.

**Spec:** `docs/specs/brand-filter.md` (parent: `docs/specs/product.md`; backend contract: `trac-dia-thien-phu-api/docs/specs/product_controller.md`)

## Global Constraints

- Backend workdir is `D:\Code\TracDiaThienPhu\trac-dia-thien-phu-api`; UI workdir is `D:\Code\TracDiaThienPhu\trac-dia-thien-phu-ui`.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`. Backend wrapper is `.\mvnw.cmd`.
- Backend matching is case-insensitive EXACT (`IgnoreCase` derived query); no `LIKE`/contains.
- Blank `brand` param is treated as absent (no filtering), never an error.
- UI: `verbatimModuleSyntax: true` — type imports must use `import type`; `noUnusedLocals` + `noUnusedParameters` — no unused vars; `erasableSyntaxOnly: true` — no enums/namespaces/parameter properties.
- UI components stay ≤ ~100 lines each; Vietnamese copy verbatim from the spec.
- No test runner in the UI repo — UI verification is `npm run build` + `npm run lint` + `npm run dev` visual check.
- Do not commit; the human partner commits on request.

## Review Focus

- Blank `?brand=` (empty string or whitespace) must return unfiltered results, not an empty page — pinned by Task 2 service test `listWithBlankBrandIgnoresBrandFilter`.
- Brand stored as `acme` must match `?brand=AcMe` (case-insensitive exact) — pinned by Task 2 repository test `findByBrandIgnoreCaseMatchesRegardlessOfCase`.
- Changing brand must reset pagination to page 1 so users are never stranded on an empty page — pinned by Task 3 dev check (select brand while on page 3, grid shows page 1).
- Clicking the already-selected brand radio must clear the selection — pinned by Task 3 dev check.
- Brand + category with zero combined matches must show the Vietnamese empty block, never an error — pinned by Task 3 dev check.

---

### Task 1: Backend `?brand=` filter (repository + service + controller)

**Files:**
- Modify: `src/main/java/com/trac_dia_thien_phu_api/repository/ProductRepository.java` (add 2 methods)
- Modify: `src/main/java/com/trac_dia_thien_phu_api/service/ProductService.java` (1 signature)
- Modify: `src/main/java/com/trac_dia_thien_phu_api/service/impl/ProductServiceImpl.java` (1 method)
- Modify: `src/main/java/com/trac_dia_thien_phu_api/controller/ProductController.java` (1 endpoint)
- Modify: `src/test/java/com/trac_dia_thien_phu_api/service/ProductServiceTest.java` (lines 100, 111 — 2 call sites)
- Modify: `src/test/java/com/trac_dia_thien_phu_api/controller/ProductControllerTest.java` (lines 51, 63, 73 — 3 mocks)

**Interfaces:**
- Consumes: existing `findByCategoryId(UUID, Pageable)` pattern; `Pageable` passthrough (unchanged).
- Produces: `ProductRepository.findByBrandIgnoreCase(String, Pageable)`, `ProductRepository.findByCategoryIdAndBrandIgnoreCase(UUID, String, Pageable)`; `ProductService.list(UUID categoryId, String brand, Pageable pageable)` — consumed by Task 2 tests and the Task 3 UI contract (`?brand=` query param).

- [ ] **Step 1: Change the service signature to 3 args (compiler-driven RED).** In `ProductService.java` line 16, replace `Page<Product> list(UUID categoryId, Pageable pageable);` with `Page<Product> list(UUID categoryId, String brand, Pageable pageable);`. Run `.\mvnw.cmd -q compile; if ($?) { .\mvnw.cmd -q test-compile }` from the API workdir. Expected: BUILD FAILURE naming the 5 stale 2-arg call sites (`ProductServiceImpl`, `ProductController`, `ProductServiceTest` x2, `ProductControllerTest` x3 mocks).

- [ ] **Step 2: Add the repository queries.** In `ProductRepository.java` after line 17 (`findByCategoryId`), insert the exact lines below.

```java
    Page<Product> findByBrandIgnoreCase(String brand, Pageable pageable);

    Page<Product> findByCategoryIdAndBrandIgnoreCase(UUID categoryId, String brand, Pageable pageable);
```

- [ ] **Step 3: Implement the service branch.** In `ProductServiceImpl.java`, replace the `list` method body (lines 55-59) with the exact code below.

```java
    public Page<Product> list(UUID categoryId, String brand, Pageable pageable) {
        boolean hasBrand = brand != null && !brand.isBlank();
        if (categoryId == null) {
            return hasBrand
                    ? products.findByBrandIgnoreCase(brand, pageable)
                    : products.findAll(pageable);
        }
        return hasBrand
                ? products.findByCategoryIdAndBrandIgnoreCase(categoryId, brand, pageable)
                : products.findByCategoryId(categoryId, pageable);
    }
```

- [ ] **Step 4: Accept the request param.** In `ProductController.java`, replace lines 45-47 with the exact code below.

```java
    public ApiResponse<Page<ProductResponse>> list(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String brand, Pageable pageable) {
        Page<Product> page = service.list(categoryId, brand, pageable);
```

- [ ] **Step 5: Fix the 5 stale test call sites.** In `ProductServiceTest.java`, replace `service.list(null, pageable)` (line 100) with `service.list(null, null, pageable)` and `service.list(categoryId, pageable)` (line 111) with `service.list(categoryId, null, pageable)`. In `ProductControllerTest.java`, replace `service.list(eq(null), any())` (lines 51, 73) with `service.list(eq(null), eq(null), any())` and `service.list(eq(categoryId), any())` (line 63) with `service.list(eq(categoryId), eq(null), any())`.

- [ ] **Step 6: Verify GREEN.** Run `.\mvnw.cmd test` from the API workdir. Expected: BUILD SUCCESS, all existing tests pass (behavior unchanged when `brand` is absent).

---

### Task 2: Backend tests pinning brand behavior

**Files:**
- Modify: `src/test/java/com/trac_dia_thien_phu_api/controller/ProductControllerTest.java` (append 1 test)
- Modify: `src/test/java/com/trac_dia_thien_phu_api/service/ProductServiceTest.java` (append 3 tests)
- Modify: `src/test/java/com/trac_dia_thien_phu_api/repository/ProductRepositoryTest.java` (append 1 test)

**Interfaces:**
- Consumes: `ProductService.list(UUID, String, Pageable)` and the two repository methods from Task 1; existing helpers `product(String)`, `newProduct(category, name, alias)`, `savedCategory(name)`.
- Produces: failing-then-passing coverage only; no production API change.

- [ ] **Step 1: Add the controller test.** Append the exact test below to `ProductControllerTest` (after `listWithoutFilterReturnsAll`, line 80).

```java
    @Test
    void listPassesBrandFilter() throws Exception {
        when(service.list(eq(null), eq("Acme"), any())).thenReturn(new PageImpl<>(List.of(product("Compass"))));
        when(service.imagesForProducts(any())).thenReturn(Map.of());

        mockMvc.perform(get("/api/products").param("brand", "Acme"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].name").value("Compass"));
    }
```

- [ ] **Step 2: Add the service tests.** Append the exact tests below to `ProductServiceTest` (after `listWithCategoryFiltersByCategory`, line 113).

```java
    @Test
    void listWithBrandFiltersByBrandIgnoreCase() {
        PageRequest pageable = PageRequest.of(0, 10);
        when(products.findByBrandIgnoreCase("acme", pageable)).thenReturn(Page.empty(pageable));

        assertThat(service.list(null, "acme", pageable).getTotalElements()).isZero();
        verify(products).findByBrandIgnoreCase("acme", pageable);
    }

    @Test
    void listWithCategoryAndBrandFiltersByBoth() {
        UUID categoryId = UUID.randomUUID();
        PageRequest pageable = PageRequest.of(0, 10);
        when(products.findByCategoryIdAndBrandIgnoreCase(categoryId, "Acme", pageable)).thenReturn(Page.empty(pageable));

        assertThat(service.list(categoryId, "Acme", pageable).getTotalElements()).isZero();
        verify(products).findByCategoryIdAndBrandIgnoreCase(categoryId, "Acme", pageable);
    }

    @Test
    void listWithBlankBrandIgnoresBrandFilter() {
        PageRequest pageable = PageRequest.of(0, 10);
        when(products.findAll(pageable)).thenReturn(Page.empty(pageable));

        assertThat(service.list(null, "  ", pageable).getTotalElements()).isZero();
        verify(products).findAll(pageable);
    }
```

- [ ] **Step 3: Add the repository test.** Append the exact test below to `ProductRepositoryTest` (after `findByCategoryIdFiltersAndPages`, line 82).

```java
    @Test
    void findByBrandIgnoreCaseMatchesRegardlessOfCase() {
        Category category = savedCategory("Cat");
        Product lower = newProduct(category, "P1", "p1");
        lower.setBrand("acme");
        products.saveAndFlush(lower);
        Product upper = newProduct(category, "P2", "p2");
        upper.setBrand("ACME");
        products.saveAndFlush(upper);
        Product other = newProduct(category, "P3", "p3");
        other.setBrand("Other");
        products.saveAndFlush(other);

        Page<Product> page = products.findByBrandIgnoreCase("AcMe", PageRequest.of(0, 10));

        assertThat(page.getTotalElements()).isEqualTo(2);
        assertThat(page.getContent()).extracting(Product::getName).containsExactlyInAnyOrder("P1", "P2");
    }
```

- [ ] **Step 4: Verify.** Run `.\mvnw.cmd test` from the API workdir. Expected: BUILD SUCCESS including the 5 new tests. (If a new test fails, the Task 1 production code is wrong — fix there, not in the test.)

---

### Task 3: UI wiring (query state + radio group)

**Files:**
- Modify: `src/lib/api.ts` (`ProductResponse` + `ProductQuery` + `listProducts`)
- Modify: `src/pages/san-pham/SanPhamPage.tsx` (query state + fetch call + sidebar props)
- Modify: `src/pages/san-pham/components/FilterSidebar.tsx` (radio group + clear behavior)

**Interfaces:**
- Consumes: backend `?brand=` param from Task 1; `FilterSidebar` keeps its existing category props.
- Produces: working single-select brand filter. Nothing downstream.

- [ ] **Step 1: Expose brand in the API layer.** In `src/lib/api.ts`, add `brand: string | null;` to `ProductResponse` after the `seoAlias` line, add `brand?: string;` to `ProductQuery` after `categoryId?: string;`, and insert the brand block into `listProducts` after the `categoryId` block with the exact code below.

```typescript
  if (query.brand) {
    params.set('brand', query.brand)
  }
```

- [ ] **Step 2: Track brand in page state.** In `SanPhamPage.tsx`, extend `ProductQueryState` with `brand: string | null`, change the initial state to `{ page: 0, categoryId: null, brand: null, sort: 'createdAt,desc' }`, and add `brand: query.brand ?? undefined` to the `listProducts` call alongside `categoryId`. No effect changes needed — the fetch effect already keys on the whole `query` object.

- [ ] **Step 3: Replace checkboxes with radios.** In `FilterSidebar.tsx`, replace the props interface and the brand `<ul>` block with the exact code below (scroll-box classes unchanged; `Bỏ hết` now clears both filters).

```tsx
interface FilterSidebarProps {
  categories: CategoryResponse[]
  selectedCategoryId: string | null
  onSelectCategory: (id: string | null) => void
  selectedBrand: string | null
  onSelectBrand: (brand: string | null) => void
}
```

```tsx
        <button type="button" onClick={() => { onSelectCategory(null); onSelectBrand(null) }} className="text-sm text-gray-500 hover:text-brand">Bỏ hết</button>
```

```tsx
      <ul className="space-y-1.5 mb-4 max-h-[420px] overflow-y-auto overscroll-contain pr-1">
        {brands.map((brand) => (
          <li key={brand}>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="radio"
                name="brand-filter"
                checked={selectedBrand === brand}
                onChange={() => onSelectBrand(brand)}
                onClick={() => { if (selectedBrand === brand) onSelectBrand(null) }}
                className="accent-[#22abff]"
              />
              {brand}
            </label>
          </li>
        ))}
      </ul>
```

- [ ] **Step 4: Wire the sidebar.** In `SanPhamPage.tsx`, replace the `<FilterSidebar ... />` element with the exact code below.

```tsx
        <FilterSidebar
          categories={categories}
          selectedCategoryId={query.categoryId}
          onSelectCategory={(id) => updateQuery({ categoryId: id, page: 0 })}
          selectedBrand={query.brand}
          onSelectBrand={(brand) => updateQuery({ brand, page: 0 })}
        />
```

- [ ] **Step 5: Verify.** Run `npm run build; if ($?) { npm run lint }` from the UI workdir. Expected: both exit 0.

### Task 5: Brand search box (client-side label filter)

- Modify: `src/pages/product/components/FilterSidebar.tsx` (search input + filtered list)

- [ ] **Step 1: Add local search state.** `useState('')` + `visibleBrands = brands.filter(includes, case-insensitive, trimmed)`.
- [ ] **Step 2: Render `<input type="search" placeholder="Tìm thương hiệu...">` below "Thương hiệu", then map `visibleBrands`; zero matches show `Không tìm thấy thương hiệu`.**
- [ ] **Step 3: Verify.** `npm run build; if ($?) { npm run lint }`, then `npm run dev` visual check: typing filters labels, selection + `?brand=` behavior unchanged.

---

### Task 4: End-to-end verification in dev

**Files:** None (manual checks with both servers running).

- [ ] **Step 1: Brand narrows the grid.** With the API and `npm run dev` running, open `/san-pham`, select a brand radio (e.g. Sokkia). Expected: grid shows skeletons then only that brand's products; pagination reflects the filtered total.
- [ ] **Step 2: Page reset.** Go to page 3 unfiltered, then select a brand. Expected: grid jumps to page 1 of the filtered results.
- [ ] **Step 3: Clear paths.** Click the active brand radio again. Expected: full unfiltered list returns. Select a brand plus a category, click `Bỏ hết`. Expected: both clear, full list returns.
- [ ] **Step 4: Empty combination.** Pick a brand + category combination with no products. Expected: the Vietnamese empty block, no error.
- [ ] **Step 5: Regression.** Confirm `/` and `/gioi-thieu` are unchanged and the sidebar scroll box looks as before.
