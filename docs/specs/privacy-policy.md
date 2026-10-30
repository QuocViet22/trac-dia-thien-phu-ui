# Privacy Policy Page (/chinh-sach-bao-mat) — Design Spec

Source: `https://tracdia247.vn/chinh-sach` (live page titled "Chính sách", body is the privacy-policy copy).
Target: production-ready React page at `/chinh-sach-bao-mat` inside the existing `SiteLayout`.

## Goals

- Serve `/chinh-sach-bao-mat` via `react-router`: renders `PrivacyPolicy` inside `SiteLayout` (route added in `App.tsx`; the footer link `Chính sách bảo mật` in `Footer.tsx` already points here).
- Port the source copy verbatim (Vietnamese, including its existing typos/diacritics as published): 4 intro paragraphs, then 3 numbered sections — `1. Thu thập thông tin cá nhân` (7 bullets), `2. Bảo mật` (4 bullets + 1 closing paragraph about Vietnamese law), `3. Quyền lợi khách hàng` (1 paragraph).
- Layout: breadcrumb (`Trang chủ` → `/` / `Chính sách bảo mật`), H1 `Chính sách bảo mật`, then one white content card (`rounded-xl border border-gray-200 p-4 md:p-8`) matching the contact/introduction page patterns.
- Typography: Tailwind utility classes only (no `@tailwindcss/typography`; not installed). Body text `[15px] sm:text-base leading-relaxed text-gray-800`, paragraphs spaced with `space-y-4`, section headings `text-lg md:text-xl font-bold text-gray-900 mt-8 mb-3`, bullet lists `list-disc pl-5 space-y-2`.
- Responsive: single column, `max-w-7xl` page shell with `px-4 lg:px-8 py-4`; long text wraps without horizontal overflow on mobile.
- Static content in the component file: no backend call. The public API (`src/lib/api.ts`) exposes no page/policy endpoint, and a policy CMS endpoint is out of scope (would require a separate API spec/plan).
- Optional related fix (user-confirmed): in `src/pages/contact/components/ContactForm.tsx`, point the `Chính sách bảo mật` part of the agree line at `/chinh-sach-bao-mat` via `react-router` `Link` instead of the `#` placeholder.

## Non-goals

- No admin/CMS editing for this page; content is a typed constant in the page file.
- No additions for the other footer links (`/dieu-khoan-su-dung`, `/huong-dan-mua-hang`); they still fall through to the catch-all redirect until they get their own specs.
- No document `<head>`/SEO wiring (consistent with other static pages).
- No visual redesign of the source copy (no rewriting, no shortening, no legal review).

## API Contract

- None. This page makes zero network calls.

## Architecture

- `App.tsx`: add `import PrivacyPolicy from './pages/privacy_policy/PrivacyPolicy.tsx'` and `<Route path="/chinh-sach-bao-mat" element={<PrivacyPolicy />} />`.
- `src/pages/privacy_policy/PrivacyPolicy.tsx` (currently empty): page shell (breadcrumb + H1 + content card) plus local data constants (`intro` paragraphs, `sections` array of `{ heading, paragraphs, bullets }`). Single file, well under ~150 lines; no `components/` split needed.
- Optional: `src/pages/contact/components/ContactForm.tsx` — swap the placeholder `<a href="#">` for `Link to="/chinh-sach-bao-mat"` around the `Chính sách bảo mật` text.
- Spec file: `docs/specs/privacy-policy.md` (this file); implementation plan follows approval in `docs/plans/privacy-policy.md`.

## Content

Intro paragraphs (verbatim):

1. `Cám ơn quý khách đã quan tâm và truy cập vào website. Chúng tôi tôn trọng và cam kết sẽ bảo mật những thông tin mang tính riêng tư của Quý khách.`
2. `Chính sách bảo mật sẽ giải thích cách chúng tôi tiếp nhận, sử dụng và (trong trường hợp nào đó) tiết lộ thông tin cá nhân của Quý khách.`
3. `Bảo vệ dữ liệu cá nhân và gây dựng được niềm tin cho quý khách là vấn đề rất quan trọng với chúng tôi. Vì vậy, chúng tôi sẽ dùng tên và các thông tin khác liên quan đến quý khách tuân thủ theo nội dung của Chính sách bảo mật. Chúng tôi chỉ thu thập những thông tin cần thiết liên quan đến giao dịch mua bán.`
4. `Chúng tôi sẽ giữ thông tin của khách hàng trong thời gian luật pháp quy định hoặc cho mục đích nào đó. Quý khách có thể truy cập vào website và trình duyệt mà không cần phải cung cấp chi tiết cá nhân. Lúc đó, Quý khách đang ẩn danh và chúng tôi không thể biết bạn là ai nếu Quý khách không đăng nhập vào tài khoản của mình.`

Section 1 — `1. Thu thập thông tin cá nhân` (bullets):

