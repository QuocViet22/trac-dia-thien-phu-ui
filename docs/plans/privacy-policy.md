# Privacy Policy Page (/chinh-sach-bao-mat) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (repo has no subagent tool; native inline execution). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve `/chinh-sach-bao-mat` with the verbatim privacy-policy copy from the live `/chinh-sach` page, styled like the other static pages, and point the contact form's privacy link at it.

**Architecture:** A single presentational page component holds local `intro` / `sections` data and renders breadcrumb + H1 + one content card. `App.tsx` gains one route. `ContactForm.tsx` swaps its `#` placeholder anchor for a `react-router` `Link`. No network calls, no new dependencies.

**Tech Stack:** React 19, react-router 8, Tailwind v4 (`brand #22abff`).

**Spec:** `docs/specs/privacy-policy.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0).
- No test runner — verification is build + lint + `npm run dev` visual check.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- `verbatimModuleSyntax: true` — type imports must use `import type`; `noUnusedLocals` + `noUnusedParameters` — no unused vars; `erasableSyntaxOnly: true` — no enums/namespaces/parameter properties.
- Copy is verbatim from the spec, including the source page's punctuation/capitalisation quirks. Do not "fix" the text.
- Zero network calls; no new dependencies.

## Review Focus

- Text fidelity: every intro paragraph, bullet, and section heading must match `docs/specs/privacy-policy.md` exactly (Task 1 code; dev check by comparing against the live page).
- Route ordering: the new route must sit before the `path="*"` catch-all in `App.tsx` (Task 1 Step 2).
- No horizontal overflow at 375px from long bullet text (Task 2 dev check).
- Contact form link must navigate to `/chinh-sach-bao-mat` without triggering form submit (Task 2 dev check: click link, form stays unsubmitted and route changes).
- Other pages unchanged (Task 2 dev check).

---

### Task 1: Create `PrivacyPolicy` page + route

**Files:**
- Create: `src/pages/privacy_policy/PrivacyPolicy.tsx` (file currently exists but is empty)
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: nothing (local constants only).
- Produces: `PrivacyPolicy` default export — consumed by the route in Step 2.

- [ ] **Step 1: Write `src/pages/privacy_policy/PrivacyPolicy.tsx` with the exact content below.**

```tsx
import { Link } from 'react-router'

interface PolicySection {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  closing?: string
}

const intro = [
  'Cám ơn quý khách đã quan tâm và truy cập vào website. Chúng tôi tôn trọng và cam kết sẽ bảo mật những thông tin mang tính riêng tư của Quý khách.',
  'Chính sách bảo mật sẽ giải thích cách chúng tôi tiếp nhận, sử dụng và (trong trường hợp nào đó) tiết lộ thông tin cá nhân của Quý khách.',
  'Bảo vệ dữ liệu cá nhân và gây dựng được niềm tin cho quý khách là vấn đề rất quan trọng với chúng tôi. Vì vậy, chúng tôi sẽ dùng tên và các thông tin khác liên quan đến quý khách tuân thủ theo nội dung của Chính sách bảo mật. Chúng tôi chỉ thu thập những thông tin cần thiết liên quan đến giao dịch mua bán.',
  'Chúng tôi sẽ giữ thông tin của khách hàng trong thời gian luật pháp quy định hoặc cho mục đích nào đó. Quý khách có thể truy cập vào website và trình duyệt mà không cần phải cung cấp chi tiết cá nhân. Lúc đó, Quý khách đang ẩn danh và chúng tôi không thể biết bạn là ai nếu Quý khách không đăng nhập vào tài khoản của mình.',
]

