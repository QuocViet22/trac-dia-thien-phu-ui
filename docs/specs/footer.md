# Footer — Design Spec

Source: user-supplied footer screenshot (light 4-column layout) + live content (company name, MST, hotlines, 4 addresses, link lists, FB/TikTok URLs).
Target: replace placeholder dark `src/components/layout/Footer.tsx` with light themed footer matching the screenshot.

## Goals

- Light footer: `bg-white` with `border-t-[3px] border-brand` (`--color-brand: #22abff`), Inter font inherited, `max-w-7xl mx-auto px-4 lg:px-8`.
- 4 columns (`grid gap-8 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]`, `text-sm`):
  - Company: `logo.jpg` (`h-12`), `CÔNG TY TNHH THIẾT BỊ TRẮC ĐỊA THIÊN PHÚ` bold uppercase, `Mã số thuế: 0318075014`, hotlines `0983.927.945` / `0979.778.945` as `tel:` links, 4 addresses verbatim with `fa-location-dot` icon.
  - `VỀ CHÚNG TÔI` (7 items: Download phần mềm, Máy RTK, Máy toàn đạc điện tử, Máy thủy bình, Máy định vị GPS cầm tay, Đội ngũ chuyên gia, Về Trắc Địa Thiên Phú → `/gioi-thieu`; all others `href="#"`).
  - `THÔNG TIN HỮU ÍCH` (4 items: Hướng dẫn mua hàng, Chính sách giao dịch chung, Bảo mật thông tin, Hệ thống chi nhánh + Chính sách vận chuyển), all `href="#"`.
  - `PHƯƠNG THỨC THANH TOÁN` label (text-only) + `Kết nối với chúng tôi` + FB/TikTok 40px circle buttons to the two supplied URLs (`target="_blank" rel="noreferrer"`), FontAwesome brands icons (FA CDN already in `index.html`).
- The fourth column is a flex column (`flex flex-col`): `Bản đồ` label, then a Google Maps embed (company pin, `loading="lazy"`, `referrerPolicy="strict-origin-when-cross-origin"`, `rounded-xl border border-gray-200 bg-gray-100`) that fills the leftover column height (`flex-1 min-h-[180px]`, iframe `w-full h-full border-0`), then `Kết nối với chúng tôi` + social buttons. The map grows to match the tallest column instead of leaving a gap under a fixed-height box.
- Bottom bar: `bg-brand text-white` centered `© Bản quyền thuộc về CÔNG TY TNHH THIẾT BỊ TRẮC ĐỊA THIÊN PHÚ` (white text for contrast; screenshot shows dark-on-blue).
- Headings `text-base font-bold uppercase text-gray-900`; body/links `text-gray-600 hover:text-brand`.
- Sticky footer: `SiteLayout` wrapper is `min-h-screen flex flex-col` with `<main className="flex-1">`, so the footer sits at the viewport bottom on short pages and flows normally on long pages. No `fixed` positioning; no `mt-8` on `<footer>`.

## Non-goals

- No real routes for middle-column links (placeholder `#` per review; wired later).
- No payment-method icons (screenshot shows none).
- No back-to-top button in footer (`FloatingButtons.tsx` already covers floating actions).
- No newsletter form, no new dependencies.
- Map is a static Google Maps embed — no Geolocation API, no custom map styles, no "directions" button.

## Verification

- `npm run build` passes.
- `npm run lint` passes.
- `npm run dev` visual check vs screenshot at desktop + mobile breakpoints.
