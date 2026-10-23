# Purchase Guide Page (/huong-dan-mua-hang) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (repo has no subagent tool; native inline execution). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/huong-dan-mua-hang` with the verbatim 5-step buying guide, by generalising the shared static-article component (rename to `ContentArticle`, optional `intro`/`outro`).

**Architecture:** `ContentArticle.tsx` owns breadcrumb + H1 + card and renders optional intro, sections, optional outro. `PurchaseGuide.tsx` is data-only. Privacy and terms pages only get import updates. `App.tsx` gains one route.

**Tech Stack:** React 19, react-router 8, Tailwind v4 (`brand #22abff`).

**Spec:** `docs/specs/purchase-guide.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0).
- No test runner — verification is build + lint + `npm run dev` visual check.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- `verbatimModuleSyntax: true` — type imports must use `import type` (or inline `type` specifier); `noUnusedLocals` + `noUnusedParameters` — no unused vars; `erasableSyntaxOnly: true` — no enums/namespaces/parameter properties.
- Copy verbatim from the spec, including the source's punctuation/capitalisation quirks (e.g. `Click và sản phẩm muốn mua`). Do not "fix" wording.
- Zero network calls; no new dependencies.
- Privacy and terms page copy must not change — only import lines move.

## Review Focus

- Rename safety: no stale `PolicyArticle` / `PolicySection` references anywhere (`grep` both terms at the end of Task 1).
- Privacy/terms parity after the rename (Task 1 dev check).
- Step order and sub-option bullets: Bước 2 and Bước 3 each show 1 paragraph + 3 bullets; Bước 1, 4, 5 show only a paragraph (Task 2 code; dev check).
- Outro must render **below** Bước 5, with spacing, and not inside the last section (Task 2 code; dev check).
- Route must sit before `path="*"` in `App.tsx` (Task 2 Step 2).
- Text fidelity against `docs/specs/purchase-guide.md` (Task 2 code).
- No horizontal overflow at 375px (Task 2 dev check).

---

### Task 1: Rename `PolicyArticle` → `ContentArticle`, add optional `intro`/`outro`

**Files:**
- Create: `src/components/ContentArticle.tsx`
- Delete: `src/components/PolicyArticle.tsx`
- Modify: `src/pages/privacy_policy/PrivacyPolicy.tsx`
- Modify: `src/pages/terms_of_use/TermsOfUse.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: default `ContentArticle({ title, intro?, outro?, sections })` and named type `ContentSection` — consumed by Task 1 Steps 3–4 and Task 2 Step 1.

- [ ] **Step 1: Create `src/components/ContentArticle.tsx` with the exact content below.**

```tsx
import { Link } from 'react-router'

export interface ContentSection {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  closing?: string
}

interface ContentArticleProps {
  title: string
  intro?: string[]
  outro?: string[]
  sections: ContentSection[]
}

function ContentArticle({ title, intro, outro, sections }: ContentArticleProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{title}</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <article className="bg-white rounded-xl border border-gray-200 p-4 md:p-8 text-[15px] sm:text-base leading-relaxed text-gray-800">
        {intro && intro.length > 0 && (
          <div className="space-y-4">
            {intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
        {sections.map((section) => (
          <section key={section.heading} className="mt-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
            {(section.paragraphs || section.bullets) && (
              <div className="space-y-3">
                {section.paragraphs && (
                  <div className="space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                )}
                {section.bullets && (
                  <ul className="list-disc pl-5 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {section.closing && <p className="mt-4">{section.closing}</p>}
          </section>
        ))}
        {outro && outro.length > 0 && (
          <div className="mt-8 space-y-4">
            {outro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}

export default ContentArticle
```

- [ ] **Step 2: Delete `src/components/PolicyArticle.tsx`.**

Run: `Remove-Item src/components/PolicyArticle.tsx`
Expected: file removed; build will fail until Steps 3–4 are done.

- [ ] **Step 3: Update `src/pages/privacy_policy/PrivacyPolicy.tsx` import.**

From:
```tsx
import PolicyArticle, { type PolicySection } from '../../components/PolicyArticle.tsx'
```

To:
```tsx
import ContentArticle, { type ContentSection } from '../../components/ContentArticle.tsx'
```

Also change the local declaration `const sections: PolicySection[] = [` to `const sections: ContentSection[] = [`, and the component body to:

```tsx
function PrivacyPolicy() {
  return <ContentArticle title="Chính sách bảo mật" intro={intro} sections={sections} />
}

export default PrivacyPolicy
```

Nothing else in the file changes.

- [ ] **Step 4: Update `src/pages/terms_of_use/TermsOfUse.tsx` import.**

From:
```tsx
import PolicyArticle, { type PolicySection } from '../../components/PolicyArticle.tsx'
```

To:
```tsx
import ContentArticle, { type ContentSection } from '../../components/ContentArticle.tsx'
```

