# Terms of Use Page (/dieu-khoan-su-dung) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (repo has no subagent tool; native inline execution). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/dieu-khoan-su-dung` with the verbatim terms copy, and factor the policy-page layout into one shared component so the privacy and terms pages cannot drift.

**Architecture:** `PolicyArticle.tsx` owns breadcrumb + H1 + content card and renders `intro` paragraphs and `sections`. `PrivacyPolicy.tsx` and `TermsOfUse.tsx` are data-only pages feeding that component. `App.tsx` gains one route; `ContactForm.tsx` links both terms.

**Tech Stack:** React 19, react-router 8, Tailwind v4 (`brand #22abff`).

**Spec:** `docs/specs/terms-of-use.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0).
- No test runner — verification is build + lint + `npm run dev` visual check.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- `verbatimModuleSyntax: true` — type imports must use `import type` (or inline `type` specifier); `noUnusedLocals` + `noUnusedParameters` — no unused vars; `erasableSyntaxOnly: true` — no enums/namespaces/parameter properties.
- Copy verbatim from the spec, including the source's punctuation/capitalisation quirks. Do not "fix" wording.
- Zero network calls; no new dependencies.
- Privacy page copy must not change — only its layout plumbing moves.

## Review Focus

- Refactor parity: `/chinh-sach-bao-mat` must render exactly as before (Task 1 dev check: compare against the current live page before and after).
- Section 6 of the terms page must show lead-in paragraph **and** its bullet, in that order (Task 2 code; dev check).
- Route must sit before `path="*"` in `App.tsx` (Task 2 Step 2).
- Text fidelity against `docs/specs/terms-of-use.md` (Task 2 code).
- Contact-form links navigate without submitting the form (Task 2 dev check).
- No horizontal overflow at 375px on either policy page (Task 2 dev check).

---

### Task 1: Extract `PolicyArticle` and refactor `PrivacyPolicy` onto it

**Files:**
- Create: `src/components/PolicyArticle.tsx`
- Modify: `src/pages/privacy_policy/PrivacyPolicy.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: default `PolicyArticle({ title, intro, sections })` and named type `PolicySection` — consumed by Task 1 Step 2 and Task 2 Step 1.

- [ ] **Step 1: Create `src/components/PolicyArticle.tsx` with the exact content below.**

```tsx
import { Link } from 'react-router'

export interface PolicySection {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  closing?: string
}

interface PolicyArticleProps {
  title: string
  intro: string[]
  sections: PolicySection[]
}

function PolicyArticle({ title, intro, sections }: PolicyArticleProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{title}</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <article className="bg-white rounded-xl border border-gray-200 p-4 md:p-8 text-[15px] sm:text-base leading-relaxed text-gray-800">
        <div className="space-y-4">
          {intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
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
      </article>
    </div>
  )
}

export default PolicyArticle
```

The `space-y-3` wrapper only adds spacing where a section has both paragraphs and bullets; privacy sections have only one or the other, so its render is unchanged.

- [ ] **Step 2: Refactor `src/pages/privacy_policy/PrivacyPolicy.tsx`.**

Replace the file's opening block (the `Link` import plus the local `PolicySection` interface):

From:
```tsx
import { Link } from 'react-router'

interface PolicySection {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  closing?: string
}
```

To:
```tsx
import PolicyArticle, { type PolicySection } from '../../components/PolicyArticle.tsx'
```

Leave the `intro` and `sections` constants byte-for-byte unchanged. Then replace the entire `function PrivacyPolicy() { ... }` block and its `export default PrivacyPolicy` line with:

```tsx
function PrivacyPolicy() {
  return <PolicyArticle title="Chính sách bảo mật" intro={intro} sections={sections} />
}

export default PrivacyPolicy
```

- [ ] **Step 3: Verify typecheck + lint.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

- [ ] **Step 4: Parity check.**

Run `npm run dev` and compare `/chinh-sach-bao-mat` with the current version: same breadcrumb, H1, all 4 intro paragraphs, 3 headings, 11 bullets, closing sentence, and Section 3 paragraph; same spacing. No content or layout change.

---

### Task 2: Create `TermsOfUse`, wire the route, link both terms in the contact form

**Files:**
- Create: `src/pages/terms_of_use/TermsOfUse.tsx`
- Modify: `src/App.tsx`
- Modify: `src/pages/contact/components/ContactForm.tsx`

