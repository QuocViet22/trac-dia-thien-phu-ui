# Purchase Guide Page (/huong-dan-mua-hang) — Design Spec

Source: `https://tracdia247.vn/huong-dan` (live page titled "Hướng dẫn": a 5-step buying guide).
Target: production-ready React page at `/huong-dan-mua-hang` inside the existing `SiteLayout`, reusing the shared static-article layout.

## Goals

- Serve `/huong-dan-mua-hang` via `react-router` (the footer link `Hướng dẫn mua hàng` in `Footer.tsx` already points here; it currently falls through to the catch-all redirect).
- Generalise the shared layout introduced for the policy pages, since this page has the same shell but different content shape:
  - Rename `src/components/PolicyArticle.tsx` → `src/components/ContentArticle.tsx`; rename the exported type `PolicySection` → `ContentSection`. Update the two existing consumers (`PrivacyPolicy.tsx`, `TermsOfUse.tsx`).
  - Props: `{ title: string; intro?: string[]; outro?: string[]; sections: ContentSection[] }`.
  - `intro` renders above the sections only when non-empty; `outro` renders after the sections as spaced paragraphs (`mt-8 space-y-4`) only when non-empty. Breadcrumb, H1, card, and section typography stay exactly as today.
  - Both new props are optional, so the privacy and terms pages render unchanged.
- Page H1 and breadcrumb label: `Hướng dẫn mua hàng` (matches the footer link and route). The source page's own H1 is the shorter `Hướng dẫn`; this is a deliberate, small deviation for navigation consistency.
- Port the guide copy verbatim (Vietnamese, including its existing typos/formatting quirks), presented as five sections:
  - `Bước 1:` + 1 paragraph
  - `Bước 2:` + 1 paragraph and 3 sub-option bullets
  - `Bước 3:` + 1 paragraph and 3 sub-option bullets
  - `Bước 4:` + 1 paragraph
  - `Bước 5:` + 1 paragraph
  - Closing paragraphs after all sections: the callback/confirmation sentence and `Trân trọng cảm ơn.`
- Sub-options under Bước 2 and Bước 3 are rendered as a bullet list, matching the source's stacked "Nếu bạn…" lines.
- No intro paragraphs above Bước 1 (the source starts directly with the first step).

## Non-goals

- No copy editing or rewriting; no new steps invented.
- No backend/CMS: content stays static constants in the page file. `src/lib/api.ts` has no guide/page endpoint.
- No separate pages for the live site's `/huong-dan` variants ("Hướng dẫn thanh toán", "Hướng dẫn giao nhận"); our footer only links `Hướng dẫn mua hàng`, and the requested route is only `/huong-dan-mua-hang`.
- No SEO `<head>` wiring (consistent with other static pages).
- No visual redesign: same `max-w-7xl` shell, one white card, same typography as the policy pages.

## API Contract

- None. This page makes zero network calls.

## Architecture

- `src/components/ContentArticle.tsx` (renamed from `PolicyArticle.tsx`): shared breadcrumb + H1 + card. Default export `ContentArticle`; named type export `ContentSection` (`{ heading: string; paragraphs?: string[]; bullets?: string[]; closing?: string }`).
- `src/pages/privacy_policy/PrivacyPolicy.tsx` (modify): update import path/names only; copy constants untouched.
- `src/pages/terms_of_use/TermsOfUse.tsx` (modify): update import path/names only; copy constants untouched.
- `src/pages/purchase_guide/PurchaseGuide.tsx` (new): data-only page returning `<ContentArticle title="Hướng dẫn mua hàng" sections={sections} outro={outro} />` (no `intro`).
- `src/App.tsx` (modify): import `PurchaseGuide`; add `<Route path="/huong-dan-mua-hang" element={<PurchaseGuide />} />` after the terms route and before the catch-all.
- Spec file: `docs/specs/purchase-guide.md` (this file); implementation plan follows approval in `docs/plans/purchase-guide.md`.

## Content

Section 1:

- Heading: `Bước 1:`
- Paragraph: `Truy cập website và lựa chọn sản phẩm cần mua để mua hàng`

Section 2:

- Heading: `Bước 2:`
- Paragraph: `Click và sản phẩm muốn mua, màn hình hiển thị ra pop up với các lựa chọn sau`
- Bullets:
  1. `Nếu bạn muốn tiếp tục mua hàng: Bấm vào phần tiếp tục mua hàng để lựa chọn thêm sản phẩm vào giỏ hàng`
  2. `Nếu bạn muốn xem giỏ hàng để cập nhật sản phẩm: Bấm vào xem giỏ hàng`
  3. `Nếu bạn muốn đặt hàng và thanh toán cho sản phẩm này vui lòng bấm vào: Đặt hàng và thanh toán`

Section 3:

- Heading: `Bước 3:`
- Paragraph: `Lựa chọn thông tin tài khoản thanh toán`
- Bullets:
  1. `Nếu bạn đã có tài khoản vui lòng nhập thông tin tên đăng nhập là email và mật khẩu vào mục đã có tài khoản trên hệ thống`
  2. `Nếu bạn chưa có tài khoản và muốn đăng ký tài khoản vui lòng điền các thông tin cá nhân để tiếp tục đăng ký tài khoản. Khi có tài khoản bạn sẽ dễ dàng theo dõi được đơn hàng của mình`
  3. `Nếu bạn muốn mua hàng mà không cần tài khoản vui lòng nhấp chuột vào mục đặt hàng không cần tài khoản`

Section 4:

- Heading: `Bước 4:`
- Paragraph: `Điền các thông tin của bạn để nhận đơn hàng, lựa chọn hình thức thanh toán và vận chuyển cho đơn hàng của mình`

Section 5:

- Heading: `Bước 5:`
- Paragraph: `Xem lại thông tin đặt hàng, điền chú thích và gửi đơn hàng`

Outro paragraphs:

1. `Sau khi nhận được đơn hàng bạn gửi chúng tôi sẽ liên hệ bằng cách gọi điện lại để xác nhận lại đơn hàng và địa chỉ của bạn.`
2. `Trân trọng cảm ơn.`

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes.
- `npm run dev` visual check at desktop + mobile:
  - `/huong-dan-mua-hang` shows breadcrumb, H1 `Hướng dẫn mua hàng`, five `Bước N:` headings in order, the correct paragraph/bullet content under each, and both outro sentences below the last step.
  - `/chinh-sach-bao-mat` and `/dieu-khoan-su-dung` render exactly as before the rename (same headings, copy, spacing).
  - No horizontal overflow at 375px.
  - Footer `Hướng dẫn mua hàng` navigates to the new page.
  - `/`, `/gioi-thieu`, `/lien-he`, `/san-pham`, `/tin-tuc` unchanged.