Also change `const sections: PolicySection[] = [` to `const sections: ContentSection[] = [`, and the component body to:

```tsx
function TermsOfUse() {
  return <ContentArticle title="Điều khoản sử dụng" intro={intro} sections={sections} />
}

export default TermsOfUse
```

Nothing else in the file changes.

- [ ] **Step 5: Check for stale references.**

Run: `Select-String -Path src\**\*.tsx -Pattern 'PolicyArticle|PolicySection'`
Expected: no matches.

- [ ] **Step 6: Verify typecheck + lint.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

- [ ] **Step 7: Parity check.**

Run `npm run dev` and confirm `/chinh-sach-bao-mat` and `/dieu-khoan-su-dung` render exactly as before (same headings, copy, spacing; no empty gap where the intro used to be).

---

### Task 2: Create `PurchaseGuide` + route

**Files:**
- Create: `src/pages/purchase_guide/PurchaseGuide.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `ContentArticle`, `ContentSection` (Task 1).
- Produces: working `/huong-dan-mua-hang` page. Nothing downstream.

- [ ] **Step 1: Create `src/pages/purchase_guide/PurchaseGuide.tsx` with the exact content below.**

```tsx
import ContentArticle, { type ContentSection } from '../../components/ContentArticle.tsx'

const sections: ContentSection[] = [
  {
    heading: 'Bước 1:',
    paragraphs: ['Truy cập website và lựa chọn sản phẩm cần mua để mua hàng'],
  },
  {
    heading: 'Bước 2:',
    paragraphs: ['Click và sản phẩm muốn mua, màn hình hiển thị ra pop up với các lựa chọn sau'],
    bullets: [
      'Nếu bạn muốn tiếp tục mua hàng: Bấm vào phần tiếp tục mua hàng để lựa chọn thêm sản phẩm vào giỏ hàng',
      'Nếu bạn muốn xem giỏ hàng để cập nhật sản phẩm: Bấm vào xem giỏ hàng',
      'Nếu bạn muốn đặt hàng và thanh toán cho sản phẩm này vui lòng bấm vào: Đặt hàng và thanh toán',
    ],
  },
  {
    heading: 'Bước 3:',
    paragraphs: ['Lựa chọn thông tin tài khoản thanh toán'],
    bullets: [
      'Nếu bạn đã có tài khoản vui lòng nhập thông tin tên đăng nhập là email và mật khẩu vào mục đã có tài khoản trên hệ thống',
      'Nếu bạn chưa có tài khoản và muốn đăng ký tài khoản vui lòng điền các thông tin cá nhân để tiếp tục đăng ký tài khoản. Khi có tài khoản bạn sẽ dễ dàng theo dõi được đơn hàng của mình',
      'Nếu bạn muốn mua hàng mà không cần tài khoản vui lòng nhấp chuột vào mục đặt hàng không cần tài khoản',
    ],
  },
  {
    heading: 'Bước 4:',
    paragraphs: ['Điền các thông tin của bạn để nhận đơn hàng, lựa chọn hình thức thanh toán và vận chuyển cho đơn hàng của mình'],
  },
  {
    heading: 'Bước 5:',
    paragraphs: ['Xem lại thông tin đặt hàng, điền chú thích và gửi đơn hàng'],
  },
]

const outro = [
  'Sau khi nhận được đơn hàng bạn gửi chúng tôi sẽ liên hệ bằng cách gọi điện lại để xác nhận lại đơn hàng và địa chỉ của bạn.',
  'Trân trọng cảm ơn.',
]

function PurchaseGuide() {
  return <ContentArticle title="Hướng dẫn mua hàng" sections={sections} outro={outro} />
}

export default PurchaseGuide
```

- [ ] **Step 2: Wire the route in `src/App.tsx`.**

Add `import PurchaseGuide from './pages/purchase_guide/PurchaseGuide.tsx'` after the `TermsOfUse` import, and add `<Route path="/huong-dan-mua-hang" element={<PurchaseGuide />} />` immediately after the `/dieu-khoan-su-dung` route (before the `path="*"` catch-all).

- [ ] **Step 3: Verify.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

Then `npm run dev` and check:
- `/huong-dan-mua-hang`: breadcrumb, H1 `Hướng dẫn mua hàng`, five `Bước N:` headings in order; Bước 2 and Bước 3 each have 1 paragraph + 3 bullets; Bước 1/4/5 have 1 paragraph; both outro sentences appear below Bước 5 with spacing.
- `/chinh-sach-bao-mat` and `/dieu-khoan-su-dung` unchanged.
- No horizontal scroll at 375px.
- Footer `Hướng dẫn mua hàng` navigates to the new page.
- `/`, `/gioi-thieu`, `/lien-he`, `/san-pham`, `/tin-tuc` unchanged.
