# Terms of Use Page (/dieu-khoan-su-dung) — Design Spec

Source: `https://tracdia247.vn/dieu-khoan` (live page titled "Điều khoản").
Target: production-ready React page at `/dieu-khoan-su-dung` inside the existing `SiteLayout`, sharing layout code with the existing privacy page.

## Goals

- Serve `/dieu-khoan-su-dung` via `react-router` (the footer link `Điều khoản sử dụng` in `Footer.tsx` already points here; the route currently falls through to the catch-all redirect).
- Extract the layout introduced by `docs/specs/privacy-policy.md` into one reusable presentational component so both policy pages stay identical:
  - `src/components/PolicyArticle.tsx` — props `{ title, intro, sections }`; renders breadcrumb (`Trang chủ` → `/` / `title`), H1 `title`, and the white content card (`bg-white rounded-xl border border-gray-200 p-4 md:p-8 text-[15px] sm:text-base leading-relaxed text-gray-800`).
  - Exported `PolicySection` type: `{ heading: string; paragraphs?: string[]; bullets?: string[]; closing?: string }`. `paragraphs` renders before `bullets`; `closing` renders after them. A section may use any combination (Section 6 of this page needs a lead-in paragraph plus one bullet).
  - Typography unchanged from the privacy page: section headings `text-lg md:text-xl font-bold text-gray-900 mb-3`, paragraph blocks `space-y-4`, lists `list-disc pl-5 space-y-2`, closing paragraph `mt-4`.
- Refactor `src/pages/privacy_policy/PrivacyPolicy.tsx` to keep its existing copy constants but render through `PolicyArticle` (no content or visual change).
- Add `src/pages/terms_of_use/TermsOfUse.tsx` with the source copy verbatim (Vietnamese, including its existing typos/formatting quirks): 2 intro paragraphs, then 6 numbered sections.
- Port Section 6 exactly as published: heading `6. Thay đổi, hủy bỏ giao dịch tại website`, a lead-in paragraph, then its single return-goods bullet.
- Point both linkable terms in the contact form's agree line at their pages: `Điều khoản` → `/dieu-khoan-su-dung`, `Chính sách bảo mật` → `/chinh-sach-bao-mat` (the privacy half is already done).

## Non-goals

- No copy editing or legal review; no rewriting the source text.
- No backend/CMS: content stays static constants in each page file. `src/lib/api.ts` has no policy/page endpoint and none is being added.
- No changes to the remaining footer link without a page (`/huong-dan-mua-hang`); it keeps redirecting until it gets its own spec.
- No SEO `<head>` wiring (consistent with other static pages).
- No change to the privacy page's copy or the visual result of its render.

## API Contract

- None. Both policy pages make zero network calls.

## Architecture

- `src/components/PolicyArticle.tsx` (new): shared breadcrumb + H1 + card renderer. Default export `PolicyArticle`; named type export `PolicySection`.
- `src/pages/privacy_policy/PrivacyPolicy.tsx` (modify): delete its inline layout and local `PolicySection` interface; `import PolicyArticle, { type PolicySection } from '../../components/PolicyArticle.tsx'`; keep `intro`/`sections` constants verbatim; return `<PolicyArticle title="Chính sách bảo mật" intro={intro} sections={sections} />`.
- `src/pages/terms_of_use/TermsOfUse.tsx` (new): same shape with `title="Điều khoản sử dụng"` and its own constants.
- `src/App.tsx` (modify): import `TermsOfUse`; add `<Route path="/dieu-khoan-su-dung" element={<TermsOfUse />} />` after the privacy route and before the catch-all.
- `src/pages/contact/components/ContactForm.tsx` (modify): agree line becomes `Tôi đồng ý với <Link to="/dieu-khoan-su-dung">Điều khoản</Link> và <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>`, both links `className="text-brand hover:underline"`.
- Spec file: `docs/specs/terms-of-use.md` (this file); implementation plan follows approval in `docs/plans/terms-of-use.md`.

## Content

Intro paragraphs (verbatim):

1. `Khi quý khách truy cập vào trang web của chúng tôi có nghĩa là quý khách đồng ý với các điều khoản này. Trang web có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Quy định và Điều kiện sử dụng, vào bất cứ lúc nào. Các thay đổi có hiệu lực ngay khi được đăng trên trang web mà không cần thông báo trước. Và khi quý khách tiếp tục sử dụng trang web, sau khi các thay đổi về quy định và điều kiện được đăng tải, có nghĩa là quý khách chấp nhận với những thay đổi đó.`
2. `Quý khách vui lòng kiểm tra thường xuyên để cập nhật những thay đổi của chúng tôi.`

Section 1 — `1. Hướng dẫn sử dụng web` (bullets):

