# Contact page (/lien-he)

## Goal
Update the contact form to enforce proper validation and enable/disable the submit button based on form state.

## Requirements

### Form validation
- All mandatory fields must be filled before enabling "Gửi Tin Nhắn" button.
- Mandatory fields: Họ và tên (name), E-mail (email), Số điện thoại (phone), Nội dung (message) - add "Nội dung" as a mandatory field.
- "Địa chỉ" (address) remains optional.
- User must click/check the Turnstile widget (complete captcha) - button only enabled when captcha is completed (token exists).
- Agree checkbox remains required.

### Phone number validation
- "Số điện thoại" field only accepts numbers.
- Should validate that it's numeric (digits only). Maybe also prevent non-numeric input.

### Button behavior
- "Gửi Tin Nhắn" button should only be enabled when:
  1. All mandatory fields are filled (name, email, phone, message not empty/whitespace)
  2. Email format is valid (basic validation)
  3. Phone contains only numbers (and is not empty)
  4. Turnstile captcha is completed (token exists)
  5. Agree checkbox is checked
- Button disabled otherwise.

### API integration
- Continue using existing `createCustomerContact` API.
- Message is now mandatory - when sending, message.trim() should not be null/empty.
- Phone validation on frontend to ensure only numbers.

## Implementation notes
- Modify `src/pages/contact/components/ContactForm.tsx`
- Add validation logic for phone (only digits)
- Track all required fields and captcha token and agree checkbox state
- Compute `isFormValid` and use it for button disabled state
- Make message required in UI (add required attribute)
- Make phone input accept only numbers (pattern or onChange filtering)

## Testing
- Manual test: button disabled until all fields filled + captcha + agree checked
- Phone field should not accept letters/special chars
- Message field is required
- Form submission still works as before
