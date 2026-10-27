# Contact Form Submission + Turnstile — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send the `/lien-he` form to `POST /api/customer-contacts` behind a Cloudflare Turnstile widget placed above `Gửi Tin Nhắn`.

**Architecture:** Copy the admin's proven widget (no `ready()`, async script, poll for `window.turnstile.render`, fail closed) into `src/components/`, add the sitekey plumbing and a production build guard, add the first POST to `src/lib/api.ts`, and rewrite `ContactForm` to submit, show a Vietnamese error on failure and reset the single-use token.

**Tech Stack:** React 19, Tailwind v4, Vite 8, TypeScript, no new dependencies, no test runner.

**Spec:** `docs/specs/contact.md` (the original page-port tasks are complete and remain in git history)

## Global Constraints

- No test runner: verification is `npm run build` (typecheck), `npm run lint`, and a headless/dev check.
- PowerShell 5.1: chain with `; if ($?) { ... }`, not `&&`.
- `verbatimModuleSyntax` (use `import type`), `noUnusedLocals`/`noUnusedParameters`, `erasableSyntaxOnly`.
- Vietnamese copy exactly as the spec; site theme brand `#22abff`.
- The Turnstile script stays `async defer`; **never** call `turnstile.ready()`.
- Vite loads only `.env`, `.env.local`, `.env.<mode>`, `.env.<mode>.local`. `.env.example` is documentation and is never read.
- Do not commit `.env.development.local` (local-only override).

## Review Focus

- A production build with no sitekey must fail, not ship a form that can never submit (Task 1 guard check).
- The widget must never crash the page when the CDN is blocked or the sitekey is wrong (Task 2: polling deadline + try/catch + error callback).
- Submitting without a token must send no request and explain why (Task 4).
- After any failed submit the captcha must be reset, because the token is single-use (Task 4 `resetKey`).
- The form must keep the visitor's input after a failure (Task 4 does not clear field state).

---

### Task 1: Sitekey plumbing and production build guard

**Files:**
- Modify: `index.html`
- Create: `.env.development`
- Modify: `.env.production`
- Modify: `.env.example`
- Modify: `vite.config.ts`

**Interfaces:**
- Produces: `import.meta.env.VITE_TURNSTILE_SITE_KEY` available in dev and prod builds; a build that fails without it.

- [ ] **Step 1: Add the script and the env values.**

`index.html`, in `<head>` before the module script:

```html
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>
```

`.env.development` (new): `VITE_TURNSTILE_SITE_KEY=0x4AAAAAAFoJRbtaimQhhY-t`
`.env.production`: add the same line next to `VITE_API_URL`.
`.env.example`: add `VITE_TURNSTILE_SITE_KEY=` plus the existing note style: `# Template only: Vite never loads this file.`

- [ ] **Step 2: Add the guard to `vite.config.ts`.**

Keep `react()` and `tailwindcss()`; switch to the callback form and throw for a production build with no key, exactly like the admin repo:

```ts
export default defineConfig(({ mode }) => {
  if (mode === 'production' && !loadEnv(mode, '.', '').VITE_TURNSTILE_SITE_KEY) {
    throw new Error('VITE_TURNSTILE_SITE_KEY is required for a production build')
  }
  return { plugins: [react(), tailwindcss()] }
})
```

- [ ] **Step 3: Verify both directions.**

```powershell
node --input-type=module -e "import { loadEnv } from 'vite'; for (const m of ['development','production']) console.log(m, loadEnv(m, process.cwd(), '').VITE_TURNSTILE_SITE_KEY)"
# expect the key for both modes
$bak = '.env.production.bak'; Move-Item '.env.production' $bak
try { npx vite build *> $env:TEMP\ui-guard.log; $code = $LASTEXITCODE } finally { Move-Item $bak '.env.production' -Force }
# expect $code non-zero and 'VITE_TURNSTILE_SITE_KEY is required' in the log
npm run build
# expect exit 0
```

- [ ] **Step 4: Commit.**

```bash
git add index.html vite.config.ts .env.development .env.production .env.example
git commit -m "chore: load the Turnstile sitekey in dev and prod, guard production builds"
```

---

### Task 2: `TurnstileWidget` component

**Files:**
- Create: `src/components/TurnstileWidget.tsx`

**Interfaces:**
- Consumes: `import.meta.env.VITE_TURNSTILE_SITE_KEY`.
- Produces: `TurnstileWidget({ action, onToken, resetKey }: { action: 'contact'; onToken: (token: string | null) => void; resetKey: number })`.

- [ ] **Step 1: Copy the admin implementation and adapt it.**

Source: `trac-dia-thien-phu-admin/src/features/auth/TurnstileWidget.tsx` at commit `6dc0a0f`. Copy it verbatim except:

- Replace the outer `className="login-turnstile"` with `className="flex justify-center mb-4"` (both the success and failure branches).
- Keep: the `declare global` block, `siteKey()`, the 10 s polling for `typeof window.turnstile?.render === 'function'`, the try/catch around `render`, the dev-only `console.error` of the Cloudflare error code, `widgetRef.current = null` in `error-callback`, `remove()` only in the cleanup, the hidden-container-plus-sibling-message failure state, and the exact failure copy `Không tải được xác thực bảo mật. Vui lòng tải lại trang.`
- No `ready()` call anywhere.