1. `Khi vào web của chúng tôi, người dùng tối thiểu phải 18 tuổi hoặc truy cập dưới sự giám sát của cha mẹ hay người giám hộ hợp pháp.`
2. `Chúng tôi cấp giấy phép sử dụng để bạn có thể mua sắm trên web trong khuôn khổ điều khoản và điều kiện sử dụng đã đề ra.`
3. `Nghiêm cấm sử dụng bất kỳ phần nào của trang web này với mục đích thương mại hoặc nhân danh bất kỳ đối tác thứ ba nào nếu không được chúng tôi cho phép bằng văn bản. Nếu vi phạm bất cứ điều nào trong đây, chúng tôi sẽ hủy giấy phép của bạn mà không cần báo trước.`
4. `Trang web này chỉ dùng để cung cấp thông tin sản phẩm chứ chúng tôi không phải nhà sản xuất nên những nhận xét hiển thị trên web là ý kiến cá nhân của khách hàng, không phải của chúng tôi.`
5. `Quý khách phải đăng ký tài khoản với thông tin xác thực về bản thân và phải cập nhật nếu có bất kỳ thay đổi nào. Mỗi người truy cập phải có trách nhiệm với mật khẩu, tài khoản và hoạt động của mình trên web. Hơn nữa, quý khách phải thông báo cho chúng tôi biết khi tài khoản bị truy cập trái phép. Chúng tôi không chịu bất kỳ trách nhiệm nào, dù trực tiếp hay gián tiếp, đối với những thiệt hại hoặc mất mát gây ra do quý khách không tuân thủ quy định.`
6. `Trong suốt quá trình đăng ký, quý khách đồng ý nhận email quảng cáo từ website. Sau đó, nếu không muốn tiếp tục nhận mail, quý khách có thể từ chối bằng cách nhấp vào đường link ở dưới cùng trong mọi email quảng cáo.`

Section 2 — `2. Chấp nhận đơn hàng và giá cả` (bullets):

1. `Chúng tôi có quyền từ chối hoặc hủy đơn hàng của quý khách vì bất kỳ lý do gì vào bất kỳ lúc nào. Chúng tôi có thể hỏi thêm về số điện thoại và địa chỉ trước khi nhận đơn hàng.`
2. `Chúng tôi cam kết sẽ cung cấp thông tin giá cả chính xác nhất cho người tiêu dùng. Tuy nhiên, đôi lúc vẫn có sai sót xảy ra, ví dụ như trường hợp giá sản phẩm không hiển thị chính xác trên trang web hoặc sai giá, tùy theo từng trường hợp chúng tôi sẽ liên hệ hướng dẫn hoặc thông báo hủy đơn hàng đó cho quý khách. Chúng tôi cũng có quyền từ chối hoặc hủy bỏ bất kỳ đơn hàng nào dù đơn hàng đó đã hay chưa được xác nhận hoặc đã bị thanh toán.`

Section 3 — `3. Thương hiệu và bản quyền` (bullets):

1. `Mọi quyền sở hữu trí tuệ (đã đăng ký hoặc chưa đăng ký), nội dung thông tin và tất cả các thiết kế, văn bản, đồ họa, phần mềm, hình ảnh, video, âm nhạc, âm thanh, biên dịch phần mềm, mã nguồn và phần mềm cơ bản đều là tài sản của chúng tôi. Toàn bộ nội dung của trang web được bảo vệ bởi luật bản quyền của Việt Nam và các công ước quốc tế. Bản quyền đã được bảo lưu.`

Section 4 — `4. Quyền pháp lý` (bullets):

1. `Các điều kiện, điều khoản và nội dung của trang web này được điều chỉnh bởi luật pháp Việt Nam và Tòa án có thẩm quyền tại Việt Nam sẽ giải quyết bất kỳ tranh chấp nào phát sinh từ việc sử dụng trái phép trang web này.`

Section 5 — `5. Quy định về bảo mật` (bullets):

1. `Trang web của chúng tôi coi trọng việc bảo mật thông tin và sử dụng các biện pháp tốt nhất bảo vệ thông tin và việc thanh toán của quý khách. Thông tin của quý khách trong quá trình thanh toán sẽ được mã hóa để đảm bảo an toàn. Sau khi quý khách hoàn thành quá trình đặt hàng, quý khách sẽ thoát khỏi chế độ an toàn.`
2. `Quý khách không được sử dụng bất kỳ chương trình, công cụ hay hình thức nào khác để can thiệp vào hệ thống hay làm thay đổi cấu trúc dữ liệu. Trang web cũng nghiêm cấm việc phát tán, truyền bá hay cổ vũ cho bất kỳ hoạt động nào nhằm can thiệp, phá hoại hay xâm nhập vào dữ liệu của hệ thống. Cá nhân hay tổ chức vi phạm sẽ bị tước bỏ mọi quyền lợi cũng như sẽ bị truy tố trước pháp luật nếu cần thiết.`
3. `Mọi thông tin giao dịch sẽ được bảo mật nhưng trong trường hợp cơ quan pháp luật yêu cầu, chúng tôi sẽ buộc phải cung cấp những thông tin này cho các cơ quan pháp luật.`

Section 6 — `6. Thay đổi, hủy bỏ giao dịch tại website`:

Lead-in paragraph: `Trong mọi trường hợp, khách hàng đều có quyền chấm dứt giao dịch nếu đã thực hiện các biện pháp sau đây:`

Bullets:

1. `Trả lại hàng hoá đã nhận nhưng chưa sử dụng hoặc hưởng bất kỳ lợi ích nào từ hàng hóa đó (theo quy định của chính sách đổi trả hàng).`

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes.
- `npm run dev` visual check at desktop + mobile:
  - `/dieu-khoan-su-dung` shows breadcrumb, H1 `Điều khoản sử dụng`, card with both intro paragraphs, all 6 sections, and Section 6's lead-in + bullet.
  - `/chinh-sach-bao-mat` renders exactly as before the refactor (same headings, paragraphs, bullets, spacing).
  - Text wraps with no horizontal overflow at 375px on both pages.
  - Footer `Điều khoản sử dụng` navigates to the new page.
  - `/lien-he`: both agree-line links navigate to their pages without submitting the form.
  - `/`, `/gioi-thieu`, `/san-pham`, `/tin-tuc` unchanged.
