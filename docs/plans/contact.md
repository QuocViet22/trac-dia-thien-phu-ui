# Contact Page (/lien-he) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (repo has no subagent tool; native inline execution). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve `/lien-he` contact page ported from `src/pages/contact/contact.html` and restyled to the site theme, with a frontend-only form.

**Architecture:** `ContactPage.tsx` owns the layout (breadcrumb + 2-col grid + locations); `components/ContactForm.tsx` is a controlled form with submitted-state branch (no network); `components/CompanyInfo.tsx` and `components/LocationsSection.tsx` are pure presentational components with verbatim copy; `App.tsx` adds the route; `contact.html` is deleted last.

**Tech Stack:** React 19 (`useState`), react-router 8, Tailwind v4 (`brand #22abff`), no new dependencies, no network calls.

**Spec:** `docs/specs/contact.md`

## Global Constraints

- `npm run build` (`tsc -b && vite build`) must pass; `npm run lint` must pass (exit 0).
- No test runner — verification is build + lint + `npm run dev` visual check.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- `verbatimModuleSyntax: true` — type imports must use `import type`; `noUnusedLocals` + `noUnusedParameters` — no unused vars; `erasableSyntaxOnly: true` — no enums/namespaces/parameter properties.
- Components ≤ ~100 lines each; Vietnamese copy verbatim from the spec/`contact.html`.
- Zero network calls; form submit is local state only.

## Review Focus

- Submitting with empty required fields must be blocked by native validation, never show the thank-you state (Task 1 dev check: click submit empty, then fill and resubmit).
- The thank-you state must replace the form (not duplicate it) after valid submit (Task 1 code branches on `submitted`; dev check).
- Map iframe must keep `title`, `loading="lazy"` attributes (Task 2 code; dev check it loads).
- Mobile must stack form/info/locations to one column with no horizontal overflow (Task 3 dev check at 375px width).
- `contact.html` deletion must not break anything (Task 3: file unreferenced; build check).

---

### Task 1: Create `ContactForm` (controlled frontend-only form)

**Files:**
- Create: `src/pages/contact/components/ContactForm.tsx`

**Interfaces:**
- Consumes: nothing (local state only).
- Produces: `ContactForm` default export — consumed by Task 3.

- [ ] **Step 1: Create `src/pages/contact/components/ContactForm.tsx` with the exact content below.**

```tsx
import { useState, type FormEvent } from 'react'

const inputClass = 'w-full text-base px-5 py-3 border border-gray-300 rounded-full text-gray-800 placeholder:text-gray-400 outline-none focus:border-brand bg-white'

function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Backend contact endpoint does not exist yet — frontend-only success state.
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-bold text-gray-900 mb-2">Cảm ơn bạn!</p>
        <p className="text-gray-600">Nhân viên tư vấn sẽ sớm liên hệ với bạn để tư vấn. Xin cảm ơn.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2 mb-4">
        <input type="text" placeholder="Nhập họ và tên bạn" required value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
        <input type="email" placeholder="E-mail" required value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 mb-4">
        <input type="text" placeholder="Địa chỉ của bạn" value={address} onChange={(event) => setAddress(event.target.value)} className={inputClass} />
        <input type="tel" placeholder="Số điện thoại tên bạn" required value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} />
      </div>
      <textarea placeholder="Nhập nội dung bạn muốn hỗ trợ" value={message} onChange={(event) => setMessage(event.target.value)} rows={6} className="w-full text-base px-5 py-3 border border-gray-300 rounded-3xl text-gray-800 placeholder:text-gray-400 outline-none focus:border-brand bg-white resize-y mb-4" />
      <label className="flex items-center gap-3 text-gray-500 mb-4 cursor-pointer">
        <input type="checkbox" required className="w-5 h-5 accent-[#22abff]" />
        <span>Tôi đồng ý với <a href="#">Điều khoản và Chính sách bảo mật</a></span>
      </label>
      <div className="text-center">
        <button type="submit" className="text-base font-bold text-white bg-brand px-10 py-3 rounded-xl hover:opacity-90">Gửi Tin Nhắn</button>
      </div>
      <p className="text-gray-600 mt-6">Trường có dấu (<span className="text-red-500">*</span>) là bắt buộc.</p>
    </form>
  )
}

export default ContactForm
```

- [ ] **Step 2: Verify typecheck passes.**

Run: `npm run build`
Expected: exit 0 (nothing imports the new component yet; proves it compiles).

---

### Task 2: Create `CompanyInfo` + `LocationsSection` (verbatim presentational)

