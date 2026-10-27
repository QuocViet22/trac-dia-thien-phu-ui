# Contact Page (/lien-he) — Design Spec

Source: `src/pages/contact/contact.html` (static Vietnamese page: contact form card + company-info card + Google Maps / office locations section).
Target: production-ready React page at `/lien-he` inside the existing `SiteLayout`, served with `react-router`, restyled to the site theme. The form submits to the API and is protected by Cloudflare Turnstile (added after the initial port; see *Contact submission* below).

## Goals

- Serve `/lien-he` via `react-router`: renders `ContactPage` inside `SiteLayout` (route added in `App.tsx` alongside existing routes).
- Replicate the reference structure with Vietnamese copy verbatim from `contact.html`: breadcrumb (`Trang chủ / Liên hệ`), form card (`Thông tin liên hệ` + consultant note), company-info card (`Thông tin chung`, IGEO SYSTEM details), locations section (`Hệ thống cơ sở của iGeo System`, map + 2 office cards).
- Restyle to the site theme (user-approved): brand `#22abff` submit button, `rounded-xl` cards with `border-gray-200` (matching other pages), default site font (no Mulish import), standard heading scale (`text-2xl md:text-3xl` H1). No custom `<style>` blocks; Tailwind only.
- Contact form is controlled React state: fields name (required), email (required, `type=email`), address (optional), phone (required, `type=tel`), message (optional textarea), agree checkbox (required). HTML `required` + native validation; on submit it POSTs to the API, shows the thank-you state only on `201`, and shows a Vietnamese error with a fresh captcha otherwise (see *Contact submission*).
- Company and office strings verbatim from `contact.html` (company names, tax ID `2803136812`, charter capital, both office addresses, `0929.939.789`, `congtyigeo@gmail.com`).
- Keep the Google Maps embed iframe (`https://www.google.com/maps?q=Thanh+Hóa,+Việt+Nam&output=embed`, `loading="lazy"`, title `Bản đồ iGeo System`).
- Responsive: 2-column grid stacks to 1 column on mobile (same breakpoint behavior as reference); form two-field rows stack on mobile.
- Follow existing patterns: Tailwind, components under ~100 lines, Vietnamese copy verbatim.
- Delete `src/pages/contact/contact.html` once ported (it becomes redundant; content lives in the React page + this spec).

## Non-goals

- No `mailto:` fallback (user chose the API submission).
- No document `<head>` SEO wiring (deferred, same as news).
- No privacy-policy page for the agree-checkbox link (link target deferred; keep `#` placeholder as in reference).
- No email notification to the store owner (the admin "Khách Hàng" tab is the surface).
- No attachments, no server-side rate limiter beyond Turnstile, no admin screens in this repo.

## API Contract

- `POST {VITE_API_URL}/api/customer-contacts` with
  `{ name, email, address, phone, message, turnstileToken }`; `201` returns the
  stored row, `400` validation, `403` captcha rejected, `503` captcha service
  unavailable. Full contract:
  `trac-dia-thien-phu-api/docs/specs/customer_contact.md`.
- The form sends `address`/`message` as `null` when blank; `name`, `email` and
  `phone` are trimmed before sending.
- No other network calls are added to this page.

## Architecture

- `App.tsx`: add `<Route path="/lien-he" element={<ContactPage />} />`.
- `src/pages/contact/ContactPage.tsx`: page shell (breadcrumb + grid + locations section); renders `ContactForm`, `CompanyInfo`, `LocationsSection`.
- `src/pages/contact/components/ContactForm.tsx`: controlled form with `useState` per field, `token` / `submitting` / `error` state; renders `TurnstileWidget` directly above the submit button; on submit posts via `createCustomerContact`, shows the thank-you branch only on success, and on failure shows a Vietnamese alert and bumps `resetKey` (a Turnstile token is single-use, so every attempt needs a fresh one).
- `src/components/TurnstileWidget.tsx`: explicit render into a `div`, props `action`, `onToken`, `resetKey`; polling and failure behaviour as described in *Captcha* below.
- `src/lib/api.ts`: add `createCustomerContact(payload)` using the existing `API_BASE` and `ApiError`; this is the file's first POST (it only has GET today).
- `index.html`: load `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit` with `async defer`.
- `vite.config.ts`: production build guard for `VITE_TURNSTILE_SITE_KEY` (same rule as admin).
- `src/pages/contact/components/CompanyInfo.tsx`: pure presentational card with the verbatim company paragraphs.
- `src/pages/contact/components/LocationsSection.tsx`: pure presentational section (map iframe + office cards; office data as a local `const` array in the file).
- If `ContactPage.tsx` stays under ~100 lines with small inline subcomponents, component files may be folded in; split only as needed.
- Spec file: `docs/specs/contact.md` (this file); implementation plan follows after approval in `docs/plans/contact.md`.

