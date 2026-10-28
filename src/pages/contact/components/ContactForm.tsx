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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (name.trim() === '') {
      setError('Vui lòng nhập họ và tên.')
      return
    }
    if (email.trim() === '') {
      setError('Vui lòng nhập địa chỉ email.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.')
      return
    }
    if (phone.trim() === '') {
      setError('Vui lòng nhập số điện thoại.')
      return
    }
    if (!isValidPhone(phone)) {
      setError('Vui lòng nhập số điện thoại hợp lệ (chỉ gồm chữ số).')
      return
    }
    if (message.trim() === '') {
      setError('Vui lòng nhập nội dung tin nhắn.')
      return
    }
    if (!agreed) {
      setError('Vui lòng đồng ý với Điều khoản và Chính sách bảo mật.')
      return
    }
    if (!token) {
      setError('Vui lòng hoàn tất xác thực bảo mật.')
      return
    }

    setSubmitting(true)
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

  if (submitted) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-bold text-gray-900 mb-2">Cảm ơn bạn!</p>
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
      </div>
      <textarea
        placeholder="Nhập nội dung bạn muốn hỗ trợ *"
        required
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={6}
        className="w-full text-base px-5 py-3 border border-gray-300 rounded-3xl text-gray-800 placeholder:text-gray-400 outline-none focus:border-brand bg-white resize-y mb-4"
      />
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
      {error && (
        <p role="alert" className="text-center text-red-500 mb-2">{error}</p>
      )}
      <div className="text-center">
        <TurnstileWidget action="contact" onToken={setToken} resetKey={resetKey} />
        <button type="submit" disabled={submitting} className="text-base font-bold text-white bg-brand px-10 py-3 rounded-xl hover:opacity-90">Gửi Tin Nhắn</button>
      </div>
      <p className="text-gray-600 mt-6">Trường có dấu (<span className="text-red-500">*</span>) là bắt buộc.</p>
    </form>
  )
}

export default ContactForm