**Interfaces:**
- Consumes: `PolicyArticle`, `PolicySection` (Task 1).
- Produces: working `/dieu-khoan-su-dung` page. Nothing downstream.

- [ ] **Step 1: Create `src/pages/terms_of_use/TermsOfUse.tsx` with the exact content below.**

```tsx
import PolicyArticle, { type PolicySection } from '../../components/PolicyArticle.tsx'

const intro = [
  'Khi quý khách truy cập vào trang web của chúng tôi có nghĩa là quý khách đồng ý với các điều khoản này. Trang web có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Quy định và Điều kiện sử dụng, vào bất cứ lúc nào. Các thay đổi có hiệu lực ngay khi được đăng trên trang web mà không cần thông báo trước. Và khi quý khách tiếp tục sử dụng trang web, sau khi các thay đổi về quy định và điều kiện được đăng tải, có nghĩa là quý khách chấp nhận với những thay đổi đó.',
  'Quý khách vui lòng kiểm tra thường xuyên để cập nhật những thay đổi của chúng tôi.',
]

const sections: PolicySection[] = [
  {
    heading: '1. Hướng dẫn sử dụng web',
    bullets: [
      'Khi vào web của chúng tôi, người dùng tối thiểu phải 18 tuổi hoặc truy cập dưới sự giám sát của cha mẹ hay người giám hộ hợp pháp.',
      'Chúng tôi cấp giấy phép sử dụng để bạn có thể mua sắm trên web trong khuôn khổ điều khoản và điều kiện sử dụng đã đề ra.',
      'Nghiêm cấm sử dụng bất kỳ phần nào của trang web này với mục đích thương mại hoặc nhân danh bất kỳ đối tác thứ ba nào nếu không được chúng tôi cho phép bằng văn bản. Nếu vi phạm bất cứ điều nào trong đây, chúng tôi sẽ hủy giấy phép của bạn mà không cần báo trước.',
      'Trang web này chỉ dùng để cung cấp thông tin sản phẩm chứ chúng tôi không phải nhà sản xuất nên những nhận xét hiển thị trên web là ý kiến cá nhân của khách hàng, không phải của chúng tôi.',
      'Quý khách phải đăng ký tài khoản với thông tin xác thực về bản thân và phải cập nhật nếu có bất kỳ thay đổi nào. Mỗi người truy cập phải có trách nhiệm với mật khẩu, tài khoản và hoạt động của mình trên web. Hơn nữa, quý khách phải thông báo cho chúng tôi biết khi tài khoản bị truy cập trái phép. Chúng tôi không chịu bất kỳ trách nhiệm nào, dù trực tiếp hay gián tiếp, đối với những thiệt hại hoặc mất mát gây ra do quý khách không tuân thủ quy định.',
      'Trong suốt quá trình đăng ký, quý khách đồng ý nhận email quảng cáo từ website. Sau đó, nếu không muốn tiếp tục nhận mail, quý khách có thể từ chối bằng cách nhấp vào đường link ở dưới cùng trong mọi email quảng cáo.',
    ],
  },
  {
    heading: '2. Chấp nhận đơn hàng và giá cả',
    bullets: [
      'Chúng tôi có quyền từ chối hoặc hủy đơn hàng của quý khách vì bất kỳ lý do gì vào bất kỳ lúc nào. Chúng tôi có thể hỏi thêm về số điện thoại và địa chỉ trước khi nhận đơn hàng.',
      'Chúng tôi cam kết sẽ cung cấp thông tin giá cả chính xác nhất cho người tiêu dùng. Tuy nhiên, đôi lúc vẫn có sai sót xảy ra, ví dụ như trường hợp giá sản phẩm không hiển thị chính xác trên trang web hoặc sai giá, tùy theo từng trường hợp chúng tôi sẽ liên hệ hướng dẫn hoặc thông báo hủy đơn hàng đó cho quý khách. Chúng tôi cũng có quyền từ chối hoặc hủy bỏ bất kỳ đơn hàng nào dù đơn hàng đó đã hay chưa được xác nhận hoặc đã bị thanh toán.',
    ],
  },
  {
    heading: '3. Thương hiệu và bản quyền',
    bullets: [
      'Mọi quyền sở hữu trí tuệ (đã đăng ký hoặc chưa đăng ký), nội dung thông tin và tất cả các thiết kế, văn bản, đồ họa, phần mềm, hình ảnh, video, âm nhạc, âm thanh, biên dịch phần mềm, mã nguồn và phần mềm cơ bản đều là tài sản của chúng tôi. Toàn bộ nội dung của trang web được bảo vệ bởi luật bản quyền của Việt Nam và các công ước quốc tế. Bản quyền đã được bảo lưu.',
    ],
  },
  {
    heading: '4. Quyền pháp lý',
    bullets: [
      'Các điều kiện, điều khoản và nội dung của trang web này được điều chỉnh bởi luật pháp Việt Nam và Tòa án có thẩm quyền tại Việt Nam sẽ giải quyết bất kỳ tranh chấp nào phát sinh từ việc sử dụng trái phép trang web này.',
    ],
  },
  {
    heading: '5. Quy định về bảo mật',
    bullets: [
      'Trang web của chúng tôi coi trọng việc bảo mật thông tin và sử dụng các biện pháp tốt nhất bảo vệ thông tin và việc thanh toán của quý khách. Thông tin của quý khách trong quá trình thanh toán sẽ được mã hóa để đảm bảo an toàn. Sau khi quý khách hoàn thành quá trình đặt hàng, quý khách sẽ thoát khỏi chế độ an toàn.',
      'Quý khách không được sử dụng bất kỳ chương trình, công cụ hay hình thức nào khác để can thiệp vào hệ thống hay làm thay đổi cấu trúc dữ liệu. Trang web cũng nghiêm cấm việc phát tán, truyền bá hay cổ vũ cho bất kỳ hoạt động nào nhằm can thiệp, phá hoại hay xâm nhập vào dữ liệu của hệ thống. Cá nhân hay tổ chức vi phạm sẽ bị tước bỏ mọi quyền lợi cũng như sẽ bị truy tố trước pháp luật nếu cần thiết.',
      'Mọi thông tin giao dịch sẽ được bảo mật nhưng trong trường hợp cơ quan pháp luật yêu cầu, chúng tôi sẽ buộc phải cung cấp những thông tin này cho các cơ quan pháp luật.',
    ],
  },
  {
    heading: '6. Thay đổi, hủy bỏ giao dịch tại website',
    paragraphs: [
      'Trong mọi trường hợp, khách hàng đều có quyền chấm dứt giao dịch nếu đã thực hiện các biện pháp sau đây:',
    ],
    bullets: [
      'Trả lại hàng hoá đã nhận nhưng chưa sử dụng hoặc hưởng bất kỳ lợi ích nào từ hàng hóa đó (theo quy định của chính sách đổi trả hàng).',
    ],
  },
]

function TermsOfUse() {
  return <PolicyArticle title="Điều khoản sử dụng" intro={intro} sections={sections} />
}

export default TermsOfUse
```