## Contact submission

- Widget sits directly above `Gửi Tin Nhắn`, centered with the button; the
  action is `contact` and must match the API verifier.
- Submitting without a token shows `Vui lòng hoàn tất xác thực bảo mật.` and
  makes no request. The button is disabled while a request is in flight.
- Success → existing thank-you state (`Cảm ơn bạn! …`). Failure → inline
  `role="alert"` message `Không gửi được tin nhắn. Vui lòng thử lại.`, the form
  keeps the user's input, and the captcha is reset.
- `403` (captcha rejected) and `503` (captcha unavailable) get the same
  user-facing message; the status is logged with `console.error` in dev only.

## Captcha

- Sitekey: `VITE_TURNSTILE_SITE_KEY`, inlined at build time. Vite loads only
  `.env`, `.env.local`, `.env.<mode>` and `.env.<mode>.local`; `.env.example`
  is a template and is never read. `.env.development` and `.env.production`
  carry the value (a sitekey is public, like `VITE_API_URL`).
- `vite.config.ts` fails a production build without a sitekey, so a contact form
  that can never submit cannot ship.
- The script stays `async defer`; the widget **never calls
  `turnstile.ready()`** — Cloudflare throws
  `Remove async/defer from the Turnstile api.js script tag before using
  turnstile.ready()` when the script was loaded async, and that throw escapes
  into React's error boundary. Poll for `window.turnstile.render` (10 s) and
  render directly; `render` has no `isReady` guard.
- Failure (no key, script blocked, `render` throw, `error-callback`) shows
  `Không tải được xác thực bảo mật. Vui lòng tải lại trang.` and emits no token;
  the widget container stays mounted so Cloudflare does not log
  `Cannot find Widget`.
- Local dev needs `localhost` allowlisted in the sitekey's Hostname Management,
  otherwise `error-callback` reports `110200` and the widget lands on that same
  message. The production host `tracdiathienphu.viethq.tech` must be allowlisted
  too (the API's CORS already allows it).

## Content

- Breadcrumb (`Trang chủ` links `/`), H1 `Liên hệ` (page title; the form card keeps its own `Thông tin liên hệ` heading per reference).
- Form placeholders verbatim: `Nhập họ và tên bạn`, `E-mail`, `Địa chỉ của bạn`, `Số điện thoại tên bạn`, `Nhập nội dung bạn muốn hỗ trợ`; agree line `Tôi đồng ý với Điều khoản và Chính sách bảo mật`; submit `Gửi Tin Nhắn`; footnote `Trường có dấu (*) là bắt buộc.`; thank-you state copy as in Goals.
- Info card and office cards verbatim from reference (see Goals).

## Verification

- `npm run build` (includes `tsc -b` typecheck) passes.
- `npm run lint` passes.
- `npm run dev` visual check at desktop + mobile: structure matches reference (form left, info right, locations below); theme matches site (brand button, standard cards); the widget renders directly above `Gửi Tin Nhắn`; empty required fields blocked by native validation; map iframe loads; `/`, `/gioi-thieu`, `/san-pham`, `/tin-tuc` unchanged.
- Submission against the smoke API: valid data + solved widget → thank-you state and a stored row; a `403`/`503`/network failure → inline error, inputs preserved, captcha reset; submitting without a token is blocked client-side with no request.
- A production build with no sitekey exits non-zero (guard), and with a sitekey exits zero.
- Headless check of `/lien-he`: widget container mounts, no uncaught exception, no React error boundary. If `localhost` is not allowlisted, use an uncommitted `.env.development.local` with the always-pass test sitekey for this check.
