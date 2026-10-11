# Contact Page (/lien-he) — Design Spec

Source: `src/pages/contact/contact.html` (static Vietnamese page: contact form card + company-info card + Google Maps / office locations section).
Target: production-ready React page at `/lien-he` inside the existing `SiteLayout`, served with `react-router`, restyled to the site theme. No backend dependency.

## Goals

- Serve `/lien-he` via `react-router`: renders `ContactPage` inside `SiteLayout` (route added in `App.tsx` alongside existing routes).
- Replicate the reference structure with Vietnamese copy verbatim from `contact.html`: breadcrumb (`Trang chủ / Liên hệ`), form card (`Thông tin liên hệ` + consultant note), company-info card (`Thông tin chung`, IGEO SYSTEM details), locations section (`Hệ thống cơ sở của iGeo System`, map + 2 office cards).
- Restyle to the site theme (user-approved): brand `#22abff` submit button, `rounded-xl` cards with `border-gray-200` (matching other pages), default site font (no Mulish import), standard heading scale (`text-2xl md:text-3xl` H1). No custom `<style>` blocks; Tailwind only.
- Contact form is controlled React state: fields name (required), email (required, `type=email`), address (optional), phone (required, `type=tel`), message (optional textarea), agree checkbox (required). HTML `required` + native validation; on submit show a frontend-only thank-you state (e.g. `Cảm ơn bạn! Nhân viên tư vấn sẽ sớm liên hệ với bạn.`) with no network call.
- Company and office strings verbatim from `contact.html` (company names, tax ID `2803136812`, charter capital, both office addresses, `0929.939.789`, `congtyigeo@gmail.com`).
- Keep the Google Maps embed iframe (`https://www.google.com/maps?q=Thanh+Hóa,+Việt+Nam&output=embed`, `loading="lazy"`, title `Bản đồ iGeo System`).
- Responsive: 2-column grid stacks to 1 column on mobile (same breakpoint behavior as reference); form two-field rows stack on mobile.
- Follow existing patterns: Tailwind, components under ~100 lines, Vietnamese copy verbatim.
- Delete `src/pages/contact/contact.html` once ported (it becomes redundant; content lives in the React page + this spec).

## Non-goals

- No backend contact/feedback submission (API has no such endpoint). The form is frontend-only; a real `POST` endpoint is a separate backend sub-project with its own spec/plan in the API repo.
- No `mailto:` fallback (user chose frontend-only success state).
- No document `<head>` SEO wiring (deferred, same as news).
- No privacy-policy page for the agree-checkbox link (link target deferred; keep `#` placeholder as in reference).

## API Contract

- None. This page makes zero network calls.

## Architecture

- `App.tsx`: add `<Route path="/lien-he" element={<ContactPage />} />`.
- `src/pages/contact/ContactPage.tsx`: page shell (breadcrumb + grid + locations section); renders `ContactForm`, `CompanyInfo`, `LocationsSection`.
- `src/pages/contact/components/ContactForm.tsx`: controlled form with `useState` per field (or single state object), submitted-state branch showing the thank-you message; includes a code comment noting backend submission is deferred.
- `src/pages/contact/components/CompanyInfo.tsx`: pure presentational card with the verbatim company paragraphs.
- `src/pages/contact/components/LocationsSection.tsx`: pure presentational section (map iframe + office cards; office data as a local `const` array in the file).
- If `ContactPage.tsx` stays under ~100 lines with small inline subcomponents, component files may be folded in; split only as needed.
- Spec file: `docs/specs/contact.md` (this file); implementation plan follows after approval in `docs/plans/contact.md`.

## Content

- Breadcrumb (`Trang chủ` links `/`), H1 `Liên hệ` (page title; the form card keeps its own `Thông tin liên hệ` heading per reference).
- Form placeholders verbatim: `Nhập họ và tên bạn`, `E-mail`, `Địa chỉ của bạn`, `Số điện thoại tên bạn`, `Nhập nội dung bạn muốn hỗ trợ`; agree line `Tôi đồng ý với Điều khoản và Chính sách bảo mật`; submit `Gửi Tin Nhắn`; footnote `Trường có dấu (*) là bắt buộc.`; thank-you state copy as in Goals.
- Info card and office cards verbatim from reference (see Goals).

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes.
- `npm run dev` visual check at desktop + mobile: structure matches reference (form left, info right, locations below); theme matches site (brand button, standard cards); submit with valid data shows thank-you state; empty required fields blocked by native validation; map iframe loads; `/`, `/gioi-thieu`, `/san-pham`, `/tin-tuc` unchanged.