- [ ] **Step 2: Wire the route in `src/App.tsx`.**

Add `import TermsOfUse from './pages/terms_of_use/TermsOfUse.tsx'` after the `PrivacyPolicy` import, and add `<Route path="/dieu-khoan-su-dung" element={<TermsOfUse />} />` immediately after the `/chinh-sach-bao-mat` route (before the `path="*"` catch-all).

- [ ] **Step 3: Update the contact form agree line.**

In `src/pages/contact/components/ContactForm.tsx`, replace:

```tsx
        <span>Tôi đồng ý với Điều khoản và <Link to="/chinh-sach-bao-mat" className="text-brand hover:underline">Chính sách bảo mật</Link></span>
```

with:

```tsx
        <span>Tôi đồng ý với <Link to="/dieu-khoan-su-dung" className="text-brand hover:underline">Điều khoản</Link> và <Link to="/chinh-sach-bao-mat" className="text-brand hover:underline">Chính sách bảo mật</Link></span>
```

- [ ] **Step 4: Verify.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

Then `npm run dev` and check:
- `/dieu-khoan-su-dung`: breadcrumb, H1 `Điều khoản sử dụng`, 2 intro paragraphs, 6 headings, Section 6 shows the lead-in then its bullet.
- `/chinh-sach-bao-mat` still matches the pre-refactor render.
- Both pages wrap without horizontal scroll at 375px.
- Footer `Điều khoản sử dụng` navigates to the new page.
- `/lien-he`: clicking `Điều khoản` and `Chính sách bảo mật` navigates to the right page and does not submit the form.
- `/`, `/gioi-thieu`, `/san-pham`, `/tin-tuc` unchanged.
