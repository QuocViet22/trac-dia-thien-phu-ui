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
