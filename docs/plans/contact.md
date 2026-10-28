# Contact page (/lien-he) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the contact form to enforce proper validation - make "Nội dung" mandatory, validate phone as numbers only, and enable "Gửi Tin Nhắn" button only when all mandatory fields are filled and captcha is completed.

**Architecture:** Modify ContactForm component to track form validity state. Add phone number validation (digits only). Track all required field values, email validity, phone validity, captcha token, and agree checkbox. Compute isFormValid and disable button accordingly. Make message field required.

**Tech Stack:** React 19, TypeScript, React Router

**Spec:** docs/specs/contact.md

## Global Constraints
- Follow existing patterns in the codebase
- Use TypeScript with verbatimModuleSyntax (type imports must use import type)
- No unused locals/parameters
- Keep changes minimal and focused

---

### Task 1: Update ContactForm for validation and button state

**Files:**
- Modify: `src/pages/contact/components/ContactForm.tsx`

**Changes needed:**
1. Add state for agree checkbox
2. Add validation for phone (digits only)
3. Add validation for email format (basic)
4. Compute isFormValid based on all conditions
5. Make message field required
6. Disable button when form is not valid
7. Prevent non-numeric input in phone field

**Implementation:**

- [ ] **Step 1: Add agree checkbox state and phone validation helper**

Update imports and add state:
```tsx
import { Link } from 'react-router'
import { useState, type FormEvent } from 'react'
import TurnstileWidget from '../../../components/TurnstileWidget'
import { createCustomerContact } from '../../../lib/api'

const inputClass = 'w-full text-base px-5 py-3 border border-gray-300 rounded-full text-gray-800 placeholder:text-gray-400 outline-none focus:border-brand bg-white'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim()
  return trimmed.length > 0 && /^\d+$/.test(trimmed)
}

function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [resetKey, setResetKey] = useState(0)
  const [agreed, setAgreed] = useState(false)
  ...
}
```

- [ ] **Step 2: Compute form validity**

Add computed validity:
```tsx
const isFormValid =
  name.trim() !== '' &&
  isValidEmail(email) &&
  isValidPhone(phone) &&
  message.trim() !== '' &&
  agreed &&
  token !== null
```

- [ ] **Step 3: Update phone input to only accept numbers**

```tsx
<input
  type="tel"
  placeholder="Số điện thoại"
  required
  value={phone}
  onChange={(event) => {
    const value = event.target.value.replace(/\D/g, '')
    setPhone(value)
  }}
  className={inputClass}
/>
```

- [ ] **Step 4: Make message required and update placeholder**

```tsx
<textarea
  placeholder="Nhập nội dung bạn muốn hỗ trợ *"
  required
  value={message}
  onChange={(event) => setMessage(event.target.value)}
  rows={6}
  className="w-full text-base px-5 py-3 border border-gray-300 rounded-3xl text-gray-800 placeholder:text-gray-400 outline-none focus:border-brand bg-white resize-y mb-4"
/>
```

- [ ] **Step 5: Update agree checkbox to be controlled**

```tsx
<label className="flex items-center gap-3 text-gray-500 mb-4 cursor-pointer">
  <input
    type="checkbox"
    required
    checked={agreed}
    onChange={(event) => setAgreed(event.target.checked)}
    className="w-5 h-5 accent-[#22abff]"
  />
  <span>Tôi đồng ý với <Link to="/dieu-khoan-su-dung" className="text-brand hover:underline">Điều khoản</Link> và <Link to="/chinh-sach-bao-mat" className="text-brand hover:underline">Chính sách bảo mật</Link></span>
</label>
```

- [ ] **Step 6: Update submit button to be disabled based on form validity**

```tsx
<button
  type="submit"
  disabled={submitting || !isFormValid}
  className="text-base font-bold text-white bg-brand px-10 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
>
  Gửi Tin Nhắn
</button>
```

- [ ] **Step 7: Update onSubmit to rely on validation (or keep defensive check)**

The button being disabled should prevent submission, but keep the token check as defensive:
```tsx
const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  if (!isFormValid || !token) {
    setError('Vui lòng điền đầy đủ thông tin và hoàn tất xác thực bảo mật.')
    return
  }
  setSubmitting(true)
  setError('')
  try {
    await createCustomerContact({
      name: name.trim(),
      email: email.trim(),
      address: address.trim() || null,
      phone: phone.trim(),
      message: message.trim(),
      turnstileToken: token,
    })
    setSubmitted(true)
  } catch (err) {
    if (import.meta.env.DEV) console.error(err)
    setError('Không gửi được tin nhắn. Vui lòng thử lại.')
    setToken(null)
    setResetKey((k) => k + 1)
  } finally {
    setSubmitting(false)
  }
}
```

- [ ] **Step 8: Test the build**

Run: `npm run build` (from trac-dia-thien-phu-ui directory)
Expected: Build succeeds with no TypeScript errors

- [ ] **Step 9: Commit**

```bash
git add src/pages/contact/components/ContactForm.tsx
git commit -m "feat: improve contact form validation and button state"
```

---

### Task 2: Update spec to mark as implemented (if needed)

**Files:**
- Modify: `docs/specs/contact.md` (add implementation note)

- [ ] **Step 1: Add implementation status**

Append to spec:
```markdown
## Implementation Status
Implemented in ContactForm.tsx - button disabled until all mandatory fields filled, captcha completed, and terms agreed. Phone accepts only digits. Message is mandatory.
```

- [ ] **Step 2: Commit**

```bash
git add docs/specs/contact.md
git commit -m "docs: update contact spec with implementation status"
```