1. `Chúng tôi thu thập, lưu trữ và xử lý thông tin của bạn cho quá trình mua hàng và cho những thông báo sau này liên quan đến đơn hàng, và để cung cấp dịch vụ, bao gồm một số thông tin cá nhân: danh hiệu, tên, giới tính, ngày sinh, email, địa chỉ, địa chỉ giao hàng, số điện thoại, fax, chi tiết thanh toán, chi tiết thanh toán bằng thẻ hoặc chi tiết tài khoản ngân hàng.`
2. `Chúng tôi sẽ dùng thông tin quý khách đã cung cấp để xử lý đơn đặt hàng, cung cấp các dịch vụ và thông tin yêu cầu thông qua website và theo yêu cầu của bạn.`
3. `Hơn nữa, chúng tôi sẽ sử dụng các thông tin đó để quản lý tài khoản của bạn; xác minh và thực hiện giao dịch trực tuyến, nhận diện khách vào web, nghiên cứu nhân khẩu học, gửi thông tin bao gồm thông tin sản phẩm và dịch vụ. Nếu quý khách không muốn nhận bất cứ thông tin tiếp thị của chúng tôi thì có thể từ chối bất cứ lúc nào.`
4. `Chúng tôi có thể chuyển tên và địa chỉ cho bên thứ ba để họ giao hàng cho bạn (ví dụ cho bên chuyển phát nhanh hoặc nhà cung cấp).`
5. `Chi tiết đơn đặt hàng của bạn được chúng tôi lưu giữ nhưng vì lí do bảo mật nên chúng tôi không công khai trực tiếp được. Tuy nhiên, quý khách có thể tiếp cận thông tin bằng cách đăng nhập tài khoản trên web. Tại đây, quý khách sẽ thấy chi tiết đơn đặt hàng của mình, những sản phẩm đã nhận và những sản phẩm đã gửi và chi tiết email, ngân hàng và bản tin mà bạn đặt theo dõi dài hạn.`
6. `Quý khách cam kết bảo mật dữ liệu cá nhân và không được phép tiết lộ cho bên thứ ba. Chúng tôi không chịu bất kỳ trách nhiệm nào cho việc dùng sai mật khẩu nếu đây không phải lỗi của chúng tôi.`
7. `Chúng tôi có thể dùng thông tin cá nhân của bạn để nghiên cứu thị trường. mọi thông tin chi tiết sẽ được ẩn và chỉ được dùng để thống kê. Quý khách có thể từ chối không tham gia bất cứ lúc nào.`

Section 2 — `2. Bảo mật` (bullets):

1. `Chúng tôi có biện pháp thích hợp về kỹ thuật và an ninh để ngăn chặn truy cập trái phép hoặc trái pháp luật hoặc mất mát hoặc tiêu hủy hoặc thiệt hại cho thông tin của bạn.`
2. `Chúng tôi khuyên quý khách không nên đưa thông tin chi tiết về việc thanh toán với bất kỳ ai bằng e-mail, chúng tôi không chịu trách nhiệm về những mất mát quý khách có thể gánh chịu trong việc trao đổi thông tin của quý khách qua internet hoặc email.`
3. `Quý khách tuyệt đối không sử dụng bất kỳ chương trình, công cụ hay hình thức nào khác để can thiệp vào hệ thống hay làm thay đổi cấu trúc dữ liệu. Nghiêm cấm việc phát tán, truyền bá hay cổ vũ cho bất kỳ hoạt động nào nhằm can thiệp, phá hoại hay xâm nhập vào dữ liệu của hệ thống website. Mọi vi phạm sẽ bị tước bỏ mọi quyền lợi cũng như sẽ bị truy tố trước pháp luật nếu cần thiết.`
4. `Mọi thông tin giao dịch sẽ được bảo mật nhưng trong trường hợp cơ quan pháp luật yêu cầu, chúng tôi sẽ buộc phải cung cấp những thông tin này cho các cơ quan pháp luật.`

Section 2 closing paragraph:

`Các điều kiện, điều khoản và nội dung của trang web này được điều chỉnh bởi luật pháp Việt Nam và tòa án Việt Nam có thẩm quyền xem xét.`

Section 3 — `3. Quyền lợi khách hàng` (paragraph):

`Quý khách có quyền yêu cầu truy cập vào dữ liệu cá nhân của mình, có quyền yêu cầu chúng tôi sửa lại những sai sót trong dữ liệu của bạn mà không mất phí. Bất cứ lúc nào bạn cũng có quyền yêu cầu chúng tôi ngưng sử dụng dữ liệu cá nhân của bạn cho mục đích tiếp thị.`

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes.
- `npm run dev` visual check at desktop + mobile: `/chinh-sach-bao-mat` shows breadcrumb, H1, card with all intro paragraphs, all 3 sections with their bullets/paragraphs; text wraps with no horizontal overflow at 375px; footer `Chính sách bảo mật` link navigates there; `/`, `/gioi-thieu`, `/lien-he`, `/san-pham`, `/tin-tuc` unchanged.