- [ ] **Step 2: Verify build + lint.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

- [ ] **Step 3: Commit.**

```bash
git add src/components/TurnstileWidget.tsx
git commit -m "feat: add the Turnstile widget to the public site"
```

---

### Task 3: `createCustomerContact` in `src/lib/api.ts`

**Files:**
- Modify: `src/lib/api.ts`

**Interfaces:**
- Consumes: `API_BASE`, `ApiError` (already exported).
- Produces: `CustomerContactPayload` and `createCustomerContact(payload: CustomerContactPayload): Promise<void>`.

- [ ] **Step 1: Add the payload type and POST helper.**

```ts
export interface CustomerContactPayload {
  name: string
  email: string
  address: string | null
  phone: string
  message: string | null
  turnstileToken: string
}

export async function createCustomerContact(payload: CustomerContactPayload): Promise<void> {
  // POST `${API_BASE}/api/customer-contacts`; on !ok read { message } and throw ApiError(status, message)
}
```

- [ ] **Step 2: Verify build.**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 3: Commit.**

```bash
git add src/lib/api.ts
git commit -m "feat: add the contact submission API call"
```

---

### Task 4: Submit from `ContactForm`

**Files:**
- Modify: `src/pages/contact/components/ContactForm.tsx`

**Interfaces:**
- Consumes: `TurnstileWidget` (Task 2), `createCustomerContact` (Task 3).
- Produces: a form that POSTs and only shows the thank-you state on success.

- [ ] **Step 1: Add submission state and the widget.**

Add `token: string | null`, `submitting: boolean`, `error: string`, `resetKey: number` to the existing field state. Render inside the existing centered block, above the button:

```tsx
<div className="text-center">
  <TurnstileWidget action="contact" onToken={setToken} resetKey={resetKey} />
  <button type="submit" disabled={submitting} className="...">Gửi Tin Nhắn</button>
</div>
```

- [ ] **Step 2: Replace the submit handler.**

Rules, in order: `event.preventDefault()`; if `!token` set `error` to `Vui lòng hoàn tất xác thực bảo mật.` and return without a request; set `submitting`, clear `error`; `await createCustomerContact({ name: name.trim(), email: email.trim(), address: address.trim() || null, phone: phone.trim(), message: message.trim() || null, turnstileToken: token })`; on success `setSubmitted(true)`; on failure set `error` to `Không gửi được tin nhắn. Vui lòng thử lại.`, log the error with `console.error` only when `import.meta.env.DEV`, set `token` to `null` and `setResetKey((k) => k + 1)`; always clear `submitting`.

Render `error` above the widget as `<p role="alert" className="text-center text-red-500 mb-2">{error}</p>`.

- [ ] **Step 3: Verify build + lint.**

Run: `npm run build; if ($?) { npm run lint }`
Expected: both exit 0.

- [ ] **Step 4: Commit.**

```bash
git add src/pages/contact/components/ContactForm.tsx
git commit -m "feat: submit the contact form with a Turnstile token"
```

---

### Task 5: End-to-end verification

**Files:**
- Create (temporary, uncommitted): `.env.development.local`
- Modify: `docs/specs/contact.md` (only if behaviour changed)

**Interfaces:**
- Consumes: the API smoke run from `trac-dia-thien-phu-api/docs/plans/customer_contact.md` Task 4 (port 8081, test profile, Turnstile test secret).

- [ ] **Step 1: Point the dev server at the smoke API with the always-pass sitekey.**

`.env.development.local`:

```
VITE_API_URL=http://localhost:8081
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

This file is local-only; delete it after the check. It exists because the real sitekey does not allow `localhost` (110200) until Hostname Management is updated.

- [ ] **Step 2: Check the happy path.**

Run `npm run dev`, open `/lien-he`, fill the form, solve/pass the widget, submit. Expected: the thank-you state replaces the form, and the API has a new row (the smoke API's `GET` needs a JWT; check the row with `select name, phone from customer_contact_info order by created_at desc limit 1` on the test DB).

- [ ] **Step 3: Check the failure path.**

Stop the smoke API (or point `VITE_API_URL` at a dead port), submit again with a fresh token. Expected: `Không gửi được tin nhắn. Vui lòng thử lại.`, inputs preserved, and the widget re-renders with a new token (reset). Restart the API and confirm the next submit succeeds.

- [ ] **Step 4: Check the token guard and the headless load.**

Submitting with the widget still loading must show `Vui lòng hoàn tất xác thực bảo mật.` and send no request (Network tab). Then load `/lien-he` headless and confirm the widget container mounts, there is no uncaught exception, and no React error boundary.

- [ ] **Step 5: Remove `.env.development.local`.**

- [ ] **Step 6: Update the spec if behaviour changed** (final step; compare with `docs/specs/contact.md`).

- [ ] **Step 7: Commit.**

```bash
git add docs/specs/contact.md
git commit -m "docs: update the contact spec after implementation"
```
