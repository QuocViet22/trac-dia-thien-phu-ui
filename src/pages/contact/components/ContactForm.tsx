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