const sections: PolicySection[] = [
  {
    heading: '1. Thu thập thông tin cá nhân',
    bullets: [
      'Chúng tôi thu thập, lưu trữ và xử lý thông tin của bạn cho quá trình mua hàng và cho những thông báo sau này liên quan đến đơn hàng, và để cung cấp dịch vụ, bao gồm một số thông tin cá nhân: danh hiệu, tên, giới tính, ngày sinh, email, địa chỉ, địa chỉ giao hàng, số điện thoại, fax, chi tiết thanh toán, chi tiết thanh toán bằng thẻ hoặc chi tiết tài khoản ngân hàng.',
      'Chúng tôi sẽ dùng thông tin quý khách đã cung cấp để xử lý đơn đặt hàng, cung cấp các dịch vụ và thông tin yêu cầu thông qua website và theo yêu cầu của bạn.',
      'Hơn nữa, chúng tôi sẽ sử dụng các thông tin đó để quản lý tài khoản của bạn; xác minh và thực hiện giao dịch trực tuyến, nhận diện khách vào web, nghiên cứu nhân khẩu học, gửi thông tin bao gồm thông tin sản phẩm và dịch vụ. Nếu quý khách không muốn nhận bất cứ thông tin tiếp thị của chúng tôi thì có thể từ chối bất cứ lúc nào.',
      'Chúng tôi có thể chuyển tên và địa chỉ cho bên thứ ba để họ giao hàng cho bạn (ví dụ cho bên chuyển phát nhanh hoặc nhà cung cấp).',
      'Chi tiết đơn đặt hàng của bạn được chúng tôi lưu giữ nhưng vì lí do bảo mật nên chúng tôi không công khai trực tiếp được. Tuy nhiên, quý khách có thể tiếp cận thông tin bằng cách đăng nhập tài khoản trên web. Tại đây, quý khách sẽ thấy chi tiết đơn đặt hàng của mình, những sản phẩm đã nhận và những sản phẩm đã gửi và chi tiết email, ngân hàng và bản tin mà bạn đặt theo dõi dài hạn.',
      'Quý khách cam kết bảo mật dữ liệu cá nhân và không được phép tiết lộ cho bên thứ ba. Chúng tôi không chịu bất kỳ trách nhiệm nào cho việc dùng sai mật khẩu nếu đây không phải lỗi của chúng tôi.',
      'Chúng tôi có thể dùng thông tin cá nhân của bạn để nghiên cứu thị trường. mọi thông tin chi tiết sẽ được ẩn và chỉ được dùng để thống kê. Quý khách có thể từ chối không tham gia bất cứ lúc nào.',
    ],
  },
  {
    heading: '2. Bảo mật',
    bullets: [
      'Chúng tôi có biện pháp thích hợp về kỹ thuật và an ninh để ngăn chặn truy cập trái phép hoặc trái pháp luật hoặc mất mát hoặc tiêu hủy hoặc thiệt hại cho thông tin của bạn.',
      'Chúng tôi khuyên quý khách không nên đưa thông tin chi tiết về việc thanh toán với bất kỳ ai bằng e-mail, chúng tôi không chịu trách nhiệm về những mất mát quý khách có thể gánh chịu trong việc trao đổi thông tin của quý khách qua internet hoặc email.',
      'Quý khách tuyệt đối không sử dụng bất kỳ chương trình, công cụ hay hình thức nào khác để can thiệp vào hệ thống hay làm thay đổi cấu trúc dữ liệu. Nghiêm cấm việc phát tán, truyền bá hay cổ vũ cho bất kỳ hoạt động nào nhằm can thiệp, phá hoại hay xâm nhập vào dữ liệu của hệ thống website. Mọi vi phạm sẽ bị tước bỏ mọi quyền lợi cũng như sẽ bị truy tố trước pháp luật nếu cần thiết.',
      'Mọi thông tin giao dịch sẽ được bảo mật nhưng trong trường hợp cơ quan pháp luật yêu cầu, chúng tôi sẽ buộc phải cung cấp những thông tin này cho các cơ quan pháp luật.',
    ],
    closing: 'Các điều kiện, điều khoản và nội dung của trang web này được điều chỉnh bởi luật pháp Việt Nam và tòa án Việt Nam có thẩm quyền xem xét.',
  },
  {
    heading: '3. Quyền lợi khách hàng',
    paragraphs: [
      'Quý khách có quyền yêu cầu truy cập vào dữ liệu cá nhân của mình, có quyền yêu cầu chúng tôi sửa lại những sai sót trong dữ liệu của bạn mà không mất phí. Bất cứ lúc nào bạn cũng có quyền yêu cầu chúng tôi ngưng sử dụng dữ liệu cá nhân của bạn cho mục đích tiếp thị.',
    ],
  },
]

function PrivacyPolicy() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Chính sách bảo mật</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Chính sách bảo mật</h1>
      <article className="bg-white rounded-xl border border-gray-200 p-4 md:p-8 text-[15px] sm:text-base leading-relaxed text-gray-800">
        <div className="space-y-4">
          {intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {sections.map((section) => (
          <section key={section.heading} className="mt-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
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
            {section.closing && <p className="mt-4">{section.closing}</p>}
          </section>
        ))}
      </article>
    </div>
  )
}

export default PrivacyPolicy
```

- [ ] **Step 2: Wire the route in `src/App.tsx`.**

Add `import PrivacyPolicy from './pages/privacy_policy/PrivacyPolicy.tsx'` after the `ContactPage` import, and add `<Route path="/chinh-sach-bao-mat" element={<PrivacyPolicy />} />` immediately after the `/lien-he` route (before the `path="*"` catch-all).

- [ ] **Step 3: Verify typecheck + lint.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

---

### Task 2: Point the contact form privacy link at the new page, then final verify

**Files:**
- Modify: `src/pages/contact/components/ContactForm.tsx`

**Interfaces:**
- Consumes: route `/chinh-sach-bao-mat` (Task 1).
- Produces: nothing downstream.

- [ ] **Step 1: Update `ContactForm.tsx`.**

Add `import { Link } from 'react-router'` as the first import (before the React import), and replace the agree-line anchor:

From:
```tsx
        <span>Tôi đồng ý với <a href="#">Điều khoản và Chính sách bảo mật</a></span>
```

To:
```tsx
        <span>Tôi đồng ý với Điều khoản và <Link to="/chinh-sach-bao-mat" className="text-brand hover:underline">Chính sách bảo mật</Link></span>
```

- [ ] **Step 2: Verify.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

Then `npm run dev` and check:
- `/chinh-sach-bao-mat` renders breadcrumb, H1, all 4 intro paragraphs, all 3 sections with correct bullets/paragraphs, and the Section 2 closing sentence.
- At 375px width the copy wraps with no horizontal scrollbar.
- Footer `Chính sách bảo mật` navigates to the page.
- `/lien-he`: the agree line shows `Chính sách bảo mật` in brand colour; clicking it navigates to `/chinh-sach-bao-mat` and does not submit the form.
- `/`, `/gioi-thieu`, `/san-pham`, `/tin-tuc` render unchanged.