**Files:**
- Create: `src/pages/contact/components/CompanyInfo.tsx`
- Create: `src/pages/contact/components/LocationsSection.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `CompanyInfo`, `LocationsSection` default exports — consumed by Task 3.

- [ ] **Step 1: Create `src/pages/contact/components/CompanyInfo.tsx` with the exact content below.**

```tsx
function CompanyInfo() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 text-center mb-4">Thông tin chung</h2>
      <div className="space-y-4 text-gray-800">
        <p><b>Tên Công ty:</b> CÔNG TY TNHH IGEO SYSTEM</p>
        <p><b>Tên Quốc tế:</b> IGEO SYSTEM COMPANY LIMITED</p>
        <p><b>Tên viết tắt:</b> IGEO SYSTEM CO.,LDT</p>
        <p><b>Giấy chứng nhận đăng ký Doanh nghiệp:</b> Số 2803136812 do Cục Thuế Tỉnh Thanh Hoá cấp lần đầu ngày 2021-10-06.</p>
        <p><b>Vốn điều lệ:</b> 2.000.000.000 đồng (Hai tỷ đồng).</p>
      </div>
    </div>
  )
}

export default CompanyInfo
```

- [ ] **Step 2: Create `src/pages/contact/components/LocationsSection.tsx` with the exact content below.**

```tsx
const offices = [
  {
    name: 'Văn phòng Thanh Hóa',
    address: 'Lô 28, Nơ 17, đường Lê Dụ Tông, phường Đông Vệ. TP. Thanh Hóa',
    phone: '0929.939.789',
    email: 'congtyigeo@gmail.com',
  },
  {
    name: 'Văn Phòng Hà Nội',
    address: 'Số 12A -D8, Khu D, KĐT Geleximco, Đ.Lê Trọng Tấn, Q.Hà Đông, TP Hà Nội, Việt Nam',
    phone: '0929.939.789',
    email: 'congtyigeo@gmail.com',
  },
]

function LocationsSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start mt-10">
      <div className="h-[400px] lg:h-[560px] overflow-hidden rounded-xl bg-gray-100">
        <iframe
          src="https://www.google.com/maps?q=Thanh+Hóa,+Việt+Nam&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Bản đồ iGeo System"
          className="w-full h-full border-0"
        />
      </div>
      <div>
        <h2 className="text-xl font-bold text-brand mb-4">Hệ thống cơ sở của iGeo System</h2>
        {offices.map((office) => (
          <div key={office.name} className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <h3 className="text-gray-900 mb-1">{office.name}</h3>
            <div className="pl-5 text-gray-700 space-y-1">
              <div>{office.address}</div>
              <div>{office.phone}</div>
              <div>{office.email}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default LocationsSection
```

- [ ] **Step 3: Verify typecheck passes.**

Run: `npm run build`
Expected: exit 0 (nothing imports the new components yet; proves they compile).

---

### Task 3: Create `ContactPage` + route + delete `contact.html` and verify

**Files:**
- Create: `src/pages/contact/ContactPage.tsx`
- Modify: `src/App.tsx`
- Delete: `src/pages/contact/contact.html`

**Interfaces:**
- Consumes: `ContactForm`, `CompanyInfo`, `LocationsSection` (Tasks 1–2).
- Produces: working `/lien-he` page. Nothing downstream.

- [ ] **Step 1: Create `src/pages/contact/ContactPage.tsx` with the exact content below.**

```tsx
import { Link } from 'react-router'
import ContactForm from './components/ContactForm.tsx'
import CompanyInfo from './components/CompanyInfo.tsx'
import LocationsSection from './components/LocationsSection.tsx'

function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Liên hệ</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Liên hệ</h1>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start">
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center uppercase">Thông tin liên hệ</h2>
          <div className="text-center text-gray-600 mt-1 mb-6">
            <p>Nhân viên tư vấn sẽ sớm liên hệ với bạn để tư vấn.</p>
            <p>Xin cảm ơn.</p>
          </div>
          <ContactForm />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-8">
          <CompanyInfo />
        </div>
      </div>
      <LocationsSection />
    </div>
  )
}

export default ContactPage
```

- [ ] **Step 2: Wire the `/lien-he` route in `src/App.tsx`.** Add the import `import ContactPage from './pages/contact/ContactPage.tsx'` alongside the other page imports, and add `<Route path="/lien-he" element={<ContactPage />} />` alongside the other routes.

- [ ] **Step 3: Delete `src/pages/contact/contact.html`.** Content is now fully ported; the file is unreferenced.

- [ ] **Step 4: Verify.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0. Then `npm run dev`: `/lien-he` shows form card left, info card right, locations below in site theme; valid submit shows thank-you state instead of the form; empty submit blocked by native validation; map loads; mobile stacks cleanly at 375px; `/`, `/gioi-thieu`, `/san-pham`, `/tin-tuc` unchanged.
