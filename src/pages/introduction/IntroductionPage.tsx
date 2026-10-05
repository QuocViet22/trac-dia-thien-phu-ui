import { Link } from 'react-router'
import Img from '../../components/Img.tsx'
import Section from './components/Section.tsx'
import slider1 from '../../assets/introduction/slider-1.webp'
import companyPhoto from '../../assets/introduction/cong-ty-trac-dia-ban-do.jpg'
import servicePhoto from '../../assets/introduction/gioi-thieu-dich-vu.jpg'
import { commitments, conclusionParagraphs, coreValues, customerClosing, customerGroups, equipment, hotline, mission, offices, overviewParagraphs, pageTitle, supportServices, techSupport, type ValueItem, vision, website } from './data.ts'

const fallback = 'https://placehold.co/800x450?text=Thien+Phu'

function BulletList({ items }: { items: ValueItem[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.title}>
          <strong className="text-gray-900">{item.title}</strong>: {item.text}
        </li>
      ))}
    </ul>
  )
}

function IntroductionPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Giới thiệu</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Giới thiệu</h1>
      <p className="text-lg md:text-xl font-bold text-gray-900 mb-6">{pageTitle}</p>
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-8 flex flex-col gap-8">
        <Section index="1" heading="Giới thiệu tổng quan về công ty">
          {overviewParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <Img src={slider1} fallback={fallback} alt="Thiết bị trắc địa Thiên Phú" className="w-full rounded-lg" loading="lazy" />
        </Section>
        <Section index="2" heading="Sứ mệnh và tầm nhìn">
          <h3 className="font-bold text-gray-900">Sứ mệnh</h3>
          <p>{mission}</p>
          <h3 className="font-bold text-gray-900">Tầm nhìn</h3>
          <p>{vision}</p>
        </Section>
        <Section index="3" heading="Giá trị cốt lõi">
          <BulletList items={coreValues} />
          <Img src={companyPhoto} fallback={fallback} alt="Công ty trắc địa bản đồ" className="w-full rounded-lg" loading="lazy" />
        </Section>
        <Section index="4" heading="Sản phẩm và dịch vụ">
          <h3 className="font-bold text-gray-900">Thiết bị trắc địa</h3>
          <BulletList items={equipment} />
          <h3 className="font-bold text-gray-900">Dịch vụ hỗ trợ kỹ thuật</h3>
          <BulletList items={supportServices} />
        </Section>
        <Section index="5" heading="Khách hàng và đối tác">
          <ul className="list-disc pl-5 space-y-1">
            {customerGroups.map((group) => (
              <li key={group}>{group}</li>
            ))}
          </ul>
          <p>{customerClosing}</p>
          <Img src={servicePhoto} fallback={fallback} alt="Dịch vụ máy trắc địa Thiên Phú" className="w-full rounded-lg" loading="lazy" />
        </Section>
        <Section index="6" heading="Cam kết chất lượng">
          <BulletList items={commitments} />
        </Section>
        <Section index="7" heading="Liên hệ với chúng tôi">
          <ul className="space-y-2">
            {offices.map((office) => (
              <li key={office.label}>
                <strong className="text-gray-900">{office.label}:</strong> {office.address}
              </li>
            ))}
          </ul>
          <p><strong className="text-gray-900">Hotline:</strong> {hotline}</p>
          <p><strong className="text-gray-900">Hỗ trợ kỹ thuật:</strong> {techSupport}</p>
          <p><strong className="text-gray-900">Website:</strong> <a href={website} target="_blank" rel="noreferrer" className="text-brand hover:underline">{website}</a></p>
          {conclusionParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </Section>
      </div>
    </div>
  )
}

export default IntroductionPage
